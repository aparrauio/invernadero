import { useEffect, useRef, useState } from "react";
import { listarRiegos, registrarRiego, repartirErrores } from "../api.js";
import { fechaCorta, hoyIso } from "../formato.js";
import Campo from "../componentes/Campo.jsx";
import ListaVacia from "../componentes/ListaVacia.jsx";
import Mensaje from "../componentes/Mensaje.jsx";

const CAMPOS = ["cantidadMl", "fecha", "cuidador"];
const VACIO = { cantidadMl: "", fecha: "", cuidador: "" };

function ordenarPorFecha(riegos) {
  return [...riegos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export default function DetallePlanta({ planta, alVolver }) {
  const [riegos, setRiegos] = useState([]);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | no-existe | error
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({ porCampo: {}, generales: [] });
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const primerCampo = useRef(null);

  useEffect(() => {
    listarRiegos(planta._id)
      .then((lista) => {
        setRiegos(lista);
        setEstado("listo");
      })
      .catch((error) =>
        setEstado(error.estado === 404 ? "no-existe" : "error"),
      );
  }, [planta._id]);

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setExito("");
    setErrores({ porCampo: {}, generales: [] });
    try {
      const cantidad = datos.cantidadMl.trim();
      const riego = await registrarRiego({
        planta: planta._id,
        cantidadMl: cantidad === "" ? undefined : Number(cantidad),
        fecha: datos.fecha || undefined,
        cuidador: datos.cuidador.trim() || undefined,
      });
      setRiegos(ordenarPorFecha([...riegos, riego]));
      setEstado("listo");
      setDatos(VACIO);
      setExito(`Riego guardado para ${planta.nombre}.`);
    } catch (error) {
      if (error.estado === 400) {
        setErrores(repartirErrores(error, CAMPOS));
      } else if (error.estado === 404) {
        setEstado("no-existe");
      } else {
        setErrores({
          porCampo: {},
          generales: [
            "No pudimos guardar el riego. Revisa que la API esté encendida y vuelve a intentarlo.",
          ],
        });
      }
    } finally {
      setEnviando(false);
    }
  }

  const volver = (
    <a
      href="#plantas"
      className="enlace-volver"
      onClick={(evento) => {
        evento.preventDefault();
        alVolver();
      }}
    >
      ← Volver a plantas
    </a>
  );

  if (estado === "no-existe") {
    return (
      <>
        {volver}
        <Mensaje tipo="error">
          No encontramos esa planta. Puede que se haya borrado.
        </Mensaje>
      </>
    );
  }

  return (
    <>
      {volver}
      <h1>{planta.nombre}</h1>
      <dl className="datos-planta">
        <div>
          <dt>Especie</dt>
          <dd>{planta.especie}</dd>
        </div>
        <div>
          <dt>Ubicación</dt>
          <dd>{planta.ubicacion}</dd>
        </div>
        <div>
          <dt>Riego cada</dt>
          <dd>
            {planta.intervaloRiegoDias}{" "}
            {planta.intervaloRiegoDias === 1 ? "día" : "días"}
          </dd>
        </div>
      </dl>

      <section className="seccion" aria-labelledby="titulo-historial">
        <h2 id="titulo-historial">Historial de riegos</h2>
        {estado === "cargando" && (
          <p className="texto-secundario">Cargando riegos…</p>
        )}
        {estado === "error" && (
          <Mensaje tipo="error">
            No pudimos cargar los riegos. Revisa que la API esté encendida y
            vuelve a intentarlo.
          </Mensaje>
        )}
        {estado === "listo" && riegos.length === 0 && (
          <ListaVacia
            texto="Esta planta todavía no tiene riegos."
            accion="Registrar el primer riego"
            alPulsar={() => primerCampo.current?.focus()}
          />
        )}
        {estado === "listo" && riegos.length > 0 && (
          <ul className="historial">
            {riegos.map((riego) => (
              <li key={riego._id}>
                <p className="historial-fecha">{fechaCorta(riego.fecha)}</p>
                <p className="texto-secundario">
                  {riego.cantidadMl} ml · {riego.cuidador || "sin cuidador"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="seccion tarjeta" aria-labelledby="titulo-riego">
        <h2 id="titulo-riego">Registrar un riego</h2>
        {exito && <Mensaje tipo="exito">{exito}</Mensaje>}
        {errores.generales.map((mensaje) => (
          <Mensaje key={mensaje} tipo="error">
            {mensaje}
          </Mensaje>
        ))}
        <form onSubmit={enviar} noValidate>
          <Campo
            id="cantidadMl"
            etiqueta="Cantidad (ml)"
            ayuda="Medio litro son 500 ml."
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={datos.cantidadMl}
            onChange={cambiar}
            error={errores.porCampo.cantidadMl}
            ref={primerCampo}
          />
          <Campo
            id="fecha"
            etiqueta="Fecha"
            ayuda="Déjala vacía si la regaste hoy."
            type="date"
            max={hoyIso()}
            value={datos.fecha}
            onChange={cambiar}
            error={errores.porCampo.fecha}
          />
          <Campo
            id="cuidador"
            etiqueta="Cuidador"
            ayuda="Opcional."
            value={datos.cuidador}
            onChange={cambiar}
            error={errores.porCampo.cuidador}
          />
          <button type="submit" className="boton-primario" disabled={enviando}>
            {enviando ? "Guardando…" : "Registrar riego"}
          </button>
        </form>
      </section>
    </>
  );
}
