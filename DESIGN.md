# DESIGN.md — Invernadero Encantado

Sistema de diseño y guía de estilo del frontend (`client/`). Léelo antes de crear o modificar cualquier pantalla o componente. Si una spec contradice este archivo, manda la spec y hay que actualizar este archivo en el mismo commit.

## Concepto

Un cuaderno de campo botánico con un toque de magia: ordenado, legible y cálido.

**Palabras clave:** claro · botánico · con un toque de magia.

**Usuarios y contexto:** cuidadores voluntarios que registran plantas y riegos de pie, entre las mesas del invernadero, muchas veces desde el móvil. Deben encontrar y anotar algo en segundos.

## Principios

1. **Lo importante primero:** qué planta es y cuándo se regó.
2. **Un solo botón primario por pantalla.**
3. **Cada estado tiene su mensaje:** cargando, lista vacía, error y éxito.
4. **Cada error dice qué pasó y cómo arreglarlo.**

## Color

Usa solo estas variables. No escribas colores directamente en los componentes.

| Variable | Valor | Nombre | Uso |
|---|---|---|---|
| `--color-primario` | `#2F6B4F` | Verde invernadero | Botón primario, encabezado de tabla, éxito |
| `--color-acento` | `#6A4C9C` | Violeta mágico | Enlaces y foco del teclado. Nunca en botones |
| `--color-texto` | `#1E2B22` | Tinta de musgo | Texto principal |
| `--color-texto-secundario` | `#4E5E53` | Hoja seca | Ayudas, fechas, etiquetas menores |
| `--color-fondo` | `#F3F6F1` | Niebla de invernadero | Fondo de página |
| `--color-superficie` | `#FFFFFF` | Superficie | Tarjetas y formularios |
| `--color-borde` | `#C9D6CA` | — | Bordes decorativos |
| `--color-borde-campo` | `#7A8A7F` | — | Borde de los campos (3.6:1) |
| `--color-exito-fondo` | `#E3F0E7` | — | Fondo de mensajes de éxito |
| `--color-error` | `#B3261E` | Error | Texto y borde de errores |
| `--color-error-fondo` | `#FBECEA` | — | Fondo de mensajes de error |
| `--color-aviso` | `#8A5300` | Ámbar | Reservado para la épica E2 |
| `--color-aviso-fondo` | `#FBF1DF` | — | Reservado para la épica E2 |

Todos los textos cumplen contraste 4.5:1 o más sobre su fondo.

## Tipografía

Fuentes de Google Fonts:

- `--fuente-titulos`: **Bricolage Grotesque** 600.
- `--fuente-texto`: **Atkinson Hyperlegible** 400 y 700.

| Uso | Tamaño | Fuente |
|---|---|---|
| Título de pantalla | 32 px | títulos 600 |
| Título de sección | 24 px | títulos 600 |
| Destacado y botones | 18 px | texto 700 |
| Texto general y campos | 16 px | texto 400 |
| Ayudas y fechas (mínimo) | 14 px | texto 400 |

Interlineado 1.5. Ningún texto por debajo de 14 px.

## Espacio y forma

| Variable | Valor | Uso típico |
|---|---|---|
| `--espacio-1` | 4 px | Entre icono y texto |
| `--espacio-2` | 8 px | Entre etiqueta y campo |
| `--espacio-3` | 12 px | Relleno de botones |
| `--espacio-4` | 16 px | Entre campos de un formulario |
| `--espacio-5` | 24 px | Relleno de tarjetas |
| `--espacio-6` | 32 px | Entre secciones |
| `--espacio-7` | 48 px | Margen de página en escritorio |

- **Radios:** `--radio-control` 8 px (botones y campos); `--radio-tarjeta` 12 px (tarjetas y mensajes).
- **Sin sombras:** se separa con bordes de 1 px y espacio.

## Tokens en CSS

Estas variables van en `client/src/styles/tokens.css` y se importan una sola vez en la entrada de la app:

