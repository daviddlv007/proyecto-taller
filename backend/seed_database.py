"""
Script de población de base de datos para AppSwap
Genera datos realistas para desarrollo y testing.
Preparado para escalar a datasets grandes para ML en el futuro.
"""
import json
import random
from datetime import datetime, timedelta
from database import SessionLocal, User, App, Payment, Review, Rol, Categoria, Base, engine
from passlib.context import CryptContext

# Configuración de hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración: cambiar DATASET_SIZE para generar más datos en el futuro
DATASET_SIZE = "small"  # "small", "medium", "large" para futuras implementaciones de ML

# Datasets configurables
DATASET_CONFIG = {
    "small": {
        "vendors": 3,
        "buyers": 5,
        "apps_per_vendor": (2, 4),  # min, max apps por vendedor
        "purchases_per_buyer": (1, 3),  # min, max compras por comprador
        "review_probability": 0.6  # 60% de las compras tienen review
    },
    "medium": {
        "vendors": 10,
        "buyers": 50,
        "apps_per_vendor": (3, 8),
        "purchases_per_buyer": (2, 10),
        "review_probability": 0.5
    },
    "large": {
        "vendors": 50,
        "buyers": 500,
        "apps_per_vendor": (5, 15),
        "purchases_per_buyer": (3, 20),
        "review_probability": 0.4
    }
}

# Datos realistas para generación
APP_NAMES = [
    "TaskMaster Pro", "CloudSync", "DataViz Dashboard", "SecureVault",
    "CodeHelper IDE", "DesignStudio", "ProjectHub", "Analytics Plus",
    "ChatConnect", "FileManager Pro", "EmailBoost", "CalendarSync",
    "NoteTaker Elite", "BudgetTracker", "FitnessCoach", "RecipeBox",
    "MusicStream", "PhotoEditor Pro", "VideoConverter", "PDFTools"
]

CATEGORIES = ["Productividad", "Desarrollo", "Diseño", "Analítica", "Comunicación", 
              "Utilidades", "Finanzas", "Salud", "Entretenimiento", "Educación"]

DESCRIPTIONS = [
    "Herramienta profesional para aumentar tu productividad diaria",
    "Solución empresarial para equipos modernos",
    "Plataforma intuitiva con funciones avanzadas",
    "Sistema completo de gestión y análisis",
    "Aplicación premium con soporte 24/7",
    "Suite integral para profesionales",
    "Software líder en su categoría",
    "Tecnología de vanguardia para tu negocio"
]

REVIEW_COMMENTS = [
    "Excelente aplicación, muy útil para mi trabajo diario",
    "Fácil de usar y con muchas funcionalidades",
    "Cumple con lo prometido, recomendada",
    "Buena relación calidad-precio",
    "Interfaz intuitiva y buen rendimiento",
    "Me ha ayudado a optimizar mis procesos",
    "Soporte técnico muy atento",
    "Algunas funciones podrían mejorar pero en general bien",
    "Perfecta para equipos pequeños",
    "Vale la pena la inversión"
]

def hash_password(password: str) -> str:
    """Hash de contraseña usando bcrypt"""
    return pwd_context.hash(password)

def generate_credentials(buyer_id: int, app_id: int) -> str:
    """Genera credenciales únicas en formato JSON"""
    credentials = {
        "username": f"user_{app_id}_{buyer_id}",
        "password": f"pass_{random.randint(10000000, 99999999)}",
        "app_id": app_id,
        "buyer_id": buyer_id
    }
    return json.dumps(credentials)

def clean_database(db):
    """Limpia todas las tablas de la base de datos"""
    print("🧹 Limpiando base de datos...")
    db.query(Review).delete()
    db.query(Payment).delete()
    db.query(App).delete()
    db.query(User).delete()
    db.commit()
    print("✅ Base de datos limpiada")

