/**
 * Ejercicio 1: Invertir una cadena de texto
 *
 * Objetivo: Crear una función que invierta una cadena de texto sin usar el método reverse()
 *
 * Ejemplo:
 * Input: "Hola mundo"
 * Output: "odnum aloH"
 */

// Tu solución aquí
function invertirString(texto) {
  let invertedText = "";
  for(let i = texto.length - 1; i >= 0; i--){
    invertedText += texto[i]
  }

  return invertedText;
}

// Casos de prueba
console.log(invertirString("Hola mundo")); // Debería mostrar: "odnum aloH"
// console.log(invertirString("JavaScript")); // Debería mostrar: "tpircSavaJ"
// console.log(invertirString("a")); // Debería mostrar: "a"
// console.log(invertirString("")); // Debería mostrar: ""

/**
 * Pistas:
 * 1. Puedes recorrer la cadena desde el último carácter hasta el primero
 * 2. Puedes usar un bucle for o while
 * 3. Puedes ir construyendo una nueva cadena carácter por carácter
 *
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
 *
 * function invertirString(texto) {
 *   let resultado = "";
 *   for (let i = texto.length - 1; i >= 0; i--) {
 *     resultado += texto[i];
 *   }
 *   return resultado;
 * }
 */
