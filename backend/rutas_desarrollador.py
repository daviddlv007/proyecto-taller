from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db, User, App, Payment, Review, Rol, Categoria
from schemas import (
    UserRegisterDTO, UserLoginDTO, UserResponse,
    AppCreateDTO, AppUpdateDTO, AppResponse,
    PaymentResponse, PaymentUpdateDTO,
    ReviewResponse, StatsResponse,
    RecommendationRequest, RecommendationsResponse, AppRecommendation
)
from auth import get_password_hash, verify_password, create_access_token, verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import timedelta

router = APIRouter(prefix="/desarrollador", tags=["desarrollador"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    user_id = verify_token(credentials.credentials)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.post("/auth/register", response_model=UserResponse)
def register_desarrollador(user_data: UserRegisterDTO, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.correo == user_data.correo).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Correo ya registrado")
    
    rol_desarrollador = db.query(Rol).filter(Rol.nombre == "desarrollador").first()
    if not rol_desarrollador:
        rol_desarrollador = Rol(nombre="desarrollador")
        db.add(rol_desarrollador)
        db.flush()
    
    hashed_password = get_password_hash(user_data.contrasena)
    new_user = User(
        correo=user_data.correo,
        nombre=user_data.nombre,
        contrasena=hashed_password,
        rol_id=rol_desarrollador.id
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
def login_desarrollador(login_data: UserLoginDTO, db: Session = Depends(get_db)):
    rol_desarrollador = db.query(Rol).filter(Rol.nombre == "desarrollador").first()
    if not rol_desarrollador:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contrasena incorrectos")
    
    user = db.query(User).filter(
        User.correo == login_data.correo,
        User.rol_id == rol_desarrollador.id
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

# CRUD Apps
@router.post("/apps", response_model=AppResponse)
def create_app(app_data: AppCreateDTO, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    categoria_obj = db.query(Categoria).filter(Categoria.nombre == app_data.categoria).first()
    if not categoria_obj:
        categoria_obj = Categoria(nombre=app_data.categoria)
        db.add(categoria_obj)
        db.flush()
    
    new_app = App(
        nombre=app_data.nombre,
        descripcion=app_data.descripcion,
        categoria_id=categoria_obj.id,
        url_aplicacion=app_data.url_aplicacion,
        propietario_id=current_user.id,
        imagen_portada=app_data.imagen_portada,
        precio=app_data.precio,
        url_video=app_data.url_video,
        plantilla_credenciales=app_data.plantilla_credenciales
    )
    
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    return AppResponse(
        id=new_app.id,
        nombre=new_app.nombre,
        descripcion=new_app.descripcion,
        categoria=new_app.categoria_obj.nombre,
        url_aplicacion=new_app.url_aplicacion,
        propietario_id=new_app.propietario_id,
        imagen_portada=new_app.imagen_portada,
        precio=new_app.precio,
        url_video=new_app.url_video
    )

@router.get("/apps", response_model=List[AppResponse])
def get_desarrollador_apps(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    apps = db.query(App).filter(App.propietario_id == current_user.id).all()
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

@router.put("/apps/{app_id}", response_model=AppResponse)
def update_app(app_id: int, app_data: AppUpdateDTO, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(App).filter(App.id == app_id, App.propietario_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Aplicacion no encontrada")
    
    app.nombre = app_data.nombre
    app.descripcion = app_data.descripcion
    app.url_aplicacion = app_data.url_aplicacion
    app.imagen_portada = app_data.imagen_portada
    if app_data.precio is not None:
        app.precio = app_data.precio
    if app_data.url_video is not None:
        app.url_video = app_data.url_video
    if app_data.plantilla_credenciales is not None:
        app.plantilla_credenciales = app_data.plantilla_credenciales
    
    db.commit()
    db.refresh(app)
    
    return AppResponse(
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

@router.delete("/apps/{app_id}")
def delete_app(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(App).filter(App.id == app_id, App.propietario_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Aplicacion no encontrada")
    
    db.delete(app)
    db.commit()
    
    return {"message": "Aplicacion eliminada correctamente"}

@router.get("/apps/{app_id}/stats", response_model=StatsResponse)
def get_app_stats(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(App).filter(App.id == app_id, App.propietario_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Aplicacion no encontrada")
    
    # Calcular estadisticas
    reviews_count = db.query(Review).filter(Review.aplicacion_id == app_id).count()
    avg_rating = db.query(func.avg(Review.calificacion)).filter(Review.aplicacion_id == app_id).scalar() or 0
    confirmed_payments = db.query(Payment).filter(
        Payment.aplicacion_id == app_id, 
        Payment.estado == "confirmado"
    ).count()
    
    return StatsResponse(
        descargas=confirmed_payments,  # Asumimos descargas = pagos confirmados
        resenas=reviews_count,
        calificacion_promedio=float(avg_rating),
        pagos_recibidos=float(confirmed_payments * app.precio)
    )

@router.get("/apps/{app_id}/reviews", response_model=List[ReviewResponse])
def get_app_reviews(app_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(App).filter(App.id == app_id, App.propietario_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Aplicacion no encontrada")
    
    reviews = db.query(Review).filter(Review.aplicacion_id == app_id).all()
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

# Pagos
@router.get("/payments", response_model=List[PaymentResponse])
def get_desarrollador_payments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Obtener pagos de todas las apps del desarrollador
    desarrollador_apps = db.query(App).filter(App.propietario_id == current_user.id).all()
    app_ids = [app.id for app in desarrollador_apps]
    
    payments = db.query(Payment).filter(Payment.aplicacion_id.in_(app_ids)).all()
    return [
        PaymentResponse(
            id=payment.id,
            aplicacion_id=payment.aplicacion_id,
            comprador_id=payment.comprador_id,
            estado=payment.estado,
            codigo_qr=payment.codigo_qr
        )
        for payment in payments
    ]

@router.patch("/payments/{payment_id}", response_model=PaymentResponse)
def update_payment_status(payment_id: int, payment_data: PaymentUpdateDTO, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que el pago pertenece a una app del desarrollador
    payment = db.query(Payment).join(App).filter(
        Payment.id == payment_id,
        App.propietario_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    
    payment.estado = payment_data.estado
    db.commit()
    db.refresh(payment)
    
    return PaymentResponse(
        id=payment.id,
        aplicacion_id=payment.aplicacion_id,
        comprador_id=payment.comprador_id,
        estado=payment.estado,
        codigo_qr=payment.codigo_qr
    )

# Recomendaciones ML (simuladas)
@router.post("/recommendations", response_model=RecommendationsResponse)
def get_desarrollador_recommendations(request: RecommendationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Simulacion de recomendaciones ML
    mock_ideas = [
        "Sugerencia de app de productividad",
        "Idea de app de finanzas personales",
        "App de seguimiento de salud",
        "Herramienta de gestion de tareas"
    ]
    
    return RecommendationsResponse(
        recomendaciones=[
            AppRecommendation(
                aplicacion_id=i,
                nombre=idea,
                url_aplicacion=f"https://example.com/idea-{i}"
            )
            for i, idea in enumerate(mock_ideas, 1)
        ]
    )

# Mis Ventas - Lista completa de apps vendidas
@router.get("/sales")
def get_desarrollador_sales(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Obtener todas las ventas del desarrollador (apps compradas por usuarios)"""
    # Obtener todas las apps del desarrollador
    desarrollador_apps = db.query(App).filter(App.propietario_id == current_user.id).all()
    
    sales_list = []
    total_revenue = 0
    total_sales_count = 0
    
    for app in desarrollador_apps:
        # Obtener pagos confirmados para esta app
        confirmed_payments = db.query(Payment).filter(
            Payment.aplicacion_id == app.id,
            Payment.estado == "confirmado"
        ).all()
        
        # Crear una entrada por cada venta (pago confirmado)
        for payment in confirmed_payments:
            comprador = db.query(User).filter(User.id == payment.comprador_id).first()
            if comprador:
                sales_list.append({
                    "app_id": app.id,
                    "app_name": app.nombre,
                    "buyer_id": comprador.id,
                    "buyer_name": comprador.nombre,
                    "buyer_email": comprador.correo,
                    "purchase_date": payment.fecha_creacion.isoformat(),
                    "price": app.precio
                })
                total_revenue += app.precio
                total_sales_count += 1
    
    return {
        "total_apps": len(desarrollador_apps),
        "total_sales": total_sales_count,
        "total_revenue": total_revenue,
        "sales": sales_list
    }
