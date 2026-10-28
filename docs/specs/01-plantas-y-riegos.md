# Spec 01 · Plantas y riegos

- **Historias:** HU-1.1 · Registrar una planta, y HU-1.2 · Registrar un riego (que absorbe HU-1.3). Ver [docs/backlog/E1-plantas-y-riegos.md](../backlog/E1-plantas-y-riegos.md).
- **Sprint:** 2026-10-28.
- **Tickets:** T-01 a T-07.
- **Estado:** borrador. Antes de implementar hay que confirmar los puntos de la sección 0.

## 0. Diferencias con el backlog y el PRD

Esta spec sigue el encargo técnico recibido. En varios puntos ese encargo cambia o amplía lo que dicen el backlog y el PRD. Si algún punto no se confirma, hay que corregir esta spec. Si se confirma, hay que actualizar el backlog y el PRD.

| # | En esta spec | En el backlog o el PRD | Cómo se ha resuelto aquí |
|---|---|---|---|
| X1 | La cantidad de agua se guarda como `cantidadMl`. | D4 y regla 6.10: litros con decimales. | `cantidadMl` es un número entero de mililitros, mayor o igual que 1. Equivale a litros con hasta 3 decimales: 0,5 L = 500 ml. Así se resuelve también la precisión. Hay que confirmar si el cliente acepta indicar la cantidad en ml. |
| X2 | El riego tiene un campo `cuidador`. | §7 [SUPUESTO]: un riego se registra sin responsable. DoD de T-06: no se pide responsable. | `cuidador` es un texto **opcional**. No rompe el supuesto, pero permite guardarlo. Hay que confirmar si es obligatorio y actualizar el §7. |
| X3 | La planta tiene `enReposo` (por defecto `false`). | El PRD no define el reposo (ver [epicas.md](../backlog/epicas.md), E2). | Solo se guarda. En este sprint no afecta a ninguna regla ni al cálculo de E2. |
| X4 | La planta tiene `cuidadosEspeciales[]` con `tipo` y `nota`. | No aparece en el PRD ni en el backlog. | Es opcional. Dentro de cada elemento, `tipo` es obligatorio y `nota` opcional. No afecta a ninguna regla. |
| X5 | `GET /api/plantas` lista todas las plantas. | HU-1.5 está fuera de alcance, pendiente de confirmar. | Se incluye. Resuelve el problema de que el cuidador no conozca el id de una planta. Hay que pasar HU-1.5 al sprint. |
| X6 | `GET /api/plantas/:id/riegos` devuelve el historial de riegos. | HU-1.4 está por refinar y no entra en el sprint. | Se incluye con un comportamiento mínimo (sección 2.4). HU-1.4 sigue sin criterios de aceptación. |
| X7 | Un riego se registra con `POST /api/riegos` e indica la planta en el cuerpo. | T-06 y AGENTS.md: rutas de riegos bajo `/api/plantas/:id/riegos`. | Se sigue el encargo. Solo el historial queda bajo `/api/plantas/:id/riegos`. |
| X8 | La fecha de un riego es, por defecto, el momento actual. | Caso borde abierto: «riego sin fecha». | Queda resuelto: si no se indica la fecha, se toma la de ahora. |
| X9 | La verificación es con tests sin base de datos o con curl. | T-04 y T-07 piden tests de aceptación automáticos contra la API con una base de datos aislada. | Se sigue el encargo (sección 4). Hay que actualizar la DoD de T-01, T-04 y T-07. |

## 1. Modelos

Archivos: `src/models/planta.js` y `src/models/riego.js`, con Mongoose 8 y CommonJS.

### 1.1 Planta