def create_users(db, config):
    """Crea usuarios vendedores y compradores"""
    print(f"👥 Creando usuarios de desarrollo y {config['vendors']} vendedores adicionales y {config['buyers']} compradores adicionales...")
    
    rol_desarrollador = db.query(Rol).filter(Rol.nombre == "desarrollador").first()
    if not rol_desarrollador:
        rol_desarrollador = Rol(nombre="desarrollador")
        db.add(rol_desarrollador)
        db.flush()
    
    rol_usuario = db.query(Rol).filter(Rol.nombre == "usuario").first()
    if not rol_usuario:
        rol_usuario = Rol(nombre="usuario")
        db.add(rol_usuario)
        db.flush()
    
    vendors = []
    buyers = []
    
    print("🔧 Creando usuarios de desarrollo (DEV_USERS)...")
    
    dev_vendor1 = User(
        correo="vendor@example.com",
        nombre="Juan Vendedor",
        contrasena=hash_password("123456"),
        rol_id=rol_desarrollador.id
    )
    db.add(dev_vendor1)
    vendors.append(dev_vendor1)
    
    dev_vendor2 = User(
        correo="maria@vendor.com",
        nombre="Maria García",
        contrasena=hash_password("123456"),
        rol_id=rol_desarrollador.id
    )
    db.add(dev_vendor2)
    vendors.append(dev_vendor2)
    
    dev_buyer1 = User(
        correo="buyer@example.com",
        nombre="Ana Compradora",
        contrasena=hash_password("123456"),
        rol_id=rol_usuario.id
    )
    db.add(dev_buyer1)
    buyers.append(dev_buyer1)
    
    dev_buyer2 = User(
        correo="pedro@buyer.com",
        nombre="Pedro López",
        contrasena=hash_password("123456"),
        rol_id=rol_usuario.id
    )
    db.add(dev_buyer2)
    buyers.append(dev_buyer2)
    
    print("✅ Usuarios de desarrollo creados (para DevLogin)")
    
    additional_vendors = max(0, config['vendors'] - 2)
    additional_buyers = max(0, config['buyers'] - 2)
    
    if additional_vendors > 0:
        print(f"📝 Creando {additional_vendors} vendedores adicionales...")
        for i in range(1, additional_vendors + 1):
            vendor = User(
                correo=f"vendor{i}@appswap.com",
                nombre=f"Vendor {i}",
                contrasena=hash_password("vendor123"),
                rol_id=rol_desarrollador.id
            )
            db.add(vendor)
            vendors.append(vendor)
    
    if additional_buyers > 0:
        print(f"📝 Creando {additional_buyers} compradores adicionales...")
        for i in range(1, additional_buyers + 1):
            buyer = User(
                correo=f"buyer{i}@appswap.com",
                nombre=f"Buyer {i}",
                contrasena=hash_password("buyer123"),
                rol_id=rol_usuario.id
            )
            db.add(buyer)
            buyers.append(buyer)
    
    db.commit()
    print(f"✅ Total: {len(vendors)} vendedores y {len(buyers)} compradores")
    return vendors, buyers

def create_apps(db, vendors, config):
    """Crea aplicaciones para cada vendedor"""
    print("📱 Creando aplicaciones...")
    
    categorias_cache = {}
    for cat_nombre in CATEGORIES:
        cat_obj = db.query(Categoria).filter(Categoria.nombre == cat_nombre).first()
        if not cat_obj:
            cat_obj = Categoria(nombre=cat_nombre)
            db.add(cat_obj)
            db.flush()
        categorias_cache[cat_nombre] = cat_obj
    
    apps = []
    app_names_copy = APP_NAMES.copy()
    random.shuffle(app_names_copy)
    name_index = 0
    
    for vendor in vendors:
        num_apps = random.randint(*config['apps_per_vendor'])
        
        for _ in range(num_apps):
            if name_index >= len(app_names_copy):
                app_name = f"{random.choice(APP_NAMES)} Plus"
            else:
                app_name = app_names_copy[name_index]
                name_index += 1
            
            price = round(random.choice([0.0, 4.99, 9.99, 14.99, 19.99, 29.99, 49.99, 99.99]), 2)
            cat_nombre = random.choice(CATEGORIES)
            
            app = App(
                nombre=app_name,
                descripcion=random.choice(DESCRIPTIONS),
                categoria_id=categorias_cache[cat_nombre].id,
                url_aplicacion=f"https://{app_name.lower().replace(' ', '')}.com/app",
                propietario_id=vendor.id,
                imagen_portada=f"https://picsum.photos/seed/{app_name}/400/200",
                precio=price,
                url_video=f"https://{app_name.lower().replace(' ', '')}.com/demo" if price > 0 else None,
                plantilla_credenciales=None
            )
            db.add(app)
            apps.append(app)
    
    db.commit()
    print(f"✅ Creadas {len(apps)} aplicaciones")
    return apps

