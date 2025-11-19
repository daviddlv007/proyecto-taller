from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, User, App, Payment, Review, Rol, Categoria, Base, engine
from auth import get_password_hash
from datetime import datetime, timedelta
import random
import json
from ml_models.price_optimizer import PriceOptimizer
from ml_models.recommender import AppRecommender

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/seed-db")
def seed_database(db: Session = Depends(get_db)):
    """
    Poblar la base de datos con datos de demostración (60 apps, 25 usuarios, 120 compras, 50 reviews)
    """
    try:
        existing_users = db.query(User).count()
        if existing_users > 5:
            raise HTTPException(status_code=400, detail="La base de datos ya contiene datos. Usa /admin/clear-db primero.")
        
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
        
        vendors_data = [
            ("Developer Demo", "dev@test.com"),  # USUARIO DEMO DESARROLLADOR - DUEÑO DE CALCULADORAPRO
            ("María García", "maria@vendor.com"),
            ("María García", "maria@techdev.com"),
            ("Carlos López", "carlos@innovaapps.com"),
            ("Ana Martínez", "ana@softwarepro.com"),
            ("Luis Rodríguez", "luis@devstudio.com"),
            ("Sofía González", "sofia@cloudapps.com"),
            ("Diego Fernández", "diego@webtools.com"),
            ("Laura Sánchez", "laura@smartdev.com"),
            ("Juan Pérez", "juan@appbuilders.com"),
            ("Elena Torres", "elena@codelab.com"),
            ("Pablo Ramírez", "pablo@techinnovate.com"),
        ]
        
        buyers_data = [
            ("Comprador Demo", "comprador@test.com"),  # USUARIO DEMO COMPRADOR - NO COMPRÓ CALCULADORAPRO
            ("Pedro López", "pedro@buyer.com"),
            ("Pedro González", "pedro@empresa.com"),
            ("Lucía Fernández", "lucia@startup.com"),
            ("Miguel Ángel", "miguel@freelance.com"),
            ("Carmen López", "carmen@consulting.com"),
            ("Javier Ruiz", "javier@agency.com"),
            ("Isabel Moreno", "isabel@digital.com"),
            ("Raúl Jiménez", "raul@tech.com"),
            ("Beatriz Castro", "beatriz@studio.com"),
            ("Sergio Ortega", "sergio@marketing.com"),
            ("Natalia Vargas", "natalia@design.com"),
            ("Fernando Silva", "fernando@ecommerce.com"),
            ("Cristina Ramos", "cristina@content.com"),
            ("Admin User", "admin@appswap.com"),
        ]
        
        vendors = []
        for i, (nombre, correo) in enumerate(vendors_data):
            # Usuarios de demo tienen password "password", otros "123456"
            pwd = "password" if correo in ["dev@test.com", "comprador@test.com"] else "123456"
            user = User(
                nombre=nombre,
                correo=correo,
                contrasena=get_password_hash(pwd),
                rol_id=rol_desarrollador.id
            )
            db.add(user)
            vendors.append(user)
        
        buyers = []
        for nombre, correo in buyers_data:
            pwd = "password" if correo in ["dev@test.com", "comprador@test.com"] else "123456"
            user = User(
                nombre=nombre,
                correo=correo,
                contrasena=get_password_hash(pwd),
                rol_id=rol_usuario.id
            )
            db.add(user)
            buyers.append(user)
        
        db.commit()
        
        categories = ["Productividad", "Finanzas", "Marketing", "Educacion", "Diseno", "Desarrollo"]
        categorias_cache = {}
        for cat_nombre in categories:
            cat_obj = db.query(Categoria).filter(Categoria.nombre == cat_nombre).first()
            if not cat_obj:
                cat_obj = Categoria(nombre=cat_nombre)
                db.add(cat_obj)
                db.flush()
            categorias_cache[cat_nombre] = cat_obj
        
        apps_data = [
            # Productividad
            ("TaskMaster Pro", "Gestión avanzada de tareas y proyectos con IA", 29.99, "https://taskmaster-pro.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("TimeTracker Elite", "Seguimiento de tiempo y productividad para equipos", 24.99, "https://timetracker.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("NotesFlow", "Organizador de notas con sincronización en tiempo real", 14.99, "https://notesflow.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("MeetingHub", "Coordinador inteligente de reuniones y agendas", 34.99, "https://meetinghub.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("FocusTime", "Bloqueador de distracciones basado en Pomodoro", 9.99, "https://focustime.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("DocuShare Pro", "Gestor colaborativo de documentos empresariales", 39.99, "https://docushare.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("CalendarSync", "Sincronización avanzada de calendarios múltiples", 19.99, "https://calendarsync.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("WorkflowMax", "Automatización de flujos de trabajo empresariales", 44.99, "https://workflowmax.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("TeamCollab", "Plataforma de colaboración para equipos remotos", 27.99, "https://teamcollab.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("ProjectVision", "Visualizador de proyectos con Gantt y Kanban", 32.99, "https://projectvision.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            
            # Finanzas
            ("MoneyWise", "Control personal de finanzas e inversiones", 15.99, "https://moneywise.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("InvoicePro", "Generador profesional de facturas y presupuestos", 22.99, "https://invoicepro.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("ExpenseTracker", "Seguimiento automático de gastos empresariales", 18.99, "https://expensetracker.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("CryptoWatch", "Monitor de criptomonedas con alertas en tiempo real", 12.99, "https://cryptowatch.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("BudgetMaster", "Planificador de presupuestos para PyMEs", 25.99, "https://budgetmaster.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("TaxHelper", "Asistente para declaración de impuestos", 34.99, "https://taxhelper.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("PayrollGenius", "Sistema de nóminas automatizado", 49.99, "https://payrollgenius.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("StockAnalyzer", "Análisis técnico de acciones con IA", 39.99, "https://stockanalyzer.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("FinanceDash", "Dashboard financiero personalizable", 27.99, "https://financedash.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("DebtFree", "Calculadora y planificador de pagos de deudas", 11.99, "https://debtfree.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            
            # Marketing
            ("SocialBoost", "Automatización de publicaciones en redes sociales", 32.99, "https://socialboost.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("EmailCampaigner", "Creador de campañas de email marketing", 28.99, "https://emailcampaigner.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("SEOOptimizer", "Herramienta de optimización SEO con auditorías", 45.99, "https://seooptimizer.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("ContentPlanner", "Planificador de contenido para blogs y redes", 19.99, "https://contentplanner.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("AdMetrics", "Análisis de métricas de campañas publicitarias", 37.99, "https://admetrics.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("LeadGenerator", "Captador automático de leads calificados", 54.99, "https://leadgenerator.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("InfluencerHub", "Gestor de colaboraciones con influencers", 41.99, "https://influencerhub.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("BrandMonitor", "Monitoreo de marca y menciones en internet", 29.99, "https://brandmonitor.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("LandingBuilder", "Constructor de landing pages de alta conversión", 24.99, "https://landingbuilder.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("MarketResearch", "Análisis de mercado y competencia", 33.99, "https://marketresearch.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            
            # Educación
            ("LearningPath", "Plataforma de cursos online interactivos", 44.99, "https://learningpath.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("QuizMaster", "Creador de exámenes y evaluaciones", 16.99, "https://quizmaster.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("StudentTracker", "Sistema de seguimiento de progreso estudiantil", 38.99, "https://studenttracker.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("VirtualClassroom", "Aula virtual con videoconferencia integrada", 52.99, "https://virtualclassroom.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("GradeBook Pro", "Libro de calificaciones digital para profesores", 21.99, "https://gradebook.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("LanguageLab", "Laboratorio de idiomas con reconocimiento de voz", 31.99, "https://languagelab.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("MathTutor AI", "Tutor de matemáticas con inteligencia artificial", 26.99, "https://mathtutor.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("LibraryManager", "Sistema de gestión de bibliotecas escolares", 35.99, "https://librarymanager.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("AssignmentHub", "Plataforma de entrega y revisión de tareas", 23.99, "https://assignmenthub.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("CertificateGen", "Generador automático de certificados", 14.99, "https://certificategen.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            
            # Diseño
            ("DesignStudio Pro", "Suite completa de diseño gráfico en la nube", 49.99, "https://designstudio.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("ColorPalette AI", "Generador de paletas de colores con IA", 12.99, "https://colorpalette.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("MockupBuilder", "Creador de mockups profesionales", 27.99, "https://mockupbuilder.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("LogoMaker Plus", "Diseñador de logos inteligente", 34.99, "https://logomaker.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("IconLibrary Pro", "Biblioteca de +10,000 iconos vectoriales", 19.99, "https://iconlibrary.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("PhotoEditor AI", "Editor de fotos con herramientas de IA", 42.99, "https://photoeditor.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("TypographyTool", "Herramienta de tipografía y fuentes", 17.99, "https://typographytool.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("BannerDesigner", "Diseñador de banners para redes sociales", 22.99, "https://bannerdesigner.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("UIKitBuilder", "Constructor de UI kits personalizados", 39.99, "https://uikitbuilder.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("AnimationStudio", "Creador de animaciones 2D", 54.99, "https://animationstudio.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            
            # Desarrollo
            ("CodeReview AI", "Revisor automático de código con IA", 37.99, "https://codereview.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("APITester Pro", "Herramienta de testing de APIs RESTful", 29.99, "https://apitester.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("DatabaseDesigner", "Diseñador visual de bases de datos", 44.99, "https://dbdesigner.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("GitFlow Manager", "Gestor de flujos de trabajo Git", 24.99, "https://gitflowmanager.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("DocGenerator", "Generador automático de documentación técnica", 19.99, "https://docgenerator.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("DeploymentHub", "Plataforma de despliegue continuo", 52.99, "https://deploymenthub.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("BugTracker Elite", "Sistema avanzado de seguimiento de bugs", 34.99, "https://bugtracker.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("PerformanceMonitor", "Monitor de rendimiento de aplicaciones", 41.99, "https://perfmonitor.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("CodeSnippet Library", "Biblioteca de snippets de código reutilizables", 14.99, "https://codesnippet.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
            ("SecurityScanner", "Escáner de vulnerabilidades de seguridad", 49.99, "https://securityscanner.example.com", "https://www.w3schools.com/html/mov_bbb.mp4"),
        ]
        
        apps = []
        for idx, (name, desc, price, url, demo) in enumerate(apps_data):
            category = categories[idx // 10]
            vendor = vendors[idx % len(vendors)]
            
            app = App(
                nombre=name,
                descripcion=desc,
                categoria_id=categorias_cache[category].id,
                url_aplicacion=url,
                url_video=demo,
                propietario_id=vendor.id,
                precio=price,
                imagen_portada=f"https://picsum.photos/seed/{idx+100}/400/300",
                plantilla_credenciales=json.dumps({
                    "username": f"user_{idx+1}",
                    "password": "demo123",
                    "api_key": f"sk-{random.randint(100000, 999999)}"
                })
            )
            db.add(app)
            apps.append(app)
        
        # CALCULADORA PRO (App Demo embebida) - Creada por dev@test.com
        calculadora_vendor = vendors[0]  # dev@test.com es el primer vendor
        calculadora = App(
            nombre="CalculadoraPro",
            descripcion="Calculadora profesional con funciones avanzadas. Modo DEMO gratuito (suma/resta) y modo PRO ($9.99) con multiplicación/división. Autenticación automática post-compra.",
            categoria_id=categorias_cache["Productividad"].id,
            url_aplicacion="http://localhost:5173/demo-calc/",
            url_video="https://www.w3schools.com/html/mov_bbb.mp4",
            propietario_id=calculadora_vendor.id,
            precio=9.99,
            imagen_portada="https://picsum.photos/seed/calc999/400/300",
            plantilla_credenciales=json.dumps({
                "username": "calcpro_user",
                "password": "pro2024",
                "activation_code": "CALCPRO-FULL-ACCESS"
            })
        )
        db.add(calculadora)
        apps.append(calculadora)
        
        db.commit()
        
        # COMPRAS (1000+ compras distribuidas temporalmente en últimos 6 meses)
        base_date = datetime.now() - timedelta(days=180)
        test_buyer = buyers[0]  # comprador@test.com
        
        print("📦 Generando 1000+ compras coherentes...")
        
        for i in range(1050):  # 1050 compras para superar el requisito
            # Distribución temporal: más compras recientes (exponencial)
            days_ago = int(180 * (1 - random.random() ** 2))
            purchase_date = base_date + timedelta(days=days_ago)
            
            buyer = random.choice(buyers)
            app = random.choice(apps)
            
            # RESTRICCIÓN: comprador@test.com NO debe comprar CalculadoraPro
            if buyer.id == test_buyer.id and app.nombre == "CalculadoraPro":
                continue  # Saltar esta compra
            
            # Generar credenciales únicas
            credentials = json.dumps({
                "username": f"{buyer.nombre.lower().replace(' ', '_')}_{app.id}",
                "password": f"pwd{random.randint(1000, 9999)}",
                "api_key": f"ak-{random.randint(100000000, 999999999)}",
                "access_token": f"at_{random.randint(10000, 99999)}"
            })
            
            payment = Payment(
                aplicacion_id=app.id,
                comprador_id=buyer.id,
                estado="confirmado",
                codigo_qr=f"QR-{random.randint(100000, 999999)}",
                credenciales=credentials,
                fecha_creacion=purchase_date
            )
            db.add(payment)
        
        db.commit()
        print(f"✅ {db.query(Payment).count()} compras generadas")
        
        # REVIEWS (generar reviews para ~60% de las compras)
        all_payments = db.query(Payment).filter(Payment.estado == "confirmado").all()
        review_count = 0
        
        print("📝 Generando reviews...")
        
        # Distribución de ratings realista: 40% 5★, 30% 4★, 20% 3★, 7% 2★, 3% 1★
        rating_weights = [40, 30, 20, 7, 3]
        # Distribución de ratings realista: 40% 5★, 30% 4★, 20% 3★, 7% 2★, 3% 1★
        rating_weights = [40, 30, 20, 7, 3]
        
        comments_positive = [
            "Excelente aplicación, cumple con todas mis expectativas",
            "Muy útil y fácil de usar, totalmente recomendada",
            "La mejor inversión que he hecho en software",
            "Increíble funcionalidad, ahorra mucho tiempo",
            "Interfaz intuitiva y potente, me encanta",
            "Superó mis expectativas, muy profesional",
            "Exactamente lo que necesitaba",
            "Calidad premium, vale cada centavo"
        ]
        
        comments_neutral = [
            "Buena app pero le falta alguna funcionalidad",
            "Cumple lo prometido, aunque tiene margen de mejora",
            "Funciona bien pero el precio es un poco alto",
            "Está bien, nada extraordinario",
            "Aceptable para el uso básico"
        ]
        
        comments_negative = [
            "Esperaba más funcionalidades por el precio",
            "Tiene bugs que deberían corregirse pronto",
            "No cumple todas las promesas",
            "Decepcionante en algunos aspectos"
        ]
        
        for payment in all_payments:
            # 60% de probabilidad de tener review
            if random.random() < 0.6:
                rating = random.choices([5, 4, 3, 2, 1], weights=rating_weights)[0]
                
                if rating >= 4:
                    comment = random.choice(comments_positive)
                elif rating == 3:
                    comment = random.choice(comments_neutral)
                else:
                    comment = random.choice(comments_negative)
                
                review = Review(
                    aplicacion_id=payment.aplicacion_id,
                    autor_id=payment.comprador_id,
                    calificacion=rating,
                    comentario=comment,
                    fecha_creacion=payment.fecha_creacion + timedelta(days=random.randint(1, 7))
                )
                db.add(review)
                review_count += 1
        
        db.commit()
        print(f"✅ {review_count} reviews generadas")
        
        # Configurar datos extras para usuarios de demostración
        dev_user = db.query(User).filter(User.correo == "dev@test.com").first()
        buyer_user = db.query(User).filter(User.correo == "comprador@test.com").first()
        
        if dev_user and buyer_user:
            # Dar al comprador demo algunas compras variadas (15 compras)
            demo_apps = db.query(App).filter(App.nombre != "CalculadoraPro").limit(15).all()
            for app in demo_apps:
                days_ago = random.randint(5, 90)
                purchase_date = datetime.now() - timedelta(days=days_ago)
                
                credentials = json.dumps({
                    "username": f"demo_{app.id}",
                    "password": f"pwd{random.randint(1000, 9999)}",
                    "api_key": f"ak-demo-{random.randint(100000, 999999)}"
                })
                
                payment = Payment(
                    aplicacion_id=app.id,
                    comprador_id=buyer_user.id,
                    estado="confirmado",
                    codigo_qr=f"QR-DEMO-{random.randint(100000, 999999)}",
                    credenciales=credentials,
                    fecha_creacion=purchase_date
                )
                db.add(payment)
                
                # Agregar review
                if random.random() < 0.7:
                    rating = random.choices([5, 4, 3], weights=[50, 35, 15])[0]
                    review = Review(
                        aplicacion_id=app.id,
                        autor_id=buyer_user.id,
                        calificacion=rating,
                        comentario=random.choice(comments_positive if rating >= 4 else comments_neutral),
                        fecha_creacion=purchase_date + timedelta(days=random.randint(1, 3))
                    )
                    db.add(review)
            
            db.commit()
            print(f"✅ Usuarios de demostración configurados")
            print(f"   - dev@test.com: Dueño de CalculadoraPro + {db.query(App).filter(App.propietario_id == dev_user.id).count()} apps")
            print(f"   - comprador@test.com: {db.query(Payment).filter(Payment.comprador_id == buyer_user.id).count()} compras (NO incluye CalculadoraPro)")
        
        total_purchases = db.query(Payment).count()
        total_reviews = db.query(Review).count()
        
        return {
            "message": "✅ Base de datos poblada exitosamente con datos coherentes para demostración",
            "users": len(vendors) + len(buyers),
            "vendors": len(vendors),
            "buyers": len(buyers),
            "apps": len(apps),
            "purchases": total_purchases,
            "reviews": total_reviews,
            "demo_users": {
                "developer": "dev@test.com (password: password)",
                "buyer": "comprador@test.com (password: password)",
                "note": "comprador@test.com NO ha comprado CalculadoraPro"
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al poblar BD: {str(e)}")


@router.delete("/clear-db")
def clear_database(db: Session = Depends(get_db)):
    """
    Limpiar toda la base de datos (CUIDADO: elimina todos los datos)
    """
    try:
        # Eliminar en orden inverso por dependencias
        db.query(Review).delete()
        db.query(Payment).delete()
        db.query(App).delete()
        db.query(User).delete()
        db.commit()
        
        return {
            "message": "✅ Base de datos limpiada exitosamente",
            "warning": "Todos los datos han sido eliminados"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al limpiar BD: {str(e)}")


@router.post("/reset-all")
def reset_all(db: Session = Depends(get_db)):
    """
    🔄 RESET COMPLETO: Limpia DB + Puebla con datos + Entrena modelos ML
    
    Este endpoint hace TODO el proceso en orden correcto:
    1. Limpia la base de datos
    2. Puebla con datos de demostración
    3. Entrena ambos modelos ML con los datos nuevos
    4. Recarga los modelos globales en memoria
    
    Úsalo después de hacer cambios en el esquema o cuando necesites
    un ambiente completamente fresco con ML funcionando.
    """
    try:
        print("=" * 60)
        print("🧹 PASO 1/4: LIMPIANDO BASE DE DATOS")
        print("=" * 60)
        db.query(Review).delete()
        db.query(Payment).delete()
        db.query(App).delete()
        db.query(User).delete()
        db.query(Categoria).delete()
        db.query(Rol).delete()
        db.commit()
        print("✅ Base de datos limpiada")
        
        # PASO 2: Poblar base de datos
        print("\n" + "=" * 60)
        print("📦 PASO 2/4: POBLANDO BASE DE DATOS")
        print("=" * 60)
        
        # Llamar a la función de seed directamente
        seed_result = seed_database(db)
        print(f"✅ {seed_result['users']} usuarios creados")
        print(f"✅ {seed_result['apps']} apps creadas")
        print(f"✅ {seed_result['purchases']} compras creadas")
        print(f"✅ {seed_result['reviews']} reviews creadas")
        
        # PASO 3: Entrenar modelos ML
        print("\n" + "=" * 60)
        print("🤖 PASO 3/4: ENTRENANDO MODELOS ML")
        print("=" * 60)
        
        # Entrenar Recommender
        print("\n🎯 Entrenando Sistema de Recomendaciones...")
        recommender = AppRecommender()
        recommender.train(db)
        print("✅ Recommender System entrenado")
        
        # Entrenar Price Optimizer
        print("\n📈 Entrenando Optimizador de Precios...")
        optimizer = PriceOptimizer()
        optimizer.train(db)
        print("✅ Price Optimizer entrenado")
        
        # PASO 4: Recargar modelos globales
        print("\n" + "=" * 60)
        print("🔄 PASO 4/4: RECARGANDO MODELOS EN MEMORIA")
        print("=" * 60)
        
        # Importar las instancias globales y recargarlas
        import ml_endpoints
        ml_endpoints.recommender.load()
        ml_endpoints.price_optimizer.load()
        print("✅ Modelos recargados en memoria")
        
        print("\n" + "=" * 60)
        print("✅ RESET COMPLETO EXITOSO")
        print("=" * 60)
        
        return {
            "success": True,
            "message": "🎉 Reset completo exitoso: DB limpia + poblada + ML entrenado + modelos recargados",
            "steps_completed": {
                "1_database_cleared": True,
                "2_data_seeded": {
                    "users": seed_result['users'],
                    "apps": seed_result['apps'],
                    "purchases": seed_result['purchases'],
                    "reviews": seed_result['reviews']
                },
                "3_ml_trained": {
                    "recommender": True,
                    "price_optimizer": True
                },
                "4_models_reloaded": True
            },
            "ready": "✅ Sistema listo para usar con ML funcionando"
        }
        
    except Exception as e:
        db.rollback()
        import traceback
        error_detail = traceback.format_exc()
        print(f"\n❌ ERROR: {str(e)}")
        print(error_detail)
        raise HTTPException(
            status_code=500, 
            detail=f"Error en reset completo: {str(e)}\n\n{error_detail}"
        )