| Campo | Tipo | Obligatorio | Por defecto | Validación | Regla |
|---|---|---|---|---|---|
| `nombre` | String | Sí | — | Se recortan los espacios (`trim`). Un texto con solo espacios cuenta como vacío. | 6.8 |
| `especie` | String | Sí | — | Igual que `nombre`. | 6.8 |
| `ubicacion` | String | Sí | — | Igual que `nombre`. | 6.8 |
| `intervaloRiegoDias` | Number | Sí | — | Número entero (`Number.isInteger`) y como mínimo 1. | 6.1, 6.8 |
| `enReposo` | Boolean | No | `false` | — | X3 |
| `cuidadosEspeciales` | Array de subdocumentos | No | `[]` | Cada elemento tiene `tipo` (String, obligatorio, con `trim`) y `nota` (String, opcional, con `trim`). | X4 |
| `createdAt` | Date | Automático | Momento del registro | Lo gestiona Mongoose con `timestamps: { createdAt: true, updatedAt: false }`. El cliente no lo puede fijar. | 6.2 |

Notas:
- `createdAt` es la **fecha de registro** de la planta a efectos de las reglas 6.2 y 6.4.
- No se impone que el nombre sea único. Los nombres repetidos siguen siendo un caso borde abierto.
- Si `intervaloRiegoDias` llega como texto, Mongoose intenta convertirlo: `"3"` se acepta como 3, y `"tres"` o `"3,0"` dan un error de conversión que se responde con un 400.

### 1.2 Riego

| Campo | Tipo | Obligatorio | Por defecto | Validación | Regla |
|---|---|---|---|---|---|
| `planta` | ObjectId, referencia a `Planta` | Sí | — | Debe tener formato de ObjectId. Que la planta exista se comprueba en la ruta, no en el modelo. | 6.9 |
| `fecha` | Date | No | `Date.now` | Su día de calendario en hora local NO DEBE ser posterior al día de hoy. Que no sea anterior al registro de la planta se comprueba en la ruta. | 6.4, 6.5, X8 |
| `cantidadMl` | Number | Sí | — | Número entero y como mínimo 1. | 6.10, X1 |
| `cuidador` | String | No | — | Se recortan los espacios (`trim`). | X2 |

### 1.3 Días de calendario y zona horaria

- La comparación de fechas está en `src/dominio/fechas.js`, como funciones puras que reciben «hoy» como parámetro para poder probarlas:
  - `diaCalendario(fecha)`: devuelve el día de calendario (año, mes y día) de una fecha en hora local.
  - `esFechaRiegoValida(fechaRiego, fechaRegistroPlanta, ahora)`: devuelve `true` si el día del riego está entre el día de registro de la planta y el día de hoy, ambos incluidos.
- Se ignora la hora en las comparaciones (regla 6.5). Por eso un riego del mismo día del registro se acepta (CA-1.2.2).
- «Hora local» es la del proceso de Node. La zona horaria del invernadero se configura con la variable de entorno `TZ` (p. ej. `TZ=Europe/Madrid`), según el supuesto del §7.

## 2. Endpoints

Todos están bajo `/api` y reciben y devuelven JSON.

### 2.0 Formato de los errores

- **400 · Error de validación o datos con formato incorrecto:**
  ```json
  {
    "error": "Datos no válidos",
    "detalles": [
      { "campo": "especie", "mensaje": "La especie es obligatoria" },
      { "campo": "ubicacion", "mensaje": "La ubicación es obligatoria" }
    ]
  }
  ```
  `detalles` contiene **todos** los campos que fallan, no solo el primero (CA-1.1.6).
- **404 · El recurso no existe:**
  ```json
  { "error": "Planta no encontrada" }
  ```
- **500 · Error inesperado:** `{ "error": "Error interno" }`, sin detalles internos. No cuenta como error de validación.

Un id con formato que no es ObjectId responde **400**. Un id con formato válido que no corresponde a ninguna planta responde **404**.

### 2.1 `POST /api/plantas` — Registrar una planta (HU-1.1)

**Cuerpo:**
```json
{
  "nombre": "Mandrágora",
  "especie": "Mandragora officinarum",
  "ubicacion": "Mesa 2",
  "intervaloRiegoDias": 3,
  "enReposo": false,
  "cuidadosEspeciales": [{ "tipo": "luz", "nota": "Sombra parcial" }]
}
```
`enReposo` y `cuidadosEspeciales` son opcionales. Se ignora cualquier `createdAt` que llegue en el cuerpo.