```css
:root {
  --color-primario: #2f6b4f;
  --color-acento: #6a4c9c;
  --color-texto: #1e2b22;
  --color-texto-secundario: #4e5e53;
  --color-fondo: #f3f6f1;
  --color-superficie: #ffffff;
  --color-borde: #c9d6ca;
  --color-borde-campo: #7a8a7f;
  --color-exito-fondo: #e3f0e7;
  --color-error: #b3261e;
  --color-error-fondo: #fbecea;
  --color-aviso: #8a5300;
  --color-aviso-fondo: #fbf1df;

  --fuente-titulos: "Bricolage Grotesque", system-ui, sans-serif;
  --fuente-texto: "Atkinson Hyperlegible", system-ui, sans-serif;

  --espacio-1: 4px;
  --espacio-2: 8px;
  --espacio-3: 12px;
  --espacio-4: 16px;
  --espacio-5: 24px;
  --espacio-6: 32px;
  --espacio-7: 48px;

  --radio-control: 8px;
  --radio-tarjeta: 12px;
}
```

## Componentes

| Componente | Cómo se ve | Reglas |
|---|---|---|
| **Botón primario** | Fondo `--color-primario`, texto blanco 700 | Altura mínima 44 px. Uno por pantalla |
| **Botón secundario** | Borde de 2 px `--color-primario`, fondo blanco, texto primario | Altura mínima 44 px. Para acciones de apoyo o cancelar |
| **Campo** | Etiqueta visible arriba, borde `--color-borde-campo` | La ayuda va debajo. Con error: borde de 2 px `--color-error` y mensaje debajo con icono |
| **Lista de plantas** | Tabla con encabezado `--color-primario`: nombre, especie, ubicación, riego cada | En el móvil, cada fila se convierte en una tarjeta con el nombre arriba |
| **Historial de riegos** | Lista vertical, el más reciente primero | Fecha en negrita; cantidad y cuidador debajo, en `--color-texto-secundario` |
| **Mensaje de carga** | Solo texto, por ejemplo «Cargando plantas…» | Sin animaciones ni spinners |
| **Mensaje de éxito** | Fondo `--color-exito-fondo`, icono de visto | Nombra lo que se guardó |
| **Mensaje de error** | Fondo `--color-error-fondo`, texto `--color-error`, icono | Dice qué pasó y qué hacer |
| **Lista vacía** | Borde discontinuo y una acción | Siempre ofrece el siguiente paso, por ejemplo «Registrar el primer riego» |

## Datos y textos de la API

- **Campos de la planta:** Nombre, Especie, Ubicación y «Riego cada (días)».
- **Cantidad del riego:** se muestra como «Cantidad (ml)», igual que la guarda la API (`cantidadMl`).
- **Cuidador:** es opcional. Si falta, se muestra «sin cuidador».
- **Fechas:** formato corto en español, por ejemplo «28 oct 2026».
- **Errores de validación de la API:** se muestran junto al campo al que corresponden. Si no se pueden asociar a un campo, van arriba del formulario.

## Tono de voz

Español, tuteo, frases cortas y sin tecnicismos: nada de «400», «ObjectId» ni «payload».

| Así sí | Así no |
|---|---|
| «Escribe cada cuántos días hay que regarla. Mínimo 1.» | «Error 400: intervaloRiegoDias inválido.» |
| «No encontramos esa planta. Puede que se haya borrado.» | «CastError: ObjectId no válido.» |
| «Riego guardado para Helecho Lunar.» | «¡Operación realizada con éxito! 🎉» |

## Accesibilidad

- Contraste de texto de 4.5:1 o más.
- Un `<label>` real en cada campo.
- Los errores llevan icono y texto, nunca solo color.
- Zonas táctiles de 44 px como mínimo.
- Foco visible al navegar con teclado: contorno de 3 px en `--color-acento`.
- Botones con `<button>` y enlaces con `<a href>`, nunca un `div` con `onClick`.

## No hacemos

- Librerías de UI o de CSS (Tailwind, Bootstrap, MUI…).
- Animaciones, sombras ni degradados.
- Modo oscuro.
- Imágenes, ilustraciones ni emojis.
- Iconos de librerías: solo SVG en línea, los mínimos.
