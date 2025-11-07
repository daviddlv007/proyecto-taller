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
    name: str
    description: str
    category: str
    app_url: str
    cover_image: Optional[str] = None
    price: float = 0.0
    demo_url: Optional[str] = None
    credentials_template: Optional[str] = None

class AppUpdateDTO(BaseModel):
    name: str
    description: str
    app_url: str
    cover_image: Optional[str] = None
    price: Optional[float] = None
    demo_url: Optional[str] = None
    credentials_template: Optional[str] = None

class AppResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    app_url: str
    owner_id: Optional[int] = None
    cover_image: Optional[str] = None
    price: float = 0.0
    demo_url: Optional[str] = None

class AppsListResponse(BaseModel):
    apps: List[AppResponse]

# Payment DTOs
class PaymentCreateDTO(BaseModel):
    app_id: int
    qr_code: str

class PaymentUpdateDTO(BaseModel):
    status: str

class PaymentResponse(BaseModel):
    id: int
    app_id: int
    buyer_id: int
    status: str
    qr_code: str
    credentials: Optional[str] = None

# Review DTOs
class ReviewCreateDTO(BaseModel):
    app_id: int
    rating: int
    comment: str

class ReviewResponse(BaseModel):
    id: int
    app_id: int
    user_id: int
    rating: int
    comment: str

# Stats DTOs
class StatsResponse(BaseModel):
    downloads: int
    reviews: int
    average_rating: float
    payments_received: float

# Purchase DTOs
class PurchaseResponse(BaseModel):
    id: int
    app_id: int
    app_name: str
    app_category: str
    app_description: str
    app_url: str
    cover_image: Optional[str] = None
    price: float = 0.0
    credentials: Optional[str] = None
    purchase_date: str

class PurchasesListResponse(BaseModel):
    purchases: List[PurchaseResponse]

# Recommendations DTOs
class RecommendationRequest(BaseModel):
    user_id: int

class AppRecommendation(BaseModel):
    app_id: int
    name: str
    app_url: str

class RecommendationsResponse(BaseModel):
    recommendations: List[AppRecommendation]