**Respuesta 201:** la planta creada.
```json
{
  "_id": "6720f1a2b3c4d5e6f7a8b9c0",
  "nombre": "Mandrágora",
  "especie": "Mandragora officinarum",
  "ubicacion": "Mesa 2",
  "intervaloRiegoDias": 3,
  "enReposo": false,
  "cuidadosEspeciales": [{ "_id": "…", "tipo": "luz", "nota": "Sombra parcial" }],
  "createdAt": "2026-10-28T09:15:00.000Z"
}
```

**Errores:**
- **400:** falta nombre, especie, ubicación o intervalo; el intervalo no es entero o es menor que 1; un elemento de `cuidadosEspeciales` no tiene `tipo`; o un campo no se puede convertir a su tipo.

### 2.2 `GET /api/plantas` — Listar las plantas (X5)

**Cuerpo:** ninguno.

**Respuesta 200:** un array con todas las plantas, en el mismo formato que en 2.1 y ordenadas por `createdAt` ascendente. Si no hay plantas, devuelve `[]`. No hay paginación ni filtros en el MVP.

**Errores:** ninguno específico (solo un 500 si hay un error inesperado).

### 2.3 `POST /api/riegos` — Registrar un riego (HU-1.2)

**Cuerpo:**
```json
{
  "planta": "6720f1a2b3c4d5e6f7a8b9c0",
  "fecha": "2026-10-25",
  "cantidadMl": 500,
  "cuidador": "Ada"
}
```
`fecha` y `cuidador` son opcionales. Si falta `fecha`, se toma el momento actual.

**Respuesta 201:** el riego creado.
```json
{
  "_id": "6720f2c3d4e5f6a7b8c9d0e1",
  "planta": "6720f1a2b3c4d5e6f7a8b9c0",
  "fecha": "2026-10-24T22:00:00.000Z",
  "cantidadMl": 500,
  "cuidador": "Ada"
}
```
En el ejemplo, `TZ=Europe/Madrid`: la medianoche local del 25 de octubre son las 22:00 UTC del día 24.

**Fechas sin hora:** si `fecha` llega solo con el día (`AAAA-MM-DD`), DEBE interpretarse como la medianoche de ese día en **hora local**. JavaScript interpreta `new Date("2026-10-25")` como medianoche UTC, que en zonas con desfase negativo cae en el día anterior. Esta conversión se hace en `src/dominio/fechas.js` y se cubre con un test de dominio.

**Errores:**
- **400:** falta `planta` o `cantidadMl`; `planta` no tiene formato de ObjectId; `cantidadMl` no es entero o es menor que 1; `fecha` no es una fecha válida; la fecha es de un día posterior a hoy; o la fecha es de un día anterior al registro de la planta.
- **404:** la planta indicada no existe. No se registra ningún riego.

**Orden de las comprobaciones:**
1. Validar el formato del cuerpo con el modelo. Si falla, responder 400.
2. Buscar la planta. Si no existe, responder 404.
3. Comprobar con `esFechaRiegoValida` que la fecha no es anterior al registro de la planta. Si falla, responder 400.
4. Guardar el riego.

### 2.4 `GET /api/plantas/:id/riegos` — Historial de riegos de una planta (X6)

**Cuerpo:** ninguno.

**Respuesta 200:** un array con los riegos de la planta, ordenados por `fecha` descendente (el más reciente primero). Usa el mismo formato que en 2.3. Si la planta existe y no tiene riegos, devuelve `[]`.

**Errores:**
- **400:** `:id` no tiene formato de ObjectId.
- **404:** la planta no existe.

## 3. Criterios de aceptación

Son los del backlog, con su mismo id, reescritos como requisitos. Donde el backlog habla de litros, aquí se usan mililitros (X1).

### 3.1 HU-1.1 · Registrar una planta

