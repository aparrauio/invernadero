const express = require("express");
const plantasRouter = require("./routes/plantas");
const riegosRouter = require("./routes/riegos");

const app = express();

app.use(express.json());

app.use("/api/plantas", plantasRouter);
app.use("/api/riegos", riegosRouter);

// Express 5 reenvía aquí también los errores de las rutas async.
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const detalles = Object.entries(err.errors).map(([campo, error]) => ({
      campo,
      mensaje: error.message,
    }));
    return res.status(400).json({ error: "Datos no válidos", detalles });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo no es un JSON válido" });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno" });
});

module.exports = app;
