"""
Script de migración para agregar nuevas columnas a la base de datos existente.
Ejecutar con: python migrate_db.py
"""
import sqlite3
import os

DB_PATH = "./appswap.db"

def migrate():
    if not os.path.exists(DB_PATH):
        print(f"❌ Base de datos no encontrada en {DB_PATH}")
        print("💡 Ejecuta el backend para crear la base de datos primero")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("🔄 Iniciando migración de base de datos...")
    
    # Verificar qué columnas existen en la tabla apps
    cursor.execute("PRAGMA table_info(apps)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"📋 Columnas actuales en 'apps': {columns}")
    
    # Agregar columnas faltantes a la tabla apps
    migrations_apps = []
    if 'price' not in columns:
        migrations_apps.append(("price", "ALTER TABLE apps ADD COLUMN price REAL DEFAULT 0.0"))
    if 'demo_url' not in columns:
        migrations_apps.append(("demo_url", "ALTER TABLE apps ADD COLUMN demo_url TEXT"))
    if 'credentials_template' not in columns:
        migrations_apps.append(("credentials_template", "ALTER TABLE apps ADD COLUMN credentials_template TEXT"))
    
    for col_name, sql in migrations_apps:
        try:
            cursor.execute(sql)
            print(f"✅ Agregada columna '{col_name}' a tabla 'apps'")
        except sqlite3.OperationalError as e:
            print(f"⚠️  Columna '{col_name}' ya existe o error: {e}")
    
    # Verificar columnas en la tabla payments
    cursor.execute("PRAGMA table_info(payments)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"📋 Columnas actuales en 'payments': {columns}")
    
    # Agregar columna credentials a la tabla payments
    if 'credentials' not in columns:
        try:
            cursor.execute("ALTER TABLE payments ADD COLUMN credentials TEXT")
            print("✅ Agregada columna 'credentials' a tabla 'payments'")
        except sqlite3.OperationalError as e:
            print(f"⚠️  Columna 'credentials' ya existe o error: {e}")
    
    # Actualizar status de payments existentes a "confirmed" si están en "pending"
    try:
        cursor.execute("UPDATE payments SET status = 'confirmed' WHERE status = 'pending'")
        rows_updated = cursor.rowcount
        if rows_updated > 0:
            print(f"✅ Actualizados {rows_updated} pagos de 'pending' a 'confirmed'")
    except Exception as e:
        print(f"⚠️  Error actualizando status de payments: {e}")
    
    conn.commit()
    conn.close()
    
    print("✅ Migración completada exitosamente!")
    print("🚀 Ahora puedes reiniciar el backend")

if __name__ == "__main__":
    migrate()
