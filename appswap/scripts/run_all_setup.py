import subprocess
import sys
import os

# Carpeta donde están los scripts
SCRIPTS_DIR = os.path.dirname(__file__)

# Lista de scripts en orden
scripts_order = [
    "setup_core.py",
    "setup_vendor.py",
    "setup_buyer.py"
]

for script in scripts_order:
    script_path = os.path.join(SCRIPTS_DIR, script)
    print(f"\n🚀 Ejecutando: {script_path}\n")
    
    result = subprocess.run([sys.executable, script_path], capture_output=True, text=True)
    
    print(result.stdout)
    if result.stderr:
        print(f"❌ Errores en {script}:\n{result.stderr}")
    
    if result.returncode != 0:
        print(f"❌ El script {script} falló. Abortando ejecución.")
        break
else:
    print("\n🎉 Todos los scripts se ejecutaron correctamente.")
