from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Auth DTOs
class UserRegisterDTO(BaseModel):
    correo: str
    contrasena: str
    nombre: str

class UserLoginDTO(BaseModel):
    correo: str
    contrasena: str

class UserResponse(BaseModel):
    id: int
    correo: str
    nombre: str
    token: str

# App DTOs
class AppCreateDTO(BaseModel):
    nombre: str
    descripcion: str
    categoria: str
    url_aplicacion: str
    imagen_portada: Optional[str] = None
    precio: float = 0.0
    url_video: Optional[str] = None
    plantilla_credenciales: Optional[str] = None

class AppUpdateDTO(BaseModel):
    nombre: str
    descripcion: str
    url_aplicacion: str
    imagen_portada: Optional[str] = None
    precio: Optional[float] = None
    url_video: Optional[str] = None
    plantilla_credenciales: Optional[str] = None

class AppResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str
    categoria: str
    url_aplicacion: str
    propietario_id: Optional[int] = None
    imagen_portada: Optional[str] = None
    precio: float = 0.0
    url_video: Optional[str] = None

class AppsListResponse(BaseModel):
    aplicaciones: List[AppResponse]

# Payment DTOs
class PaymentCreateDTO(BaseModel):
    aplicacion_id: int
    codigo_qr: str

class PaymentUpdateDTO(BaseModel):
    estado: str

class PaymentResponse(BaseModel):
    id: int
    aplicacion_id: int
    comprador_id: int
    estado: str
    codigo_qr: str
    credenciales: Optional[str] = None

# Review DTOs
class ReviewCreateDTO(BaseModel):
    aplicacion_id: int
    calificacion: int
    comentario: str

class ReviewResponse(BaseModel):
    id: int
    aplicacion_id: int
    autor_id: int
    calificacion: int
    comentario: str

# Stats DTOs
class StatsResponse(BaseModel):
    descargas: int
    resenas: int
    calificacion_promedio: float
    pagos_recibidos: float

# Purchase DTOs
class PurchaseResponse(BaseModel):
    id: int
    aplicacion_id: int
    nombre_aplicacion: str
    categoria_aplicacion: str
    descripcion_aplicacion: str
    url_aplicacion: str
    imagen_portada: Optional[str] = None
    precio: float = 0.0
    credenciales: Optional[str] = None
    fecha_compra: str

class PurchasesListResponse(BaseModel):
    compras: List[PurchaseResponse]

# Recommendations DTOs
class RecommendationRequest(BaseModel):
    usuario_id: int

class AppRecommendation(BaseModel):
    aplicacion_id: int
    nombre: str
    url_aplicacion: str

class RecommendationsResponse(BaseModel):
    recomendaciones: List[AppRecommendation]