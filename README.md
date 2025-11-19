# 🛍️ AppSwap - Marketplace de Aplicaciones

Sistema completo de marketplace con recomendaciones ML, optimización de precios y **búsqueda inteligente con IA**.

## 🚀 Inicio Rápido

### 1. Configuración de Variables de Entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales (OPENAI_API_KEY, STRIPE_SECRET_KEY, etc.)
```

### 2. Iniciar el sistema

```bash
docker-compose up -d
```

Esto inicia:
- 🐘 PostgreSQL en puerto 5432
- 🐍 Backend FastAPI en http://localhost:8000
- ⚛️ Frontend React en http://localhost:5173

### 3. Resetear y poblar datos (RECOMENDADO)

```bash
curl -X POST http://localhost:8000/admin/reset-all
```

### 4. Acceder al sistema

Abre: **http://localhost:5173**

**Credenciales de prueba:**
- Email: `pedro@empresa.com` | Password: `123456`

---

## ✨ Características Principales

### 🤖 Búsqueda Inteligente con IA
- Busca apps en lenguaje natural: "app para gestionar proyectos"
- Tecnología: OpenAI GPT-3.5-turbo
- Endpoint: `POST /search/ai-search`

### 📊 Machine Learning
- Sistema de recomendaciones personalizado
- Optimizador de precios con Random Forest
- Entrenamientos automáticos

### Más Funcionalidades
- 💰 Optimización de precios
- 🎨 Tema dinámico claro/oscuro
- 📱 Responsive design
- 🔐 Autenticación JWT
- 💳 Pagos con Stripe

---

## 🔧 Stack Tecnológico

**Backend:** FastAPI, SQLAlchemy, PostgreSQL, OpenAI, Stripe
**Frontend:** React, TypeScript, Material-UI, Vite
**DevOps:** Docker, Docker Compose

---

## 📋 Endpoints Principales

```
POST   /search/ai-search                - Búsqueda inteligente con IA
POST   /usuario/auth/login              - Login comprador
POST   /desarrollador/auth/login        - Login vendedor
GET    /ml/recommendations/{user_id}    - Recomendaciones
POST   /ml/price-suggestion/{app_id}    - Sugerencia de precio
POST   /payments/create-checkout-session - Crear pago Stripe
POST   /admin/reset-all                 - Reset completo sistema
```

---

## 📝 Variables de Entorno

Todas en `.env` (ver `.env.example`):
- `DATABASE_URL` - Conexión PostgreSQL
- `OPENAI_API_KEY` - OpenAI para búsqueda IA
- `STRIPE_SECRET_KEY` - Pagos con Stripe
- `VITE_API_URL` - URL backend para frontend

---

## 🐛 Troubleshooting

```bash
# Reset completo
curl -X POST http://localhost:8000/admin/reset-all

# Ver logs
docker-compose logs -f backend

# Reiniciar servicios
docker-compose down && docker-compose up -d
```

---

**¿Listo? Abre http://localhost:5173 🚀**
