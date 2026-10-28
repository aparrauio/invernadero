const express = require("express");
const mongoose = require("mongoose");
const Planta = require("../models/planta");
const Riego = require("../models/riego");

const router = express.Router();

router.post("/", async (req, res) => {
  // Solo se toman los campos que el cuidador puede fijar: createdAt lo pone el sistema.
  const {
    nombre,
    especie,
    ubicacion,
    intervaloRiegoDias,
    enReposo,
    cuidadosEspeciales,
  } = req.body ?? {};
  const planta = await Planta.create({
    nombre,
    especie,
    ubicacion,
    intervaloRiegoDias,
    enReposo,
    cuidadosEspeciales,
  });
  res.status(201).json(planta);
});

router.get("/", async (req, res) => {
  const plantas = await Planta.find().sort({ createdAt: 1 });
  res.json(plantas);
});

router.get("/:id/riegos", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      error: "Datos no válidos",
      detalles: [
        { campo: "id", mensaje: "La planta no tiene un identificador válido" },
      ],
    });
  }
  if (!(await Planta.exists({ _id: id }))) {
    return res.status(404).json({ error: "Planta no encontrada" });
  }
  const riegos = await Riego.find({ planta: id }).sort({ fecha: -1 });
  res.json(riegos);
});

module.exports = router;
