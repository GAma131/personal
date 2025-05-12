#!/bin/bash
# Script para iniciar el movimiento del mouse

# Ruta al script de AppleScript
SCRIPT_PATH="$(dirname "$0")/mouse_mover.scpt"

# Verificar si el script existe
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "Error: No se encontró el script mouse_mover.scpt"
    exit 1
fi

echo "Iniciando script de movimiento de mouse..."
echo "Para detenerlo, presiona Ctrl+C en esta ventana o Cmd+. en la ventana de Script Editor"

# Ejecutar el script de AppleScript
osascript "$SCRIPT_PATH"
