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

class Rol(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    
    usuarios = relationship("User", back_populates="rol_obj")

class Categoria(Base):
    __tablename__ = "categorias"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    
    aplicaciones = relationship("App", back_populates="categoria_obj")

class User(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String, unique=True, index=True)
    nombre = Column(String)
    contrasena = Column(String)
    rol_id = Column(Integer, ForeignKey("roles.id"))
    
    rol_obj = relationship("Rol", back_populates="usuarios")
    aplicaciones_desarrollador = relationship("App", back_populates="propietario", foreign_keys="App.propietario_id")
    compras = relationship("Payment", back_populates="comprador", foreign_keys="Payment.comprador_id")
    resenas = relationship("Review", back_populates="autor")

class App(Base):
    __tablename__ = "aplicaciones"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    url_aplicacion = Column(String)
    propietario_id = Column(Integer, ForeignKey("usuarios.id"))
    imagen_portada = Column(String, nullable=True)
    precio = Column(Float, default=0.0)
    url_video = Column(String, nullable=True)
    plantilla_credenciales = Column(String, nullable=True)
    
    categoria_obj = relationship("Categoria", back_populates="aplicaciones")
    propietario = relationship("User", back_populates="aplicaciones_desarrollador")
    pagos = relationship("Payment", back_populates="aplicacion")
    resenas = relationship("Review", back_populates="aplicacion")

class Payment(Base):
    __tablename__ = "pagos"
    
    id = Column(Integer, primary_key=True, index=True)
    aplicacion_id = Column(Integer, ForeignKey("aplicaciones.id"))
    comprador_id = Column(Integer, ForeignKey("usuarios.id"))
    estado = Column(String, default="confirmado")  # Ahora por defecto "confirmado"
    codigo_qr = Column(String)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    credenciales = Column(String, nullable=True)  # Credenciales entregadas al comprador (JSON string)
    
    # Relaciones
    aplicacion = relationship("App", back_populates="pagos")
    comprador = relationship("User", back_populates="compras")

class Review(Base):
    __tablename__ = "resenas"
    
    id = Column(Integer, primary_key=True, index=True)
    aplicacion_id = Column(Integer, ForeignKey("aplicaciones.id"))
    autor_id = Column(Integer, ForeignKey("usuarios.id"))
    calificacion = Column(Integer)
    comentario = Column(String)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    aplicacion = relationship("App", back_populates="resenas")
    autor = relationship("User", back_populates="resenas")

# Crear tablas
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()