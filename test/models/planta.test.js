const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const Planta = require("../../src/models/planta");

function datosValidos() {
  return {
    nombre: "Mandrágora",
    especie: "Mandragora officinarum",
    ubicacion: "Mesa 2",
    intervaloRiegoDias: 3,
  };
}

function erroresDe(datos) {
  return new Planta(datos).validateSync()?.errors ?? {};
}

describe("Modelo Planta", () => {
  test("CA-1.1.1: una planta con los cuatro datos obligatorios es válida", () => {
    const planta = new Planta(datosValidos());
    assert.equal(planta.validateSync(), undefined);
    assert.equal(planta.nombre, "Mandrágora");
    assert.equal(planta.especie, "Mandragora officinarum");
    assert.equal(planta.ubicacion, "Mesa 2");
    assert.equal(planta.intervaloRiegoDias, 3);
  });

  test("enReposo es false y cuidadosEspeciales está vacío por defecto", () => {
    const planta = new Planta(datosValidos());
    assert.equal(planta.enReposo, false);
    assert.equal(planta.cuidadosEspeciales.length, 0);
  });

  test("CA-1.1.2: acepta un intervalo de 1 día", () => {
    assert.deepEqual(
      erroresDe({ ...datosValidos(), intervaloRiegoDias: 1 }),
      {},
    );
  });

  for (const intervalo of [0, -2]) {
    test(`CA-1.1.3: rechaza un intervalo de ${intervalo} días`, () => {
      const errores = erroresDe({
        ...datosValidos(),
        intervaloRiegoDias: intervalo,
      });
      assert.match(errores.intervaloRiegoDias.message, /al menos 1 día/);
    });
  }

  test("CA-1.1.4: rechaza un intervalo no entero", () => {
    const errores = erroresDe({ ...datosValidos(), intervaloRiegoDias: 2.5 });
    assert.match(errores.intervaloRiegoDias.message, /número entero/);
  });

  test("rechaza un intervalo que no es un número", () => {
    const errores = erroresDe({
      ...datosValidos(),
      intervaloRiegoDias: "tres",
    });
    assert.match(errores.intervaloRiegoDias.message, /número entero/);
  });

  for (const campo of [
    "nombre",
    "especie",
    "ubicacion",
    "intervaloRiegoDias",
  ]) {
    test(`CA-1.1.5: rechaza una planta sin ${campo}`, () => {
      const datos = datosValidos();
      delete datos[campo];
      const errores = erroresDe(datos);
      assert.deepEqual(Object.keys(errores), [campo]);
      assert.match(errores[campo].message, /obligatori/);
    });
  }

  for (const campo of ["nombre", "especie", "ubicacion"]) {
    test(`CA-1.1.5: rechaza el campo ${campo} con solo espacios`, () => {
      const errores = erroresDe({ ...datosValidos(), [campo]: "   " });
      assert.deepEqual(Object.keys(errores), [campo]);
    });
  }

  test("recorta los espacios de los textos", () => {
    const planta = new Planta({ ...datosValidos(), nombre: "  Mandrágora  " });
    assert.equal(planta.nombre, "Mandrágora");
  });

  test("CA-1.1.6: informa de todos los datos que faltan", () => {
    const datos = datosValidos();
    delete datos.especie;
    delete datos.ubicacion;
    const errores = erroresDe(datos);
    assert.deepEqual(Object.keys(errores).sort(), ["especie", "ubicacion"]);
  });

  test("acepta cuidados especiales con tipo y nota", () => {
    const errores = erroresDe({
      ...datosValidos(),
      cuidadosEspeciales: [
        { tipo: "luz", nota: "Sombra parcial" },
        { tipo: "abono" },
      ],
    });
    assert.deepEqual(errores, {});
  });

  test("rechaza un cuidado especial sin tipo", () => {
    const errores = erroresDe({
      ...datosValidos(),
      cuidadosEspeciales: [{ nota: "Sin tipo" }],
    });
    assert.ok(errores["cuidadosEspeciales.0.tipo"]);
  });
});
