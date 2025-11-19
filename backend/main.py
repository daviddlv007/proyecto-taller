from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import rutas_desarrollador
import rutas_usuario
import ml_endpoints
import admin_routes
import stripe_routes
import ai_search_routes

app = FastAPI(
    title="AppSwap API",
    description="API para la plataforma de compra/venta de aplicaciones web",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:5174", 
        "http://localhost:5175", 
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(rutas_desarrollador.router)
app.include_router(rutas_usuario.router)
app.include_router(ml_endpoints.router)
app.include_router(admin_routes.router)
app.include_router(stripe_routes.router)
app.include_router(ai_search_routes.router)

@app.get("/")
def read_root():
    return {"message": "AppSwap API - Backend funcionando correctamente"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "appswap-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)