/**
 * Ejercicio 3: Contador de palabras
 * 
 * Objetivo: Crear una función que cuente el número de palabras en una frase.
 * 
 * Ejemplo:
 * Input: "Hola mundo de JavaScript"
 * Output: 4
 */

// Tu solución aquí
function contarPalabras(frase) {
  // Implementa tu solución
}

// Casos de prueba
console.log(contarPalabras("Hola mundo de JavaScript")); // Debería mostrar: 4
console.log(contarPalabras("Programación")); // Debería mostrar: 1
console.log(contarPalabras("  Espacios  en  blanco  ")); // Debería mostrar: 3
console.log(contarPalabras("")); // Debería mostrar: 0

/**
 * Pistas:
 * 1. Puedes usar el método split() para dividir la cadena
 * 2. Considera cómo manejar espacios múltiples
 * 3. ¿Qué pasa con una cadena vacía?
 * 
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
 * 
 * function contarPalabras(frase) {
 *   // Eliminar espacios al inicio y al final, y manejar múltiples espacios
 *   frase = frase.trim();
 *   if (frase === "") {
 *     return 0;
 *   }
 *   
 *   // Dividir por espacios y contar
 *   return frase.split(/\s+/).length;
 * }
 */
