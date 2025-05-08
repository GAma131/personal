/**
 * Ejercicio 2: Verificar si dos palabras son anagramas
 * 
 * Objetivo: Crear una función que determine si dos palabras son anagramas.
 * Un anagrama es una palabra que resulta de reorganizar las letras de otra palabra.
 * 
 * Ejemplo:
 * Input: "listen", "silent"
 * Output: true
 * 
 * Input: "hello", "world"
 * Output: false
 */

// Tu solución aquí
function sonAnagramas(palabra1, palabra2) {
  // Implementa tu solución
}

// Casos de prueba
console.log(sonAnagramas("listen", "silent")); // Debería mostrar: true
console.log(sonAnagramas("dormitorio", "dormitorio")); // Debería mostrar: true
console.log(sonAnagramas("hello", "world")); // Debería mostrar: false
console.log(sonAnagramas("Roma", "amor")); // Debería mostrar: true (ignorando mayúsculas/minúsculas)
console.log(sonAnagramas("", "")); // Debería mostrar: true

/**
 * Pistas:
 * 1. Normaliza las cadenas (convierte a minúsculas)
 * 2. Ordena los caracteres de cada palabra
 * 3. Compara las cadenas ordenadas
 * 
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
 * 
 * function sonAnagramas(palabra1, palabra2) {
 *   // Normalizar y ordenar las palabras
 *   const normalizada1 = palabra1.toLowerCase().split('').sort().join('');
 *   const normalizada2 = palabra2.toLowerCase().split('').sort().join('');
 *   
 *   // Comparar las palabras ordenadas
 *   return normalizada1 === normalizada2;
 * }
 * 
 * // Solución alternativa usando un objeto para contar caracteres
 * function sonAnagramasAlternativo(palabra1, palabra2) {
 *   if (palabra1.length !== palabra2.length) return false;
 *   
 *   palabra1 = palabra1.toLowerCase();
 *   palabra2 = palabra2.toLowerCase();
 *   
 *   const conteo = {};
 *   
 *   // Contar caracteres de la primera palabra
 *   for (let char of palabra1) {
 *     conteo[char] = (conteo[char] || 0) + 1;
 *   }
 *   
 *   // Restar caracteres de la segunda palabra
 *   for (let char of palabra2) {
 *     if (!conteo[char]) return false;
 *     conteo[char]--;
 *   }
 *   
 *   // Verificar que todos los conteos sean cero
 *   return Object.values(conteo).every(count => count === 0);
 * }
 */
