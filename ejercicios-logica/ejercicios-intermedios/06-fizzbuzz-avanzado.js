/**
 * Ejercicio 6: FizzBuzz Avanzado
 *
 * Objetivo: Implementar una versión avanzada del clásico problema FizzBuzz.
 * 
 * Reglas básicas:
 * - Para múltiplos de 3, imprime "Fizz"
 * - Para múltiplos de 5, imprime "Buzz"
 * - Para múltiplos de ambos 3 y 5, imprime "FizzBuzz"
 * - Para otros números, imprime el número
 *
 * Reglas avanzadas adicionales:
 * - Para múltiplos de 7, añade "Whizz"
 * - Para múltiplos de 11, añade "Bang"
 * - Si el número contiene un 3, imprime "Fizz" (independientemente de divisibilidad)
 * - Si el número contiene un 5, imprime "Buzz" (independientemente de divisibilidad)
 *
 * Ejemplo:
 * Input: 15
 * Output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "Whizz", "8", "Fizz", "Buzz", "Bang", "Fizz", "Fizz", "Whizz", "FizzBuzz"]
 */

// Tu solución aquí
function fizzBuzzAvanzado(n) {
  // Implementa tu solución
}

// Casos de prueba
console.log(fizzBuzzAvanzado(15)); // Ver ejemplo arriba
console.log(fizzBuzzAvanzado(21)); // Debería incluir "FizzWhizz" para el número 21
console.log(fizzBuzzAvanzado(33)); // Debería mostrar "Fizz" (contiene 3 y es divisible por 3)
console.log(fizzBuzzAvanzado(35)); // Debería mostrar "BuzzWhizz" (contiene 5 y es divisible por 5 y 7)
console.log(fizzBuzzAvanzado(55)); // Debería mostrar "Buzz" (contiene 5 y es divisible por 5)

/**
 * Pistas:
 * 1. Maneja cada regla por separado y luego combina los resultados
 * 2. Presta atención al orden de las reglas, especialmente las que dependen del contenido del número
 * 3. Usa el operador módulo (%) para verificar divisibilidad
 * 4. Convierte el número a string para verificar si contiene ciertos dígitos
 *
 * Desafío adicional: Haz que tu función acepte parámetros personalizables para las reglas,
 * permitiendo al usuario definir qué números usar para "Fizz", "Buzz", etc.
 *
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
**/
/**
 * function fizzBuzzAvanzado(n) {
 *   const resultado = [];
 *   
 *   for (let i = 1; i <= n; i++) {
 *     let salida = "";
 *     const iString = i.toString();
 *     
 *     // Reglas de contenido (tienen prioridad)
 *     if (iString.includes('3')) {
 *       salida += "Fizz";
 *     } else if (i % 3 === 0) {
 *       // Regla de divisibilidad por 3
 *       salida += "Fizz";
 *     }
 *     
 *     if (iString.includes('5')) {
 *       salida += "Buzz";
 *     } else if (i % 5 === 0) {
 *       // Regla de divisibilidad por 5
 *       salida += "Buzz";
 *     }
 *     
 *     // Reglas adicionales
 *     if (i % 7 === 0) {
 *       salida += "Whizz";
 *     }
 *     
 *     if (i % 11 === 0) {
 *       salida += "Bang";
 *     }
 *     
 *     // Si no se aplicó ninguna regla, usar el número
 *     resultado.push(salida || i.toString());
 *   }
 *   
 *   return resultado;
 * }
 *
 * // Versión personalizable
 * function fizzBuzzPersonalizable(n, reglas) {
 *   const resultado = [];
 *   
 *   for (let i = 1; i <= n; i++) {
 *     let salida = "";
 *     const iString = i.toString();
 *     
 *     // Aplicar cada regla
 *     for (const regla of reglas) {
 *       const { divisor, texto, contenido } = regla;
 *       
 *       if (contenido && iString.includes(contenido)) {
 *         salida += texto;
 *       } else if (divisor && i % divisor === 0) {
 *         salida += texto;
 *       }
 *     }
 *     
 *     // Si no se aplicó ninguna regla, usar el número
 *     resultado.push(salida || i.toString());
 *   }
 *   
 *   return resultado;
 * }
 * 
 * // Ejemplo de uso de la versión personalizable:
 * // const reglas = [
 * //   { divisor: 3, texto: "Fizz", contenido: "3" },
 * //   { divisor: 5, texto: "Buzz", contenido: "5" },
 * //   { divisor: 7, texto: "Whizz" },
 * //   { divisor: 11, texto: "Bang" }
 * // ];
 * // fizzBuzzPersonalizable(30, reglas);
 */
