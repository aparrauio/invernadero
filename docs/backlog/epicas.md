# Invernadero Encantado — Épicas del MVP

Fuente: [docs/prd/invernadero-mvp.md](../prd/invernadero-mvp.md). Los números de alcance (§4) y de reglas de negocio (§6) son los del PRD.

## E1 · Plantas y riegos

**Objetivo:** que el cuidador pueda dar de alta sus plantas, anotar cada riego (incluso uno olvidado) y consultar el historial de riegos de cualquier planta.

**Alcance que cubre (§4):**
- 4.1 Registrar una planta con su nombre y su intervalo de riego en días.
- 4.2 Registrar un riego de una planta, incluido un riego olvidado con fecha pasada.
- 4.4 Consultar el historial de riegos de una planta.

**Reglas de negocio que le aplican (§6):**
- 6.1 El intervalo de riego es un número entero de días, mínimo 1. Se valida al registrar la planta.
- 6.4 Un riego no puede tener fecha futura ni anterior a la fecha de registro de la planta, pero sí una fecha pasada dentro de ese margen. Se valida al registrar el riego.
- 6.8 Nombre, especie, ubicación e intervalo son obligatorios al registrar una planta.
- 6.9 No se puede registrar un riego de una planta que no existe.
- 6.10 La cantidad de agua de un riego se expresa en litros, admite decimales y debe ser mayor que 0.

## E2 · Cuidado

**Objetivo:** que el cuidador sepa en una sola consulta qué plantas necesitan agua hoy y cuáles van más atrasadas.

**Alcance que cubre (§4):**
- 4.3 Consultar las plantas que necesitan agua, con sus días de retraso y ordenadas de la más a la menos urgente.

**Reglas de negocio que le aplican (§6):**
- 6.2 Una planta que nunca se ha regado cuenta desde su fecha de registro.
- 6.3 Si una planta tiene varios riegos, cuenta el más reciente.
- 6.5 Se cuentan días de calendario y se ignora la hora. Una planta necesita agua cuando los días transcurridos desde su referencia son ≥ su intervalo.
- 6.6 Días de retraso = días transcurridos − intervalo. Si vale 0, le toca hoy.
- 6.7 La consulta muestra solo las plantas que necesitan agua, ordenadas de mayor a menor retraso.

E2 también usa los datos que valida E1 (el intervalo de la regla 6.1 y las fechas de riego de la regla 6.4), pero esas validaciones pertenecen a E1.

**Sobre el «reposo»:** la descripción de esta épica incluye «manejar el reposo», pero el PRD no define ningún concepto de reposo: no aparece en el alcance, en las reglas ni en los puntos abiertos. Por ahora E2 no tiene ningún punto de alcance ni regla sobre el reposo. Antes de escribir specs hay que decidir qué es el reposo y añadirlo al PRD, o quitarlo de la descripción de la épica.

## Cobertura del alcance

| Punto de alcance (§4) | Épica |
|---|---|
| 4.1 Registrar planta | E1 |
| 4.2 Registrar riego | E1 |
| 4.3 Consultar plantas que necesitan agua | E2 |
| 4.4 Historial de riegos | E1 |

Ningún punto del alcance queda fuera de las dos épicas. Todas las reglas de negocio (6.1–6.10) están asignadas a una de ellas.

Hay una diferencia en el otro sentido: E2 menciona el «reposo», que no tiene respaldo en el PRD (ver arriba).
