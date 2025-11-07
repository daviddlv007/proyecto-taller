#!/bin/bash

# Script de prueba rápida para CalculadoraPro Demo
# Ejecuta todas las verificaciones y proporciona acceso rápido

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        CALCULADORAPRO DEMO - SCRIPT DE PRUEBA RÁPIDA          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que Docker Compose esté corriendo
echo "📦 Verificando servicios Docker..."
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Error: Los servicios no están corriendo"
    echo "💡 Ejecuta primero: docker-compose up -d"
    exit 1
fi
echo "✅ Servicios corriendo correctamente"
echo ""

# Verificar configuración de la calculadora
echo "🔍 Verificando configuración de CalculadoraPro Demo..."
docker-compose exec -T backend python verify_calculator.py
VERIFY_EXIT_CODE=$?

if [ $VERIFY_EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ La verificación falló. ¿Deseas registrar/actualizar la app? (s/n)"
    read -r response
    if [ "$response" = "s" ] || [ "$response" = "S" ]; then
        docker-compose exec -T backend python register_demo_calc.py
    fi
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                      ACCESO RÁPIDO                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 URLs disponibles:"
echo "   • Calculadora directa:  http://localhost:5173/demo-calc/"
echo "   • Frontend AppSwap:     http://localhost:5173/"
echo "   • Backend API:          http://localhost:8000/"
echo "   • API Docs:             http://localhost:8000/docs"
echo ""
echo "👤 Credenciales de prueba:"
echo "   • Pedro (comprador):    pedro@gmail.com / password123"
echo "   • María (vendor):       maria@techdev.com / password123"
echo ""
echo "🎯 FLUJO DE DEMOSTRACIÓN:"
echo "   1. Abre la calculadora: http://localhost:5173/demo-calc/"
echo "   2. Prueba suma y resta (funciona)"
echo "   3. Intenta multiplicar o dividir (bloqueado)"
echo "   4. Login como Pedro en AppSwap: http://localhost:5173/"
echo "   5. Busca 'CalculadoraPro Demo' y cómprala"
echo "   6. Usa las credenciales en la calculadora"
echo "   7. Disfruta del modo PRO (todas las operaciones)"
echo ""
echo "📝 COMANDOS ÚTILES:"
echo "   • Reiniciar servicios:     docker-compose restart"
echo "   • Ver logs backend:        docker-compose logs -f backend"
echo "   • Actualizar app:          docker-compose exec backend python register_demo_calc.py"
echo "   • Verificar app:           docker-compose exec backend python verify_calculator.py"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ¡LISTO PARA DEMOSTRAR!                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Preguntar si desea abrir en navegador
if command -v xdg-open &> /dev/null; then
    echo "¿Deseas abrir la calculadora en el navegador? (s/n)"
    read -r open_browser
    if [ "$open_browser" = "s" ] || [ "$open_browser" = "S" ]; then
        xdg-open "http://localhost:5173/demo-calc/"
        echo "✅ Navegador abierto"
    fi
elif command -v open &> /dev/null; then
    echo "¿Deseas abrir la calculadora en el navegador? (s/n)"
    read -r open_browser
    if [ "$open_browser" = "s" ] || [ "$open_browser" = "S" ]; then
        open "http://localhost:5173/demo-calc/"
        echo "✅ Navegador abierto"
    fi
fi

echo ""
echo "📚 Documentación completa en: CALCULADORA_DEMO_SUMMARY.md"
echo ""
