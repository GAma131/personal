/**
 * Ejercicio 7: Contador de palabras y frecuencia
 *
 * Objetivo: Crear una función que analice un texto y devuelva estadísticas sobre las palabras.
 * La función debe contar el número total de palabras y calcular la frecuencia de cada palabra.
 *
 * Ejemplo:
 * Input: "El perro corre. El gato salta. El perro ladra."
 * Output: {
 *   totalPalabras: 8,
 *   frecuencia: {
 *     "el": 3,
 *     "perro": 2,
 *     "corre": 1,
 *     "gato": 1,
 *     "salta": 1,
 *     "ladra": 1
 *   },
 *   palabraMasComun: "el"
 * }
 */

// Tu solución aquí
function analizarTexto(texto) {
  // Implementa tu solución
}

// Casos de prueba
console.log(analizarTexto("El perro corre. El gato salta. El perro ladra."));
console.log(analizarTexto("Hola mundo. Hola programación. Hola JavaScript."));
console.log(analizarTexto("")); // Texto vacío
console.log(analizarTexto("¡JavaScript es genial! JavaScript es poderoso. JavaScript es versátil."));
console.log(analizarTexto("uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez."));

/**
 * Pistas:
 * 1. Normaliza el texto (convierte a minúsculas, elimina signos de puntuación)
 * 2. Divide el texto en palabras usando espacios como separadores
 * 3. Usa un objeto para contar la frecuencia de cada palabra
 * 4. Encuentra la palabra más común comparando las frecuencias
 *
 * Desafío adicional: Añade más estadísticas como:
 * - Longitud promedio de las palabras
 * - Palabra más larga
 * - Palabra más corta (excluyendo palabras de una sola letra)
 * - Las 3 palabras más comunes
 *
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
**/
/**
 * function analizarTexto(texto) {
 *   // Manejar caso de texto vacío
 *   if (!texto.trim()) {
 *     return {
 *       totalPalabras: 0,
 *       frecuencia: {},
 *       palabraMasComun: null
 *     };
 *   }
 *   
 *   // Normalizar el texto: convertir a minúsculas y eliminar signos de puntuación
 *   const textoNormalizado = texto.toLowerCase().replace(/[.,!?;:()"'-]/g, '');
 *   
 *   // Dividir en palabras y filtrar espacios vacíos
 *   const palabras = textoNormalizado.split(/\s+/).filter(palabra => palabra.length > 0);
 *   
 *   // Contar frecuencia de palabras
 *   const frecuencia = {};
 *   palabras.forEach(palabra => {
 *     frecuencia[palabra] = (frecuencia[palabra] || 0) + 1;
 *   });
 *   
 *   // Encontrar la palabra más común
 *   let palabraMasComun = null;
 *   let maxFrecuencia = 0;
 *   
 *   for (const palabra in frecuencia) {
 *     if (frecuencia[palabra] > maxFrecuencia) {
 *       maxFrecuencia = frecuencia[palabra];
 *       palabraMasComun = palabra;
 *     }
 *   }
 *   
 *   return {
 *     totalPalabras: palabras.length,
 *     frecuencia,
 *     palabraMasComun
 *   };
 * }
 *
 * // Versión con estadísticas adicionales
 * function analizarTextoAvanzado(texto) {
 *   // Manejar caso de texto vacío
 *   if (!texto.trim()) {
 *     return {
 *       totalPalabras: 0,
 *       frecuencia: {},
 *       palabraMasComun: null,
 *       longitudPromedio: 0,
 *       palabraMasLarga: null,
 *       palabraMasCorta: null,
 *       palabrasMasComunes: []
 *     };
 *   }
 *   
 *   // Normalizar y dividir en palabras
 *   const textoNormalizado = texto.toLowerCase().replace(/[.,!?;:()"'-]/g, '');
 *   const palabras = textoNormalizado.split(/\s+/).filter(palabra => palabra.length > 0);
 *   
 *   // Contar frecuencia
 *   const frecuencia = {};
 *   palabras.forEach(palabra => {
 *     frecuencia[palabra] = (frecuencia[palabra] || 0) + 1;
 *   });
 *   
 *   // Calcular longitud promedio
 *   const longitudTotal = palabras.reduce((sum, palabra) => sum + palabra.length, 0);
 *   const longitudPromedio = longitudTotal / palabras.length;
 *   
 *   // Encontrar palabra más larga y más corta
 *   let palabraMasLarga = '';
 *   let palabraMasCorta = palabras[0];
 *   
 *   palabras.forEach(palabra => {
 *     if (palabra.length > palabraMasLarga.length) {
 *       palabraMasLarga = palabra;
 *     }
 *     
 *     if (palabra.length < palabraMasCorta.length && palabra.length > 1) {
 *       palabraMasCorta = palabra;
 *     }
 *   });
 *   
 *   // Encontrar las 3 palabras más comunes
 *   const palabrasMasComunes = Object.entries(frecuencia)
 *     .sort((a, b) => b[1] - a[1])
 *     .slice(0, 3)
 *     .map(entry => entry[0]);
 *   
 *   return {
 *     totalPalabras: palabras.length,
 *     frecuencia,
 *     palabraMasComun: palabrasMasComunes[0],
 *     longitudPromedio,
 *     palabraMasLarga,
 *     palabraMasCorta: palabraMasCorta.length > 1 ? palabraMasCorta : null,
 *     palabrasMasComunes
 *   };
 * }
 */
