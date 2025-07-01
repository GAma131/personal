import pyautogui
import time
 
# Intervalo de tiempo entre movimientos del mouse (en segundos)
intervalo = 5  # Cada 5 segundos
 
# Movimiento pequeño para evitar detección de inactividad
while True:
    # Mueve el mouse ligeramente
    pyautogui.move(10, 0)  # Mueve 10 píxeles a la derecha
    pyautogui.move(-10, 0)  # Mueve 10 píxeles a la izquierda
    # Espera el intervalo antes de mover el mouse nuevamente
    time.sleep(intervalo)