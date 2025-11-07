#!/usr/bin/env python3
"""
Script para re-entrenar los modelos ML con los datos actuales
"""
import sys
sys.path.insert(0, '/app')

from database import SessionLocal
from ml_models.price_optimizer import PriceOptimizer
from ml_models.recommender import AppRecommender

def retrain_models():
    """Re-entrenar todos los modelos ML"""
    db = SessionLocal()
    
    print("=" * 60)
    print("🚀 RE-ENTRENANDO MODELOS DE MACHINE LEARNING")
    print("=" * 60)
    
    try:
        # 1. Recommender System
        print("\n🎯 MODELO: SISTEMA DE RECOMENDACIONES")
        print("-" * 60)
        recommender = AppRecommender()
        recommender.train(db)
        print("✅ Sistema de recomendaciones entrenado exitosamente")
        
        # 2. Price Optimizer
        print("\n📈 MODELO: OPTIMIZACIÓN DE PRECIOS")
        print("-" * 60)
        optimizer = PriceOptimizer()
        optimizer.train(db)
        print("✅ Optimizador de precios entrenado exitosamente")
        
        print("\n" + "=" * 60)
        print("✅ TODOS LOS MODELOS RE-ENTRENADOS EXITOSAMENTE")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    retrain_models()
