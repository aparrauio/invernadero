# Auditoría · Spec 01 · Plantas y riegos

- **Spec auditada:** [docs/specs/01-plantas-y-riegos.md](specs/01-plantas-y-riegos.md) (en estado borrador).
- **Código auditado:** commit `a4bd52f`.
- **Fecha:** 2026-10-28.
- **`npm test`:** 42 tests, 42 pasan, 0 fallan.
- **Pruebas con curl:** contra el servidor de desarrollo en `http://localhost:3000`, el 2026-10-28 hacia las 16:21 UTC.
- **Alcance de la auditoría:** solo se reporta; no se ha corregido nada.

## Resumen

| Resultado | Criterios de aceptación | Otros requisitos de la spec |
|---|---|---|
| Cumple | 15 de 15 | 9 |
| No cumple | 0 | 1 |
| Sin verificar | — | 5 |

Todos los criterios de aceptación cumplen con la verificación que les asigna la spec, salvo la parte con curl de CA-1.2.9, que no se ha podido probar (ver la tabla).

## 1. Criterios de aceptación

Los nombres de los tests son los que muestra `npm test`. Los ids de las pruebas con curl son los de la planta `6ae220fe1049f800e58059eb` creada durante la verificación.

| Criterio | Cómo se verificó | Resultado | Evidencia |
|---|---|---|---|
| CA-1.1.1 · Registro válido | curl + test del modelo | Cumple | curl: `POST /api/plantas` con los cuatro datos → **201**, con los datos enviados, `enReposo: false`, `cuidadosEspeciales: []` y `createdAt: 2026-10-28T16:21:18.413Z`. Test: «CA-1.1.1: una planta con los cuatro datos obligatorios es válida». |
| CA-1.1.2 · Intervalo mínimo | Test del modelo | Cumple | «CA-1.1.2: acepta un intervalo de 1 día». |
| CA-1.1.3 · Intervalo cero o negativo | Test del modelo + curl | Cumple | Tests: «rechaza un intervalo de 0 días» y «de -2 días». curl: `intervaloRiegoDias: 0` → **400**, «El intervalo de riego debe ser de al menos 1 día», y `GET /api/plantas` no muestra la planta. |
| CA-1.1.4 · Intervalo no entero | Test del modelo | Cumple | «CA-1.1.4: rechaza un intervalo no entero» (2,5). |
| CA-1.1.5 · Falta un dato obligatorio | Test del modelo | Cumple | Un test por cada uno de los cuatro datos («rechaza una planta sin nombre», «sin especie», etc.), y otros tres con textos de solo espacios. |
| CA-1.1.6 · Faltan varios datos | Test del modelo | Cumple | «CA-1.1.6: informa de todos los datos que faltan»: errores en `especie` y `ubicacion`. |
| CA-1.2.1 · Riego de hoy | curl + test del modelo | Cumple | curl: `POST /api/riegos` sin fecha y con `cantidadMl: 2000` → **201**, `fecha: 2026-10-28T16:21:19.038Z`. Test: «CA-1.2.1: un riego sin fecha es válido y toma la fecha de hoy». |
| CA-1.2.2 · Riego el mismo día del registro | curl + test de dominio | Cumple | curl: el riego anterior es de una planta creada 0,6 s antes → **201**. Test: «CA-1.2.2: acepta un riego del mismo día del registro, aunque sea a una hora anterior». |
| CA-1.2.3 · La hora no cuenta | Test de dominio | Cumple | «las 00:01 y las 23:59 son el mismo día», «las 23:59 y las 00:00 siguientes son días distintos», «hoy a las 23:59 no es futura». |
| CA-1.2.4 · Fecha futura | Test del modelo + test de dominio + curl | Cumple | curl: `fecha: "2026-10-29"` → **400**, «Un riego no puede tener fecha futura». Tests: «CA-1.2.4: rechaza un riego con la fecha de mañana» y «mañana es futura». |
| CA-1.2.5 · Planta inexistente | curl | Cumple | `planta: "000000000000000000000000"` → **404**, «Planta no encontrada». El historial de la planta de prueba sigue teniendo 1 solo riego. |
| CA-1.2.6 · Cantidad cero o negativa | Test del modelo + curl | Cumple | Tests: «rechaza una cantidad de 0 ml» y «de -1 ml». curl: `cantidadMl: 0` → **400**, «La cantidad de agua debe ser mayor que 0», y el historial no cambia. |
| CA-1.2.7 · 500 ml (0,5 L) | Test del modelo | Cumple | «CA-1.2.7: acepta 500 ml (0,5 L)». |
| CA-1.2.8 · Riego olvidado con fecha pasada | Test de dominio | Cumple | «CA-1.2.8: acepta un riego de hace 3 días de una planta registrada hace 10». |
| CA-1.2.9 · Fecha anterior al registro | Test de dominio | Cumple | «CA-1.2.9: rechaza un riego de hace 11 días de una planta registrada hace 10». |
| CA-1.2.9 · Parte con curl | curl | Sin verificar | La spec pide además probar con curl un riego de ayer de una planta creada hoy (debe dar 400). No se ejecutó. |

