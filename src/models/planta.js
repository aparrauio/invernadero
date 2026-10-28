const mongoose = require("mongoose");

const MENSAJE_INTERVALO_ENTERO =
  "El intervalo de riego debe ser un número entero de días";

function textoObligatorio(mensaje) {
  return { type: String, required: [true, mensaje], trim: true };
}

const cuidadoEspecialSchema = new mongoose.Schema({
  tipo: textoObligatorio("El tipo del cuidado especial es obligatorio"),
  nota: { type: String, trim: true },
});

const plantaSchema = new mongoose.Schema(
  {
    nombre: textoObligatorio("El nombre es obligatorio"),
    especie: textoObligatorio("La especie es obligatoria"),
    ubicacion: textoObligatorio("La ubicación es obligatoria"),
    intervaloRiegoDias: {
      type: Number,
      required: [true, "El intervalo de riego es obligatorio"],
      min: [1, "El intervalo de riego debe ser de al menos 1 día"],
      validate: {
        validator: Number.isInteger,
        message: MENSAJE_INTERVALO_ENTERO,
      },
      cast: MENSAJE_INTERVALO_ENTERO,
    },
    enReposo: { type: Boolean, default: false },
    cuidadosEspeciales: { type: [cuidadoEspecialSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

module.exports = mongoose.model("Planta", plantaSchema);
