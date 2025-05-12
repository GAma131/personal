#!/bin/bash
# Script para iniciar el movimiento del mouse

# Ruta al script de Python
SCRIPT_PATH="$(dirname "$0")/mouse_mover.py"

# Verificar si el script existe
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "Error: No se encontró el script mouse_mover.py"
    exit 1
fi

# Dar permisos de ejecución al script de Python si no los tiene
chmod +x "$SCRIPT_PATH"

# Ejecutar el script de Python
python3 "$SCRIPT_PATH"
