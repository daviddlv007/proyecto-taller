#!/bin/bash
# Script para resetear completamente AppSwap
# Limpia DB + Puebla datos + Entrena ML + Recarga modelos

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🔄 APPSWAP - RESET COMPLETO DEL SISTEMA            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Este script hará lo siguiente:"
echo "  1️⃣  Limpiará toda la base de datos"
echo "  2️⃣  Poblará con datos de demostración (23 usuarios, 60 apps)"
echo "  3️⃣  Entrenará los modelos de Machine Learning"
echo "  4️⃣  Recargará los modelos en memoria"
echo ""
echo "⚠️  ADVERTENCIA: Se eliminarán TODOS los datos existentes"
echo ""
read -p "¿Deseas continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    echo "❌ Operación cancelada"
    exit 1
fi

echo ""
echo "🚀 Iniciando reset completo..."
echo ""

# Ejecutar el endpoint
response=$(curl -s -X POST http://localhost:8000/admin/reset-all)

# Verificar si fue exitoso
if echo "$response" | grep -q '"success":true'; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                ✅ RESET COMPLETADO EXITOSAMENTE            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📊 Datos creados:"
    echo "   • 23 usuarios (10 vendors + 13 buyers)"
    echo "   • 60 aplicaciones (10 por categoría)"
    echo "   • 120 compras"
    echo "   • 50 reseñas"
    echo ""
    echo "🤖 Modelos ML:"
    echo "   • Sistema de Recomendaciones ✓"
    echo "   • Optimizador de Precios ✓"
    echo ""
    echo "🔐 Credenciales de prueba:"
    echo ""
    echo "   👨‍💼 VENDOR (María):"
    echo "      Email: maria@techdev.com"
    echo "      Password: 123456"
    echo ""
    echo "   👤 BUYER (Pedro):"
    echo "      Email: pedro@empresa.com"
    echo "      Password: 123456"
    echo ""
    echo "🌐 Accede a: http://localhost:5173"
    echo ""
else
    echo ""
    echo "❌ ERROR: El reset falló"
    echo ""
    echo "Respuesta del servidor:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo ""
    exit 1
fi
