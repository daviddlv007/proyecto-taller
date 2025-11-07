#!/bin/bash

# Script para iniciar ambos servidores de AppSwap

echo "🚀 Iniciando AppSwap..."

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    pkill -f "python main.py"
    pkill -f "npm run dev"
    exit 0
}

# Capturar señales para limpieza
trap cleanup SIGINT SIGTERM

# Verificar si el directorio del proyecto existe
if [ ! -d "/home/ubuntu/proyectos/proyecto-taller" ]; then
    echo "❌ Error: Directorio del proyecto no encontrado"
    exit 1
fi

echo "📦 Iniciando backend (FastAPI)..."
cd /home/ubuntu/proyectos/proyecto-taller/backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Esperar un momento para que el backend inicie
sleep 3

echo "🌐 Iniciando frontend (React + Vite)..."
cd /home/ubuntu/proyectos/proyecto-taller/appswap
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ AppSwap iniciado correctamente!"
echo ""
echo "📍 URLs disponibles:"
echo "   🔗 Backend API: http://localhost:8000"
echo "   🔗 Frontend:    http://localhost:5175 (o puerto disponible)"
echo "   📖 API Docs:    http://localhost:8000/docs"
echo ""
echo "👥 Usuarios de prueba:"
echo "   Vendedores:"
echo "   • vendor@example.com / 123456"
echo "   • maria@vendor.com / 123456"
echo ""
echo "   Compradores:"
echo "   • buyer@example.com / 123456"
echo "   • pedro@buyer.com / 123456"
echo ""
echo "📋 Presiona Ctrl+C para detener ambos servidores"
echo ""

# Esperar a que termine uno de los procesos
wait