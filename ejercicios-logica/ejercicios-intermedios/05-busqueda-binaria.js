/**
 * Ejercicio 5: Búsqueda Binaria
 *
 * Objetivo: Implementar el algoritmo de búsqueda binaria para encontrar un elemento en un array ordenado.
 * La búsqueda binaria es mucho más eficiente que la búsqueda lineal para arrays ordenados.
 *
 * Ejemplo:
 * Input: [1, 3, 5, 7, 9, 11, 13, 15], 7
 * Output: 3 (índice donde se encuentra el elemento)
 *
 * Input: [1, 3, 5, 7, 9, 11, 13, 15], 6
 * Output: -1 (el elemento no existe en el array)
 */

// Tu solución aquí
function busquedaBinaria(array, elemento) {
  let newArray = []
  let result;
  do{
    const halfArray = array[array.length / 2]
    if(elemento === halfArray){
      console.log(array.length / 2)
      result = halfArray
    }

    if(elemento < halfArray){
      newArray = array.slice(3)
      console.log(newArray)
    }

    if(elemento > halfArray){
      newArray = array.slice(-halfArray)
      console.log(newArray)
      result = true
    }
  }while(result === undefined)
}

// Casos de prueba
console.log(busquedaBinaria([1, 3, 5, 7, 9, 11, 13, 15], 7)); // Debería mostrar: 3
// console.log(busquedaBinaria([1, 3, 5, 7, 9, 11, 13, 15], 6)); // Debería mostrar: -1
// console.log(busquedaBinaria([1, 2, 3, 4, 5], 1)); // Debería mostrar: 0
// console.log(busquedaBinaria([1, 2, 3, 4, 5], 5)); // Debería mostrar: 4
// console.log(busquedaBinaria([], 5)); // Debería mostrar: -1 (array vacío)

/**
 * Pistas:
 * 1. La búsqueda binaria funciona dividiendo repetidamente el array a la mitad
 * 2. Compara el elemento buscado con el elemento en el medio del array
 * 3. Si son iguales, has encontrado el elemento
 * 4. Si el elemento buscado es menor, continúa la búsqueda en la mitad izquierda
 * 5. Si el elemento buscado es mayor, continúa la búsqueda en la mitad derecha
 *
 * Desafío adicional: Implementa tanto la versión iterativa como la versión recursiva
 * del algoritmo de búsqueda binaria.
 *
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
**/
/**
 * // Versión iterativa
 * function busquedaBinaria(array, elemento) {
 *   let inicio = 0;
 *   let fin = array.length - 1;
 *
 *   while (inicio <= fin) {
 *     const medio = Math.floor((inicio + fin) / 2);
 *
 *     if (array[medio] === elemento) {
 *       return medio; // Elemento encontrado
 *     } else if (array[medio] < elemento) {
 *       inicio = medio + 1; // Buscar en la mitad derecha
 *     } else {
 *       fin = medio - 1; // Buscar en la mitad izquierda
 *     }
 *   }
 *
 *   return -1; // Elemento no encontrado
 * }
 *
 * // Versión recursiva
 * function busquedaBinariaRecursiva(array, elemento, inicio = 0, fin = array.length - 1) {
 *   // Caso base: elemento no encontrado
 *   if (inicio > fin) {
 *     return -1;
 *   }
 *
 *   const medio = Math.floor((inicio + fin) / 2);
 *
 *   // Caso base: elemento encontrado
 *   if (array[medio] === elemento) {
 *     return medio;
 *   }
 *
 *   // Llamada recursiva
 *   if (array[medio] < elemento) {
 *     return busquedaBinariaRecursiva(array, elemento, medio + 1, fin); // Mitad derecha
 *   } else {
 *     return busquedaBinariaRecursiva(array, elemento, inicio, medio - 1); // Mitad izquierda
 *   }
 * }
 */
