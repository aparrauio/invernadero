# Invernadero Encantado — Mini-PRD del MVP

## 1. Problema
Los cuidadores del invernadero no tienen una forma fiable de saber qué plantas mágicas necesitan agua. Hoy dependen de la memoria o de notas sueltas. Por eso hay plantas que se quedan sin riego y otras que se riegan de más.

## 2. Usuarios
- **Cuidador:** registra plantas y riegos, y consulta cada día qué plantas le toca regar.

## 3. Objetivo y métrica de éxito
- **Objetivo:** que un cuidador sepa en una sola consulta qué plantas regar hoy y cuáles van más atrasadas.
- **Métrica:** el % de plantas regadas en su día o antes. Meta: ≥ 90 % durante el primer mes de uso. [SUPUESTO]

## 4. Alcance del MVP
1. Registrar una planta con su nombre, especie, ubicación e intervalo de riego en días.
2. Registrar un riego de una planta con la cantidad de agua usada, incluido un riego olvidado con fecha pasada.
3. Consultar las plantas que necesitan agua, con sus días de retraso y ordenadas de la más a la menos urgente.
4. Consultar el historial de riegos de una planta.

## 5. No-alcance
- Cuentas de usuario, permisos y separación por cuidador.
- Notificaciones o recordatorios automáticos.
- Varios invernaderos.
- Sensores, clima o ajuste automático del intervalo.
- Corregir o borrar riegos (ver Puntos abiertos).

## 6. Reglas de negocio
1. El intervalo de riego es un número entero de días, mínimo 1.
2. Una planta que nunca se ha regado cuenta desde su fecha de registro.
3. Si una planta tiene varios riegos, cuenta el más reciente.
4. Un riego no puede tener fecha futura ni anterior a la fecha de registro de la planta. Sí puede tener fecha pasada dentro de ese margen.
5. Se cuentan días de calendario y se ignora la hora. Una planta necesita agua cuando los días transcurridos desde su referencia (último riego o registro) son ≥ su intervalo.
6. Días de retraso = días transcurridos − intervalo. Si vale 0, le toca hoy.
7. La consulta muestra solo las plantas que necesitan agua, ordenadas de mayor a menor retraso.
8. Nombre, especie, ubicación e intervalo son obligatorios al registrar una planta.
9. No se puede registrar un riego de una planta que no existe.
10. La cantidad de agua de un riego se expresa en litros, admite decimales y debe ser mayor que 0.

## 7. Supuestos
- [SUPUESTO] Hay un único invernadero y todos los cuidadores ven todas las plantas.
- [SUPUESTO] «Hoy» se calcula con la hora local del invernadero.
- [SUPUESTO] Un riego se registra sin responsable.
- [SUPUESTO] La meta del 90 % es orientativa y se revisará con datos reales.

## 8. Puntos abiertos
- **Corrección de riegos erróneos:** no se ha decidido si un riego mal registrado se puede borrar o editar. Riesgo: como cuenta el más reciente, un error puede ocultar una planta seca hasta su siguiente ciclo.
- **Desempate:** falta decidir el orden entre plantas con los mismos días de retraso.
- **Cantidad de agua:** falta decidir si es obligatoria, con cuántos decimales se guarda y si tiene un máximo por riego.
- **Especie y ubicación:** falta decidir si son texto libre o se eligen de una lista cerrada.
- **Cambio de intervalo:** falta decidir si se puede modificar el intervalo de una planta ya registrada y si el cambio afecta al cálculo de forma inmediata.
