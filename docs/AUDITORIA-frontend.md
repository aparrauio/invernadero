# Auditoría · Frontend de E1 (spec 02)

Rama de referencia del taller del 4 de noviembre. Verificación en el navegador (Chromium, 1280 px y 390 px) contra una API de prueba en memoria que responde igual que la spec 01; conviene repetir los criterios con la API real conectada a Atlas.

| Criterio | Cómo se comprobó | Resultado |
|---|---|---|
| CA-F.1 · Lista de plantas | Navegador: tres plantas en la tabla, en orden de registro | Cumple |
| CA-F.2 · Lista vacía | Navegador con la API sin plantas: bloque discontinuo y acción que lleva al formulario | Cumple |
| CA-F.3 · Registrar planta | Navegador: mensaje «Planta registrada: Rosa Bruma.» y la planta al final de la lista | Cumple |
| CA-F.4 · Errores junto a su campo | Navegador: sin especie ni ubicación y con intervalo 0, tres mensajes bajo sus campos, con icono y borde de error | Cumple |
| CA-F.5 · Abrir el detalle | Navegador: el nombre abre el detalle con el riego más reciente primero | Cumple |
| CA-F.6 · Historial vacío | Navegador: planta recién creada muestra «Esta planta todavía no tiene riegos.» | Cumple |
| CA-F.7 · Registrar riego | Navegador: 500 ml sin fecha, aparece arriba con «sin cuidador» | Cumple |
| CA-F.8 · Riego no válido | Navegador: cantidad 0 muestra el mensaje bajo «Cantidad (ml)» y el historial no cambia. Fecha de mañana: el campo no permite elegirla (`max`); el mensaje de la API se probó solo en la API de prueba | Cumple |
| CA-F.9 · API apagada | Navegador con la API detenida: mensaje de error de conexión sin tecnicismos | Cumple |
| CA-F.10 · Diseño | Revisión de diseño contra DESIGN.md: colores, espacios y radios solo con variables; botones y enlaces de acción ≥ 44 px; `<label>` en cada campo; foco de 3 px violeta; un botón primario por pantalla | Cumple |
| CA-F.11 · Móvil | Navegador a 390 px: la lista se ve como tarjetas y el ancho de la página es 390 px | Cumple |

## Revisión de diseño

- Los tamaños de letra (32, 24, 18, 16 y 14 px) están escritos en `app.css` porque DESIGN.md no los define como variables. Se deja anotado; no es una desviación.
- Sin librerías de UI, de CSS, de rutas ni de iconos.

## Pendiente

- Repetir la verificación contra la API real.
- La deuda técnica del backlog de E1 sigue abierta.