- **CA-1.1.1 · Registro válido:** al registrar una planta con nombre, especie, ubicación y un intervalo de 3 días, el sistema DEBE crearla con esos datos y con la fecha actual como `createdAt`, y DEBE devolver todos esos datos en la respuesta.
- **CA-1.1.2 · Intervalo mínimo:** el sistema DEBE aceptar un intervalo de 1 día.
- **CA-1.1.3 · Intervalo cero o negativo:** el sistema NO DEBE crear una planta con un intervalo de 0 o negativo, y DEBE indicar que el intervalo debe ser de al menos 1 día.
- **CA-1.1.4 · Intervalo no entero:** el sistema NO DEBE crear una planta con un intervalo de 2,5 días, y DEBE indicar que el intervalo debe ser un número entero.
- **CA-1.1.5 · Falta un dato obligatorio:** el sistema NO DEBE crear una planta si falta el nombre, la especie, la ubicación o el intervalo, y DEBE indicar qué dato falta. Se cumple para cada uno de los cuatro por separado.
- **CA-1.1.6 · Faltan varios datos obligatorios:** si faltan la especie y la ubicación, el sistema NO DEBE crear la planta y DEBE indicar los dos datos que faltan.

### 3.2 HU-1.2 · Registrar un riego

- **CA-1.2.1 · Riego de hoy:** al registrar un riego de hoy con 2000 ml de una planta registrada hace 5 días, el sistema DEBE guardarlo con la fecha de hoy y esa cantidad, y DEBE devolverlo en la respuesta.
- **CA-1.2.2 · Riego el mismo día del registro:** el sistema DEBE aceptar un riego de hoy de una planta registrada hoy.
- **CA-1.2.3 · La hora no cuenta:** el sistema DEBE tratar un riego hecho a las 23:59 hora local como un riego de ese día, y la hora NO DEBE afectar a ninguna comparación de fechas.
- **CA-1.2.4 · Fecha futura:** el sistema NO DEBE registrar un riego con la fecha de mañana, y DEBE indicar que un riego no puede tener fecha futura.
- **CA-1.2.5 · Planta inexistente:** el sistema NO DEBE registrar un riego de una planta que no existe, y DEBE indicar que la planta no existe.
- **CA-1.2.6 · Cantidad cero o negativa:** el sistema NO DEBE registrar un riego con 0 ml o con una cantidad negativa, y DEBE indicar que la cantidad debe ser mayor que 0.
- **CA-1.2.7 · Cantidad equivalente a litros con decimales:** el sistema DEBE aceptar un riego de 500 ml (0,5 L) y guardarlo con 500 ml.
- **CA-1.2.8 · Riego olvidado con fecha pasada:** el sistema DEBE aceptar un riego con la fecha de hace 3 días de una planta registrada hace 10 días, y DEBE guardarlo con esa fecha.
- **CA-1.2.9 · Fecha anterior al registro:** el sistema NO DEBE registrar un riego con la fecha de hace 11 días de una planta registrada hace 10 días, y DEBE indicar que un riego no puede ser anterior al registro de la planta.

En todos los criterios con NO DEBE, el sistema tampoco DEBE crear la planta ni registrar el riego.

## 4. Verificación de los criterios

Tipos de verificación:
- **Modelo:** test automático con `node --test`, sin base de datos. Construye el documento con `new Modelo(datos)` y comprueba el resultado de `validateSync()`.
- **Dominio:** test automático con `node --test`, sin base de datos, de las funciones puras de `src/dominio/fechas.js`. Se usa cuando el criterio depende de la fecha de registro de una planta o de la hora actual, que no se pueden fijar desde la API ni desde el modelo. Es un tipo que no estaba en el encargo; se añade por ese motivo.
- **curl:** prueba manual contra el servidor arrancado con `npm run dev`.

