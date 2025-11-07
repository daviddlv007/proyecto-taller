"""
Script para poblar la base de datos con datos realistas para ML
- 60 apps distribuidas en 6 categorías
- 25 usuarios (12 buyers, 10 vendors, 3 ambos)
- 100+ compras con distribución temporal
- 50+ reviews con ratings variados
"""

from database import SessionLocal, User, App, Payment, Review
from datetime import datetime, timedelta
import random
import json

db = SessionLocal()

# Limpiar datos existentes
print("🗑️  Limpiando base de datos...")
db.query(Review).delete()
db.query(Payment).delete()
db.query(App).delete()
db.query(User).delete()
db.commit()

# ==================== USUARIOS ====================
print("👥 Creando usuarios...")

# 10 Vendors
vendors = [
    {"correo": "maria@techdev.com", "nombre": "María García", "role": "vendor"},
    {"correo": "carlos@innovaapps.com", "nombre": "Carlos Rodríguez", "role": "vendor"},
    {"correo": "ana@softwarepro.com", "nombre": "Ana Martínez", "role": "vendor"},
    {"correo": "luis@devstudio.com", "nombre": "Luis Fernández", "role": "vendor"},
    {"correo": "sofia@cloudapps.com", "nombre": "Sofía López", "role": "vendor"},
    {"correo": "diego@webtools.com", "nombre": "Diego Sánchez", "role": "vendor"},
    {"correo": "laura@smartdev.com", "nombre": "Laura Torres", "role": "vendor"},
    {"correo": "juan@appbuilders.com", "nombre": "Juan Ramírez", "role": "vendor"},
    {"correo": "elena@codelab.com", "nombre": "Elena Morales", "role": "vendor"},
    {"correo": "pablo@techinnovate.com", "nombre": "Pablo Jiménez", "role": "vendor"},
]

# 12 Buyers
buyers = [
    {"correo": "pedro@empresa.com", "nombre": "Pedro González", "role": "buyer"},
    {"correo": "lucia@startup.com", "nombre": "Lucía Pérez", "role": "buyer"},
    {"correo": "miguel@freelance.com", "nombre": "Miguel Ruiz", "role": "buyer"},
    {"correo": "carmen@consulting.com", "nombre": "Carmen Díaz", "role": "buyer"},
    {"correo": "javier@agency.com", "nombre": "Javier Moreno", "role": "buyer"},
    {"correo": "isabel@digital.com", "nombre": "Isabel Castro", "role": "buyer"},
    {"correo": "raul@tech.com", "nombre": "Raúl Vargas", "role": "buyer"},
    {"correo": "beatriz@studio.com", "nombre": "Beatriz Ortiz", "role": "buyer"},
    {"correo": "sergio@marketing.com", "nombre": "Sergio Romero", "role": "buyer"},
    {"correo": "natalia@design.com", "nombre": "Natalia Silva", "role": "buyer"},
    {"correo": "fernando@ecommerce.com", "nombre": "Fernando Ramos", "role": "buyer"},
    {"correo": "cristina@content.com", "nombre": "Cristina Vega", "role": "buyer"},
]

# 3 Both roles
both_roles = [
    {"correo": "admin@appswap.com", "nombre": "Admin AppSwap", "role": "vendor"},
    {"correo": "developer@startup.com", "nombre": "Dev & User", "role": "vendor"},
    {"correo": "hybrid@tech.com", "nombre": "Hybrid User", "role": "buyer"},
]

all_users_data = vendors + buyers + both_roles
user_objects = []

for user_data in all_users_data:
    user = User(
        correo=user_data["correo"],
        nombre=user_data["nombre"],
        contrasena="123456",  # Simple para demo
        role=user_data["role"]
    )
    db.add(user)
    user_objects.append(user)

db.commit()
print(f"✅ {len(user_objects)} usuarios creados")

# Separar por roles
vendor_users = [u for u in user_objects if u.role == "vendor"][:10]
buyer_users = [u for u in user_objects if u.role == "buyer"][:15]

# ==================== APLICACIONES ====================
print("📱 Creando aplicaciones...")

