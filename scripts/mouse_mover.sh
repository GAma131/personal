#!/bin/bash

# Script para mantener el mouse activo
# Mueve el mouse cada 20 segundos para evitar que el sistema entre en reposo

echo "Iniciando script para mantener el mouse activo..."
echo "Presiona Ctrl+C para detener el script"

# Verifica si cliclick está instalado
if ! command -v cliclick &> /dev/null; then
    echo "El comando 'cliclick' no está instalado."
    echo "Puedes instalarlo con: brew install cliclick"
    echo "Si no tienes Homebrew, instálalo primero: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Función para mover el mouse
move_mouse() {
    # Obtiene la posición actual del mouse
    current_position=$(cliclick p)
    
    # Mueve el mouse 10 píxeles a la derecha
    cliclick m:+10,+0
    
    # Espera un segundo
    sleep 1
    
    # Vuelve a la posición original
    cliclick m:"$current_position"
    
    echo "Mouse movido a las $(date +%H:%M:%S)"
}

# Bucle principal
while true; do
    move_mouse
    sleep 20
done
