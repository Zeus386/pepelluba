# Instrucciones de Administración (Backend) - PepeWeb

Para añadir nuevos temas o ejercicios a tu aplicación, no tienes que modificar código complejo. Solo necesitas alimentar archivos de boletín/parciales como `js/data/BOLETIN1.js`, `js/data/PRIMER_PARCIAL.js`, `js/data/SEGUNDO_PARCIAL.js` o `js/data/CONVOCATORIA.js` usando un modelo de Inteligencia Artificial (ChatGPT, Claude, Gemini, etc).

## 1. El Prompt (Copia y pega esto en la IA)

Copia el siguiente texto exacto y envíaselo a la IA, adjuntando la demostración de Isabelle que quieras añadir.

> Actúa como un profesor experto en Lógica Matemática y en el asistente de demostración Isabelle/HOL. 
> 
> Tengo una web hiperminimalista interactiva que reproduce demostraciones de Isabelle mediante un motor de pasos en JavaScript. Necesito que conviertas la siguiente demostración matemática (que te pasaré al final de este prompt) **exactamente en este formato JSON**, listo para copiar y pegar en los archivos de mi aplicación.
> 
> **ESTRUCTURA REQUERIDA DEL JSON:**
> ```javascript
> "exe99": {
>     "title": "Nombre del Ejercicio",
>     "name": "id_del_ejercicio",
>     "defaultMethod": "Deducción Natural",
>     "steps": [
>         {
>             "code": "lemma mi_lema:\nassumes \"hipotesis\"\nshows \"conclusion\"",
>             "explanation": "Explicación detallada, mínima y elegante de este estado inicial.",
>             "activeHyp": ["hipotesis_activa", "otra_hipotesis"],
>             "highlights": ["lemma", "assumes", "shows"]
>         },
>         {
>             "code": "proof -\n  have \"algo\"",
>             "explanation": "Explicación lógica...",
>             "activeHyp": ["hipotesis_activa"],
>             "highlights": ["proof", "have"]
>         }
>     ]
> }
> ```
> 
> **REGLAS ESTRICTAS QUE DEBES CUMPLIR:**
> 1. Devuelve ÚNICAMENTE el código JavaScript de este objeto, sin formato markdown extra "```javascript" si es posible, sin texto de relleno. Solo el código listo para integrar.
> 2. Cada paso (`code`) lógico debe tener su correspondiente bloque de explicación (`explanation`).
> 3. La explicación debe ser hiperminimalista, concisa pero extremadamente rigurosa, para estudiantes de Universidad de Sevilla de Matemáticas.
> 4. `activeHyp` es un array con las hipótesis o suposiciones actuales disponibles en la prueba en ESE paso específico.
> 5. Escapa debidamente las comillas y saltos de línea para evitar romper la sintaxis de JavaScript (`\n`, `\"`).
> 
> Aquí tienes la demostración matemática a convertir:
> **[ PEGA AQUÍ EL CÓDIGO DE ISABELLE O LA DEMOSTRACIÓN A INTEGRAR ]**

## 2. Cómo actualizar la web

1. Copia la respuesta que te dé la IA.
2. Abre el archivo correspondiente (`js/data/BOLETINX.js`, `js/data/PRIMER_PARCIAL.js`, `js/data/SEGUNDO_PARCIAL.js` o `js/data/CONVOCATORIA.js`) con el Bloc de Notas o VSCode.
3. Pega el bloque de código entre los demás ejercicios, asegurándote de separarlos por comas.
4. Nombra los ejercicios como `"exe01"`, `"exe02"`, etc.
5. ¡Guarda el archivo y recarga tu página web para ver el ejercicio funcionando al instante!
