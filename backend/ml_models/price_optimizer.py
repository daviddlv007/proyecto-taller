"""
Price Optimizer - Modelo ML para sugerencias de precio óptimo
Usa regresión lineal con features: categoría, competencia, rating promedio, ventas
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os
from datetime import datetime, timedelta

class PriceOptimizer:
    def __init__(self):
        self.model = LinearRegression()
        self.category_encoder = LabelEncoder()
        self.is_trained = False
        self.model_path = "ml_models/models/price_optimizer.pkl"
        self.encoder_path = "ml_models/models/category_encoder.pkl"
        
    def prepare_data(self, db):
        """Preparar datos desde la base de datos"""
        from database import App, Payment, Review
        from sqlalchemy import func
        
        # Obtener todas las apps con sus estadísticas
        apps = db.query(App).all()
        
        data = []
        for app in apps:
            # Calcular estadísticas
            total_sales = db.query(func.count(Payment.id))\
                .filter(Payment.aplicacion_id == app.id, Payment.estado == 'confirmado')\
                .scalar() or 0
            
            avg_rating = db.query(func.avg(Review.calificacion))\
                .filter(Review.aplicacion_id == app.id)\
                .scalar() or 3.0
            
            # Ventas último mes
            month_ago = datetime.now() - timedelta(days=30)
            recent_sales = db.query(func.count(Payment.id))\
                .filter(Payment.aplicacion_id == app.id, 
                       Payment.estado == 'confirmado',
                       Payment.fecha_creacion >= month_ago)\
                .scalar() or 0
            
            competitor_avg_price = db.query(func.avg(App.precio))\
                .filter(App.categoria_id == app.categoria_id, App.id != app.id)\
                .scalar() or app.precio
            
            data.append({
                'app_id': app.id,
                'category': app.categoria_obj.nombre,
                'current_price': app.precio,
                'total_sales': total_sales,
                'recent_sales': recent_sales,
                'avg_rating': float(avg_rating),
                'competitor_avg_price': float(competitor_avg_price),
            })
        
        return pd.DataFrame(data)
    
    def train(self, db):
        """Entrenar el modelo"""
        print("📊 Preparando datos para Price Optimizer...")
        df = self.prepare_data(db)
        
        if len(df) < 10:
            print("❌ Insuficientes datos para entrenar (mínimo 10 apps)")
            return False
        
        self.category_encoder.fit(df['category'])
        df['category_encoded'] = self.category_encoder.transform(df['category'])
        
        X = df[['category_encoded', 'total_sales', 'recent_sales', 
                'avg_rating', 'competitor_avg_price']].values
        y = df['current_price'].values
        
        # Split para validación
        if len(df) >= 20:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
        else:
            X_train, X_test, y_train, y_test = X, X, y, y
        
        # Entrenar
        print("🤖 Entrenando modelo de regresión...")
        self.model.fit(X_train, y_train)
        
        # Validar
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"✅ Modelo entrenado:")
        print(f"   MAE: ${mae:.2f}")
        print(f"   R²: {r2:.3f}")
        
        self.is_trained = True
        self.save()
        return True
    
    def suggest_price(self, db, app_id: int):
        """Sugerir precio óptimo para una app"""
        if not self.is_trained:
            return None
        
        from database import App, Payment, Review
        from sqlalchemy import func
        
        app = db.query(App).filter(App.id == app_id).first()
        if not app:
            return None
        
        # Calcular features actuales
        total_sales = db.query(func.count(Payment.id))\
            .filter(Payment.aplicacion_id == app.id, Payment.estado == 'confirmado')\
            .scalar() or 0
        
        month_ago = datetime.now() - timedelta(days=30)
        recent_sales = db.query(func.count(Payment.id))\
            .filter(Payment.aplicacion_id == app.id, 
                   Payment.estado == 'confirmado',
                   Payment.fecha_creacion >= month_ago)\
            .scalar() or 0
        
        avg_rating = db.query(func.avg(Review.calificacion))\
            .filter(Review.aplicacion_id == app.id)\
            .scalar() or 3.0
        
        competitor_avg_price = db.query(func.avg(App.precio))\
            .filter(App.categoria_id == app.categoria_id, App.id != app.id)\
            .scalar() or app.precio
        
        category_encoded = self.category_encoder.transform([app.categoria_obj.nombre])[0]
        features = np.array([[
            category_encoded,
            total_sales,
            recent_sales,
            float(avg_rating),
            float(competitor_avg_price)
        ]])
        
        suggested_price = self.model.predict(features)[0]
        
        price_diff = abs(suggested_price - app.precio)
        confidence = max(0.5, 1.0 - (price_diff / app.precio))
        
        if suggested_price > app.precio:
            impact = f"+{((suggested_price / app.precio - 1) * 100):.0f}% ingresos potenciales"
        elif suggested_price < app.precio:
            impact = f"+{((app.precio / suggested_price - 1) * 30):.0f}% ventas estimadas"
        else:
            impact = "Precio actual es óptimo"
        
        if avg_rating >= 4.5:
            reason = f"Alto rating ({avg_rating:.1f}⭐) justifica precio premium"
        elif recent_sales > 5:
            reason = f"Buena demanda reciente ({recent_sales} ventas/mes)"
        elif suggested_price < competitor_avg_price:
            reason = f"Estrategia competitiva (competencia: ${competitor_avg_price:.2f})"
        else:
            reason = f"Basado en análisis de mercado y demanda"
        
        return {
            'current_price': round(app.precio, 2),
            'suggested_price': round(max(5.0, suggested_price), 2),  # Mínimo $5
            'confidence': round(confidence, 2),
            'impact': impact,
            'reason': reason,
            'stats': {
                'total_sales': total_sales,
                'recent_sales': recent_sales,
                'avg_rating': round(float(avg_rating), 1),
                'competitor_avg': round(float(competitor_avg_price), 2)
            }
        }
    
    def save(self):
        """Guardar modelo"""
        os.makedirs("ml_models/models", exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.category_encoder, self.encoder_path)
        print(f"💾 Modelo guardado en {self.model_path}")
    
    def load(self):
        """Cargar modelo"""
        if os.path.exists(self.model_path) and os.path.exists(self.encoder_path):
            self.model = joblib.load(self.model_path)
            self.category_encoder = joblib.load(self.encoder_path)
            self.is_trained = True
            print("✅ Modelo Price Optimizer cargado")
            return True
        return False
