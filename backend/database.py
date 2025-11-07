from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Usar PostgreSQL en Docker, SQLite en desarrollo local
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./appswap.db')

# Para PostgreSQL, usar pool pre-ping y check_same_thread solo para SQLite
if DATABASE_URL.startswith('postgresql'):
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String, unique=True, index=True)
    nombre = Column(String)
    contrasena = Column(String)
    role = Column(String)  # "vendor" or "buyer"
    
    # Relaciones
    vendor_apps = relationship("App", back_populates="owner", foreign_keys="App.owner_id")
    buyer_payments = relationship("Payment", back_populates="buyer", foreign_keys="Payment.buyer_id")
    reviews = relationship("Review", back_populates="user")

class App(Base):
    __tablename__ = "apps"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    category = Column(String)
    app_url = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    cover_image = Column(String, nullable=True)  # URL de la imagen de portada
    price = Column(Float, default=0.0)  # Precio de la aplicación
    demo_url = Column(String, nullable=True)  # URL de demo gratuita
    credentials_template = Column(String, nullable=True)  # Plantilla de credenciales (JSON string)
    
    # Relaciones
    owner = relationship("User", back_populates="vendor_apps")
    payments = relationship("Payment", back_populates="app")
    reviews = relationship("Review", back_populates="app")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, ForeignKey("apps.id"))
    buyer_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="confirmed")  # Ahora por defecto "confirmed"
    qr_code = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    credentials = Column(String, nullable=True)  # Credenciales entregadas al comprador (JSON string)
    
    # Relaciones
    app = relationship("App", back_populates="payments")
    buyer = relationship("User", back_populates="buyer_payments")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, ForeignKey("apps.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    app = relationship("App", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

# Crear tablas
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()