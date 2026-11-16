import { useEffect, useRef, useState } from "react";
import { listarPlantas, registrarPlanta, repartirErrores } from "../api.js";
import Campo from "../componentes/Campo.jsx";
import ListaVacia from "../componentes/ListaVacia.jsx";
import Mensaje from "../componentes/Mensaje.jsx";

const CAMPOS = ["nombre", "especie", "ubicacion", "intervaloRiegoDias"];
const VACIO = {
  nombre: "",
  especie: "",
  ubicacion: "",
  intervaloRiegoDias: "",
};

export default function Plantas({ alAbrir }) {
  const [plantas, setPlantas] = useState([]);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({ porCampo: {}, generales: [] });
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const primerCampo = useRef(null);

  useEffect(() => {
    listarPlantas()
      .then((lista) => {
        setPlantas(lista);
        setEstado("listo");
      })
      .catch(() => setEstado("error"));
  }, []);

  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setExito("");
    setErrores({ porCampo: {}, generales: [] });
    try {
      const intervalo = datos.intervaloRiegoDias.trim();
      const planta = await registrarPlanta({
        ...datos,
        intervaloRiegoDias: intervalo === "" ? undefined : Number(intervalo),
      });
      setPlantas([...plantas, planta]);
      setEstado("listo");
      setDatos(VACIO);
      setExito(`Planta registrada: ${planta.nombre}.`);
    } catch (error) {
      if (error.estado === 400) {
        setErrores(repartirErrores(error, CAMPOS));
      } else {
        setErrores({
          porCampo: {},
          generales: [
            "No pudimos guardar la planta. Revisa que la API esté encendida y vuelve a intentarlo.",
          ],
        });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>Plantas</h1>

      <section className="seccion" aria-labelledby="titulo-lista">
        <h2 id="titulo-lista" className="solo-lector">
          Lista de plantas
        </h2>
        {estado === "cargando" && (
          <p className="texto-secundario">Cargando plantas…</p>
        )}
        {estado === "error" && (
          <Mensaje tipo="error">
            No pudimos cargar las plantas. Revisa que la API esté encendida y
            vuelve a intentarlo.
          </Mensaje>
        )}
        {estado === "listo" && plantas.length === 0 && (
          <ListaVacia
            texto="Todavía no hay plantas registradas."
            accion="Registrar la primera planta"
            alPulsar={() => primerCampo.current?.focus()}
          />
        )}
        {estado === "listo" && plantas.length > 0 && (
          <table className="tabla-plantas">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Especie</th>
                <th scope="col">Ubicación</th>
                <th scope="col">Riego cada</th>
              </tr>
            </thead>
            <tbody>
              {plantas.map((planta) => (
                <tr key={planta._id}>
                  <td data-etiqueta="Nombre">
                    <a
                      href={`#planta-${planta._id}`}
                      className="enlace-planta"
                      onClick={(evento) => {
                        evento.preventDefault();
                        alAbrir(planta);
                      }}
                    >
                      {planta.nombre}
                    </a>
                  </td>
                  <td data-etiqueta="Especie">{planta.especie}</td>
                  <td data-etiqueta="Ubicación">{planta.ubicacion}</td>
                  <td data-etiqueta="Riego cada">
                    {planta.intervaloRiegoDias}{" "}
                    {planta.intervaloRiegoDias === 1 ? "día" : "días"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="seccion tarjeta" aria-labelledby="titulo-registro">
        <h2 id="titulo-registro">Registrar una planta</h2>
        {exito && <Mensaje tipo="exito">{exito}</Mensaje>}
        {errores.generales.map((mensaje) => (
          <Mensaje key={mensaje} tipo="error">
            {mensaje}
          </Mensaje>
        ))}
        <form onSubmit={enviar} noValidate>
          <Campo
            id="nombre"
            etiqueta="Nombre"
            value={datos.nombre}
            onChange={cambiar}
            error={errores.porCampo.nombre}
            ref={primerCampo}
          />
          <Campo
            id="especie"
            etiqueta="Especie"
            value={datos.especie}
            onChange={cambiar}
            error={errores.porCampo.especie}
          />
          <Campo
            id="ubicacion"
            etiqueta="Ubicación"
            ayuda="Por ejemplo: Mesa 2"
            value={datos.ubicacion}
            onChange={cambiar}
            error={errores.porCampo.ubicacion}
          />
          <Campo
            id="intervaloRiegoDias"
            etiqueta="Riego cada (días)"
            ayuda="Cada cuántos días hay que regarla. Mínimo 1."
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={datos.intervaloRiegoDias}
            onChange={cambiar}
            error={errores.porCampo.intervaloRiegoDias}
          />
          <button type="submit" className="boton-primario" disabled={enviando}>
            {enviando ? "Guardando…" : "Registrar planta"}
          </button>
        </form>
      </section>
    </>
  );
}
