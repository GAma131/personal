# Agent Guidelines for cositas-node

This document provides coding agents with essential information about this repository's structure, conventions, and workflows.

## Repository Overview

Personal learning/practice repository containing:
- **ejercicios-logica/**: JavaScript programming exercises (basic → intermediate → advanced)
- **htmls/**: HTML/CSS email templates for e-commerce
- **pruebas/**: Experimental/test scripts
- **scripts/**: Utility automation scripts
- **teams-keep-active/**: Python keep-alive automation

**Primary Language**: Spanish (comments, documentation, variable names)
**Target Audience**: Spanish-speaking developers/learners

## Build, Lint & Test Commands

### Development Server
```bash
# Live reload server for HTML files (from htmls/ directory)
npx browser-sync start --server --files "*.html,*.css"
```

### Testing
**No testing framework is currently configured.** Test files use console.log() assertions.

```bash
# Run a single exercise
node ejercicios-logica/ejercicios-basicos/01-invertir-string.js

# Run a specific test file
node pruebas/crearArchivo.js
```

### Linting/Formatting
**No ESLint or Prettier configured.** Follow existing code style patterns.

### Package Management
```bash
npm install              # Install dependencies
npm ls                   # List installed packages
```

## Code Style Guidelines

### Language & Conventions
- **Use Spanish** for all comments, documentation, and variable names
- **Target audience**: Spanish-speaking developers
- **Plain JavaScript** (no TypeScript)
- **CommonJS modules** (`require()` not ES6 `import`)

### Naming Conventions

#### Files
- **kebab-case with numbers**: `01-invertir-string.js`, `02-palindromo.js`
- HTML/CSS: `estilos.css`, `detalle-pedido.html`

#### Functions
- **camelCase**: `invertirString()`, `esPalindromo()`, `contarPalabras()`
- Descriptive Spanish names indicating action
- Examples: `generarPrimos()`, `busquedaBinaria()`, `sonAnagramas()`

#### Variables
- **camelCase**: `textoNormalizado`, `palabraInvertida`, `secuencia`
- Descriptive Spanish names
- Use singular for single values, plural for collections

#### Classes
- **PascalCase**: `class Nodo`, `class ArbolBinarioBusqueda`

#### Constants
- **camelCase** (not UPPER_SNAKE_CASE): `const resultado = ...`

#### CSS Classes
- **kebab-case**: `.detalle-pedido-header`, `.producto-precio-col`
- Component-based naming: `.bloque-saludo`, `.bloque-mapa`, `.bloque-detalle-pedido`

### Import/Module Patterns
```javascript
// CommonJS (preferred in this codebase)
const fs = require('fs');
const path = require('path');

// Files are standalone scripts - no exports in exercise files
// No ES6 import/export used
```

### Formatting

#### Indentation
- **Spaces** (not tabs)
- Appears to be **2 spaces** in most files

#### Braces & Semicolons
- **Inconsistent usage** - match the file you're editing
- Some files use braces for single statements, others don't
- Semicolons mostly present but not strict

#### Line Length
- No strict limit enforced
- Keep reasonable (aim for ~100 chars when practical)

### Functions & Control Flow

#### Function Declarations
```javascript
// Standard function declaration (preferred for exercises)
function invertirString(texto) {
  // implementation
}

// Arrow functions for callbacks
palabras.forEach(palabra => {
  frecuencia[palabra] = (frecuencia[palabra] || 0) + 1;
});

// Default parameters
function busquedaBinaria(array, elemento, inicio = 0, fin = array.length - 1) {
  // implementation
}
```

#### Conditionals
```javascript
// Early returns for edge cases
if (palabra1.length !== palabra2.length) {
  return false;
}

// Ternary for simple assignments
return palabra.length > 1 ? palabra : null;
```

#### Loops
```javascript
// Classic for loop (most common)
for (let i = 0; i < n; i++) {
  // code
}

// Reverse iteration
for (let i = texto.length - 1; i >= 0; i--) {
  invertedText += texto[i];
}

// forEach for arrays
palabras.forEach(palabra => {
  // code
});
```

### Modern JavaScript Features

**Use these ES6+ features:**
- Spread operator: `[...array]`
- Destructuring: `[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]`
- Arrow functions: `() => {}`
- Template literals: `` `texto ${variable}` ``
- Object shorthand: `{ totalPalabras, frecuencia }`
- Default parameters: `function fn(param = defaultValue)`

### Error Handling

**Current pattern**: Minimal error handling
```javascript
// Basic validation at function start
if (!texto || texto === "") {
  return "";
}

// Null checks for data structures
if (nodo === null) {
  return false;
}

// No try-catch blocks currently used
// No custom error classes
```

**For new production code**, consider adding:
- Proper try-catch blocks for I/O operations
- Input validation with helpful error messages
- Error logging for debugging

### Types & Validation

**No TypeScript** - Plain JavaScript with dynamic typing
- No JSDoc type annotations currently used
- Implicit type assumptions based on method usage
- Basic runtime validation for edge cases only

### Comments & Documentation

#### Exercise File Structure
```javascript
/**
 * Ejercicio 1: Título del ejercicio
 * 
 * Objetivo: Descripción clara del objetivo
 * 
 * Ejemplo:
 * Input: "ejemplo"
 * Output: resultado
 */