apps_data = [
    # Productividad (10 apps)
    {"name": "TaskMaster Pro", "category": "Productividad", "description": "Gestión avanzada de tareas y proyectos con metodología Kanban", "price": 29.99, "demo": "https://taskmaster-demo.app"},
    {"name": "TimeTracker Elite", "category": "Productividad", "description": "Seguimiento de tiempo con reportes y facturación automática", "price": 19.99, "demo": "https://timetracker-demo.app"},
    {"name": "NoteMate AI", "category": "Productividad", "description": "Notas inteligentes con búsqueda por IA y sincronización", "price": 14.99, "demo": "https://notemate-demo.app"},
    {"name": "FocusZone Pro", "category": "Productividad", "description": "Bloqueador de distracciones con técnica Pomodoro", "price": 9.99, "demo": "https://focuszone-demo.app"},
    {"name": "MeetingHub", "category": "Productividad", "description": "Organización de reuniones y actas automáticas", "price": 24.99, "demo": "https://meetinghub-demo.app"},
    {"name": "ProjectPulse", "category": "Productividad", "description": "Dashboard de proyectos con métricas en tiempo real", "price": 34.99, "demo": "https://projectpulse-demo.app"},
    {"name": "DocuFlow", "category": "Productividad", "description": "Gestión documental con OCR y búsqueda semántica", "price": 27.99, "demo": "https://docuflow-demo.app"},
    {"name": "AgendaPro", "category": "Productividad", "description": "Calendario inteligente con sugerencias de optimización", "price": 12.99, "demo": "https://agendapro-demo.app"},
    {"name": "CollabSpace", "category": "Productividad", "description": "Espacio de trabajo colaborativo en tiempo real", "price": 39.99, "demo": "https://collabspace-demo.app"},
    {"name": "QuickTask", "category": "Productividad", "description": "Lista de tareas minimalista y rápida", "price": 4.99, "demo": "https://quicktask-demo.app"},
    
    # Finanzas (10 apps)
    {"name": "MoneyWise", "category": "Finanzas", "description": "Control de gastos personales con categorización IA", "price": 15.99, "demo": "https://moneywise-demo.app"},
    {"name": "InvoiceGen Pro", "category": "Finanzas", "description": "Generador de facturas profesionales", "price": 22.99, "demo": "https://invoicegen-demo.app"},
    {"name": "CryptoTracker", "category": "Finanzas", "description": "Seguimiento de portafolio de criptomonedas", "price": 18.99, "demo": "https://cryptotracker-demo.app"},
    {"name": "BudgetMaster", "category": "Finanzas", "description": "Planificación financiera con proyecciones", "price": 25.99, "demo": "https://budgetmaster-demo.app"},
    {"name": "ExpenseBot", "category": "Finanzas", "description": "Bot de registro de gastos por voz", "price": 11.99, "demo": "https://expensebot-demo.app"},
    {"name": "TaxHelper", "category": "Finanzas", "description": "Asistente para declaración de impuestos", "price": 29.99, "demo": "https://taxhelper-demo.app"},
    {"name": "StockAlert", "category": "Finanzas", "description": "Alertas de mercado bursátil personalizadas", "price": 16.99, "demo": "https://stockalert-demo.app"},
    {"name": "PayrollPro", "category": "Finanzas", "description": "Gestión de nómina para pequeñas empresas", "price": 44.99, "demo": "https://payrollpro-demo.app"},
    {"name": "SavingsGoal", "category": "Finanzas", "description": "Planificador de ahorros con gamificación", "price": 8.99, "demo": "https://savingsgoal-demo.app"},
    {"name": "FinanceHub", "category": "Finanzas", "description": "Dashboard financiero todo-en-uno", "price": 35.99, "demo": "https://financehub-demo.app"},
    
    # Marketing (10 apps)
    {"name": "SocialBoost", "category": "Marketing", "description": "Automatización de publicaciones en redes sociales", "price": 32.99, "demo": "https://socialboost-demo.app"},
    {"name": "EmailCampaign Pro", "category": "Marketing", "description": "Campañas de email marketing con A/B testing", "price": 27.99, "demo": "https://emailcampaign-demo.app"},
    {"name": "SEO Analyzer", "category": "Marketing", "description": "Análisis SEO con recomendaciones accionables", "price": 21.99, "demo": "https://seoanalyzer-demo.app"},
    {"name": "ContentPlanner", "category": "Marketing", "description": "Calendario de contenidos con IA generativa", "price": 24.99, "demo": "https://contentplanner-demo.app"},
    {"name": "AdTracker", "category": "Marketing", "description": "Seguimiento de campañas publicitarias multicanal", "price": 29.99, "demo": "https://adtracker-demo.app"},
    {"name": "BrandMonitor", "category": "Marketing", "description": "Monitoreo de reputación de marca en tiempo real", "price": 38.99, "demo": "https://brandmonitor-demo.app"},
    {"name": "LeadGenerator", "category": "Marketing", "description": "Captura y calificación de leads automática", "price": 34.99, "demo": "https://leadgenerator-demo.app"},
    {"name": "InfluencerHub", "category": "Marketing", "description": "Plataforma de gestión de influencers", "price": 41.99, "demo": "https://influencerhub-demo.app"},
    {"name": "AnalyticsPro", "category": "Marketing", "description": "Analytics avanzado con visualizaciones", "price": 26.99, "demo": "https://analyticspro-demo.app"},
    {"name": "VideoMarketing", "category": "Marketing", "description": "Editor de videos para redes sociales", "price": 19.99, "demo": "https://videomarketing-demo.app"},
    
    # Educación (10 apps)
    {"name": "LearningPath", "category": "Educación", "description": "Plataforma de cursos online personalizados", "price": 49.99, "demo": "https://learningpath-demo.app"},
    {"name": "QuizMaker Pro", "category": "Educación", "description": "Creador de exámenes con corrección automática", "price": 16.99, "demo": "https://quizmaker-demo.app"},
    {"name": "StudyBuddy", "category": "Educación", "description": "Asistente de estudio con técnicas de memorización", "price": 12.99, "demo": "https://studybuddy-demo.app"},
    {"name": "ClassroomHub", "category": "Educación", "description": "Gestión de aulas virtuales", "price": 39.99, "demo": "https://classroomhub-demo.app"},
    {"name": "FlashCards AI", "category": "Educación", "description": "Tarjetas de estudio generadas por IA", "price": 9.99, "demo": "https://flashcards-demo.app"},
    {"name": "TutorConnect", "category": "Educación", "description": "Marketplace de tutores online", "price": 44.99, "demo": "https://tutorconnect-demo.app"},
    {"name": "SkillTracker", "category": "Educación", "description": "Seguimiento de progreso de habilidades", "price": 14.99, "demo": "https://skilltracker-demo.app"},
    {"name": "LanguagePro", "category": "Educación", "description": "Aprendizaje de idiomas con IA conversacional", "price": 29.99, "demo": "https://languagepro-demo.app"},
    {"name": "CertBuilder", "category": "Educación", "description": "Preparación para certificaciones profesionales", "price": 34.99, "demo": "https://certbuilder-demo.app"},
    {"name": "ReadingCoach", "category": "Educación", "description": "Mejora de comprensión lectora con ejercicios", "price": 11.99, "demo": "https://readingcoach-demo.app"},
    
    # Diseño (10 apps)
    {"name": "DesignStudio Pro", "category": "Diseño", "description": "Suite completa de diseño gráfico", "price": 54.99, "demo": "https://designstudio-demo.app"},
    {"name": "LogoCraft", "category": "Diseño", "description": "Generador de logos con IA", "price": 19.99, "demo": "https://logocraft-demo.app"},
    {"name": "ColorPalette AI", "category": "Diseño", "description": "Generador de paletas de colores inteligente", "price": 7.99, "demo": "https://colorpalette-demo.app"},
    {"name": "MockupGen", "category": "Diseño", "description": "Creador de mockups profesionales", "price": 24.99, "demo": "https://mockupgen-demo.app"},
    {"name": "IconLibrary Pro", "category": "Diseño", "description": "Biblioteca de iconos vectoriales con búsqueda", "price": 16.99, "demo": "https://iconlibrary-demo.app"},
    {"name": "UIKit Builder", "category": "Diseño", "description": "Constructor de kits de UI reutilizables", "price": 32.99, "demo": "https://uikit-demo.app"},
    {"name": "PrototypeFast", "category": "Diseño", "description": "Prototipado rápido de interfaces", "price": 28.99, "demo": "https://prototypefast-demo.app"},
    {"name": "FontManager", "category": "Diseño", "description": "Gestor de fuentes con previsualización", "price": 13.99, "demo": "https://fontmanager-demo.app"},
    {"name": "DesignCollab", "category": "Diseño", "description": "Colaboración en diseño en tiempo real", "price": 41.99, "demo": "https://designcollab-demo.app"},
    {"name": "AssetOrganizer", "category": "Diseño", "description": "Organizador de assets de diseño", "price": 18.99, "demo": "https://assetorganizer-demo.app"},
    
    # Desarrollo (10 apps)
    {"name": "CodeSnippet Pro", "category": "Desarrollo", "description": "Biblioteca de snippets con búsqueda IA", "price": 21.99, "demo": "https://codesnippet-demo.app"},
    {"name": "APITester", "category": "Desarrollo", "description": "Cliente HTTP para testing de APIs", "price": 17.99, "demo": "https://apitester-demo.app"},
    {"name": "GitFlow Manager", "category": "Desarrollo", "description": "Gestión visual de flujos Git", "price": 25.99, "demo": "https://gitflow-demo.app"},
    {"name": "DatabaseDesigner", "category": "Desarrollo", "description": "Diseñador visual de bases de datos", "price": 29.99, "demo": "https://dbdesigner-demo.app"},
    {"name": "CodeReview AI", "category": "Desarrollo", "description": "Revisión automática de código con sugerencias", "price": 36.99, "demo": "https://codereview-demo.app"},
    {"name": "DocGenerator", "category": "Desarrollo", "description": "Generación automática de documentación", "price": 19.99, "demo": "https://docgenerator-demo.app"},
    {"name": "DevDashboard", "category": "Desarrollo", "description": "Dashboard de métricas de desarrollo", "price": 31.99, "demo": "https://devdashboard-demo.app"},
    {"name": "BugTracker Pro", "category": "Desarrollo", "description": "Sistema avanzado de seguimiento de bugs", "price": 27.99, "demo": "https://bugtracker-demo.app"},
    {"name": "PerformanceMonitor", "category": "Desarrollo", "description": "Monitoreo de rendimiento de aplicaciones", "price": 44.99, "demo": "https://perfmonitor-demo.app"},
    {"name": "CLIBuilder", "category": "Desarrollo", "description": "Constructor de herramientas CLI", "price": 15.99, "demo": "https://clibuilder-demo.app"},
]

