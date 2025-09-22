import pyautogui
import time
 
# Intervalo de tiempo entre movimientos del mouse (en segundos)
intervalo = 60  # Cada 60 segundos
 
print("Stay active script started. Press Ctrl+C to stop.")
print(f"Presionando tecla f15 cada {intervalo} segundos.")

try:
    # Bucle principal
    while True:
        # Presiona la tecla F15
        pyautogui.press('f15')
        # Espera el intervalo de tiempo antes de la siguiente acción
        time.sleep(intervalo)
except KeyboardInterrupt:
    print("Stay active script stopped by the user.")