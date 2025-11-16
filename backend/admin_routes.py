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
            ("Juan Vendedor", "vendor@example.com"),
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
            ("Ana Compradora", "buyer@example.com"),
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
        for nombre, correo in vendors_data:
            user = User(
                nombre=nombre,
                correo=correo,
                contrasena=get_password_hash("123456"),
                rol_id=rol_desarrollador.id
            )
            db.add(user)
            vendors.append(user)
        
        buyers = []
        for nombre, correo in buyers_data:
            user = User(
                nombre=nombre,
                correo=correo,
                contrasena=get_password_hash("123456"),
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
            ("TaskMaster Pro", "Gestión avanzada de tareas y proyectos con IA", 29.99, "https://taskmaster-pro.example.com", "https://taskmaster-pro.example.com/demo"),
            ("TimeTracker Elite", "Seguimiento de tiempo y productividad para equipos", 24.99, "https://timetracker.example.com", "https://timetracker.example.com/demo"),
            ("NotesFlow", "Organizador de notas con sincronización en tiempo real", 14.99, "https://notesflow.example.com", "https://notesflow.example.com/demo"),
            ("MeetingHub", "Coordinador inteligente de reuniones y agendas", 34.99, "https://meetinghub.example.com", "https://meetinghub.example.com/demo"),
            ("FocusTime", "Bloqueador de distracciones basado en Pomodoro", 9.99, "https://focustime.example.com", "https://focustime.example.com/demo"),
            ("DocuShare Pro", "Gestor colaborativo de documentos empresariales", 39.99, "https://docushare.example.com", "https://docushare.example.com/demo"),
            ("CalendarSync", "Sincronización avanzada de calendarios múltiples", 19.99, "https://calendarsync.example.com", "https://calendarsync.example.com/demo"),
            ("WorkflowMax", "Automatización de flujos de trabajo empresariales", 44.99, "https://workflowmax.example.com", "https://workflowmax.example.com/demo"),
            ("TeamCollab", "Plataforma de colaboración para equipos remotos", 27.99, "https://teamcollab.example.com", "https://teamcollab.example.com/demo"),
            ("ProjectVision", "Visualizador de proyectos con Gantt y Kanban", 32.99, "https://projectvision.example.com", "https://projectvision.example.com/demo"),
            
            # Finanzas
            ("MoneyWise", "Control personal de finanzas e inversiones", 15.99, "https://moneywise.example.com", "https://moneywise.example.com/demo"),
            ("InvoicePro", "Generador profesional de facturas y presupuestos", 22.99, "https://invoicepro.example.com", "https://invoicepro.example.com/demo"),
            ("ExpenseTracker", "Seguimiento automático de gastos empresariales", 18.99, "https://expensetracker.example.com", "https://expensetracker.example.com/demo"),
            ("CryptoWatch", "Monitor de criptomonedas con alertas en tiempo real", 12.99, "https://cryptowatch.example.com", "https://cryptowatch.example.com/demo"),
            ("BudgetMaster", "Planificador de presupuestos para PyMEs", 25.99, "https://budgetmaster.example.com", "https://budgetmaster.example.com/demo"),
            ("TaxHelper", "Asistente para declaración de impuestos", 34.99, "https://taxhelper.example.com", "https://taxhelper.example.com/demo"),
            ("PayrollGenius", "Sistema de nóminas automatizado", 49.99, "https://payrollgenius.example.com", "https://payrollgenius.example.com/demo"),
            ("StockAnalyzer", "Análisis técnico de acciones con IA", 39.99, "https://stockanalyzer.example.com", "https://stockanalyzer.example.com/demo"),
            ("FinanceDash", "Dashboard financiero personalizable", 27.99, "https://financedash.example.com", "https://financedash.example.com/demo"),
            ("DebtFree", "Calculadora y planificador de pagos de deudas", 11.99, "https://debtfree.example.com", "https://debtfree.example.com/demo"),
            
            # Marketing
            ("SocialBoost", "Automatización de publicaciones en redes sociales", 32.99, "https://socialboost.example.com", "https://socialboost.example.com/demo"),
            ("EmailCampaigner", "Creador de campañas de email marketing", 28.99, "https://emailcampaigner.example.com", "https://emailcampaigner.example.com/demo"),
            ("SEOOptimizer", "Herramienta de optimización SEO con auditorías", 45.99, "https://seooptimizer.example.com", "https://seooptimizer.example.com/demo"),
            ("ContentPlanner", "Planificador de contenido para blogs y redes", 19.99, "https://contentplanner.example.com", "https://contentplanner.example.com/demo"),
            ("AdMetrics", "Análisis de métricas de campañas publicitarias", 37.99, "https://admetrics.example.com", "https://admetrics.example.com/demo"),
            ("LeadGenerator", "Captador automático de leads calificados", 54.99, "https://leadgenerator.example.com", "https://leadgenerator.example.com/demo"),
            ("InfluencerHub", "Gestor de colaboraciones con influencers", 41.99, "https://influencerhub.example.com", "https://influencerhub.example.com/demo"),
            ("BrandMonitor", "Monitoreo de marca y menciones en internet", 29.99, "https://brandmonitor.example.com", "https://brandmonitor.example.com/demo"),
            ("LandingBuilder", "Constructor de landing pages de alta conversión", 24.99, "https://landingbuilder.example.com", "https://landingbuilder.example.com/demo"),
            ("MarketResearch", "Análisis de mercado y competencia", 33.99, "https://marketresearch.example.com", "https://marketresearch.example.com/demo"),
            
            # Educación
            ("LearningPath", "Plataforma de cursos online interactivos", 44.99, "https://learningpath.example.com", "https://learningpath.example.com/demo"),
            ("QuizMaster", "Creador de exámenes y evaluaciones", 16.99, "https://quizmaster.example.com", "https://quizmaster.example.com/demo"),
            ("StudentTracker", "Sistema de seguimiento de progreso estudiantil", 38.99, "https://studenttracker.example.com", "https://studenttracker.example.com/demo"),
            ("VirtualClassroom", "Aula virtual con videoconferencia integrada", 52.99, "https://virtualclassroom.example.com", "https://virtualclassroom.example.com/demo"),
            ("GradeBook Pro", "Libro de calificaciones digital para profesores", 21.99, "https://gradebook.example.com", "https://gradebook.example.com/demo"),
            ("LanguageLab", "Laboratorio de idiomas con reconocimiento de voz", 31.99, "https://languagelab.example.com", "https://languagelab.example.com/demo"),
            ("MathTutor AI", "Tutor de matemáticas con inteligencia artificial", 26.99, "https://mathtutor.example.com", "https://mathtutor.example.com/demo"),
            ("LibraryManager", "Sistema de gestión de bibliotecas escolares", 35.99, "https://librarymanager.example.com", "https://librarymanager.example.com/demo"),
            ("AssignmentHub", "Plataforma de entrega y revisión de tareas", 23.99, "https://assignmenthub.example.com", "https://assignmenthub.example.com/demo"),
            ("CertificateGen", "Generador automático de certificados", 14.99, "https://certificategen.example.com", "https://certificategen.example.com/demo"),
            
            # Diseño
            ("DesignStudio Pro", "Suite completa de diseño gráfico en la nube", 49.99, "https://designstudio.example.com", "https://designstudio.example.com/demo"),
            ("ColorPalette AI", "Generador de paletas de colores con IA", 12.99, "https://colorpalette.example.com", "https://colorpalette.example.com/demo"),
            ("MockupBuilder", "Creador de mockups profesionales", 27.99, "https://mockupbuilder.example.com", "https://mockupbuilder.example.com/demo"),
            ("LogoMaker Plus", "Diseñador de logos inteligente", 34.99, "https://logomaker.example.com", "https://logomaker.example.com/demo"),
            ("IconLibrary Pro", "Biblioteca de +10,000 iconos vectoriales", 19.99, "https://iconlibrary.example.com", "https://iconlibrary.example.com/demo"),
            ("PhotoEditor AI", "Editor de fotos con herramientas de IA", 42.99, "https://photoeditor.example.com", "https://photoeditor.example.com/demo"),
            ("TypographyTool", "Herramienta de tipografía y fuentes", 17.99, "https://typographytool.example.com", "https://typographytool.example.com/demo"),
            ("BannerDesigner", "Diseñador de banners para redes sociales", 22.99, "https://bannerdesigner.example.com", "https://bannerdesigner.example.com/demo"),
            ("UIKitBuilder", "Constructor de UI kits personalizados", 39.99, "https://uikitbuilder.example.com", "https://uikitbuilder.example.com/demo"),
            ("AnimationStudio", "Creador de animaciones 2D", 54.99, "https://animationstudio.example.com", "https://animationstudio.example.com/demo"),
            
            # Desarrollo
            ("CodeReview AI", "Revisor automático de código con IA", 37.99, "https://codereview.example.com", "https://codereview.example.com/demo"),
            ("APITester Pro", "Herramienta de testing de APIs RESTful", 29.99, "https://apitester.example.com", "https://apitester.example.com/demo"),
            ("DatabaseDesigner", "Diseñador visual de bases de datos", 44.99, "https://dbdesigner.example.com", "https://dbdesigner.example.com/demo"),
            ("GitFlow Manager", "Gestor de flujos de trabajo Git", 24.99, "https://gitflowmanager.example.com", "https://gitflowmanager.example.com/demo"),
            ("DocGenerator", "Generador automático de documentación técnica", 19.99, "https://docgenerator.example.com", "https://docgenerator.example.com/demo"),
            ("DeploymentHub", "Plataforma de despliegue continuo", 52.99, "https://deploymenthub.example.com", "https://deploymenthub.example.com/demo"),
            ("BugTracker Elite", "Sistema avanzado de seguimiento de bugs", 34.99, "https://bugtracker.example.com", "https://bugtracker.example.com/demo"),
            ("PerformanceMonitor", "Monitor de rendimiento de aplicaciones", 41.99, "https://perfmonitor.example.com", "https://perfmonitor.example.com/demo"),
            ("CodeSnippet Library", "Biblioteca de snippets de código reutilizables", 14.99, "https://codesnippet.example.com", "https://codesnippet.example.com/demo"),
            ("SecurityScanner", "Escáner de vulnerabilidades de seguridad", 49.99, "https://securityscanner.example.com", "https://securityscanner.example.com/demo"),
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
        
        db.commit()
        
        # COMPRAS (120 compras en últimos 6 meses, distribución temporal)
        base_date = datetime.now() - timedelta(days=180)
        for i in range(120):
            # Más compras recientes (distribución exponencial)
            days_ago = int(180 * (1 - random.random() ** 2))
            purchase_date = base_date + timedelta(days=days_ago)
            
            buyer = random.choice(buyers)
            app = random.choice(apps)
            
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
        
        # REVIEWS (50 reviews con distribución realista de ratings)
        confirmed_payments = db.query(Payment).filter(Payment.estado == "confirmado").limit(50).all()
        
        rating_distribution = [5]*17 + [4]*15 + [3]*10 + [2]*5 + [1]*3  # 35% 5★, 30% 4★, 20% 3★, 10% 2★, 5% 1★
        random.shuffle(rating_distribution)
        
        comments_positive = [
            "Excelente aplicación, cumple con todas mis expectativas",
            "Muy útil y fácil de usar, totalmente recomendada",
            "La mejor inversión que he hecho en software",
            "Increíble funcionalidad, ahorra mucho tiempo",
            "Interfaz intuitiva y potente, me encanta",
        ]
        
        comments_neutral = [
            "Buena app pero le falta alguna funcionalidad",
            "Cumple lo prometido, aunque tiene margen de mejora",
            "Funciona bien pero el precio es un poco alto",
        ]
        
        comments_negative = [
            "Esperaba más funcionalidades por el precio",
            "Tiene bugs que deberían corregirse pronto",
        ]
        
        for i, payment in enumerate(confirmed_payments):
            rating_value = rating_distribution[i % len(rating_distribution)]
            
            if rating_value >= 4:
                comment = random.choice(comments_positive)
            elif rating_value == 3:
                comment = random.choice(comments_neutral)
            else:
                comment = random.choice(comments_negative)
            
            review = Review(
                aplicacion_id=payment.aplicacion_id,
                autor_id=payment.comprador_id,
                calificacion=rating_value,
                comentario=comment,
                fecha_creacion=payment.fecha_creacion + timedelta(days=random.randint(1, 7))
            )
            db.add(review)
        
        db.commit()
        
        # DATOS EXTRAS PARA USUARIOS DE PRUEBA (PRESENTACION)
        test_vendor = db.query(User).filter(User.correo == "vendor@example.com").first()
        test_buyer = db.query(User).filter(User.correo == "buyer@example.com").first()
        
        if test_vendor and test_buyer:
            vendor_apps = db.query(App).filter(App.propietario_id == test_vendor.id).all()
            
            # MUCHAS MAS VENTAS para el vendor de prueba (80 compras adicionales)
            for _ in range(80):
                app = random.choice(vendor_apps) if vendor_apps else random.choice(apps)
                buyer_random = random.choice(buyers)
                days_ago = random.randint(1, 180)
                purchase_date = datetime.now() - timedelta(days=days_ago)
                
                credentials = json.dumps({
                    "username": f"user_{random.randint(1000, 9999)}",
                    "password": f"pwd{random.randint(1000, 9999)}",
                    "api_key": f"ak-{random.randint(100000000, 999999999)}"
                })
                
                payment = Payment(
                    aplicacion_id=app.id,
                    comprador_id=buyer_random.id,
                    estado="confirmado",
                    codigo_qr=f"QR-{random.randint(100000, 999999)}",
                    credenciales=credentials,
                    fecha_creacion=purchase_date
                )
                db.add(payment)
                
                # 85% tienen review para tener muchos datos
                if random.random() < 0.85:
                    rating = random.choices([5,4,3,2,1], weights=[45,30,15,7,3])[0]
                    comments = {
                        5: ["Excelente app, muy profesional", "La mejor de su categoria", "100% recomendada", "Increible calidad", "Superó mis expectativas"],
                        4: ["Muy buena aplicacion", "Funciona perfectamente", "Gran herramienta", "Muy recomendable", "Buena compra"],
                        3: ["Cumple su funcion", "Aceptable", "Normal", "Esta bien", "Podria mejorar"],
                        2: ["Le falta mejorar", "Tiene bugs", "No es lo que esperaba", "Regular", "Decepcionante"],
                        1: ["Mala experiencia", "No funciona bien", "Decepcionante", "No vale la pena", "Pesima"]
                    }
                    
                    review = Review(
                        aplicacion_id=app.id,
                        autor_id=buyer_random.id,
                        calificacion=rating,
                        comentario=random.choice(comments[rating]),
                        fecha_creacion=purchase_date + timedelta(days=random.randint(1, 5))
                    )
                    db.add(review)
            
            # El buyer de prueba tiene 25 compras variadas (más datos)
            for _ in range(25):
                app = random.choice(apps)
                days_ago = random.randint(1, 120)
                purchase_date = datetime.now() - timedelta(days=days_ago)
                
                credentials = json.dumps({
                    "username": f"ana_user_{app.id}",
                    "password": f"pwd{random.randint(1000, 9999)}",
                    "api_key": f"ak-{random.randint(100000000, 999999999)}"
                })
                
                payment = Payment(
                    aplicacion_id=app.id,
                    comprador_id=test_buyer.id,
                    estado="confirmado",
                    codigo_qr=f"QR-{random.randint(100000, 999999)}",
                    credenciales=credentials,
                    fecha_creacion=purchase_date
                )
                db.add(payment)
                
                # 60% tienen review del buyer de prueba
                if random.random() < 0.6:
                    rating = random.choices([5,4,3], weights=[50,35,15])[0]
                    review = Review(
                        aplicacion_id=app.id,
                        autor_id=test_buyer.id,
                        calificacion=rating,
                        comentario=f"Review de prueba - Rating {rating}",
                        fecha_creacion=purchase_date + timedelta(days=random.randint(1, 3))
                    )
                    db.add(review)
            
            db.commit()
        
        total_purchases = db.query(Payment).count()
        total_reviews = db.query(Review).count()
        
        return {
            "message": "✅ Base de datos poblada exitosamente",
            "users": len(vendors) + len(buyers),
            "vendors": len(vendors),
            "buyers": len(buyers),
            "apps": len(apps),
            "purchases": total_purchases,
            "reviews": total_reviews
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

