---
name: wireframes
description: Genera wireframes de baja fidelidad en SVG, en escala de grises, a partir de los criterios de aceptación de una historia de usuario. Úsala después de escribir los criterios y antes de la spec. Recibe el id de la historia, por ejemplo /wireframes HU-1.8.
disable-model-invocation: true
---

# Wireframes desde los criterios

Historia: $ARGUMENTS

## Antes de dibujar

1. Lee la historia y sus criterios de aceptación en `docs/backlog/`. Si no tiene criterios DADO / CUANDO / ENTONCES, detente y pide escribirlos primero: sin criterios no hay wireframes.
2. Lee `DESIGN.md` solo para conocer los componentes y los textos (etiquetas, mensajes, tono). **No uses sus colores ni sus fuentes.**
3. Haz una lista de los **estados de pantalla** que piden los criterios (por ejemplo: lista, panel abierto, guardando, error de validación, error de conexión, éxito). Muéstrala con el criterio que origina cada estado y espera a que el usuario la confirme.

## Al dibujar

4. Crea un SVG por estado en `docs/specs/<número>-<slug>/wireframes/`, con nombre `<estado>-movil.svg`. Para los estados principales (la pantalla base y el estado que la historia agrega), crea también `<estado>-escritorio.svg`. Usa el número de la próxima spec y un slug corto.
5. Convenciones obligatorias:
   - **Tamaño:** `viewBox` de 390 de ancho en móvil y 1280 en escritorio; el alto, el que haga falta.
   - **Solo grises:** `#FFFFFF`, `#F2F2F2`, `#D9D9D9`, `#9E9E9E`, `#616161` y `#212121`. Nada de color, sombras, degradados, imágenes ni iconos detallados.
   - **Texto:** `font-family="system-ui, sans-serif"`, tamaños 14, 16, 20 y 24. Etiquetas, botones y mensajes con el texto real que dicen los criterios o DESIGN.md; los textos largos de relleno, como barras grises.
   - **Componentes como cajas:** botón primario con relleno `#616161` y texto blanco; botón secundario con borde de 2 px; campo como rectángulo con borde y su etiqueta encima.
   - **Anotaciones:** en cada SVG, una banda superior gris claro con el nombre del estado y los ids de los criterios que cubre (por ejemplo «Panel abierto · CA-1.8.2, CA-1.8.7»).
6. Crea `docs/specs/<número>-<slug>/wireframes/README.md` con una tabla: estado, archivos y criterios que cubre, y una sección «Decisiones» con lo que el wireframe decide y los criterios no (por ejemplo, dónde va la acción en cada fila).

## Al terminar

7. Comprueba que cada criterio aparece en al menos un wireframe. Si alguno no se puede dibujar, dilo.
8. No escribas código ni la spec. Termina con la tabla del README y pide al usuario que revise y apruebe los wireframes.
