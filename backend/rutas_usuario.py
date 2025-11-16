from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db, User, App, Payment, Review, Rol, Categoria
from schemas import (
    UserRegisterDTO, UserLoginDTO, UserResponse,
    AppResponse, AppsListResponse,
    PaymentCreateDTO, PaymentResponse,
    ReviewCreateDTO, ReviewResponse,
    RecommendationRequest, RecommendationsResponse, AppRecommendation,
    PurchaseResponse, PurchasesListResponse
)
from auth import get_password_hash, verify_password, create_access_token, verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import timedelta

router = APIRouter(prefix="/usuario", tags=["usuario"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    user_id = verify_token(credentials.credentials)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.post("/auth/register", response_model=UserResponse)
def register_usuario(user_data: UserRegisterDTO, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.correo == user_data.correo).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Correo ya registrado")
    
    rol_usuario = db.query(Rol).filter(Rol.nombre == "usuario").first()
    if not rol_usuario:
        rol_usuario = Rol(nombre="usuario")
        db.add(rol_usuario)
        db.flush()
    
    hashed_password = get_password_hash(user_data.contrasena)
    new_user = User(
        correo=user_data.correo,
        nombre=user_data.nombre,
        contrasena=hashed_password,
        rol_id=rol_usuario.id
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(new_user.id)}, expires_delta=access_token_expires
    )
    
    return UserResponse(
        id=new_user.id,
        correo=new_user.correo,
        nombre=new_user.nombre,
        token=access_token
    )

@router.post("/auth/login", response_model=UserResponse)
def login_usuario(login_data: UserLoginDTO, db: Session = Depends(get_db)):
    rol_usuario = db.query(Rol).filter(Rol.nombre == "usuario").first()
    if not rol_usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contrasena incorrectos")
    
    user = db.query(User).filter(
        User.correo == login_data.correo,
        User.rol_id == rol_usuario.id
    ).first()
    
    if not user or not verify_password(login_data.contrasena, user.contrasena):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contrasena incorrectos"
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return UserResponse(
        id=user.id,
        correo=user.correo,
        nombre=user.nombre,
        token=access_token
    )

@router.get("/apps", response_model=AppsListResponse)
def get_all_apps(db: Session = Depends(get_db)):
    apps = db.query(App).all()
    return AppsListResponse(
        aplicaciones=[
            AppResponse(
                id=app.id,
                nombre=app.nombre,
                descripcion=app.descripcion,
                categoria=app.categoria_obj.nombre,
                url_aplicacion=app.url_aplicacion,
                imagen_portada=app.imagen_portada,
                precio=app.precio,
                url_video=app.url_video
            )
            for app in apps
        ]
    )

@router.get("/apps/{app_id}/execute")
def execute_app(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Aplicacion no encontrada")
    
    # Generar token de ejecucion (simulado)
    access_token = create_access_token(data={"sub": str(current_user.id), "app_id": app_id})
    
    return {
        "url": app.url_aplicacion,
        "token": access_token
    }

@router.post("/payments", response_model=PaymentResponse)
def create_payment(payment_data: PaymentCreateDTO, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que la app existe
    app = db.query(App).filter(App.id == payment_data.aplicacion_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Aplicacion no encontrada")
    
    # Verificar si ya compro esta app
    existing_payment = db.query(Payment).filter(
        Payment.aplicacion_id == payment_data.aplicacion_id,
        Payment.comprador_id == current_user.id,
        Payment.estado == "confirmado"
    ).first()
    
    if existing_payment:
        raise HTTPException(status_code=400, detail="Ya has comprado esta aplicacion")
    
    # Generar credenciales automaticamente
    import json
    credentials_dict = {
        "username": f"user_{current_user.id}_{payment_data.aplicacion_id}",
        "password": f"pass_{payment_data.codigo_qr[-8:]}",
        "app_id": payment_data.aplicacion_id,
        "buyer_id": current_user.id
    }
    credentials_json = json.dumps(credentials_dict)
    
    # Crear nuevo pago (auto-confirmado)
    new_payment = Payment(
        aplicacion_id=payment_data.aplicacion_id,
        comprador_id=current_user.id,
        codigo_qr=payment_data.codigo_qr,
        estado="confirmado",  # Auto-confirmado
        credenciales=credentials_json
    )
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    
    return PaymentResponse(
        id=new_payment.id,
        aplicacion_id=new_payment.aplicacion_id,
        comprador_id=new_payment.comprador_id,
        estado=new_payment.estado,
        codigo_qr=new_payment.codigo_qr,
        credenciales=new_payment.credenciales
    )

@router.get("/payments", response_model=List[PurchaseResponse])
def get_usuario_payments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Hacer JOIN con la tabla apps para obtener toda la informacion
    payments = db.query(Payment, App).join(App, Payment.aplicacion_id == App.id).filter(
        Payment.comprador_id == current_user.id,
        Payment.estado == "confirmado"
    ).all()
    
    return [
        PurchaseResponse(
            id=payment.id,
            aplicacion_id=payment.aplicacion_id,
            nombre_aplicacion=app.nombre,
            categoria_aplicacion=app.categoria_obj.nombre,
            descripcion_aplicacion=app.descripcion,
            url_aplicacion=app.url_aplicacion,
            imagen_portada=app.imagen_portada,
            precio=app.precio,
            credenciales=payment.credenciales,
            fecha_compra=str(payment.fecha_creacion) if hasattr(payment, 'fecha_creacion') else ""
        )
        for payment, app in payments
    ]

@router.post("/recommendations", response_model=List[AppResponse])
def get_usuario_recommendations(request: RecommendationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Obtener apps aleatorias como recomendaciones (simulacion de ML)
    apps = db.query(App).limit(6).all()
    
    return [
        AppResponse(
            id=app.id,
            nombre=app.nombre,
            descripcion=app.descripcion,
            categoria=app.categoria_obj.nombre,
            url_aplicacion=app.url_aplicacion,
            propietario_id=app.propietario_id,
            imagen_portada=app.imagen_portada,
            precio=app.precio,
            url_video=app.url_video
        )
        for app in apps
    ]

@router.post("/reviews", response_model=ReviewResponse)
def create_review(review_data: ReviewCreateDTO, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que la app existe
    app = db.query(App).filter(App.id == review_data.aplicacion_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Aplicacion no encontrada")
    
    # Verificar que el usuario no ha dejado ya una review para esta app
    existing_review = db.query(Review).filter(
        Review.aplicacion_id == review_data.aplicacion_id,
        Review.autor_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="Ya has dejado una resena para esta aplicacion")
    
    # Crear nueva review
    new_review = Review(
        aplicacion_id=review_data.aplicacion_id,
        autor_id=current_user.id,
        calificacion=review_data.calificacion,
        comentario=review_data.comentario
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return ReviewResponse(
        id=new_review.id,
        aplicacion_id=new_review.aplicacion_id,
        autor_id=new_review.autor_id,
        calificacion=new_review.calificacion,
        comentario=new_review.comentario
    )

@router.get("/reviews", response_model=List[ReviewResponse])
def get_my_reviews(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.autor_id == current_user.id).all()
    return [
        ReviewResponse(
            id=review.id,
            aplicacion_id=review.aplicacion_id,
            autor_id=review.autor_id,
            calificacion=review.calificacion,
            comentario=review.comentario
        )
        for review in reviews
    ]

@router.get("/purchases", response_model=PurchasesListResponse)
def get_usuario_purchases(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Hacer JOIN con la tabla apps para obtener toda la informacion
    payments = db.query(Payment, App).join(App, Payment.aplicacion_id == App.id).filter(
        Payment.comprador_id == current_user.id,
        Payment.estado == "confirmado"
    ).all()
    
    purchases = []
    for payment, app in payments:
        purchases.append(
            PurchaseResponse(
                id=payment.id,
                aplicacion_id=app.id,
                nombre_aplicacion=app.nombre,
                categoria_aplicacion=app.categoria_obj.nombre,
                descripcion_aplicacion=app.descripcion,
                url_aplicacion=app.url_aplicacion,
                imagen_portada=app.imagen_portada,
                precio=app.precio,
                credenciales=payment.credenciales,
                fecha_compra=payment.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S") if hasattr(payment, 'fecha_creacion') else ""
            )
        )
    
    return PurchasesListResponse(compras=purchases)
