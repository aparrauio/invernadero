# Wireframes · HU-1.8 · Registrar un riego rápido desde la lista

> Ejemplo de referencia generado con `/wireframes HU-1.8`. Baja fidelidad, solo grises: la estructura sale de aquí, el estilo de `DESIGN.md` y el comportamiento de los criterios.

| Estado | Archivos | Criterios |
| --- | --- | --- |
| Lista | `lista-movil.svg` · `lista-escritorio.svg` | CA-1.8.1, CA-1.8.7 |
| Panel abierto | `panel-abierto-movil.svg` · `panel-abierto-escritorio.svg` | CA-1.8.2, CA-1.8.7 |
| Guardando | `guardando-movil.svg` | CA-1.8.6 |
| Error de validación | `error-validacion-movil.svg` | CA-1.8.4 |
| Error de conexión | `error-conexion-movil.svg` | CA-1.8.5 |
| Éxito | `exito-movil.svg` | CA-1.8.3 |

## Decisiones

Lo que el wireframe decide y los criterios no:

- **La acción «Regar»** va a la derecha de cada fila (tarjeta en móvil, última columna en escritorio) y es un botón **secundario**: así la pantalla mantiene un solo botón primario (DESIGN.md).
- **El panel** es una hoja inferior en móvil y un panel lateral derecho en escritorio. Mientras está abierto, la lista queda atenuada y «Guardar riego» es el único botón primario visible.
- **El mensaje de éxito** aparece arriba de la lista, porque el panel ya se cerró.
- **El error de conexión** va dentro del panel, arriba del campo, y el campo conserva la cantidad escrita.