app_objects = []
for i, app_data in enumerate(apps_data):
    vendor = vendor_users[i % len(vendor_users)]
    app = App(
        name=app_data["name"],
        description=app_data["description"],
        category=app_data["category"],
        app_url=f"https://app.appswap.com/{app_data['name'].lower().replace(' ', '-')}",
        owner_id=vendor.id,
        cover_image=f"https://picsum.photos/seed/{i+1}/400/200",
        price=app_data["price"],
        demo_url=app_data["demo"],
        credentials_template=json.dumps({"username": "user_{buyer_id}", "password": "pass_{random}"})
    )
    db.add(app)
    app_objects.append(app)

db.commit()
print(f"✅ {len(app_objects)} apps creadas")

# ==================== COMPRAS ====================
print("💳 Creando compras (historial temporal)...")

purchases = []
base_date = datetime.now() - timedelta(days=180)  # 6 meses atrás

# Crear 120 compras distribuidas temporalmente
for i in range(120):
    buyer = random.choice(buyer_users)
    app = random.choice(app_objects)
    
    # Distribución temporal: más compras recientes
    days_ago = int(random.triangular(0, 180, 30))
    purchase_date = base_date + timedelta(days=days_ago)
    
    # Generar credenciales
    credentials = {
        "username": f"user_{buyer.id}_{app.id}",
        "password": f"pass_{random.randint(1000, 9999)}"
    }
    
    payment = Payment(
        app_id=app.id,
        buyer_id=buyer.id,
        status="confirmed",
        qr_code=f"QR-{i+1:04d}",
        created_at=purchase_date,
        credentials=json.dumps(credentials)
    )
    db.add(payment)
    purchases.append(payment)

