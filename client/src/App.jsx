import { useState } from "react";
import Plantas from "./pantallas/Plantas.jsx";
import DetallePlanta from "./pantallas/DetallePlanta.jsx";

// Dos pantallas, sin librería de rutas (spec 02, sección 1).
export default function App() {
  const [plantaAbierta, setPlantaAbierta] = useState(null);

  return (
    <>
      <header className="cabecera">
        <p className="marca">Invernadero Encantado</p>
      </header>
      <main className="pagina">
        {plantaAbierta ? (
          <DetallePlanta
            planta={plantaAbierta}
            alVolver={() => setPlantaAbierta(null)}
          />
        ) : (
          <Plantas alAbrir={setPlantaAbierta} />
        )}
      </main>
    </>
  );
}
