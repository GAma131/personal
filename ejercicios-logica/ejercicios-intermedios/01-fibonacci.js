/**
 * Ejercicio 1: Secuencia de Fibonacci
 * 
 * Objetivo: Crear una función que genere los primeros n números de la secuencia de Fibonacci.
 * La secuencia de Fibonacci comienza con 0 y 1, y cada número subsiguiente es la suma de los dos anteriores.
 * 
 * Ejemplo:
 * Input: 8
 * Output: [0, 1, 1, 2, 3, 5, 8, 13]
 */

// Tu solución aquí
function fibonacci(n) {
  // Implementa tu solución
}

// Casos de prueba
console.log(fibonacci(8)); // Debería mostrar: [0, 1, 1, 2, 3, 5, 8, 13]
console.log(fibonacci(1)); // Debería mostrar: [0]
console.log(fibonacci(2)); // Debería mostrar: [0, 1]
console.log(fibonacci(0)); // Debería manejar este caso (¿qué debería devolver?)

/**
 * Pistas:
 * 1. Considera los casos especiales (n = 0, n = 1, n = 2)
 * 2. Usa un array para almacenar la secuencia
 * 3. Recuerda que cada número es la suma de los dos anteriores
 * 
 * Desafío adicional: ¿Puedes implementar una versión recursiva?
 * 
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
 * 
 * function fibonacci(n) {
 *   if (n <= 0) return [];
 *   if (n === 1) return [0];
 *   if (n === 2) return [0, 1];
 *   
 *   const secuencia = [0, 1];
 *   for (let i = 2; i < n; i++) {
 *     secuencia.push(secuencia[i-1] + secuencia[i-2]);
 *   }
 *   
 *   return secuencia;
 * }
 * 
 * // Versión recursiva (menos eficiente pero interesante)
 * function fibonacciRecursivo(n) {
 *   if (n <= 0) return [];
 *   if (n === 1) return [0];
 *   if (n === 2) return [0, 1];
 *   
 *   const secuencia = fibonacciRecursivo(n - 1);
 *   secuencia.push(secuencia[secuencia.length - 1] + secuencia[secuencia.length - 2]);
 *   return secuencia;
 * }
 */
