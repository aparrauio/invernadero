# Invernadero Encantado

## Proyecto
API REST para registrar las plantas mágicas de un invernadero y sus riegos.

## Stack
- Node.js 20+, Express 5, Mongoose 8
- CommonJS (`require` / `module.exports`)
- Tests con `node --test`
- Formato con Prettier

## Estructura prevista
- `src/app.js` — configuración de la app Express (sin `listen`)
- `src/index.js` — punto de entrada: conexión a MongoDB y arranque del servidor
- `src/models/` — modelos de Mongoose
- `src/routes/` — routers de Express
- `src/dominio/` — funciones puras de lógica de negocio
- `test/` — tests
- `docs/prd/` — documentos de requisitos de producto
- `docs/specs/` — especificaciones de cada funcionalidad

## Comandos
- `npm run dev` — arranca el servidor en modo desarrollo
- `npm test` — ejecuta la batería de tests

## Convenciones
- Nombres del dominio en español (`planta`, `riego`, `invernadero`).
- camelCase para variables y funciones.
- Rutas REST bajo `/api` (p. ej. `/api/plantas`, `/api/plantas/:id/riegos`).

## Reglas
- Nunca leer ni modificar `.env`.
- Nunca escribir credenciales en el código; usar variables de entorno.
- Ninguna funcionalidad se implementa sin una spec en `docs/specs/`.
- Ejecutar `npm test` antes de dar una tarea por terminada.

## Frontend
- El frontend vive en `client/` (React + Vite) y llama a la API con rutas relativas `/api/...` a través del proxy de Vite.
- Antes de crear o modificar cualquier archivo de `client/`, lee `DESIGN.md` (sistema de diseño) y la spec correspondiente.
- CSS plano, sin librerías de UI ni de CSS.
- Colores, espacios, radios y fuentes solo desde las variables de `client/src/styles/tokens.css`.
- Textos en español, con el tono de `DESIGN.md`.
- Si la spec tiene wireframes (sección «Pantallas»), son la referencia de estructura: qué hay en cada pantalla, en qué orden y con qué textos. Colores, tipografía y componentes salen de `DESIGN.md`; el comportamiento, de los criterios de la spec.
- Arranque: `cd client && npm run dev` (http://localhost:5173), con la API corriendo en otra terminal.

## Flujo de trabajo
- Las tareas viven en el tablero de Trello **Invernadero Encantado**: Backlog → Por hacer → En curso → En revisión → Hecho.
- Cada spec se implementa en su propia rama `spec/<número>-<slug>`, creada desde `main`. Nunca se hace commit directo en `main`.
- Una tarjeta del Backlog sin spec no se implementa.
- No hagas push ni abras PR a mano: al terminar una spec, el hook de revisión adversarial la revisa y, si aprueba, abre el PR.
- Solo una persona mueve una tarjeta a «Hecho», después de revisar el PR.
