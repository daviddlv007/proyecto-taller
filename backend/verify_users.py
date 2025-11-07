"""
Script para verificar que los usuarios del DevLogin existen en la base de datos
"""
from database import SessionLocal, User

def verify_dev_users():
    """Verifica que todos los usuarios del DEV_USERS existan"""
    db = SessionLocal()
    
    # Usuarios esperados por el DevLogin del frontend
    expected_users = [
        ("vendor@example.com", "vendor", "Juan Vendedor"),
        ("maria@vendor.com", "vendor", "Maria García"),
        ("buyer@example.com", "buyer", "Ana Compradora"),
        ("pedro@buyer.com", "buyer", "Pedro López"),
    ]
    
    print("="*60)
    print("🔍 VERIFICACIÓN DE USUARIOS DEV_USERS")
    print("="*60 + "\n")
    
    all_ok = True
    
    for email, role, nombre in expected_users:
        user = db.query(User).filter(User.correo == email).first()
        
        if user:
            status = "✅"
            if user.role != role:
                status = "⚠️ "
                all_ok = False
                print(f"{status} {nombre} ({email})")
                print(f"   ⚠️  ERROR: Role incorrecto. Esperado: {role}, Encontrado: {user.role}")
            elif user.nombre != nombre:
                status = "⚠️ "
                print(f"{status} {nombre} ({email})")
                print(f"   ⚠️  ADVERTENCIA: Nombre diferente. Esperado: {nombre}, Encontrado: {user.nombre}")
            else:
                print(f"{status} {nombre} ({email})")
                print(f"   Role: {user.role} | ID: {user.id}")
        else:
            status = "❌"
            all_ok = False
            print(f"{status} {nombre} ({email})")
            print(f"   ❌ ERROR: Usuario no existe en la base de datos")
        
        print()
    
    print("="*60)
    if all_ok:
        print("✅ Todos los usuarios DEV_USERS están correctamente configurados")
        print("🚀 El DevLogin del frontend debería funcionar correctamente")
    else:
        print("❌ Hay problemas con los usuarios DEV_USERS")
        print("💡 Ejecuta: python seed_database.py")
    print("="*60 + "\n")
    
    db.close()

if __name__ == "__main__":
    verify_dev_users()
