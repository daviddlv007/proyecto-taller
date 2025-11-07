# CalculadoraPro Demo - Guía de Demostración

## 📋 Descripción

**CalculadoraPro Demo** es una aplicación de calculadora diseñada para demostrar el modelo completo de negocio de AppSwap. Permite:

- **Modo Demo (Gratuito)**: Suma y resta
- **Modo PRO (De pago)**: Multiplicación y división desbloqueadas

## 🎯 Objetivo de la Demo

Esta calculadora ilustra el flujo completo de AppSwap:

1. **Exploración**: Los compradores pueden probar la versión demo sin costo
2. **Compra**: Si les gusta, compran la versión completa
3. **Credenciales**: Reciben credenciales de acceso
4. **Desbloqueo**: Usan las credenciales para activar funciones PRO

## 🚀 Cómo Probar el Flujo Completo

### Paso 1: Ver la app como comprador (Pedro)

1. Inicia sesión en AppSwap como **Pedro**:
   - Email: `pedro@gmail.com`
   - Contraseña: `password123`

2. Ve a la sección **"Apps disponibles"**

3. Busca **"CalculadoraPro Demo"** en la categoría Productividad

### Paso 2: Probar la versión demo

1. Haz clic en **"Probar Demo"** o abre directamente: `http://localhost:5173/demo-calc/`

2. Verás la calculadora en **MODO DEMO**:
   - ✅ Suma (+) y resta (−) funcionan normalmente
   - 🔒 Multiplicación (×) y división (÷) están bloqueadas
   - Al intentar usar funciones bloqueadas aparece un mensaje

### Paso 3: Comprar la aplicación

1. Regresa a la página de la app en AppSwap

2. Haz clic en **"Comprar"** (precio: $9.99)

3. Completa el proceso de compra

4. Recibirás credenciales:
   ```json
   {
     "usuario": "user_demo",
     "password": "pass_demo"
   }
   ```

### Paso 4: Desbloquear versión PRO

1. Abre nuevamente la calculadora

2. Verás la sección **"🔓 Desbloquear Versión PRO"**

3. Ingresa las credenciales recibidas:
   - Usuario: `user_demo` (o cualquier usuario)
   - Contraseña: `pass_demo` (o cualquier contraseña)

4. Haz clic en **"Iniciar Sesión"**

5. ¡La versión PRO se activará! Ahora tendrás acceso a:
   - ✅ Multiplicación (×)
   - ✅ División (÷)

### Paso 5: Persistencia

- Las credenciales se guardan en `localStorage`
- La próxima vez que abras la calculadora, seguirá en modo PRO
- Puedes cerrar sesión con el botón **"Cerrar Sesión (Volver a Demo)"**

## 🔧 Detalles Técnicos

### Ubicación de archivos

```
appswap/public/demo-calc/
└── index.html        # Calculadora completa (HTML + CSS + JS)
```

### Autenticación simulada

La calculadora acepta **cualquier usuario y contraseña** para facilitar la demostración. En producción, esto se conectaría con el sistema de autenticación de AppSwap.

### Características del código

- ✅ Sin dependencias externas (HTML/CSS/JS puro)
- ✅ Responsive design
- ✅ Persistencia con localStorage
- ✅ UI moderna con gradientes
- ✅ Indicador visual de modo (DEMO/PRO)
- ✅ Animaciones suaves

## 📊 Información de la App en la Base de Datos

- **ID**: 301
- **Nombre**: CalculadoraPro Demo
- **Categoría**: Productividad
- **Precio**: $9.99
- **Vendor**: María García (maria@techdev.com)
- **URL**: `/demo-calc/index.html`
- **Demo URL**: `/demo-calc/index.html`

## 🎨 Capturas de Pantalla (Descripción)

### Modo Demo
- Indicador amarillo "MODO DEMO"
- Botones × y ÷ con candado 🔒
- Mensaje informativo sobre limitaciones
- Formulario de login visible

### Modo PRO
- Indicador verde "MODO PRO"
- Todos los botones activos
- Botón "Cerrar Sesión" visible
- Mensaje de confirmación

## 🛠️ Mantenimiento

### Actualizar la app en la base de datos

```bash
cd /home/ubuntu/proyectos/proyecto-taller
docker-compose exec backend python register_demo_calc.py
```

### Modificar la calculadora

Edita el archivo:
```
appswap/public/demo-calc/index.html
```

Los cambios se reflejarán inmediatamente (no requiere rebuild).

## 💡 Tips para la Presentación

1. **Primero muestra el problema**: "Los usuarios quieren probar antes de comprar"
2. **Luego la solución**: "AppSwap permite demos gratuitas"
3. **Demuestra el valor**: Prueba la suma, luego intenta multiplicar (bloqueado)
4. **Cierra con la conversión**: Compra, obtén credenciales, desbloquea funciones

## 📝 Notas

- La calculadora es completamente funcional y auto-contenida
- No requiere conexión a Internet (excepto para la imagen de portada)
- Acepta números decimales
- Previene división por cero
- Guarda el estado de autenticación entre sesiones

---

**Creado para**: Demostración del modelo de negocio AppSwap  
**Fecha**: 2025  
**Vendor**: María García (@techdev.com)