| Criterio | Verificación | Qué se comprueba |
|---|---|---|
| CA-1.1.1 | curl | `POST /api/plantas` con los cuatro datos responde 201 con esos datos y un `createdAt` de hoy. |
| CA-1.1.2 | Modelo | Con `intervaloRiegoDias: 1`, `validateSync()` no da errores. |
| CA-1.1.3 | Modelo | Con `0` y con `-2`, hay un error en `intervaloRiegoDias`. |
| CA-1.1.4 | Modelo | Con `2.5`, hay un error en `intervaloRiegoDias`. |
| CA-1.1.5 | Modelo | Quitando cada uno de los cuatro campos por turno, hay un error justo en ese campo. También con `"   "` en los campos de texto. |
| CA-1.1.6 | Modelo | Sin `especie` ni `ubicacion`, hay errores en los dos campos. |
| CA-1.2.1 | curl | `POST /api/riegos` sin `fecha` y con `cantidadMl: 2000` responde 201 con la fecha de hoy. |
| CA-1.2.2 | curl | Crear una planta y registrarle un riego de inmediato responde 201. |
| CA-1.2.3 | Dominio | `diaCalendario` y `esFechaRiegoValida` tratan las 23:59 y las 00:00 como días distintos, y las 00:01 y las 23:59 del mismo día como el mismo día. |
| CA-1.2.4 | Modelo | Con `fecha` de mañana, hay un error en `fecha`. |
| CA-1.2.5 | curl | `POST /api/riegos` con un ObjectId válido que no existe responde 404, y `GET /api/plantas/:id/riegos` sigue igual. |
| CA-1.2.6 | Modelo | Con `cantidadMl: 0` y con `-1`, hay un error en `cantidadMl`. |
| CA-1.2.7 | Modelo | Con `cantidadMl: 500`, `validateSync()` no da errores. |
| CA-1.2.8 | Dominio | `esFechaRiegoValida(hace 3 días, hace 10 días, hoy)` devuelve `true`. |
| CA-1.2.9 | Dominio + curl | `esFechaRiegoValida(hace 11 días, hace 10 días, hoy)` devuelve `false`. Con curl, un riego de ayer de una planta creada hoy responde 400. |

La parte «no se crea nada» de los criterios con NO DEBE se comprueba por curl: tras el rechazo, `GET /api/plantas` o `GET /api/plantas/:id/riegos` no muestran ningún elemento nuevo.

`GET /api/plantas` (X5) y `GET /api/plantas/:id/riegos` (X6) no tienen criterios de aceptación. Se comprueban por curl junto con los criterios anteriores.

### 4.1 Comandos curl de referencia

```bash
# Registrar una planta (CA-1.1.1)
curl -i -X POST http://localhost:3000/api/plantas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mandrágora","especie":"Mandragora officinarum","ubicacion":"Mesa 2","intervaloRiegoDias":3}'

# Listar las plantas
curl -i http://localhost:3000/api/plantas

# Registrar un riego de hoy (CA-1.2.1, CA-1.2.2)
curl -i -X POST http://localhost:3000/api/riegos \
  -H "Content-Type: application/json" \
  -d '{"planta":"<id>","cantidadMl":2000}'

# Riego de una planta inexistente (CA-1.2.5): debe responder 404
curl -i -X POST http://localhost:3000/api/riegos \
  -H "Content-Type: application/json" \
  -d '{"planta":"000000000000000000000000","cantidadMl":500}'

# Historial de riegos de una planta
curl -i http://localhost:3000/api/plantas/<id>/riegos
```

El puerto es el de la variable de entorno `PORT`. En los ejemplos se usa 3000.

## 5. Archivos por ticket

| Ticket | Crea | Modifica |
|---|---|---|
| T-01 · Proyecto base | `package.json`, `.gitignore`, `.prettierrc`, `.env.example` (solo nombres de variables: `MONGODB_URI`, `PORT`, `TZ`, sin valores reales), `src/app.js`, `src/index.js` | — |
| T-02 · Planta y sus validaciones | `src/models/planta.js` | — |
| T-03 · API de plantas | `src/routes/plantas.js` (`POST` y `GET /api/plantas`) | `src/app.js` (montar el router y el manejador de errores 400/404/500) |
| T-04 · Verificación de HU-1.1 | `test/models/planta.test.js` | — |
| T-05 · Riego y sus validaciones | `src/models/riego.js`, `src/dominio/fechas.js`, `test/dominio/fechas.test.js` | — |
| T-06 · API de riegos | `src/routes/riegos.js` (`POST /api/riegos`) | `src/routes/plantas.js` (añadir `GET /api/plantas/:id/riegos`), `src/app.js` (montar el router de riegos) |
| T-07 · Verificación de HU-1.2 | `test/models/riego.test.js` | — |

Las pruebas con curl de T-04 y T-07 no crean archivos: se ejecutan con los comandos de la sección 4.1.
