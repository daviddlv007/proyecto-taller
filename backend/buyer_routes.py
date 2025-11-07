from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db, User, App, Payment, Review
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

router = APIRouter(prefix="/buyer", tags=["buyer"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    user_id = verify_token(credentials.credentials)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/auth/register", response_model=UserResponse)
def register_buyer(user_data: UserRegisterDTO, db: Session = Depends(get_db)):
    # Verificar si el correo ya existe
    existing_user = db.query(User).filter(User.correo == user_data.correo).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Correo ya registrado")
    
    # Crear nuevo usuario comprador
    hashed_password = get_password_hash(user_data.contrasena)
    new_user = User(
        correo=user_data.correo,
        nombre=user_data.nombre,
        contrasena=hashed_password,
        role="buyer"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Crear token
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
def login_buyer(login_data: UserLoginDTO, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.correo == login_data.correo,
        User.role == "buyer"
    ).first()
    
    if not user or not verify_password(login_data.contrasena, user.contrasena):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
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
        apps=[
            AppResponse(
                id=app.id,
                name=app.name,
                description=app.description,
                category=app.category,
                app_url=app.app_url,
                cover_image=app.cover_image,
                price=app.price,
                demo_url=app.demo_url
            )
            for app in apps
        ]
    )

@router.get("/apps/{app_id}/execute")
def execute_app(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App no encontrada")
    
    # Generar token de ejecución (simulado)
    access_token = create_access_token(data={"sub": str(current_user.id), "app_id": app_id})
    
    return {
        "url": app.app_url,
        "token": access_token
    }

@router.post("/payments", response_model=PaymentResponse)
def create_payment(payment_data: PaymentCreateDTO, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que la app existe
    app = db.query(App).filter(App.id == payment_data.app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App no encontrada")
    
    # Verificar si ya compró esta app
    existing_payment = db.query(Payment).filter(
        Payment.app_id == payment_data.app_id,
        Payment.buyer_id == current_user.id,
        Payment.status == "confirmed"
    ).first()
    
    if existing_payment:
        raise HTTPException(status_code=400, detail="Ya has comprado esta aplicación")
    
    # Generar credenciales automáticamente
    import json
    credentials_dict = {
        "username": f"user_{current_user.id}_{payment_data.app_id}",
        "password": f"pass_{payment_data.qr_code[-8:]}",
        "app_id": payment_data.app_id,
        "buyer_id": current_user.id
    }
    credentials_json = json.dumps(credentials_dict)
    
    # Crear nuevo pago (auto-confirmado)
    new_payment = Payment(
        app_id=payment_data.app_id,
        buyer_id=current_user.id,
        qr_code=payment_data.qr_code,
        status="confirmed",  # Auto-confirmado
        credentials=credentials_json
    )
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    
    return PaymentResponse(
        id=new_payment.id,
        app_id=new_payment.app_id,
        buyer_id=new_payment.buyer_id,
        status=new_payment.status,
        qr_code=new_payment.qr_code,
        credentials=new_payment.credentials
    )

@router.get("/payments", response_model=List[PurchaseResponse])
def get_buyer_payments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Hacer JOIN con la tabla apps para obtener toda la información
    payments = db.query(Payment, App).join(App, Payment.app_id == App.id).filter(
        Payment.buyer_id == current_user.id,
        Payment.status == "confirmed"
    ).all()
    
    return [
        PurchaseResponse(
            id=payment.id,
            app_id=payment.app_id,
            app_name=app.name,
            app_category=app.category,
            app_description=app.description,
            app_url=app.app_url,
            cover_image=app.cover_image,
            price=app.price,
            credentials=payment.credentials,
            purchase_date=str(payment.created_at) if hasattr(payment, 'created_at') else ""
        )
        for payment, app in payments
    ]

@router.post("/recommendations", response_model=List[AppResponse])
def get_buyer_recommendations(request: RecommendationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Obtener apps aleatorias como recomendaciones (simulación de ML)
    apps = db.query(App).limit(6).all()
    
    return [
        AppResponse(
            id=app.id,
            name=app.name,
            description=app.description,
            category=app.category,
            app_url=app.app_url,
            owner_id=app.owner_id,
            cover_image=app.cover_image,
            price=app.price,
            demo_url=app.demo_url
        )
        for app in apps
    ]

@router.post("/reviews", response_model=ReviewResponse)
def create_review(review_data: ReviewCreateDTO, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que la app existe
    app = db.query(App).filter(App.id == review_data.app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App no encontrada")
    
    # Verificar que el usuario no ha dejado ya una review para esta app
    existing_review = db.query(Review).filter(
        Review.app_id == review_data.app_id,
        Review.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="Ya has dejado una review para esta app")
    
    # Crear nueva review
    new_review = Review(
        app_id=review_data.app_id,
        user_id=current_user.id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return ReviewResponse(
        id=new_review.id,
        app_id=new_review.app_id,
        user_id=new_review.user_id,
        rating=new_review.rating,
        comment=new_review.comment
    )

@router.get("/reviews", response_model=List[ReviewResponse])
def get_my_reviews(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
    return [
        ReviewResponse(
            id=review.id,
            app_id=review.app_id,
            user_id=review.user_id,
            rating=review.rating,
            comment=review.comment
        )
        for review in reviews
    ]

@router.get("/purchases", response_model=PurchasesListResponse)
def get_buyer_purchases(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Hacer JOIN con la tabla apps para obtener toda la información
    payments = db.query(Payment, App).join(App, Payment.app_id == App.id).filter(
        Payment.buyer_id == current_user.id,
        Payment.status == "confirmed"
    ).all()
    
    purchases = []
    for payment, app in payments:
        purchases.append(
            PurchaseResponse(
                id=payment.id,
                app_id=app.id,
                app_name=app.name,
                app_category=app.category,
                app_description=app.description,
                app_url=app.app_url,
                cover_image=app.cover_image,
                price=app.price,
                credentials=payment.credentials,
                purchase_date=payment.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(payment, 'created_at') else ""
            )
        )
    
    return PurchasesListResponse(purchases=purchases)