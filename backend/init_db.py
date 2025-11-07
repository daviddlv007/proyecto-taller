from database import SessionLocal, User, App, Payment, Review
from auth import get_password_hash
import random

def init_db():
    db = SessionLocal()
    
    # Verificar si ya hay datos
    if db.query(User).count() > 0:
        print("La base de datos ya tiene datos")
        db.close()
        return
    
    # Crear usuarios de ejemplo
    vendor1 = User(
        correo="vendor@example.com",
        nombre="Juan Vendedor",
        contrasena=get_password_hash("123456"),
        role="vendor"
    )
    
    vendor2 = User(
        correo="maria@vendor.com",
        nombre="Maria García",
        contrasena=get_password_hash("123456"),
        role="vendor"
    )
    
    buyer1 = User(
        correo="buyer@example.com",
        nombre="Ana Compradora",
        contrasena=get_password_hash("123456"),
        role="buyer"
    )
    
    buyer2 = User(
        correo="pedro@buyer.com",
        nombre="Pedro López",
        contrasena=get_password_hash("123456"),
        role="buyer"
    )
    
    db.add_all([vendor1, vendor2, buyer1, buyer2])
    db.commit()
    db.refresh(vendor1)
    db.refresh(vendor2)
    db.refresh(buyer1)
    db.refresh(buyer2)
    
    # Crear apps de ejemplo
    apps_data = [
        {
            "name": "TaskMaster Pro",
            "description": "Gestor de tareas avanzado con colaboración en tiempo real",
            "category": "Productividad",
            "app_url": "https://taskmaster-pro.vercel.app",
            "owner_id": vendor1.id
        },
        {
            "name": "FinanceTracker",
            "description": "Aplicación para control de finanzas personales",
            "category": "Finanzas",
            "app_url": "https://finance-tracker.netlify.app",
            "owner_id": vendor1.id
        },
        {
            "name": "MindMap Creator",
            "description": "Herramienta para crear mapas mentales interactivos",
            "category": "Educación",
            "app_url": "https://mindmap-creator.herokuapp.com",
            "owner_id": vendor2.id
        },
        {
            "name": "CodeSnippet Manager",
            "description": "Organizador de fragmentos de código para desarrolladores",
            "category": "Desarrollo",
            "app_url": "https://codesnippet-manager.com",
            "owner_id": vendor2.id
        },
        {
            "name": "Workout Planner",
            "description": "Planificador de rutinas de ejercicio personalizado",
            "category": "Salud",
            "app_url": "https://workout-planner.app",
            "owner_id": vendor1.id
        }
    ]
    
    created_apps = []
    for app_data in apps_data:
        app = App(**app_data)
        db.add(app)
        created_apps.append(app)
    
    db.commit()
    for app in created_apps:
        db.refresh(app)
    
    # Crear algunos pagos de ejemplo
    payments_data = [
        {
            "app_id": created_apps[0].id,
            "buyer_id": buyer1.id,
            "status": "confirmed",
            "qr_code": "QR001234567890"
        },
        {
            "app_id": created_apps[1].id,
            "buyer_id": buyer1.id,
            "status": "pending",
            "qr_code": "QR001234567891"
        },
        {
            "app_id": created_apps[2].id,
            "buyer_id": buyer2.id,
            "status": "confirmed",
            "qr_code": "QR001234567892"
        }
    ]
    
    for payment_data in payments_data:
        payment = Payment(**payment_data)
        db.add(payment)
    
    db.commit()
    
    # Crear algunas reviews de ejemplo
    reviews_data = [
        {
            "app_id": created_apps[0].id,
            "user_id": buyer1.id,
            "rating": 5,
            "comment": "Excelente app! Muy útil para organizar mis tareas diarias."
        },
        {
            "app_id": created_apps[2].id,
            "user_id": buyer2.id,
            "rating": 4,
            "comment": "Buena herramienta para crear mapas mentales, interfaz intuitiva."
        },
        {
            "app_id": created_apps[0].id,
            "user_id": buyer2.id,
            "rating": 5,
            "comment": "La mejor app de productividad que he usado."
        }
    ]
    
    for review_data in reviews_data:
        review = Review(**review_data)
        db.add(review)
    
    db.commit()
    db.close()
    
    print("Base de datos inicializada con datos de ejemplo")
    print("\nUsuarios creados:")
    print("Vendedores:")
    print("- vendor@example.com / 123456")
    print("- maria@vendor.com / 123456")
    print("\nCompradores:")
    print("- buyer@example.com / 123456")
    print("- pedro@buyer.com / 123456")

if __name__ == "__main__":
    init_db()