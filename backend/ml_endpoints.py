"""
Endpoints REST para funcionalidades de Machine Learning
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from ml_models.price_optimizer import PriceOptimizer
from ml_models.recommender import AppRecommender
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

# Instancias globales de los modelos
price_optimizer = PriceOptimizer()
recommender = AppRecommender()

# Cargar modelos al iniciar
try:
    price_optimizer.load()
except:
    print("⚠️  Price Optimizer no cargado, necesita entrenamiento")

try:
    recommender.load()
except:
    print("⚠️  Recommender no cargado, necesita entrenamiento")

# ==================== SCHEMAS ====================
class PriceSuggestion(BaseModel):
    current_price: float
    suggested_price: float
    confidence: float
    impact: str
    reason: str
    stats: dict

class RecommendedApp(BaseModel):
    id: int
    name: str
    description: str
    category: str
    price: float
    cover_image: str | None
    score: float
    reason: str

# ==================== ENDPOINTS ====================

@router.post("/price-suggestion/{app_id}", response_model=PriceSuggestion)
def get_price_suggestion(app_id: int, db: Session = Depends(get_db)):
    """
    Obtener sugerencia de precio óptimo para una app
    
    - **app_id**: ID de la aplicación
    - Retorna: Precio sugerido, confianza, impacto estimado y razón
    """
    if not price_optimizer.is_trained:
        raise HTTPException(
            status_code=503,
            detail="Modelo de optimización de precios no está entrenado. Ejecuta train_models.py"
        )
    
    suggestion = price_optimizer.suggest_price(db, app_id)
    
    if suggestion is None:
        raise HTTPException(status_code=404, detail="App no encontrada")
    
    return suggestion

@router.get("/recommendations/{user_id}", response_model=List[RecommendedApp])
def get_recommendations(user_id: int, top_k: int = 6, db: Session = Depends(get_db)):
    """
    Obtener recomendaciones personalizadas para un usuario
    
    - **user_id**: ID del usuario (buyer)
    - **top_k**: Número de recomendaciones (default: 6)
    - Retorna: Lista de apps recomendadas con score y razón
    """
    if not recommender.is_trained:
        raise HTTPException(
            status_code=503,
            detail="Sistema de recomendaciones no está entrenado. Ejecuta train_models.py"
        )
    
    recommendations = recommender.recommend(db, user_id, top_k)
    
    return recommendations

@router.post("/retrain")
def retrain_models(db: Session = Depends(get_db)):
    """
    Re-entrenar ambos modelos ML con datos actualizados
    Solo para uso administrativo
    """
    try:
        # Re-entrenar Price Optimizer
        success_price = price_optimizer.train(db)
        
        # Re-entrenar Recommender
        success_rec = recommender.train(db)
        
        return {
            "message": "Modelos re-entrenados exitosamente",
            "price_optimizer": "OK" if success_price else "ERROR",
            "recommender": "OK" if success_rec else "ERROR"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al re-entrenar: {str(e)}")

@router.get("/status")
def get_ml_status():
    """
    Obtener estado de los modelos ML
    """
    return {
        "price_optimizer": {
            "trained": price_optimizer.is_trained,
            "status": "ready" if price_optimizer.is_trained else "not_trained"
        },
        "recommender": {
            "trained": recommender.is_trained,
            "status": "ready" if recommender.is_trained else "not_trained"
        }
    }