## 2. Otros requisitos de la spec

| Requisito | Cómo se verificó | Resultado | Evidencia |
|---|---|---|---|
| `GET /api/plantas` lista las plantas (X5) | curl | Cumple | **200**, un array con la planta creada. |
| `GET /api/plantas/:id/riegos` devuelve el historial (X6) | curl | Cumple | **200**, un array con el único riego válido. |
| Historial de una planta inexistente → 404 | — | Sin verificar | No se ejecutó la petición. |
| `:id` o `planta` con formato no válido → 400 | Petición HTTP con el servidor sin base de datos + test del modelo | Cumple | `GET /api/plantas/abc/riegos` → **400** con `detalles` en `id`. `POST /api/riegos` con `planta: "abc"` → **400**. Test: «rechaza una planta con un identificador que no es válido». |
| Formato de error 400 con `detalles` de todos los campos | curl + petición HTTP | Cumple | Un cuerpo vacío en `POST /api/plantas` → **400** con 4 entradas en `detalles`. |
| JSON mal formado → 400 | Petición HTTP con el servidor sin base de datos | Cumple | **400**, «El cuerpo no es un JSON válido». |
| Error inesperado → 500 sin detalles internos | Revisión de código | Sin verificar | El manejador de [src/app.js](../src/app.js) responde `{ "error": "Error interno" }`, pero no se ha provocado ningún 500. |
| Se ignora `createdAt` en el cuerpo de `POST /api/plantas` | Revisión de código | Sin verificar | [src/routes/plantas.js](../src/routes/plantas.js) solo toma los campos permitidos, pero no hay test ni curl. |
| Orden del listado (`createdAt` ascendente) y del historial (`fecha` descendente) | — | Sin verificar | Las pruebas se hicieron con una sola planta y un solo riego, así que el orden no se puede observar. |
| Fecha sin hora interpretada en hora local | Test de dominio + test del modelo | Cumple | «interpreta una fecha sin hora como medianoche en hora local» e «interpreta una fecha sin hora en hora local». |
| `cuidador` opcional (X2) | Test del modelo | Cumple | «cuidador es opcional y se guarda si se indica». |
| `enReposo` por defecto `false` y `cuidadosEspeciales` con `tipo` obligatorio (X3, X4) | Test del modelo + curl | Cumple | «enReposo es false y cuidadosEspeciales está vacío por defecto», «rechaza un cuidado especial sin tipo». |
| Formato de las respuestas igual al de la spec | curl | No cumple | Las respuestas incluyen `__v`, que no aparece en los ejemplos de la spec. No rompe ningún criterio. |

## 3. Observaciones

- **El hook no está formateado:** `npx prettier --check` da por buenos `src/` y `test/`, pero marca `.claude/hooks/formatear.js`. Se escribió antes de que existiera el hook.
- **Un test puede fallar a medianoche:** «CA-1.2.1: un riego sin fecha es válido y toma la fecha de hoy» compara el día de la fecha por defecto con el de `new Date()`. Si el test se ejecuta justo en el cambio de día, puede fallar.
- **Codificación en las pruebas con curl:** la planta de prueba se guardó como `Mandr�gora`. Probablemente se debe a que curl, desde Git Bash en Windows, no envía el cuerpo en UTF-8, y no a la API. Habría que confirmarlo enviando el cuerpo desde un archivo UTF-8.
- **Datos de prueba en la base de datos de desarrollo:** la planta `6ae220fe1049f800e58059eb` y el riego `6ae220ff1049f800e58059ef` siguen guardados.
- **La spec sigue en borrador:** los puntos X1–X9 de su sección 0 están sin confirmar. La implementación sigue lo que dice la spec, así que si alguno cambia (por ejemplo, ml frente a litros) habrá que auditar de nuevo.
