# Product Specification: Isabelle Logic Flow

## Descripción del Producto
Aplicación web educativa para el aprendizaje de Lógica Matemática y el asistente de demostración Isabelle. Permite a los estudiantes navegar por guías teóricas, seleccionar ejercicios organizados por boletines/exámenes y resolver demostraciones paso a paso en una interfaz interactiva.

## Características Principales

### 1. Navegación y Estructura
- **Pantalla de Introducción:** Animación de entrada con selección de módulo (Lógica Matemática).
- **Sistema de Vistas:** Navegación fluida entre Wiki, Selección de Ejercicios y Área de Trabajo (Workspace).
- **Sidebar:** Menú lateral para selección rápida de temas (Boletines 1-11, Parciales, Convocatorias).

### 2. Módulo de Aprendizaje (Wiki)
- Guía interactiva sobre sintaxis de Isabelle (assume, have, show, proof).
- Explicación de reglas lógicas (Implicación, Conjunción, Disyunción, Negación).
- Tarjetas desplegables con ejemplos de código.

### 3. Workspace de Resolución (Core)
- **Visualización de Código:** Renderizado del código de la demostración (Isar).
- **Panel de Explicación:** Muestra la explicación paso a paso de la lógica aplicada.
- **Hipótesis Activas:** Lista dinámica de las hipótesis disponibles en cada paso.
- **Controles de Navegación:** Botones "Anterior" y "Siguiente" para recorrer la demostración.
- **Barra de Progreso:** Indicador visual del avance en el ejercicio actual.

### 4. Modos de Resolución
- **Selección Modal:** Al iniciar un ejercicio, el usuario elige entre:
  - **Modo Declarativa:** Estilo Isar (legible por humanos).
  - **Modo Aplicativa:** Scripts de tácticas (apply scripts).

### 5. Administración (Admin Panel)
- Panel oculto para gestión de contenido.
- **Integración GitHub:** Autenticación y operaciones CRUD (Crear/Editar) sobre los ficheros de datos en el repositorio.
- **Editor Visual:** Interfaz para crear nuevos ejercicios y definir pasos de prueba.
- **Importación IA:** Herramienta para generar ejercicios desde JSON vía prompt a LLMs.

### 6. Aspectos Técnicos y UI
- **Zero Dependencies:** Javascript Vanilla modular (ES6 modules).
- **Temas:** Soporte nativo para Modo Claro / Modo Oscuro con persistencia.
- **Diseño Responsive:** Adaptado a móviles y escritorio (Glassmorphism UI).
