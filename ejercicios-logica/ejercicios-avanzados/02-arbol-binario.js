/**
 * Ejercicio 2: Implementación de un Árbol Binario de Búsqueda
 * 
 * Objetivo: Implementar un Árbol Binario de Búsqueda (BST) con las operaciones básicas:
 * - Insertar un valor
 * - Buscar un valor
 * - Eliminar un valor
 * - Recorrer el árbol en orden (inorder), preorden (preorder) y postorden (postorder)
 */

// Definición de la clase Nodo
class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.izquierda = null;
    this.derecha = null;
  }
}

// Implementación del Árbol Binario de Búsqueda
class ArbolBinarioBusqueda {
  constructor() {
    this.raiz = null;
  }
  
  // Método para insertar un valor en el árbol
  insertar(valor) {
    // Implementa tu solución
  }
  
  // Método auxiliar para insertar recursivamente
  _insertarRecursivo(nodo, valor) {
    // Implementa tu solución
  }
  
  // Método para buscar un valor en el árbol
  buscar(valor) {
    // Implementa tu solución
  }
  
  // Método auxiliar para buscar recursivamente
  _buscarRecursivo(nodo, valor) {
    // Implementa tu solución
  }
  
  // Método para eliminar un valor del árbol
  eliminar(valor) {
    // Implementa tu solución
  }
  
  // Método auxiliar para eliminar recursivamente
  _eliminarRecursivo(nodo, valor) {
    // Implementa tu solución
  }
  
  // Método para encontrar el valor mínimo en un subárbol
  _encontrarMinimo(nodo) {
    // Implementa tu solución
  }
  
  // Método para recorrer el árbol en orden (izquierda, raíz, derecha)
  recorridoEnOrden() {
    const resultado = [];
    this._recorridoEnOrdenRecursivo(this.raiz, resultado);
    return resultado;
  }
  
  // Método auxiliar para recorrer en orden recursivamente
  _recorridoEnOrdenRecursivo(nodo, resultado) {
    // Implementa tu solución
  }
  
  // Método para recorrer el árbol en preorden (raíz, izquierda, derecha)
  recorridoPreOrden() {
    const resultado = [];
    this._recorridoPreOrdenRecursivo(this.raiz, resultado);
    return resultado;
  }
  
  // Método auxiliar para recorrer en preorden recursivamente
  _recorridoPreOrdenRecursivo(nodo, resultado) {
    // Implementa tu solución
  }
  
  // Método para recorrer el árbol en postorden (izquierda, derecha, raíz)
  recorridoPostOrden() {
    const resultado = [];
    this._recorridoPostOrdenRecursivo(this.raiz, resultado);
    return resultado;
  }
  
  // Método auxiliar para recorrer en postorden recursivamente
  _recorridoPostOrdenRecursivo(nodo, resultado) {
    // Implementa tu solución
  }
}

// Casos de prueba
const arbol = new ArbolBinarioBusqueda();

// Insertar valores
console.log("Insertando valores: 10, 5, 15, 3, 7, 12, 18");
arbol.insertar(10);
arbol.insertar(5);
arbol.insertar(15);
arbol.insertar(3);
arbol.insertar(7);
arbol.insertar(12);
arbol.insertar(18);

// Recorridos
console.log("Recorrido en orden:", arbol.recorridoEnOrden()); // Debería mostrar: [3, 5, 7, 10, 12, 15, 18]
console.log("Recorrido en preorden:", arbol.recorridoPreOrden()); // Debería mostrar: [10, 5, 3, 7, 15, 12, 18]
console.log("Recorrido en postorden:", arbol.recorridoPostOrden()); // Debería mostrar: [3, 7, 5, 12, 18, 15, 10]

// Búsqueda
console.log("Buscar 7:", arbol.buscar(7)); // Debería mostrar: true
console.log("Buscar 20:", arbol.buscar(20)); // Debería mostrar: false

// Eliminación
console.log("Eliminando 5...");
arbol.eliminar(5);
console.log("Recorrido en orden después de eliminar 5:", arbol.recorridoEnOrden()); // Debería mostrar: [3, 7, 10, 12, 15, 18]

