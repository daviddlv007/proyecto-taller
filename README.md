# 🛍️ AppSwap - Marketplace de Aplicaciones

Sistema completo de marketplace con recomendaciones ML y optimización de precios.

## 🚀 Inicio Rápido

### 1. Iniciar el sistema

```bash
docker-compose up -d
```

Esto inicia:
- 🐘 PostgreSQL en puerto 5432
- 🐍 Backend FastAPI en http://localhost:8000
- ⚛️  Frontend React en http://localhost:5173

### 2. Resetear y poblar datos (RECOMENDADO primera vez)

```bash
./reset-appswap.sh
```

Este script hace TODO automáticamente:
- ✅ Limpia la base de datos
- ✅ Crea 23 usuarios (10 vendors + 13 buyers)
- ✅ Crea 60 aplicaciones (10 por categoría)
- ✅ Genera 120 compras y 50 reseñas
- ✅ Entrena modelos de Machine Learning
- ✅ Recarga modelos en memoria

**⚡ Después de este comando, TODO funciona inmediatamente.**

### 3. Acceder al sistema

🌐 Abre tu navegador en: **http://localhost:5173**

#### 🔐 Credenciales de Prueba

**Vendor (María)**
```
Email: maria@techdev.com
Password: 123456
```

**Buyer (Pedro)**
```
Email: pedro@empresa.com  
Password: 123456
```

---

## 📋 Arquitectura

```
proyecto-taller/
├── backend/              # FastAPI + SQLAlchemy + ML
│   ├── main.py          # Servidor principal
│   ├── database.py      # Modelos ORM
│   ├── ml_models/       # Sistema de recomendaciones y precios
│   │   ├── recommender.py
│   │   └── price_optimizer.py
│   └── admin_routes.py  # Endpoint /admin/reset-all
│
├── appswap/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── features/
│   │   │   ├── buyer/   # Vistas de compradores
│   │   │   └── vendor/  # Vistas de vendedores
│   │   └── services/    # API client
│   └── public/
│
├── docker-compose.yml   # Orquestación de servicios
├── reset-appswap.sh    # 🔄 Script de reset completo
└── RESET_GUIDE.md      # 📖 Documentación detallada
```

---

## 🤖 Machine Learning

El sistema incluye 2 modelos ML:

### 1. Sistema de Recomendaciones
- **Algoritmo**: Híbrido (Colaborativo + Contenido)
- **Entrada**: Historial de compras del usuario
- **Salida**: 6 apps personalizadas con scores
- **Endpoint**: `GET /ml/recommendations/{user_id}`

### 2. Optimizador de Precios
- **Algoritmo**: Regresión con Random Forest
- **Factores**: Categoría, popularidad, ratings
- **Salida**: Precio sugerido con nivel de confianza
- **Endpoint**: `POST /ml/price-suggestion/{app_id}`

**📊 Los modelos se entrenan automáticamente** cuando ejecutas `./reset-appswap.sh`

---

## 🧮 Demo: CalculadoraPro

El proyecto incluye una **aplicación de calculadora embebida** que demuestra el modelo de negocio completo de AppSwap.

### ✨ Características

- **Modo Demo (Gratuito)**: Suma y resta
- **Modo PRO ($9.99)**: Multiplicación y división desbloqueadas
- **Autenticación**: Sistema de credenciales post-compra
- **Persistencia**: Estado guardado en localStorage

### 🎯 Flujo de Demostración

1. **Probar Demo**: http://localhost:5173/demo-calc/
2. **Ver limitaciones**: Solo suma/resta funcionan
3. **Comprar** como Pedro (pedro@empresa.com)
4. **Recibir credenciales** automáticamente
5. **Desbloquear PRO**: Todas las operaciones disponibles

### 🚀 Script de Prueba Rápida

```bash
./test-calculator.sh
```

Este script:
- ✅ Verifica que la app esté registrada
- ✅ Muestra URLs de acceso directo
- ✅ Proporciona credenciales de prueba
- ✅ Guía paso a paso del flujo

### 📚 Documentación Completa

- **Resumen**: [CALCULADORA_DEMO_SUMMARY.md](./CALCULADORA_DEMO_SUMMARY.md)
- **Guía de uso**: [appswap/public/demo-calc/README.md](./appswap/public/demo-calc/README.md)

---

## 🔄 Flujo de Reset (Solución al Problema de IDs)

### ❌ Problema Original
Cuando limpias y repoblas la BD, los IDs cambian pero los modelos ML quedan con IDs antiguos → recomendaciones vacías.

### ✅ Solución Implementada
El endpoint `/admin/reset-all` hace **4 pasos en orden**:

1. 🧹 Limpia base de datos
2. 📦 Puebla con datos nuevos
3. 🤖 Entrena modelos con datos actuales
4. 🔄 **CLAVE: Recarga modelos en memoria**

Sin el paso 4, el servidor seguiría usando modelos obsoletos aunque los archivos estén actualizados.

**📖 Documentación completa**: Ver [RESET_GUIDE.md](./RESET_GUIDE.md)

---

## 🛠️ Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Acceder a la base de datos
```bash
docker-compose exec postgres psql -U user -d dbname
```

### Re-entrenar solo los modelos ML
```bash
docker-compose exec backend python /app/retrain_ml.py
```

### Verificar estado de los modelos
```bash
curl http://localhost:8000/ml/status | jq '.'
```

---

## 📊 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Login (retorna JWT token)

