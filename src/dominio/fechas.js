// Fechas en días de calendario según la hora local del proceso (variable TZ).
// Se ignora la hora en todas las comparaciones (regla 6.5).

const FECHA_SIN_HORA = /^(\d{4})-(\d{2})-(\d{2})$/;

// Devuelve el día de calendario como un número AAAAMMDD, comparable con < y >.
function diaCalendario(fecha) {
  return (
    fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate()
  );
}

// "AAAA-MM-DD" se interpreta como medianoche local; new Date() lo tomaría como UTC.
function interpretarFecha(valor) {
  const partes = typeof valor === "string" ? FECHA_SIN_HORA.exec(valor) : null;
  if (!partes) {
    return valor;
  }
  const [, anio, mes, dia] = partes.map(Number);
  return new Date(anio, mes - 1, dia);
}

function esFechaFutura(fecha, ahora) {
  return diaCalendario(fecha) > diaCalendario(ahora);
}

// Regla 6.4: entre el día de registro de la planta y hoy, ambos incluidos.
function esFechaRiegoValida(fechaRiego, fechaRegistroPlanta, ahora) {
  const dia = diaCalendario(fechaRiego);
  return (
    dia >= diaCalendario(fechaRegistroPlanta) && dia <= diaCalendario(ahora)
  );
}

module.exports = {
  diaCalendario,
  interpretarFecha,
  esFechaFutura,
  esFechaRiegoValida,
};
