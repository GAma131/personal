/**
 * Ejercicio 2: Verificar si una palabra es un palíndromo
 * 
 * Objetivo: Crear una función que determine si una palabra es un palíndromo.
 * Un palíndromo es una palabra que se lee igual de izquierda a derecha y de derecha a izquierda.
 * 
 * Ejemplo:
 * Input: "radar"
 * Output: true
 * 
 * Input: "hola"
 * Output: false
 */

// Tu solución aquí
function esPalindromo(palabra) {
  // Implementa tu solución
}

// Casos de prueba
console.log(esPalindromo("radar")); // Debería mostrar: true
console.log(esPalindromo("reconocer")); // Debería mostrar: true
console.log(esPalindromo("hola")); // Debería mostrar: false
console.log(esPalindromo("A man a plan a canal Panama")); // Desafío adicional: ¿Puedes hacer que funcione con frases?

/**
 * Pistas:
 * 1. Puedes usar la función que creaste en el ejercicio anterior para invertir la cadena
 * 2. Considera normalizar la entrada (eliminar espacios, convertir a minúsculas)
 * 3. Compara la cadena original con la invertida
 * 
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
 * 
 * function esPalindromo(palabra) {
 *   // Normalizar la entrada: convertir a minúsculas y eliminar espacios
 *   palabra = palabra.toLowerCase().replace(/\s/g, "");
 *   
 *   // Invertir la cadena
 *   let invertida = "";
 *   for (let i = palabra.length - 1; i >= 0; i--) {
 *     invertida += palabra[i];
 *   }
 *   
 *   // Comparar la original con la invertida
 *   return palabra === invertida;
 * }
 */
