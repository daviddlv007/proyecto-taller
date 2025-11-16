"""
Recommender System - Sistema híbrido de recomendaciones
Combina filtrado colaborativo + basado en contenido
"""

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder
import joblib
import os

class AppRecommender:
    def __init__(self):
        self.user_item_matrix = None
        self.item_similarity = None
        self.category_encoder = LabelEncoder()
        self.is_trained = False
        self.model_path = "ml_models/models/recommender.pkl"
        
    def prepare_data(self, db):
        """Preparar datos desde la base de datos"""
        from database import App, Payment, Review
        from sqlalchemy import func
        
        purchases = db.query(
            Payment.comprador_id,
            Payment.aplicacion_id,
            App.categoria_id,
            App.precio
        ).join(App).filter(Payment.estado == 'confirmado').all()
        
        purchase_data = [{
            'user_id': p[0],
            'app_id': p[1],
            'purchased': 1,
            'category_id': p[2],
            'price': p[3]
        } for p in purchases]
        
        # Enriquecer con ratings
        reviews = db.query(
            Review.autor_id,
            Review.aplicacion_id,
            Review.calificacion
        ).all()
        
        review_dict = {(r.autor_id, r.aplicacion_id): r.calificacion for r in reviews}
        
        for item in purchase_data:
            key = (item['user_id'], item['app_id'])
            item['rating'] = review_dict.get(key, 3.0)
        
        df_purchases = pd.DataFrame(purchase_data)
        
        # Información de apps para content-based
        apps = db.query(App).all()
        app_features = []
        for app in apps:
            avg_rating = db.query(func.avg(Review.calificacion))\
                .filter(Review.aplicacion_id == app.id)\
                .scalar() or 3.0
            
            total_sales = db.query(func.count(Payment.id))\
                .filter(Payment.aplicacion_id == app.id, Payment.estado == 'confirmado')\
                .scalar() or 0
            
            app_features.append({
                'app_id': app.id,
                'category_id': app.categoria_id,
                'price': app.precio,
                'avg_rating': float(avg_rating),
                'popularity': total_sales
            })
        
        df_apps = pd.DataFrame(app_features)
        
        return df_purchases, df_apps
    
    def train(self, db):
        """Entrenar sistema de recomendaciones"""
        print("📊 Preparando datos para Recommender System...")
        df_purchases, df_apps = self.prepare_data(db)
        
        if len(df_purchases) < 10:
            print("❌ Insuficientes compras para entrenar (mínimo 10)")
            return False
        
        # 1. Crear matriz usuario-item para colaborativo
        print("🤖 Construyendo matriz usuario-item...")
        self.user_item_matrix = df_purchases.pivot_table(
            index='user_id',
            columns='app_id',
            values='rating',
            fill_value=0
        )
        
        print("🤖 Calculando similitud entre apps...")
        self.category_encoder.fit(df_apps['category_id'])
        df_apps['category_encoded'] = self.category_encoder.transform(df_apps['category_id'])
        
        df_apps['price_norm'] = (df_apps['price'] - df_apps['price'].min()) / (df_apps['price'].max() - df_apps['price'].min() + 0.01)
        df_apps['rating_norm'] = df_apps['avg_rating'] / 5.0
        df_apps['popularity_norm'] = (df_apps['popularity'] - df_apps['popularity'].min()) / (df_apps['popularity'].max() - df_apps['popularity'].min() + 0.01)
        
        feature_matrix = df_apps[['category_encoded', 'price_norm', 'rating_norm', 'popularity_norm']].values
        self.item_similarity = cosine_similarity(feature_matrix)
        self.app_ids = df_apps['app_id'].values
        
        self.df_apps = df_apps
        self.is_trained = True
        
        print(f"✅ Sistema entrenado:")
        print(f"   Usuarios: {len(self.user_item_matrix)}")
        print(f"   Apps: {len(self.app_ids)}")
        print(f"   Interacciones: {len(df_purchases)}")
        
        self.save()
        return True
    
    def recommend(self, db, user_id: int, top_k: int = 6):
        """Generar recomendaciones para un usuario"""
        if not self.is_trained:
            return []
        
        from database import App, Payment
        
        # Apps ya compradas por el usuario
        purchased_app_ids = set(
            db.query(Payment.aplicacion_id)
            .filter(Payment.comprador_id == user_id, Payment.estado == 'confirmado')
            .all()
        )
        purchased_app_ids = {app_id for (app_id,) in purchased_app_ids}
        
        recommendations = []
        
        # Estrategia 1: Colaborativo (si el usuario existe en la matriz)
        if user_id in self.user_item_matrix.index:
            user_ratings = self.user_item_matrix.loc[user_id]
            
            # Calcular similitud con otros usuarios
            user_similarity = cosine_similarity(
                [user_ratings.values],
                self.user_item_matrix.values
            )[0]
            
            # Encontrar usuarios similares
            similar_users_idx = np.argsort(user_similarity)[::-1][1:6]  # Top 5 excluyendo a sí mismo
            
            # Apps que compraron usuarios similares
            for idx in similar_users_idx:
                similar_user_id = self.user_item_matrix.index[idx]
                similar_user_apps = self.user_item_matrix.loc[similar_user_id]
                
                for app_id, rating in similar_user_apps.items():
                    if rating > 0 and app_id not in purchased_app_ids:
                        recommendations.append({
                            'app_id': int(app_id),
                            'score': float(rating * user_similarity[idx]),
                            'reason': 'collaborative'
                        })
        
        # Estrategia 2: Content-based (apps similares a las que le gustaron)
        if purchased_app_ids:
            for purchased_app_id in list(purchased_app_ids)[:3]:  # Top 3 compras
                if purchased_app_id in self.app_ids:
                    app_idx = np.where(self.app_ids == purchased_app_id)[0][0]
                    similar_apps_idx = np.argsort(self.item_similarity[app_idx])[::-1][1:6]
                    
                    for idx in similar_apps_idx:
                        similar_app_id = self.app_ids[idx]
                        if similar_app_id not in purchased_app_ids:
                            recommendations.append({
                                'app_id': int(similar_app_id),
                                'score': float(self.item_similarity[app_idx][idx]),
                                'reason': 'content'
                            })
        
        # Estrategia 3: Popularidad (fallback o complemento)
        popular_apps = self.df_apps.nlargest(10, 'popularity')
        for _, app_row in popular_apps.iterrows():
            if app_row['app_id'] not in purchased_app_ids:
                recommendations.append({
                    'app_id': int(app_row['app_id']),
                    'score': float(app_row['popularity_norm'] * 0.5),  # Menor peso
                    'reason': 'popular'
                })
        
        # Consolidar y ordenar
        if not recommendations:
            # Si no hay recomendaciones, devolver apps mejor valoradas
            best_rated = self.df_apps.nlargest(top_k, 'avg_rating')
            recommendations = [{
                'app_id': int(row['app_id']),
                'score': float(row['rating_norm']),
                'reason': 'top_rated'
            } for _, row in best_rated.iterrows() if row['app_id'] not in purchased_app_ids]
        
        # Agrupar por app_id y sumar scores
        rec_dict = {}
        for rec in recommendations:
            app_id = rec['app_id']
            if app_id not in rec_dict:
                rec_dict[app_id] = {'app_id': app_id, 'score': 0, 'reasons': []}
            rec_dict[app_id]['score'] += rec['score']
            rec_dict[app_id]['reasons'].append(rec['reason'])
        
        # Ordenar por score y tomar top_k
        final_recs = sorted(rec_dict.values(), key=lambda x: x['score'], reverse=True)[:top_k]
        
        # Enriquecer con información de las apps
        result = []
        for rec in final_recs:
            app = db.query(App).filter(App.id == rec['app_id']).first()
            if app:
                # Determinar razón principal
                reason_text = self._get_reason_text(rec['reasons'])
                
                result.append({
                    'id': app.id,
                    'name': app.nombre,
                    'description': app.descripcion,
                    'category': app.categoria_obj.nombre,
                    'price': app.precio,
                    'cover_image': app.imagen_portada,
                    'score': round(rec['score'], 2),
                    'reason': reason_text
                })
        
        return result
    
    def _get_reason_text(self, reasons):
        """Generar texto de razón para la recomendación"""
        if 'collaborative' in reasons:
            return "Usuarios similares a ti compraron esta app"
        elif 'content' in reasons:
            return "Similar a apps que te gustaron"
        elif 'popular' in reasons:
            return "Popular entre todos los usuarios"
        else:
            return "Altamente valorada por la comunidad"
    
    def save(self):
        """Guardar modelo"""
        os.makedirs("ml_models/models", exist_ok=True)
        data = {
            'user_item_matrix': self.user_item_matrix,
            'item_similarity': self.item_similarity,
            'app_ids': self.app_ids,
            'category_encoder': self.category_encoder,
            'df_apps': self.df_apps
        }
        joblib.dump(data, self.model_path)
        print(f"💾 Modelo guardado en {self.model_path}")
    
    def load(self):
        """Cargar modelo"""
        if os.path.exists(self.model_path):
            data = joblib.load(self.model_path)
            self.user_item_matrix = data['user_item_matrix']
            self.item_similarity = data['item_similarity']
            self.app_ids = data['app_ids']
            self.category_encoder = data['category_encoder']
            self.df_apps = data['df_apps']
            self.is_trained = True
            print("✅ Modelo Recommender cargado")
            return True
        return False