/**
 * Pistas:
 * 1. Para insertar: Si el valor es menor que el nodo actual, va al subárbol izquierdo; si es mayor, al derecho
 * 2. Para buscar: Sigue la misma lógica que la inserción
 * 3. Para eliminar: Considera tres casos: nodo sin hijos, nodo con un hijo, nodo con dos hijos
 * 4. Para el recorrido en orden: izquierda -> raíz -> derecha
 * 5. Para el recorrido en preorden: raíz -> izquierda -> derecha
 * 6. Para el recorrido en postorden: izquierda -> derecha -> raíz
 * 
 * Solución (¡intenta resolver el ejercicio antes de mirar!):
 * 
 * // Método para insertar un valor en el árbol
 * insertar(valor) {
 *   this.raiz = this._insertarRecursivo(this.raiz, valor);
 * }
 * 
 * // Método auxiliar para insertar recursivamente
 * _insertarRecursivo(nodo, valor) {
 *   if (nodo === null) {
 *     return new Nodo(valor);
 *   }
 *   
 *   if (valor < nodo.valor) {
 *     nodo.izquierda = this._insertarRecursivo(nodo.izquierda, valor);
 *   } else if (valor > nodo.valor) {
 *     nodo.derecha = this._insertarRecursivo(nodo.derecha, valor);
 *   }
 *   
 *   return nodo;
 * }
 * 
 * // Método para buscar un valor en el árbol
 * buscar(valor) {
 *   return this._buscarRecursivo(this.raiz, valor);
 * }
 * 
 * // Método auxiliar para buscar recursivamente
 * _buscarRecursivo(nodo, valor) {
 *   if (nodo === null) {
 *     return false;
 *   }
 *   
 *   if (valor === nodo.valor) {
 *     return true;
 *   }
 *   
 *   if (valor < nodo.valor) {
 *     return this._buscarRecursivo(nodo.izquierda, valor);
 *   } else {
 *     return this._buscarRecursivo(nodo.derecha, valor);
 *   }
 * }
 * 
 * // Método para eliminar un valor del árbol
 * eliminar(valor) {
 *   this.raiz = this._eliminarRecursivo(this.raiz, valor);
 * }
 * 
 * // Método auxiliar para eliminar recursivamente
 * _eliminarRecursivo(nodo, valor) {
 *   if (nodo === null) {
 *     return null;
 *   }
 *   
 *   // Buscar el nodo a eliminar
 *   if (valor < nodo.valor) {
 *     nodo.izquierda = this._eliminarRecursivo(nodo.izquierda, valor);
 *   } else if (valor > nodo.valor) {
 *     nodo.derecha = this._eliminarRecursivo(nodo.derecha, valor);
 *   } else {
 *     // Caso 1: Nodo sin hijos o con un solo hijo
 *     if (nodo.izquierda === null) {
 *       return nodo.derecha;
 *     } else if (nodo.derecha === null) {
 *       return nodo.izquierda;
 *     }
 *     
 *     // Caso 2: Nodo con dos hijos
 *     // Encontrar el sucesor inmediato (el valor mínimo en el subárbol derecho)
 *     nodo.valor = this._encontrarMinimo(nodo.derecha);
 *     
 *     // Eliminar el sucesor inmediato
 *     nodo.derecha = this._eliminarRecursivo(nodo.derecha, nodo.valor);
 *   }
 *   
 *   return nodo;
 * }
 * 
 * // Método para encontrar el valor mínimo en un subárbol
 * _encontrarMinimo(nodo) {
 *   let actual = nodo;
 *   while (actual.izquierda !== null) {
 *     actual = actual.izquierda;
 *   }
 *   return actual.valor;
 * }
 * 
 * // Método auxiliar para recorrer en orden recursivamente
 * _recorridoEnOrdenRecursivo(nodo, resultado) {
 *   if (nodo !== null) {
 *     this._recorridoEnOrdenRecursivo(nodo.izquierda, resultado);
 *     resultado.push(nodo.valor);
 *     this._recorridoEnOrdenRecursivo(nodo.derecha, resultado);
 *   }
 * }
 * 
 * // Método auxiliar para recorrer en preorden recursivamente
 * _recorridoPreOrdenRecursivo(nodo, resultado) {
 *   if (nodo !== null) {
 *     resultado.push(nodo.valor);
 *     this._recorridoPreOrdenRecursivo(nodo.izquierda, resultado);
 *     this._recorridoPreOrdenRecursivo(nodo.derecha, resultado);
 *   }
 * }
 * 
 * // Método auxiliar para recorrer en postorden recursivamente
 * _recorridoPostOrdenRecursivo(nodo, resultado) {
 *   if (nodo !== null) {
 *     this._recorridoPostOrdenRecursivo(nodo.izquierda, resultado);
 *     this._recorridoPostOrdenRecursivo(nodo.derecha, resultado);
 *     resultado.push(nodo.valor);
 *   }
 * }
 */
