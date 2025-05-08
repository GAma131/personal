/**
 * Ejercicio 1: Implementación de algoritmos de ordenamiento
 * 
 * Objetivo: Implementar dos algoritmos de ordenamiento diferentes y comparar su eficiencia.
 * 
 * Parte 1: Implementa el algoritmo de ordenamiento por selección (Selection Sort)
 * Parte 2: Implementa el algoritmo de ordenamiento rápido (Quick Sort)
 * Parte 3: Compara el rendimiento de ambos algoritmos con arrays de diferentes tamaños
 */

// Parte 1: Implementa el algoritmo de ordenamiento por selección
function selectionSort(arr) {
  // Implementa tu solución
}

// Parte 2: Implementa el algoritmo de ordenamiento rápido
function quickSort(arr) {
  // Implementa tu solución
}

// Función para generar un array de números aleatorios
function generarArrayAleatorio(longitud, max = 1000) {
  return Array.from({ length: longitud }, () => Math.floor(Math.random() * max));
}

// Función para medir el tiempo de ejecución de un algoritmo
function medirTiempo(funcion, array) {
  const inicio = process.hrtime.bigint();
  funcion([...array]); // Clonar el array para no modificar el original
  const fin = process.hrtime.bigint();
  return Number(fin - inicio) / 1_000_000; // Convertir a milisegundos
}

// Parte 3: Comparar rendimiento
function compararRendimiento() {
  const tamaños = [10, 100, 1000, 5000];
  
  console.log("Comparación de rendimiento entre Selection Sort y Quick Sort:");
  console.log("--------------------------------------------------------");
  console.log("| Tamaño del array | Selection Sort (ms) | Quick Sort (ms) |");
  console.log("--------------------------------------------------------");
  
  tamaños.forEach(tamaño => {
    const array = generarArrayAleatorio(tamaño);
    
    const tiempoSelection = medirTiempo(selectionSort, array);
    const tiempoQuick = medirTiempo(quickSort, array);
    
    console.log(`| ${tamaño.toString().padEnd(16)} | ${tiempoSelection.toFixed(2).padEnd(19)} | ${tiempoQuick.toFixed(2).padEnd(14)} |`);
  });
  
  console.log("--------------------------------------------------------");
}

// Casos de prueba
const arrayPrueba = [5, 3, 8, 4, 2, 1, 9, 7];
console.log("Array original:", arrayPrueba);
console.log("Selection Sort:", selectionSort([...arrayPrueba]));
console.log("Quick Sort:", quickSort([...arrayPrueba]));

// Ejecutar comparación de rendimiento
compararRendimiento();

/**
 * Pistas para Selection Sort:
 * 1. Encuentra el elemento mínimo en la parte no ordenada
 * 2. Intercámbialo con el primer elemento de la parte no ordenada
 * 3. Mueve el límite de la parte ordenada una posición a la derecha
 * 
 * Pistas para Quick Sort:
 * 1. Elige un elemento pivote
 * 2. Particiona el array: elementos menores que el pivote a la izquierda, mayores a la derecha
 * 3. Aplica recursivamente el algoritmo a las dos particiones
 * 
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
 * 
 * // Selection Sort
 * function selectionSort(arr) {
 *   const n = arr.length;
 *   
 *   for (let i = 0; i < n - 1; i++) {
 *     // Encontrar el índice del elemento mínimo
 *     let minIndex = i;
 *     for (let j = i + 1; j < n; j++) {
 *       if (arr[j] < arr[minIndex]) {
 *         minIndex = j;
 *       }
 *     }
 *     
 *     // Intercambiar el elemento mínimo con el primer elemento
 *     if (minIndex !== i) {
 *       [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
 *     }
 *   }
 *   
 *   return arr;
 * }
 * 
 * // Quick Sort
 * function quickSort(arr) {
 *   if (arr.length <= 1) {
 *     return arr;
 *   }
 *   
 *   const pivote = arr[Math.floor(arr.length / 2)];
 *   const izquierda = [];
 *   const derecha = [];
 *   const iguales = [];
 *   
 *   for (const elemento of arr) {
 *     if (elemento < pivote) {
 *       izquierda.push(elemento);
 *     } else if (elemento > pivote) {
 *       derecha.push(elemento);
 *     } else {
 *       iguales.push(elemento);
 *     }
 *   }
 *   
 *   return [...quickSort(izquierda), ...iguales, ...quickSort(derecha)];
 * }
 */
