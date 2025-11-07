# Script de Población de Base de Datos

## Descripción
Script para poblar la base de datos de AppSwap con datos realistas para desarrollo y testing. Preparado para escalar a datasets grandes para Machine Learning en el futuro.

## Uso

### Población básica (configuración actual)
```bash
cd backend
python seed_database.py
```

Esto generará un dataset **SMALL** con:
- 3 vendedores
- 5 compradores  
- 2-4 apps por vendedor (~10 apps total)
- 1-3 compras por comprador (~7 compras)
- 60% de probabilidad de review por compra (~4 reviews)

### Escalado futuro para ML

Para generar más datos en el futuro, edita el archivo `seed_database.py` línea 138:

```python
# Cambiar "small" por "medium" o "large"
seed_database(dataset_size="medium", clean_first=True)
```

**Configuraciones disponibles:**

| Dataset | Vendedores | Compradores | Apps | Compras aprox. | Reviews aprox. |
|---------|-----------|------------|------|----------------|----------------|
| `small` | 3 | 5 | 10 | 7 | 4 |
| `medium` | 10 | 50 | 40-80 | 100-500 | 50-250 |
| `large` | 50 | 500 | 250-750 | 1000-10000 | 400-4000 |

## Credenciales de Prueba

Después de ejecutar el script, usa estas credenciales (coinciden con el **DevLogin** del frontend):

### Vendedores:
1. **Juan Vendedor**
   - Email: `vendor@example.com`
   - Contraseña: `123456`

2. **Maria García**
   - Email: `maria@vendor.com`
   - Contraseña: `123456`

### Compradores:
1. **Ana Compradora**
   - Email: `buyer@example.com`
   - Contraseña: `123456`

2. **Pedro López**
   - Email: `pedro@buyer.com`
   - Contraseña: `123456`

> 💡 **Nota:** Estos usuarios aparecen automáticamente en el **DevLogin** del frontend para acceso rápido con un clic.

## Datos Generados

### Aplicaciones
- Nombres realistas (TaskMaster Pro, CloudSync, etc.)
- Categorías variadas (Productividad, Desarrollo, Diseño, etc.)
- Precios: $0 (gratis), $4.99, $9.99, $14.99, $19.99, $29.99, $49.99, $99.99
- URLs de apps y demos generadas automáticamente
- Imágenes de portada usando picsum.photos

### Compras
- Fechas aleatorias en los últimos 90 días
- Credenciales únicas generadas automáticamente
- Status: "confirmed" (auto-confirmado)
- QR codes únicos por compra

### Reviews
- Ratings: 3-5 estrellas (sesgo positivo realista)
- 70% con comentarios, 30% solo rating
- Fechas 1-7 días después de la compra

## Limpieza de Datos

Por defecto, el script **limpia completamente** la base de datos antes de poblar. Para preservar datos existentes:

```python
seed_database(dataset_size="small", clean_first=False)
```

⚠️ **Advertencia:** Esto puede causar conflictos si ya existen usuarios con los mismos emails.

## Estructura del Script

El script está modularizado para fácil mantenimiento:

- `DATASET_CONFIG`: Configuración de tamaños de dataset
- `APP_NAMES`, `CATEGORIES`, etc.: Datos realistas para generación
- `clean_database()`: Limpia todas las tablas
- `create_users()`: Genera vendedores y compradores
- `create_apps()`: Crea aplicaciones con precios
- `create_purchases_and_reviews()`: Genera compras y reviews
- `print_summary()`: Muestra estadísticas de datos generados

## Futuras Mejoras para ML

El script está preparado para:
- ✅ Generar miles de registros para entrenamiento de modelos
- ✅ Distribuciones realistas de ratings y compras
- ✅ Datos temporales para análisis de series de tiempo
- ✅ Relaciones entre usuarios, apps y reviews para recomendaciones

### Ejemplo para ML (futuro):
```python
# Generar 500 compradores y 50 vendedores con miles de interacciones
seed_database(dataset_size="large", clean_first=True)
```
