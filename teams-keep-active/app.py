import pyautogui
import time
 
# Intervalo de tiempo entre movimientos del mouse (en segundos)
intervalo = 60  # Cada 60 segundos
key = "shift"
 
print("Stay active script started. Press Ctrl+C to stop.")
print(f"Presionando tecla {key} cada {intervalo} segundos.")

try:
    # Bucle principal
    while True:
        pyautogui.press(key)
        print(f"Tecla {key} presionada.")
        # Espera el intervalo de tiempo antes de la siguiente acción
        time.sleep(intervalo)
except KeyboardInterrupt:
    print("Stay active script stopped by the user.")