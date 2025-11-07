# 🔄 Guía de Reset y Mantenimiento de AppSwap

## Problema Original

Después de limpiar y repoblar la base de datos, los IDs de usuarios y apps cambian, pero los modelos de Machine Learning quedan con IDs antiguos, causando que las recomendaciones fallen.

## ✅ Solución Implementada

Se creó un **flujo completo automatizado** que garantiza la sincronización entre la base de datos y los modelos ML.

---

## 🚀 Método Recomendado: Script Bash

### Opción 1: Script Interactivo (Recomendado)

```bash
./reset-appswap.sh
```

Este script:
- ✅ Solicita confirmación antes de proceder
- ✅ Muestra el progreso paso a paso
- ✅ Verifica que todo salió bien
- ✅ Muestra las credenciales de prueba al final

### Opción 2: Endpoint directo

```bash
curl -X POST http://localhost:8000/admin/reset-all
```

---

## 📋 Qué Hace el Reset Completo

El proceso automático ejecuta **4 pasos en orden**:

### 1️⃣ Limpiar Base de Datos
```
🧹 Elimina TODOS los datos:
   - Reviews
   - Payments (compras)
   - Apps
   - Users
```

### 2️⃣ Poblar con Datos de Demostración
```
📦 Crea:
   - 23 usuarios (10 vendors + 13 buyers)
   - 60 apps (10 por cada categoría)
   - 120 compras
   - 50 reseñas
```

### 3️⃣ Entrenar Modelos ML
```
🤖 Entrena ambos modelos con los datos actuales:
   - Sistema de Recomendaciones
   - Optimizador de Precios
```

### 4️⃣ Recargar Modelos en Memoria
```
🔄 Recarga las instancias globales del servidor:
   - ml_endpoints.recommender
   - ml_endpoints.price_optimizer
```

**⚠️ IMPORTANTE**: El paso 4 es crítico. Sin él, el servidor seguiría usando modelos obsoletos aunque los archivos en disco estén actualizados.

---

## 🔐 Credenciales de Prueba

Después del reset, puedes usar estas cuentas:

### 👨‍💼 Vendor (María)
```
Email: maria@techdev.com
Password: 123456
```

### 👤 Buyer (Pedro)  
```
Email: pedro@empresa.com
Password: 123456
```

### 🔧 Admin
```
Email: admin@appswap.com
Password: 123456
```

---

## ✅ Verificar que Funciona

### 1. Verificar recomendaciones ML

```bash
# Login como Pedro
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pedro@empresa.com","password":"123456"}' \
  | jq -r '.access_token')

# Obtener ID de Pedro (debería ser 80 tras reset)
# Verificar recomendaciones
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/ml/recommendations/80" | jq '.[0:3]'
```

Deberías ver 3 apps recomendadas con sus scores.

### 2. Verificar optimización de precios

```bash
# Login como María
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@techdev.com","password":"123456"}' \
  | jq -r '.access_token')

# Sugerir precio para una app (app_id varía, usa uno existente)
curl -H "Authorization: Bearer $TOKEN" \
  -X POST "http://localhost:8000/ml/price-suggestion/84" | jq '.'
```

### 3. Verificar en el navegador

1. Abre http://localhost:5173
2. Login como **Pedro** (buyer)
3. En la página **Home** deberías ver:
   - Sección "Recomendaciones Personalizadas" con 6 apps
   - Sin porcentajes de "match"
   - Sin texto "Usuarios similares a ti..."

---

## 🛠️ Solución de Problemas

### Problema: "Recommender no está entrenado"

**Causa**: Los modelos no se cargaron después del entrenamiento.

**Solución**: Ejecuta el reset completo de nuevo:
```bash
./reset-appswap.sh
```

### Problema: Recomendaciones vacías `[]`

**Causa 1**: El usuario no tiene compras.
- Verifica que el usuario sea uno de los 13 buyers creados (IDs del 80 al 92 típicamente)

**Causa 2**: Los modelos no se recargaron.
- Ejecuta reset completo

**Causa 3**: El usuario no existe en la matriz.
- Verifica el ID correcto del usuario en la DB

### Problema: Credenciales no funcionan

**Causa**: La password cambió o los usuarios tienen IDs diferentes.

**Solución**: Todas las cuentas usan password `123456` tras el reset.

---

## 📊 Arquitectura del Flujo

```
┌─────────────────────────────────────────────────────────┐
│  1. Cliente hace: POST /admin/reset-all                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. Backend (admin_routes.py)                           │
│     ├─ Limpia DB                                        │
│     ├─ Puebla con seed_database()                       │
│     ├─ Entrena recommender.train(db)                    │
│     ├─ Entrena optimizer.train(db)                      │
│     └─ CLAVE: ml_endpoints.recommender.load()           │
│               ml_endpoints.price_optimizer.load()       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Modelos .pkl actualizados Y cargados en memoria     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. GET /ml/recommendations/{user_id}                   │
│     └─ Usa ml_endpoints.recommender (actualizado)       │
└─────────────────────────────────────────────────────────┘
```

**🔑 Punto Clave**: Sin el paso de `load()` en las instancias globales, los endpoints seguirían usando los modelos viejos en memoria aunque los archivos `.pkl` estén actualizados en disco.

---

## 📝 Cambios en el Frontend

Se eliminaron elementos redundantes de las tarjetas de recomendaciones ML:

### ❌ Antes
```tsx
<Chip label="85% match" />
<Typography>"Usuarios similares a ti compraron esta app"</Typography>
```

### ✅ Después
```tsx
// Sin chips de porcentaje
// Sin texto explicativo
// Solo: imagen, nombre, categoría, descripción, precio
```

**Razón**: Esta información no aporta valor al usuario y satura visualmente la interfaz.

---

## 🎯 Resumen

### El flujo ahora es simple:

1. **Resetear todo**: `./reset-appswap.sh`
2. **Verificar**: Login y probar recomendaciones
3. **Listo**: Todo funciona automáticamente

### No más problemas de:
- ❌ IDs desincronizados
- ❌ Modelos obsoletos
- ❌ Recomendaciones vacías tras limpiar DB
- ❌ Necesidad de re-entrenar manualmente

### Garantías:
- ✅ DB limpia y poblada
- ✅ Modelos ML entrenados con datos actuales
- ✅ Modelos cargados en memoria
- ✅ Recomendaciones funcionan inmediatamente
- ✅ Optimización de precios funciona inmediatamente

---

## 🔗 Referencias

- Endpoint: `backend/admin_routes.py` - función `reset_all()`
- Script: `reset-appswap.sh`
- Modelos ML: `backend/ml_models/recommender.py` y `price_optimizer.py`
- Frontend: `appswap/src/features/buyer/Home.tsx`
