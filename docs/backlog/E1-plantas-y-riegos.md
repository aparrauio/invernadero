# E1 · Plantas y riegos — Historias de usuario

Épica: [epicas.md](epicas.md#e1--plantas-y-riegos). Fuente: [docs/prd/invernadero-mvp.md](../prd/invernadero-mvp.md). Los números de alcance (§4), no-alcance (§5), reglas (§6) y puntos abiertos (§8) son los del PRD.

El único rol del MVP es el **cuidador** (§2). Los criterios de aceptación se escribirán más adelante.

## Historias del MVP

### HU-1.1 · Registrar una planta
Como cuidador, quiero registrar una planta con su nombre y su intervalo de riego en días, para que el invernadero sepa cada cuánto hay que regarla.

- **Alcance:** §4.1. **Reglas:** 6.1.

### HU-1.2 · Registrar un riego de hoy
Como cuidador, quiero anotar que he regado una planta hoy, para que su próximo riego se calcule desde ese momento.

- **Alcance:** §4.2. **Reglas:** 6.4.

### HU-1.3 · Registrar un riego olvidado
Como cuidador, quiero anotar un riego que hice en un día pasado y olvidé registrar, para que el historial refleje lo que de verdad pasó y la planta no aparezca como atrasada sin estarlo.

- **Alcance:** §4.2 («incluido un riego olvidado con fecha pasada»). **Reglas:** 6.4.

### HU-1.4 · Consultar el historial de riegos de una planta
Como cuidador, quiero ver todos los riegos registrados de una planta, para comprobar cuándo se ha regado y detectar si falta alguno.

- **Alcance:** §4.4.

## Historias fuera de alcance

Estas historias aparecen de forma natural al descomponer la épica, pero el PRD las excluye o no las incluye en el MVP. Se dejan anotadas para no perderlas.

### HU-1.5 · Listar las plantas registradas — fuera de alcance (pendiente de confirmar)
Como cuidador, quiero ver la lista de todas las plantas registradas, para encontrar la que busco y consultar su historial.

- **Motivo:** el §4 no incluye un listado general de plantas. La única consulta de plantas del MVP es la de las que necesitan agua (§4.3, épica E2). Sin un listado, el cuidador necesita conocer el identificador de la planta para HU-1.2, HU-1.3 y HU-1.4. Conviene confirmar si debe entrar en el MVP.

### HU-1.6 · Cambiar el intervalo de riego de una planta — fuera de alcance (punto abierto)
Como cuidador, quiero cambiar el intervalo de riego de una planta ya registrada, para ajustarlo si me equivoqué o si la planta necesita otro ritmo.

- **Motivo:** el §8 deja sin decidir si el intervalo se puede modificar y cómo afecta al cálculo.

### HU-1.7 · Corregir o borrar un riego erróneo — fuera de alcance
Como cuidador, quiero corregir o borrar un riego mal registrado, para que un error no oculte una planta que necesita agua.

- **Motivo:** el §5 excluye explícitamente corregir o borrar riegos. El §8 lo mantiene como punto abierto por el riesgo que supone.

## Comprobación INVEST

- **Independientes:** las historias del MVP se pueden implementar y entregar por separado. HU-1.2, HU-1.3 y HU-1.4 necesitan que exista alguna planta, pero para probarlas basta con datos de prueba; no dependen del código de HU-1.1. HU-1.3 añade sobre HU-1.2 la validación de fechas pasadas, así que se puede entregar después sin rehacerla.
- **Pequeñas:** cada historia es una sola operación (un alta, un registro o una consulta).
- **Comprobables:** cada una tiene un resultado observable y, cuando aplica, una regla del §6 contra la que escribir los criterios.

## Cobertura del alcance de E1

| Alcance (§4) | Historias |
|---|---|
| 4.1 Registrar planta | HU-1.1 |
| 4.2 Registrar riego (incluido olvidado) | HU-1.2, HU-1.3 |
| 4.4 Historial de riegos | HU-1.4 |
