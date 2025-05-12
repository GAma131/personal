/**
 * Ejercicio 4: Verificador de palíndromos
 *
 * Objetivo: Crear una función que determine si una cadena es un palíndromo.
 * Un palíndromo es una palabra, frase o secuencia que se lee igual hacia adelante que hacia atrás,
 * ignorando espacios, signos de puntuación y mayúsculas/minúsculas.
 *
 * Ejemplo:
 * Input: "Anita lava la tina"
 * Output: true
 *
 * Input: "Hola mundo"
 * Output: false
 */

// Tu solución aquí
function esPalindromo(texto) {
  const text = texto.trim().toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s/g, '')
  const invertedText = invertirString(text)

  if(text === invertedText)
    return true
  return false
}

function invertirString(texto) {
  let invertedText = "";
  for(let i = texto.length - 1; i >= 0; i--){
    invertedText += texto[i]
  }

  return invertedText;
}

// Casos de prueba
console.log(esPalindromo("Anita lava la tina")); // Debería mostrar: true
console.log(esPalindromo("A man, a plan, a canal: Panama")); // Debería mostrar: true
console.log(esPalindromo("race a car")); // Debería mostrar: false
console.log(esPalindromo("Oso")); // Debería mostrar: true
console.log(esPalindromo("")); // Debería mostrar: true (cadena vacía)

/**
 * Pistas:
 * 1. Normaliza la cadena (elimina espacios, signos de puntuación y convierte a minúsculas)
 * 2. Compara la cadena normalizada con su versión invertida
 * 3. Considera los casos especiales (cadena vacía, un solo carácter)
 *
 * Desafío adicional: Implementa una solución que no utilice métodos de inversión de cadenas
 * (como reverse()), sino que compare los caracteres desde ambos extremos hacia el centro.
 *
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
**/
/**
 * function esPalindromo(texto) {
 *   // Normalizar el texto: convertir a minúsculas y eliminar caracteres no alfanuméricos
 *   const textoNormalizado = texto.toLowerCase().replace(/[^a-z0-9]/g, '');
 *
 *   // Comparar con su versión invertida
 *   const textoInvertido = textoNormalizado.split('').reverse().join('');
 *   return textoNormalizado === textoInvertido;
 * }
 *
 * // Solución alternativa sin usar reverse()
 * function esPalindromoAlternativo(texto) {
 *   // Normalizar el texto
 *   const textoNormalizado = texto.toLowerCase().replace(/[^a-z0-9]/g, '');
 *
 *   // Comparar caracteres desde ambos extremos
 *   let inicio = 0;
 *   let fin = textoNormalizado.length - 1;
 *
 *   while (inicio < fin) {
 *     if (textoNormalizado[inicio] !== textoNormalizado[fin]) {
 *       return false;
 *     }
 *     inicio++;
 *     fin--;
 *   }
 *
 *   return true;
 * }
 */
