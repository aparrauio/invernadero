# Spec 02 · Frontend de la épica E1

- **Historias:** HU-1.1 · Registrar una planta, HU-1.2 · Registrar un riego, HU-1.4 · Historial de riegos y HU-1.5 · Lista de plantas. Ver [docs/backlog/E1-plantas-y-riegos.md](../backlog/E1-plantas-y-riegos.md).
- **API:** la de la [spec 01](01-plantas-y-riegos.md). Esta spec no cambia el backend.
- **Diseño:** [DESIGN.md](../../DESIGN.md). Si esta spec y DESIGN.md se contradicen, manda esta spec y se actualiza DESIGN.md en el mismo commit.
- **Estado:** implementada.

## 1. Pantallas

La app tiene dos pantallas y pasa de una a otra con estado de React, sin librería de rutas.

### 1.1 «Plantas» (HU-1.5 y HU-1.1)

- **Consume:** `GET /api/plantas` y `POST /api/plantas`.
- **Contenido:** título «Plantas», la lista de plantas y el formulario «Registrar una planta» con los campos Nombre, Especie, Ubicación y «Riego cada (días)».
- **Lista:** tabla con nombre, especie, ubicación y riego cada. En pantallas de menos de 640 px, cada fila se muestra como una tarjeta. El nombre de cada planta es un enlace que abre su «Detalle de planta».

| Estado | Qué se muestra |
|---|---|
| Cargando | «Cargando plantas…», solo texto |
| Vacío | Bloque con borde discontinuo: «Todavía no hay plantas registradas.» y el foco va al formulario con «Registrar la primera planta» |
| Error de conexión | Mensaje de error: «No pudimos cargar las plantas. Revisa que la API esté encendida y vuelve a intentarlo.» |
| Éxito al registrar | Mensaje de éxito: «Planta registrada: <nombre>.» La planta aparece al final de la lista y el formulario se vacía |

### 1.2 «Detalle de planta» (HU-1.4 y HU-1.2)

- **Consume:** `GET /api/plantas/:id/riegos` y `POST /api/riegos`. Los datos de la planta llegan desde la lista; no se piden de nuevo.
- **Contenido:** enlace «Volver a plantas», el nombre de la planta como título, sus datos (especie, ubicación, riego cada), el historial de riegos y el formulario «Registrar un riego» con los campos «Cantidad (ml)», Fecha (opcional, por defecto hoy) y Cuidador (opcional).
- **Historial:** lista vertical, el más reciente primero. Fecha en negrita en formato «28 oct 2026»; debajo, la cantidad en ml y el cuidador, o «sin cuidador».

| Estado | Qué se muestra |
|---|---|
| Cargando | «Cargando riegos…» |
| Vacío | «Esta planta todavía no tiene riegos.» con la acción «Registrar el primer riego» |
| Planta inexistente (404) | «No encontramos esa planta. Puede que se haya borrado.» y el enlace para volver |
| Error de conexión | «No pudimos cargar los riegos. Revisa que la API esté encendida y vuelve a intentarlo.» |
| Éxito al registrar | «Riego guardado para <nombre>.» El riego aparece en el historial en su posición por fecha |

### 1.3 Errores de validación de la API

- Cada elemento de `detalles` se muestra **debajo de su campo**, con icono y en `--color-error`, y el campo pasa a borde de 2 px `--color-error`.
- Si un `campo` no corresponde a ningún campo del formulario (por ejemplo `planta` o `id`), el mensaje va arriba del formulario.
- Se muestran los mensajes de la API tal como llegan; nunca códigos HTTP ni nombres técnicos.

## 2. Criterios de aceptación (se comprueban en el navegador)

- **CA-F.1 · Lista de plantas:** DADO tres plantas registradas, CUANDO el cuidador abre la app, ENTONCES DEBE ver las tres en la tabla con sus cuatro datos, de la más antigua a la más reciente.
- **CA-F.2 · Lista vacía:** DADO un invernadero sin plantas, CUANDO abre la app, ENTONCES DEBE ver el bloque vacío con la acción para registrar la primera planta, y NO DEBE ver un error.
- **CA-F.3 · Registrar planta:** DADO el formulario completo con un intervalo de 3, CUANDO pulsa «Registrar planta», ENTONCES DEBE ver el mensaje de éxito con el nombre y la planta al final de la lista.
- **CA-F.4 · Errores junto a su campo:** DADO el formulario sin especie y con un intervalo de 0, CUANDO pulsa «Registrar planta», ENTONCES DEBE ver cada mensaje debajo de su campo, con icono y en el color de error, y NO DEBE crearse ninguna planta.
- **CA-F.5 · Abrir el detalle:** DADO la lista de plantas, CUANDO pulsa el nombre de una planta, ENTONCES DEBE ver su detalle con su historial, el más reciente primero.
- **CA-F.6 · Historial vacío:** DADO una planta sin riegos, CUANDO abre su detalle, ENTONCES DEBE ver «Esta planta todavía no tiene riegos.» con la acción para registrar el primero.
- **CA-F.7 · Registrar riego:** DADO el formulario con 500 ml y sin fecha, CUANDO pulsa «Registrar riego», ENTONCES DEBE ver «Riego guardado para <nombre>.» y el riego de hoy al inicio del historial, con «sin cuidador» si no lo indicó.
- **CA-F.8 · Riego no válido:** DADO una cantidad de 0 o una fecha de mañana, CUANDO pulsa «Registrar riego», ENTONCES DEBE ver el mensaje de la API debajo del campo correspondiente, y el historial NO DEBE cambiar.
- **CA-F.9 · API apagada:** DADO la API detenida, CUANDO abre la app, ENTONCES DEBE ver el mensaje de error de conexión, sin tecnicismos.
- **CA-F.10 · Diseño:** todas las pantallas DEBEN usar solo variables de `tokens.css` para colores, espacios, radios y fuentes; los botones y enlaces de acción DEBEN medir al menos 44 px de alto; cada campo DEBE tener un `<label>` visible; el foco del teclado DEBE verse como un contorno de 3 px `--color-acento`; y DEBE haber un solo botón primario por pantalla.
- **CA-F.11 · Móvil:** a 390 px de ancho, la lista DEBE verse como tarjetas y ninguna pantalla DEBE tener desplazamiento horizontal.

## 3. Archivos

| Archivo | Qué contiene |
|---|---|
| `client/vite.config.js` | Proxy de `/api` hacia `http://localhost:3000` |
| `client/index.html` | Fuentes de Google Fonts e idioma `es` |
| `client/src/main.jsx` | Entrada: importa `tokens.css` y `app.css` |
| `client/src/styles/tokens.css` | Variables de DESIGN.md |
| `client/src/styles/app.css` | Estilos de la app, solo con variables |
| `client/src/api.js` | Llamadas a la API y normalización de errores |
| `client/src/formato.js` | Formato de fechas («28 oct 2026») |
| `client/src/App.jsx` | Navegación entre las dos pantallas |
| `client/src/pantallas/Plantas.jsx` y `DetallePlanta.jsx` | Las dos pantallas |
| `client/src/componentes/` | `Campo.jsx`, `Mensaje.jsx`, `ListaVacia.jsx` e iconos SVG en línea |

## 4. No-alcance

- NO DEBE usarse ninguna librería de UI, de CSS ni de rutas.
- NO DEBE escribirse ningún color, espacio o fuente fuera de los tokens.
- Sin tests automáticos del frontend en este sprint: se verifica en el navegador y con una revisión de diseño contra DESIGN.md.
- Sin editar ni borrar plantas o riegos, ni la consulta de plantas sedientas (épica E2).
