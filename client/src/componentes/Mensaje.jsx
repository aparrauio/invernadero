import { IconoError, IconoVisto } from "./Iconos.jsx";

// tipo: "exito" | "error"
export default function Mensaje({ tipo, children }) {
  return (
    <div
      className={`mensaje mensaje-${tipo}`}
      role={tipo === "error" ? "alert" : "status"}
    >
      {tipo === "error" ? <IconoError /> : <IconoVisto />}
      <p>{children}</p>
    </div>
  );
}