// Tu solución aquí
function nombreFuncion(parametros) {
  // Implementación
}

// Casos de prueba
console.log(nombreFuncion("test1"));
console.log(nombreFuncion("test2"));

/**
 * Pistas:
 * 1. Primera pista
 * 2. Segunda pista
 * 
 * Solución completa:
 * // Código de solución comentado
 */
```

#### Inline Comments
- Use `//` for single-line explanations
- Spanish language exclusively
- Section markers: `// Casos de prueba`, `// Tu solución aquí`

#### HTML/CSS Comments
```html
<!-- HEADER -->
<!-- DIVISOR -->
```

```css
/******** Section Name ********/
```

## HTML/CSS Guidelines (Email Templates)

### Structure
- **Table-based layout** (email client compatibility)
- **Fixed width**: 600px standard
- **Inline styles** via CSS classes
- Template variables: `{{event.nombre}}`, `{{item.titulo}}`

### Accessibility
```html
<table role="presentation">
  <img src="..." alt="Descripción clara">
</table>
```

### CSS Organization
```css
/* Global reset */
* { font-family: 'PetcoCircularCAPWeb', sans-serif; }

/* Component blocks */
.bloque-saludo { }
.bloque-detalle-pedido { }

/* Element classes */
.detalle-pedido-header { }
.producto-nombre { }
.producto-precio { }
```

## File Organization

### Creating New Exercises
1. Use numbered prefix: `##-descriptive-name.js`
2. Place in appropriate difficulty folder
3. Follow standard exercise structure (see Comments section)
4. Include multiple test cases
5. Provide hints and commented solution

### Creating New Templates
1. Use descriptive kebab-case names
2. Place HTML in `htmls/`
3. Reference shared `estilos.css`
4. Store images in `htmls/resources/`
5. Document in `htmls/lista.md`

## Common Patterns

### Array Operations
```javascript
// Splitting and joining
const palabras = frase.split(' ');
const resultado = array.join('');

// Filtering and mapping
const pares = numeros.filter(n => n % 2 === 0);
const duplicados = array.map(x => x * 2);

// Sorting
array.sort((a, b) => a - b);
```

### String Manipulation
```javascript
// Case normalization
const normalizado = texto.toLowerCase().trim();

// Regex replacement
const limpio = texto.replace(/[^a-záéíóúñ]/gi, '');

// Reversing
const invertido = texto.split('').reverse().join('');
```

## Best Practices for This Repo

1. **Maintain Spanish naming** - All identifiers, comments, docs in Spanish
2. **Educational clarity** - Code should be readable for learners
3. **Self-contained exercises** - Each file should run independently
4. **Console output** - Use console.log() for verification
5. **Progressive examples** - Show simple → complex in comments
6. **Multiple test cases** - Cover edge cases, normal cases, errors
7. **Preserve existing style** - Match conventions in the file you're editing

## Notes for Agents

- This is a **learning/practice repository**, not production code
- Prioritize **clarity and educational value** over optimization
- **No external dependencies** for exercise files (use built-in JS only)
- Test files manually via `node filename.js`
- HTML templates target **email clients** (different constraints than web)
- When in doubt, **examine similar existing files** for patterns
