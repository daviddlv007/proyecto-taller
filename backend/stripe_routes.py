from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db, Payment, App, User
import os
from pydantic import BaseModel
from auth import verify_token

# Importar stripe después de configurar la API key
import stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")

router = APIRouter(prefix="/payments", tags=["payments"])
security = HTTPBearer()

SUCCESS_URL = os.getenv("APP_SUCCESS_URL", "http://localhost:5173/usuario/payment-success")
CANCEL_URL = os.getenv("APP_CANCEL_URL", "http://localhost:5173/usuario/payment-cancel")

class CreatePaymentRequest(BaseModel):
    app_id: int

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    user_id = verify_token(credentials.credentials)
    # Convertir a int si viene como string
    if isinstance(user_id, str):
        user_id = int(user_id)
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return user

@router.post("/create-checkout-session")
def create_checkout_session(
    request: CreatePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        app = db.query(App).filter(App.id == request.app_id).first()
        if not app:
            raise HTTPException(status_code=404, detail="Aplicación no encontrada")
        
        # Crear sesión de checkout de Stripe
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': app.nombre,
                        'description': app.descripcion[:100] if app.descripcion else "",
                    },
                    'unit_amount': int(app.precio * 100),  # Stripe usa centavos
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{SUCCESS_URL}?session_id={{CHECKOUT_SESSION_ID}}&app_id={app.id}",
            cancel_url=f"{CANCEL_URL}?app_id={app.id}",
            metadata={
                'app_id': str(app.id),
                'user_id': str(current_user.id)
            }
        )
        
        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id
        }
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Error de Stripe: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/verify-session/{session_id}")
def verify_session(session_id: str, db: Session = Depends(get_db)):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == 'paid':
            # Obtener datos del metadata
            app_id = int(session.metadata.get('app_id'))
            user_id = int(session.metadata.get('user_id'))
            
            # Verificar que el usuario existe
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {
                    "status": "error",
                    "detail": "Usuario no encontrado. La sesión fue creada con un usuario que ya no existe."
                }
            
            # Verificar que la app existe
            app = db.query(App).filter(App.id == app_id).first()
            if not app:
                return {
                    "status": "error",
                    "detail": "Aplicación no encontrada"
                }
            
            # Verificar si ya existe este pago (para evitar duplicados)
            existing_payment = db.query(Payment).filter(
                Payment.codigo_qr == f"STRIPE-{session_id}"
            ).first()
            
            if existing_payment:
                return {
                    "status": "paid",
                    "payment_id": existing_payment.id,
                    "app_id": app_id,
                    "already_exists": True
                }
            
            # Generar credenciales desde la plantilla de la app
            import json
            credenciales = app.plantilla_credenciales if app.plantilla_credenciales else json.dumps({
                "stripe_session": session_id,
                "payment_intent": session.payment_intent
            })
            
            # Crear el pago en la base de datos
            payment = Payment(
                aplicacion_id=app_id,
                comprador_id=user_id,
                estado="confirmado",
                codigo_qr=f"STRIPE-{session_id}",
                credenciales=credenciales
            )
            db.add(payment)
            db.commit()
            
            return {
                "status": "paid",
                "payment_id": payment.id,
                "app_id": app_id
            }
        
        return {"status": session.payment_status}
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Error de Stripe: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
