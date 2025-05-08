/**
 * Ejercicio 3: Generador de números primos
 *
 * Objetivo: Crear una función que genere todos los números primos hasta un número n dado.
 * Un número primo es aquel que solo es divisible por 1 y por sí mismo.
 *
 * Ejemplo:
 * Input: 20
 * Output: [2, 3, 5, 7, 11, 13, 17, 19]
 */

// Tu solución aquí
function generarPrimos(n) {
  let result = []
  for(let i = 2; i<=n; i++){
    const control = []
    control.push(i/1)
    control.push(i/2)
    control.push(i/3)
    control.push(i/4)
    control.push(i/5)
    control.push(i/6)
    control.push(i/7)
    control.push(i/8)
    control.push(i/9)
    if(i>9)
      control.push(i/i)

    const countPrimos = control.filter(N => Number.isInteger(N)).length

    if(countPrimos == 2)
      result.push(i)
  }
  return result.toString();
}

// Casos de prueba
console.log(generarPrimos(20)); // Debería mostrar: [2, 3, 5, 7, 11, 13, 17, 19]
console.log(generarPrimos(10)); // Debería mostrar: [2, 3, 5, 7]
console.log(generarPrimos(1)); // Debería mostrar: []
console.log(generarPrimos(2)); // Debería mostrar: [2]

function generarPrimos(n) {
  const result = [];

  for (let i = 2; i <= n; i++) {
    let esPrimo = true;

    // Solo necesitamos verificar hasta la raíz cuadrada de i
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        esPrimo = false;
        break;
      }
    }

    if (esPrimo) {
      result.push(i);
    }
  }

  return result;
}

/**
 * Pistas:
 * 1. Crea una función auxiliar para verificar si un número es primo
 * 2. Un número es primo si no es divisible por ningún número entre 2 y su raíz cuadrada
 * 3. Considera los casos especiales (n <= 1)
 *
 * Desafío adicional: Implementa el algoritmo de la Criba de Eratóstenes para mayor eficiencia
 *
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
**/
/**
 * // Solución básica
 * function generarPrimos(n) {
 *   const primos = [];
 *
 *   // Verificar si un número es primo
 *   function esPrimo(num) {
 *     if (num <= 1) return false;
 *     if (num <= 3) return true;
 *     if (num % 2 === 0 || num % 3 === 0) return false;
 *
 *     // Verificar divisibilidad solo por números de la forma 6k±1
 *     for (let i = 5; i * i <= num; i += 6) {
 *       if (num % i === 0 || num % (i + 2) === 0) return false;
 *     }
 *
 *     return true;
 *   }
 *
 *   // Generar todos los primos hasta n
 *   for (let i = 2; i <= n; i++) {
 *     if (esPrimo(i)) {
 *       primos.push(i);
 *     }
 *   }
 *
 *   return primos;
 * }
 *
 * // Solución usando la Criba de Eratóstenes (más eficiente)
 * function generarPrimosEratostenes(n) {
 *   // Casos especiales
 *   if (n < 2) return [];
 *
 *   // Inicializar array con todos los números marcados como primos
 *   const esPrimo = new Array(n + 1).fill(true);
 *   esPrimo[0] = esPrimo[1] = false;
 *
 *   // Aplicar la criba
 *   for (let i = 2; i * i <= n; i++) {
 *     if (esPrimo[i]) {
 *       // Marcar todos los múltiplos de i como no primos
 *       for (let j = i * i; j <= n; j += i) {
 *         esPrimo[j] = false;
 *       }
 *     }
 *   }
 *
 *   // Recopilar los números primos
 *   const primos = [];
 *   for (let i = 2; i <= n; i++) {
 *     if (esPrimo[i]) {
 *       primos.push(i);
 *     }
 *   }
 *
 *   return primos;
 * }
 */