### Buyers
- `GET /buyer/apps` - Listar apps disponibles
- `POST /buyer/purchase/{app_id}` - Comprar app
- `GET /buyer/purchases` - Mis compras
- `POST /buyer/review` - Dejar reseña

### Vendors
- `GET /vendor/apps` - Mis apps
- `POST /vendor/apps` - Crear app
- `PUT /vendor/apps/{app_id}` - Actualizar app
- `GET /vendor/sales` - Ver ventas

### Machine Learning
- `GET /ml/recommendations/{user_id}` - Recomendaciones personalizadas
- `POST /ml/price-suggestion/{app_id}` - Sugerir precio óptimo
- `GET /ml/status` - Estado de los modelos

### Admin
- `POST /admin/reset-all` - 🔄 Reset completo del sistema
- `POST /admin/seed-db` - Solo poblar datos
- `POST /admin/clear-db` - Solo limpiar datos

---

## 🎨 Funcionalidades UI

### Buyer (Comprador)
- ✅ Home con recomendaciones ML personalizadas
- ✅ Explorar apps por categoría
- ✅ Mis compras con acceso a apps
- ✅ Sistema de reseñas
- ✅ Modal de detalles de apps
- ✅ Tema claro/oscuro

### Vendor (Vendedor)
- ✅ Dashboard con gráficos de ventas
- ✅ Gestión completa de apps (CRUD)
- ✅ Sugerencias de precios con ML
- ✅ Estadísticas de ventas
- ✅ Ver reseñas de clientes
- ✅ Gráficos adaptados al tema

---

## 🧪 Testing

### Verificar recomendaciones ML
```bash
# Login como Pedro
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pedro@empresa.com","password":"123456"}' | jq -r '.access_token')

# Ver recomendaciones (user_id cambia tras reset, verificar en BD)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/ml/recommendations/103" | jq '.[0:3]'
```

### Verificar optimización de precios
```bash
# Login como María
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@techdev.com","password":"123456"}' | jq -r '.access_token')

# Sugerir precio para app (app_id varía)
curl -H "Authorization: Bearer $TOKEN" \
  -X POST "http://localhost:8000/ml/price-suggestion/241" | jq '.'
```

---

## 🐛 Troubleshooting

### Problema: Recomendaciones vacías
**Solución**: Ejecuta `./reset-appswap.sh`

### Problema: Error "Recommender no entrenado"
**Solución**: Ejecuta `./reset-appswap.sh`

### Problema: Credenciales no funcionan
**Solución**: Todas las cuentas usan password `123456` tras reset

### Problema: Puerto en uso
```bash
# Ver qué usa el puerto 8000
sudo lsof -i :8000

# O reinicia los contenedores
docker-compose down
docker-compose up -d
```

---

## 📚 Documentos Adicionales

- 📖 [RESET_GUIDE.md](./RESET_GUIDE.md) - Guía completa de reset y mantenimiento
- 📖 [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Guía de implementación original
- 📖 [ML_IMPLEMENTATION_SUMMARY.md](./ML_IMPLEMENTATION_SUMMARY.md) - Detalles de ML
- 📖 [backend/SEED_README.md](./backend/SEED_README.md) - Información sobre datos de seed

---

## 🎯 Workflow Típico de Desarrollo

### Día 1: Setup inicial
```bash
docker-compose up -d
./reset-appswap.sh
# Abrir http://localhost:5173
```

### Día N: Después de cambios en esquema de BD
```bash
# Si cambiaste database.py o schemas.py
./reset-appswap.sh
```

### Debugging ML
```bash
# Ver logs de entrenamiento
docker-compose logs backend | grep "MODELO"

# Verificar archivos de modelos
docker-compose exec backend ls -lh ml_models/models/
```

---

## 📊 Datos de Seed

Tras ejecutar `./reset-appswap.sh`:

- **23 usuarios**: 10 vendors + 13 buyers
- **60 apps**: 10 por categoría
  - Productividad
  - Finanzas  
  - Marketing
  - Educación
  - Diseño
  - Desarrollo
- **120 compras**: Distribuidas entre los 13 buyers
- **50 reseñas**: Con ratings 1-5 y comentarios realistas

---

## 🔧 Tecnologías

### Backend
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- PostgreSQL 15
- scikit-learn 1.4.0
- pandas 2.2.0
- JWT Authentication

### Frontend
- React 19
- TypeScript 5.6
- Material-UI 7.3
- TanStack Query 5.90
- Vite 6

### DevOps
- Docker & Docker Compose
- Hot reload en desarrollo

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es parte de un taller educativo.

---

## 🆘 Soporte

Si encuentras problemas:

1. **Primero**: Ejecuta `./reset-appswap.sh`
2. **Segundo**: Revisa [RESET_GUIDE.md](./RESET_GUIDE.md)
3. **Tercero**: Verifica los logs: `docker-compose logs -f backend`

---

## ✨ Características Destacadas

- 🤖 **Machine Learning integrado** - Recomendaciones personalizadas
- 💰 **Optimización de precios** - Sugerencias basadas en datos
- 🎨 **Tema dinámico** - Claro/Oscuro con persistencia
- 📱 **Responsive** - Funciona en móvil, tablet y desktop
- 🔄 **Reset automatizado** - Solución al problema de IDs desincronizados
- 📊 **Visualización de datos** - Gráficos SVG adaptativos
- 🔐 **Autenticación JWT** - Segura y escalable

---

**¿Listo para empezar? Ejecuta `./reset-appswap.sh` y abre http://localhost:5173 🚀**