db.commit()
print(f"✅ {len(purchases)} compras creadas")

# ==================== REVIEWS ====================
print("⭐ Creando reviews...")

reviews = []
# Crear reviews para ~40% de las compras
reviewed_purchases = random.sample(purchases, k=min(50, len(purchases)))

for payment in reviewed_purchases:
    # Distribución realista de ratings (más 4-5 estrellas)
    rating_distribution = [5] * 35 + [4] * 30 + [3] * 20 + [2] * 10 + [1] * 5
    rating = random.choice(rating_distribution)
    
    comments = {
        5: ["Excelente app, muy útil!", "Perfecta para mis necesidades", "La mejor inversión", "Superó mis expectativas"],
        4: ["Muy buena, recomendada", "Cumple lo prometido", "Útil y funcional", "Vale la pena"],
        3: ["Está bien, puede mejorar", "Funcional pero básica", "Cumple su función", "Aceptable"],
        2: ["Tiene problemas", "No es lo que esperaba", "Necesita mejoras", "Decepcionante"],
        1: ["No funciona bien", "Muy básica", "No la recomiendo", "Problemas constantes"]
    }
    
    review = Review(
        app_id=payment.app_id,
        user_id=payment.buyer_id,
        rating=rating,
        comment=random.choice(comments[rating]),
        created_at=payment.created_at + timedelta(days=random.randint(1, 7))
    )
    db.add(review)
    reviews.append(review)

db.commit()
print(f"✅ {len(reviews)} reviews creadas")

# ==================== ESTADÍSTICAS ====================
print("\n📊 RESUMEN DE DATOS GENERADOS:")
print(f"   👥 Usuarios: {len(user_objects)} ({len(vendor_users)} vendors, {len(buyer_users)} buyers)")
print(f"   📱 Apps: {len(app_objects)} (6 categorías)")
print(f"   💳 Compras: {len(purchases)} (últimos 6 meses)")
print(f"   ⭐ Reviews: {len(reviews)} ({len(reviews)/len(purchases)*100:.1f}% coverage)")
print(f"\n   📈 Distribución por categoría:")
for category in ["Productividad", "Finanzas", "Marketing", "Educación", "Diseño", "Desarrollo"]:
    count = len([a for a in app_objects if a.category == category])
    print(f"      • {category}: {count} apps")

print("\n✅ Base de datos poblada exitosamente para ML!")

db.close()
