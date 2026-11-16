export default function ListaVacia({ texto, accion, alPulsar }) {
  return (
    <div className="lista-vacia">
      <p>{texto}</p>
      <button type="button" className="boton-secundario" onClick={alPulsar}>
        {accion}
      </button>
    </div>
  );
}
