const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const {
  diaCalendario,
  interpretarFecha,
  esFechaFutura,
  esFechaRiegoValida,
} = require("../../src/dominio/fechas");

// Las fechas se construyen en hora local para que los tests no dependan de TZ.
const hoy = new Date(2026, 9, 28, 10, 0);

function haceDias(dias, hora = 10, minuto = 0) {
  return new Date(2026, 9, 28 - dias, hora, minuto);
}

describe("diaCalendario", () => {
  test("CA-1.2.3: las 00:01 y las 23:59 son el mismo día", () => {
    assert.equal(
      diaCalendario(new Date(2026, 9, 28, 0, 1)),
      diaCalendario(new Date(2026, 9, 28, 23, 59)),
    );
  });

  test("CA-1.2.3: las 23:59 y las 00:00 siguientes son días distintos", () => {
    assert.ok(
      diaCalendario(new Date(2026, 9, 28, 23, 59)) <
        diaCalendario(new Date(2026, 9, 29, 0, 0)),
    );
  });

  test("ordena los días a través de un cambio de mes y de año", () => {
    assert.ok(
      diaCalendario(new Date(2026, 9, 31)) <
        diaCalendario(new Date(2026, 10, 1)),
    );
    assert.ok(
      diaCalendario(new Date(2026, 11, 31)) <
        diaCalendario(new Date(2027, 0, 1)),
    );
  });
});

describe("interpretarFecha", () => {
  test("interpreta una fecha sin hora como medianoche en hora local", () => {
    const fecha = interpretarFecha("2026-10-25");
    assert.equal(fecha.getFullYear(), 2026);
    assert.equal(fecha.getMonth(), 9);
    assert.equal(fecha.getDate(), 25);
    assert.equal(fecha.getHours(), 0);
  });

  test("deja igual cualquier otro valor", () => {
    const fecha = new Date();
    assert.equal(interpretarFecha(fecha), fecha);
    assert.equal(
      interpretarFecha("2026-10-25T10:00:00Z"),
      "2026-10-25T10:00:00Z",
    );
    assert.equal(interpretarFecha(undefined), undefined);
  });
});

describe("esFechaFutura", () => {
  test("CA-1.2.4: mañana es futura", () => {
    assert.equal(esFechaFutura(haceDias(-1, 0, 0), hoy), true);
  });

  test("CA-1.2.3: hoy a las 23:59 no es futura", () => {
    assert.equal(esFechaFutura(haceDias(0, 23, 59), hoy), false);
  });
});

describe("esFechaRiegoValida", () => {
  test("CA-1.2.1: acepta un riego de hoy", () => {
    assert.equal(esFechaRiegoValida(hoy, haceDias(5), hoy), true);
  });

  test("CA-1.2.2: acepta un riego del mismo día del registro, aunque sea a una hora anterior", () => {
    const registro = haceDias(0, 9, 30);
    const riego = haceDias(0, 8, 0);
    assert.equal(esFechaRiegoValida(riego, registro, hoy), true);
  });

  test("CA-1.2.4: rechaza un riego de mañana", () => {
    assert.equal(esFechaRiegoValida(haceDias(-1), haceDias(5), hoy), false);
  });

  test("CA-1.2.8: acepta un riego de hace 3 días de una planta registrada hace 10", () => {
    assert.equal(esFechaRiegoValida(haceDias(3), haceDias(10), hoy), true);
  });

  test("CA-1.2.9: rechaza un riego de hace 11 días de una planta registrada hace 10", () => {
    assert.equal(esFechaRiegoValida(haceDias(11), haceDias(10), hoy), false);
  });
});
