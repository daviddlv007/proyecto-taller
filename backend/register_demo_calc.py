#!/usr/bin/env python3
"""
Script para registrar la aplicación CalculadoraPro Demo en la base de datos.
Esta app será propiedad del vendor María (maria@techdev.com).
"""

import sys
from pathlib import Path

# Add parent directory to path to import database module
sys.path.append(str(Path(__file__).parent))

from database import get_db, App, User
from datetime import datetime


def register_calculator_app():
    """Register the CalculadoraPro Demo app in the database."""
    db = next(get_db())
    
    try:
        # Find María's user account
        maria = db.query(User).filter(
            User.correo == 'maria@techdev.com',
            User.role == 'vendor'
        ).first()
        
        if not maria:
            print("❌ Error: No se encontró el usuario vendor 'maria@techdev.com'")
            print("   Asegúrate de que la base de datos esté inicializada con seed_database.py")
            return False
        
        print(f"✓ Usuario vendor encontrado: {maria.nombre} ({maria.correo})")
        
        # Check if app already exists
        existing_app = db.query(App).filter(
            App.name == 'CalculadoraPro Demo'
        ).first()
        
        if existing_app:
            print(f"⚠ La app 'CalculadoraPro Demo' ya existe (ID: {existing_app.id})")
            print("Actualizando la app existente...")
            
            # Update existing app
            existing_app.description = 'Calculadora profesional con funciones básicas (suma, resta) en modo demo y funciones avanzadas (multiplicación, división) en modo PRO. ¡Perfecta para demostrar el modelo de negocio de AppSwap!'
            existing_app.category = 'Productividad'
            existing_app.price = 9.99
            existing_app.app_url = '/demo-calc/index.html'
            existing_app.demo_url = '/demo-calc/index.html'
            existing_app.cover_image = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop'
            existing_app.credentials_template = '{"usuario": "user_demo", "password": "pass_demo"}'
            
            db.commit()
            print(f"✓ App actualizada exitosamente (ID: {existing_app.id})")
            print_app_details(existing_app)
            return True
        
        # Create new app
        new_app = App(
            name='CalculadoraPro Demo',
            description='Calculadora profesional con funciones básicas (suma, resta) en modo demo y funciones avanzadas (multiplicación, división) en modo PRO. ¡Perfecta para demostrar el modelo de negocio de AppSwap!',
            category='Productividad',
            price=9.99,
            app_url='/demo-calc/index.html',
            demo_url='/demo-calc/index.html',
            owner_id=maria.id,
            cover_image='https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop',
            credentials_template='{"usuario": "user_demo", "password": "pass_demo"}'
        )
        
        db.add(new_app)
        db.commit()
        db.refresh(new_app)
        
        print(f"\n✓ App registrada exitosamente!")
        print_app_details(new_app)
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error al registrar la app: {e}")
        db.rollback()
        return False
    finally:
        db.close()


def print_app_details(app):
    """Print formatted app details."""
    print("\n" + "="*60)
    print("DETALLES DE LA APP")
    print("="*60)
    print(f"ID:          {app.id}")
    print(f"Nombre:      {app.name}")
    print(f"Categoría:   {app.category}")
    print(f"Precio:      ${app.price}")
    print(f"URL:         {app.app_url}")
    print(f"Demo URL:    {app.demo_url}")
    print(f"Owner ID:    {app.owner_id}")
    print(f"Descripción: {app.description}")
    print(f"Imagen:      {app.cover_image}")
    print(f"Credenciales: {app.credentials_template}")
    print("="*60)
    print("\n📝 INSTRUCCIONES PARA PROBAR:")
    print("   1. Inicia sesión como Pedro (pedro@gmail.com / password123)")
    print("   2. Ve a la página de Apps y busca 'CalculadoraPro Demo'")
    print("   3. Haz clic en 'Probar Demo' para ver la versión gratuita")
    print("   4. Compra la app para obtener credenciales")
    print("   5. Usa las credenciales para desbloquear la versión PRO")
    print("="*60 + "\n")


if __name__ == '__main__':
    print("\n🚀 Registrando CalculadoraPro Demo en la base de datos...\n")
    success = register_calculator_app()
    sys.exit(0 if success else 1)
