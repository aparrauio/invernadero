require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const app = require("./app");

const { MONGODB_URI, PORT = 3000 } = process.env;

async function arrancar() {
  if (!MONGODB_URI) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

arrancar().catch((error) => {
  console.error("No se pudo arrancar el servidor:", error.message);
  process.exit(1);
});
