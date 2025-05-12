#!/usr/bin/env python3
"""
Script para mantener el cursor del mouse en movimiento en macOS.
Este script mueve el cursor a posiciones aleatorias cada 30 segundos.
Utiliza AppleScript a través de subprocess para funcionar sin dependencias externas.
"""

import random
import time
import subprocess
import sys

def get_screen_size():
    """Obtiene el tamaño de la pantalla usando AppleScript."""
    applescript = '''
    tell application "Finder"
        set screenSize to bounds of window of desktop
    end tell
    set screenWidth to item 3 of screenSize
    set screenHeight to item 4 of screenSize
    return screenWidth & "," & screenHeight
    '''
    
    try:
        result = subprocess.check_output(['osascript', '-e', applescript], text=True).strip()
        width, height = map(int, result.split(','))
        return width, height
    except Exception as e:
        print(f"Error al obtener tamaño de pantalla: {e}")
        # Valores predeterminados en caso de error
        return 1440, 900

def move_mouse(x, y):
    """Mueve el mouse a la posición especificada usando AppleScript."""
    applescript = f'''
    tell application "System Events"
        set cursor position to {{{x}, {y}}}
    end tell
    '''
    
    try:
        subprocess.run(['osascript', '-e', applescript], check=True, capture_output=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error al mover el cursor: {e}")
        return False

def main():
    """Función principal del script."""
    width, height = get_screen_size()
    
    print("Script de movimiento de mouse iniciado.")
    print("Presiona Ctrl+C para detener.")
    print(f"Tamaño de pantalla detectado: {width}x{height}")
    print("El cursor se moverá cada 30 segundos...")
    
    try:
        while True:
            # Generar posiciones aleatorias (con margen de 100px de los bordes)
            x = random.randint(100, width - 100)
            y = random.randint(100, height - 100)
            
            # Mover el cursor
            if move_mouse(x, y):
                print(f"Cursor movido a posición: ({x}, {y})")
            
            # Esperar 30 segundos
            time.sleep(30)
    except KeyboardInterrupt:
        print("\nScript detenido por el usuario.")

if __name__ == "__main__":
    main()
