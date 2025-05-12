-- Mouse Mover Script para macOS
-- Este script mantiene el cursor del mouse en movimiento para evitar que la computadora entre en reposo

on run
	display dialog "Script de movimiento de mouse iniciado. Presiona Cmd+. para detener." buttons {"OK"} default button "OK"
	
	-- Obtener las dimensiones de la pantalla principal
	tell application "Finder"
		set screenSize to bounds of window of desktop
	end tell
	
	set screenWidth to item 3 of screenSize
	set screenHeight to item 4 of screenSize
	
	-- Iniciar bucle de movimiento
	repeat
		-- Generar posiciones aleatorias dentro de la pantalla
		set randomX to random number from 100 to (screenWidth - 100)
		set randomY to random number from 100 to (screenHeight - 100)
		
		-- Mover el cursor a la posición aleatoria
		tell application "System Events"
			set mousePosition to {randomX, randomY}
			set cursor position to mousePosition
		end tell
		
		-- Esperar 30 segundos antes del siguiente movimiento
		delay 30
	end repeat
end run
