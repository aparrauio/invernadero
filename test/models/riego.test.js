const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Riego = require("../../src/models/riego");
const { diaCalendario } = require("../../src/dominio/fechas");

function datosValidos() {
  return { planta: new mongoose.Types.ObjectId(), cantidadMl: 2000 };
}

function erroresDe(datos) {
  return new Riego(datos).validateSync()?.errors ?? {};
}

function manana() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  return fecha;
}

describe("Modelo Riego", () => {
  test("CA-1.2.1: un riego sin fecha es válido y toma la fecha de hoy", () => {
    const riego = new Riego(datosValidos());
    assert.equal(riego.validateSync(), undefined);
    assert.equal(diaCalendario(riego.fecha), diaCalendario(new Date()));
    assert.equal(riego.cantidadMl, 2000);
  });

  test("cuidador es opcional y se guarda si se indica", () => {
    const riego = new Riego({ ...datosValidos(), cuidador: "  Ada  " });
    assert.equal(riego.validateSync(), undefined);
    assert.equal(riego.cuidador, "Ada");
  });

  test("CA-1.2.4: rechaza un riego con la fecha de mañana", () => {
    const errores = erroresDe({ ...datosValidos(), fecha: manana() });
    assert.match(errores.fecha.message, /futura/);
  });

  test("interpreta una fecha sin hora en hora local", () => {
    const riego = new Riego({ ...datosValidos(), fecha: "2020-01-15" });
    assert.equal(riego.validateSync(), undefined);
    assert.equal(riego.fecha.getDate(), 15);
    assert.equal(riego.fecha.getHours(), 0);
  });

  test("rechaza una fecha que no es válida", () => {
    const errores = erroresDe({ ...datosValidos(), fecha: "no es una fecha" });
    assert.match(errores.fecha.message, /fecha no es válida/);
  });

  for (const cantidadMl of [0, -1]) {
    test(`CA-1.2.6: rechaza una cantidad de ${cantidadMl} ml`, () => {
      const errores = erroresDe({ ...datosValidos(), cantidadMl });
      assert.match(errores.cantidadMl.message, /mayor que 0/);
    });
  }

  test("CA-1.2.7: acepta 500 ml (0,5 L)", () => {
    assert.deepEqual(erroresDe({ ...datosValidos(), cantidadMl: 500 }), {});
  });

  test("rechaza una cantidad que no es un número entero de ml", () => {
    const errores = erroresDe({ ...datosValidos(), cantidadMl: 2.5 });
    assert.match(errores.cantidadMl.message, /número entero/);
  });

  test("rechaza un riego sin cantidad", () => {
    const errores = erroresDe({ planta: new mongoose.Types.ObjectId() });
    assert.deepEqual(Object.keys(errores), ["cantidadMl"]);
  });

  test("rechaza un riego sin planta", () => {
    const errores = erroresDe({ cantidadMl: 500 });
    assert.deepEqual(Object.keys(errores), ["planta"]);
  });

  test("rechaza una planta con un identificador que no es válido", () => {
    const errores = erroresDe({ ...datosValidos(), planta: "abc" });
    assert.match(errores.planta.message, /identificador válido/);
  });
});
