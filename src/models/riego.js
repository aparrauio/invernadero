const mongoose = require("mongoose");
const { interpretarFecha, esFechaFutura } = require("../dominio/fechas");

const MENSAJE_CANTIDAD_ENTERA =
  "La cantidad de agua debe ser un número entero de mililitros";

const riegoSchema = new mongoose.Schema({
  planta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Planta",
    required: [true, "La planta es obligatoria"],
    cast: "La planta no tiene un identificador válido",
  },
  fecha: {
    type: Date,
    default: Date.now,
    set: interpretarFecha,
    cast: "La fecha no es válida",
    validate: {
      validator: (fecha) => !esFechaFutura(fecha, new Date()),
      message: "Un riego no puede tener fecha futura",
    },
  },
  cantidadMl: {
    type: Number,
    required: [true, "La cantidad de agua es obligatoria"],
    min: [1, "La cantidad de agua debe ser mayor que 0"],
    validate: {
      validator: Number.isInteger,
      message: MENSAJE_CANTIDAD_ENTERA,
    },
    cast: MENSAJE_CANTIDAD_ENTERA,
  },
  cuidador: { type: String, trim: true },
});

module.exports = mongoose.model("Riego", riegoSchema);