def create_purchases_and_reviews(db, buyers, apps, config):
    """Crea compras (payments) y reviews"""
    print("🛒 Creando compras y reseñas...")
    
    payments = []
    reviews = []
    
    for buyer in buyers:
        num_purchases = random.randint(*config['purchases_per_buyer'])
        
        # Seleccionar apps aleatorias para comprar (sin repetir)
        available_apps = random.sample(apps, min(num_purchases, len(apps)))
        
        for app in available_apps:
            # Crear compra
            purchase_date = datetime.utcnow() - timedelta(days=random.randint(1, 90))
            
            payment = Payment(
                aplicacion_id=app.id,
                comprador_id=buyer.id,
                estado="confirmado",
                codigo_qr=f"QR_{buyer.id}_{app.id}_{random.randint(1000, 9999)}",
                fecha_creacion=purchase_date,
                credenciales=generate_credentials(buyer.id, app.id)
            )
            db.add(payment)
            payments.append(payment)
            
            # Crear review con probabilidad configurada
            if random.random() < config['review_probability']:
                review_date = purchase_date + timedelta(days=random.randint(1, 7))
                rating = random.randint(3, 5)  # Ratings más positivos (3-5 estrellas)
                
                review = Review(
                    aplicacion_id=app.id,
                    autor_id=buyer.id,
                    calificacion=rating,
                    comentario=random.choice(REVIEW_COMMENTS) if random.random() > 0.3 else None,
                    fecha_creacion=review_date
                )
                db.add(review)
                reviews.append(review)
    
    db.commit()
    print(f"✅ Creadas {len(payments)} compras y {len(reviews)} reseñas")
    return payments, reviews

def print_summary(vendors, buyers, apps, payments, reviews):
    """Imprime resumen de datos generados"""
    print("\n" + "="*60)
    print("📊 RESUMEN DE DATOS GENERADOS")
    print("="*60)
    print(f"👥 Usuarios:")
    print(f"   • Vendedores: {len(vendors)}")
    print(f"   • Compradores: {len(buyers)}")
    print(f"\n📱 Aplicaciones: {len(apps)}")
    
    # Estadísticas de precios
    free_apps = sum(1 for app in apps if app.precio == 0)
    paid_apps = len(apps) - free_apps
    avg_price = sum(app.precio for app in apps) / len(apps) if apps else 0
    
    print(f"   • Apps gratuitas: {free_apps}")
    print(f"   • Apps de pago: {paid_apps}")
    print(f"   • Precio promedio: ${avg_price:.2f}")
    
    print(f"\n🛒 Compras: {len(payments)}")
    total_revenue = sum(app.precio for payment in payments for app in apps if app.id == payment.aplicacion_id)
    print(f"   • Ingresos totales: ${total_revenue:.2f}")
    
    print(f"\n⭐ Reseñas: {len(reviews)}")
    if reviews:
        avg_rating = sum(review.calificacion for review in reviews) / len(reviews)
        print(f"   • Rating promedio: {avg_rating:.1f}/5.0")
    
    print("\n" + "="*60)
    print("🔑 CREDENCIALES DE PRUEBA (DEV_USERS)")
    print("="*60)
    print("Vendedores:")
    print("  1. Juan Vendedor")
    print("     Email: vendor@example.com")
    print("     Contraseña: 123456")
    print()
    print("  2. Maria García")
    print("     Email: maria@vendor.com")
    print("     Contraseña: 123456")
    print()
    print("Compradores:")
    print("  1. Ana Compradora")
    print("     Email: buyer@example.com")
    print("     Contraseña: 123456")
    print()
    print("  2. Pedro López")
    print("     Email: pedro@buyer.com")
    print("     Contraseña: 123456")
    print()
    print("💡 Estos usuarios aparecen en el DevLogin del frontend")
    print("="*60 + "\n")

def seed_database(dataset_size="small", clean_first=True):
    """Función principal de población de base de datos"""
    if dataset_size not in DATASET_CONFIG:
        print(f"❌ Dataset size '{dataset_size}' no válido. Usa: small, medium, large")
        return
    
    config = DATASET_CONFIG[dataset_size]
    
    print("="*60)
    print(f"🌱 POBLACIÓN DE BASE DE DATOS - Dataset: {dataset_size.upper()}")
    print("="*60 + "\n")
    
    db = SessionLocal()
    
    try:
        if clean_first:
            clean_database(db)
        
        # Generar datos
        vendors, buyers = create_users(db, config)
        apps = create_apps(db, vendors, config)
        payments, reviews = create_purchases_and_reviews(db, buyers, apps, config)
        
        # Mostrar resumen
        print_summary(vendors, buyers, apps, payments, reviews)
        
        print("✅ Base de datos poblada exitosamente!\n")
        
    except Exception as e:
        print(f"❌ Error durante la población: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Cambiar a "medium" o "large" para más datos en el futuro
    seed_database(dataset_size="small", clean_first=True)
