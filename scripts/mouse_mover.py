#!/usr/bin/env python3
"""
Script para mantener el mouse activo
Mueve el mouse cada 20 segundos para mantener activo el estado en Teams
Utiliza AppleScript para mover el mouse sin necesidad de permisos especiales
"""

import time
import random
import sys
import os
import subprocess
from datetime import datetime

# Contador global de actividad
actividad_contador = 0

def print_with_timestamp(message):
    """Imprime un mensaje con la hora actual"""
    current_time = datetime.now().strftime("%H:%M:%S")
    print(f"[{current_time}] {message}")

def move_mouse():
    """Mueve el mouse usando AppleScript de manera que funcione para Teams"""
    global actividad_contador
    try:
        actividad_contador += 1

        # Usar AppleScript para simular una pulsación de tecla (menos intrusivo que mover el mouse)
        # La tecla F15 es una tecla que la mayoría de teclados no tienen, por lo que no afecta a ninguna aplicación
        # pero es detectada como actividad por el sistema y Teams
        applescript = '''
        tell application "System Events"
            key code 113
        end tell
        '''

        # Ejecutar el AppleScript
        subprocess.run(['osascript', '-e', applescript], capture_output=True, check=False)

        # Mostrar progreso en la terminal
        sys.stdout.write("\r" + "*" * (actividad_contador % 10) + " " * (10 - actividad_contador % 10) +
                         f" | Actividad #{actividad_contador} | Última: {datetime.now().strftime('%H:%M:%S')} | Teams activo")
        sys.stdout.flush()

        return True
    except Exception as e:
        print(f"\nError al simular actividad: {e}")
        return False

def main():
    """Función principal del script"""
    print_with_timestamp("Iniciando script para mantener activo el estado en Teams...")
    print_with_timestamp("Presiona Ctrl+C para detener el script")
    print_with_timestamp("El script simulará actividad cada 20 segundos")

    try:
        while True:
            move_mouse()
            # Espera 20 segundos antes de la próxima actividad
            time.sleep(20)
    except KeyboardInterrupt:
        print("\n")
        print_with_timestamp("Script detenido por el usuario")
    except Exception as e:
        print("\n")
        print_with_timestamp(f"Error inesperado: {e}")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())
