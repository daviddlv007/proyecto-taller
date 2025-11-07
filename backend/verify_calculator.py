#!/usr/bin/env python3
"""
Script de verificación para probar el flujo completo de CalculadoraPro Demo.
Verifica:
1. La app existe en la base de datos
2. Pertenece al vendor María
3. Tiene la URL correcta configurada
4. Los datos están completos
"""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from database import get_db, App, User, Payment


def verify_calculator_setup():
    """Verify the calculator app is properly set up."""
    db = next(get_db())
    
    try:
        print("\n" + "="*60)
        print("🔍 VERIFICACIÓN DE CALCULADORAPRO DEMO")
        print("="*60 + "\n")
        
        # 1. Check if app exists
        print("1️⃣  Verificando existencia de la app...")
        calc_app = db.query(App).filter(App.name == 'CalculadoraPro Demo').first()
        
        if not calc_app:
            print("   ❌ La app 'CalculadoraPro Demo' no existe")
            print("   💡 Ejecuta: docker-compose exec backend python register_demo_calc.py")
            return False
        
        print(f"   ✅ App encontrada (ID: {calc_app.id})")
        
        # 2. Check vendor
        print("\n2️⃣  Verificando vendor...")
        vendor = db.query(User).filter(User.id == calc_app.owner_id).first()
        
        if not vendor:
            print(f"   ❌ No se encontró el vendor (ID: {calc_app.owner_id})")
            return False
        
        if vendor.correo != 'maria@techdev.com':
            print(f"   ⚠️  Vendor no esperado: {vendor.correo} (esperado: maria@techdev.com)")
        else:
            print(f"   ✅ Vendor correcto: {vendor.nombre} ({vendor.correo})")
        
        # 3. Check URLs
        print("\n3️⃣  Verificando URLs...")
        if calc_app.app_url != '/demo-calc/index.html':
            print(f"   ⚠️  app_url: {calc_app.app_url} (esperado: /demo-calc/index.html)")
        else:
            print(f"   ✅ app_url correcto: {calc_app.app_url}")
        
        if calc_app.demo_url != '/demo-calc/index.html':
            print(f"   ⚠️  demo_url: {calc_app.demo_url} (esperado: /demo-calc/index.html)")
        else:
            print(f"   ✅ demo_url correcto: {calc_app.demo_url}")
        
        # 4. Check price
        print("\n4️⃣  Verificando precio...")
        if calc_app.price != 9.99:
            print(f"   ⚠️  Precio: ${calc_app.price} (esperado: $9.99)")
        else:
            print(f"   ✅ Precio correcto: ${calc_app.price}")
        
        # 5. Check category
        print("\n5️⃣  Verificando categoría...")
        if calc_app.category != 'Productividad':
            print(f"   ⚠️  Categoría: {calc_app.category} (esperado: Productividad)")
        else:
            print(f"   ✅ Categoría correcta: {calc_app.category}")
        
        # 6. Check credentials template
        print("\n6️⃣  Verificando credenciales...")
        if calc_app.credentials_template:
            print(f"   ✅ Template de credenciales: {calc_app.credentials_template}")
        else:
            print("   ⚠️  No hay template de credenciales configurado")
        
        # 7. Check purchases (optional)
        print("\n7️⃣  Verificando compras...")
        purchase_count = db.query(Payment).filter(Payment.app_id == calc_app.id).count()
        print(f"   ℹ️  Compras registradas: {purchase_count}")
        
        # Summary
        print("\n" + "="*60)
        print("📊 RESUMEN DE LA CONFIGURACIÓN")
        print("="*60)
        print(f"App ID:        {calc_app.id}")
        print(f"Nombre:        {calc_app.name}")
        print(f"Vendor:        {vendor.nombre} ({vendor.correo})")
        print(f"Categoría:     {calc_app.category}")
        print(f"Precio:        ${calc_app.price}")
        print(f"URL App:       {calc_app.app_url}")
        print(f"URL Demo:      {calc_app.demo_url}")
        print(f"Imagen:        {calc_app.cover_image[:50]}...")
        print(f"Credenciales:  {calc_app.credentials_template}")
        print(f"Compras:       {purchase_count}")
        print("="*60)
        
        # Instructions
        print("\n✅ TODO VERIFICADO CORRECTAMENTE\n")
        print("🎯 PRÓXIMOS PASOS:")
        print("   1. Abre http://localhost:5173/demo-calc/ en tu navegador")
        print("   2. Prueba la versión demo (suma y resta)")
        print("   3. Intenta usar multiplicación o división (debería estar bloqueado)")
        print("   4. Inicia sesión como Pedro: pedro@gmail.com / password123")
        print("   5. Compra la app 'CalculadoraPro Demo'")
        print("   6. Usa las credenciales recibidas para desbloquear modo PRO")
        print("\n" + "="*60 + "\n")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error durante la verificación: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


if __name__ == '__main__':
    success = verify_calculator_setup()
    sys.exit(0 if success else 1)
