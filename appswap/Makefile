# --- Variables ---
PYTHON := python3
SCRIPTS_DIR := scripts
MASTER_SCRIPT := run_all_setup.py

# --- Objetivos ---
.PHONY: setup clean

# Ejecuta todos los setups
setup:
	@echo "⚡ Ejecutando setup completo del proyecto..."
	@$(PYTHON) $(SCRIPTS_DIR)/$(MASTER_SCRIPT)

# Limpieza opcional de archivos generados
clean:
	@echo "🧹 Limpiando archivos generados (opcional)"
	# Agrega aquí los comandos de limpieza si quieres
	# Por ejemplo: rm -rf src/pages/vendor/* src/pages/buyer/*
