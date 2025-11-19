from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, App
import os
from pydantic import BaseModel

router = APIRouter(prefix="/search", tags=["search"])

def get_openai_client():
    """Lazy load OpenAI client to avoid import issues"""
    from openai import OpenAI
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class SearchRequest(BaseModel):
    query: str

@router.post("/ai-search")
def ai_search_apps(request: SearchRequest, db: Session = Depends(get_db)):
    """
    Búsqueda inteligente de apps usando OpenAI.
    El usuario escribe en lenguaje natural qué tipo de app busca.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Obtener todas las apps disponibles
    apps = db.query(App).all()
    
    if not apps:
        return {"results": []}
    
    # Crear descripción de las apps para el prompt
    apps_catalog = []
    for app in apps:
        apps_catalog.append({
            "id": app.id,
            "name": app.nombre,
            "category": app.categoria_obj.nombre if app.categoria_obj else "Sin categoría",
            "description": app.descripcion,
            "price": float(app.precio)
        })
    
    # Prompt para OpenAI
    prompt = f"""Eres un asistente de búsqueda de aplicaciones. El usuario busca: "{request.query}"

Aquí está el catálogo de aplicaciones disponibles:
{apps_catalog}

Analiza la consulta del usuario y devuelve ÚNICAMENTE los IDs de las aplicaciones más relevantes, separados por comas.
Si no hay coincidencias, devuelve "NONE".
Responde SOLO con los IDs o "NONE", sin explicaciones adicionales.
"""

    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente que filtra aplicaciones basándose en las necesidades del usuario."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.3
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        if ai_response == "NONE":
            return {"results": []}
        
        # Parsear los IDs devueltos
        try:
            app_ids = [int(id.strip()) for id in ai_response.split(",") if id.strip().isdigit()]
        except:
            app_ids = []
        
        # Filtrar apps por los IDs devueltos
        filtered_apps = [app for app in apps if app.id in app_ids]
        
        # Convertir a diccionarios con los mismos nombres de campos que usa el frontend
        results = []
        for app in filtered_apps:
            results.append({
                "id": app.id,
                "nombre": app.nombre,
                "categoria": app.categoria_obj.nombre if app.categoria_obj else "Sin categoría",
                "descripcion": app.descripcion,
                "precio": float(app.precio),
                "imagen_portada": app.imagen_portada,
                "url_video": app.url_video,
                "url_aplicacion": app.url_aplicacion,
                "video_url": app.url_video,  # Alias para compatibilidad
            })
        
        return {"results": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")
