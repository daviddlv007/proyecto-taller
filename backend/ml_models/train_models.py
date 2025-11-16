"""
Script para entrenar ambos modelos ML
"""

import sys
sys.path.append('..')
from database import SessionLocal
from ml_models.price_optimizer import PriceOptimizer
from ml_models.recommender import AppRecommender

def train_all_models():
    """Entrenar todos los modelos ML"""
    db = SessionLocal()
    
    print("=" * 60)
    print("🚀 ENTRENANDO MODELOS DE MACHINE LEARNING")
    print("=" * 60)
    
    try:
        # 1. Price Optimizer
        print("\n📈 MODELO 1: OPTIMIZACIÓN DE PRECIOS")
        print("-" * 60)
        price_optimizer = PriceOptimizer()
        if price_optimizer.train(db):
            print("✅ Price Optimizer entrenado exitosamente\n")
        else:
            print("❌ Error al entrenar Price Optimizer\n")
        
        # 2. Recommender System
        print("\n🎯 MODELO 2: SISTEMA DE RECOMENDACIONES")
        print("-" * 60)
        recommender = AppRecommender()
        if recommender.train(db):
            print("✅ Recommender System entrenado exitosamente\n")
        else:
            print("❌ Error al entrenar Recommender System\n")
        
        print("=" * 60)
        print("✨ ENTRENAMIENTO COMPLETADO")
        print("=" * 60)
        
    finally:
        db.close()

if __name__ == "__main__":
    train_all_models()
