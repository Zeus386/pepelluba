# @PP Yuba Web

Estructura web modular con landing principal en raíz y secciones separadas por carpeta.

## Estructura

- `/index.html` → landing principal con intro `@pepelluba` y menú.
- `/logica/index.html` → módulo completo de Lógica Matemática.
- `/sagema/index.html` → espacio reservado (placeholder).
- `/css/estilo.css` → hoja de estilos base compartida.
- `/js/` → motor y datos del módulo lógico.
- `/logica/js/` → copia local de activos del módulo lógico.

## Navegación

- Botón **Lógica** en landing: `./logica/`
- Botón **Próximamente**: deshabilitado.
- Botón **Sagema**: reservado y deshabilitado.

## Criterios aplicados

- Rutas relativas para despliegue portable.
- Separación por secciones en carpetas independientes.
- Estilo visual coherente usando CSS base común.
- Responsive y estructura semántica orientada a accesibilidad.
