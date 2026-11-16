// Llamadas a la API. Todas las rutas son relativas: el proxy de Vite las envía a la API.

export class ErrorApi extends Error {
  constructor(mensaje, { estado = 0, detalles = [] } = {}) {
    super(mensaje);
    this.estado = estado;
    this.detalles = detalles;
  }
}

async function pedir(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(ruta, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    throw new ErrorApi("sin-conexion");
  }
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ErrorApi(cuerpo?.error ?? "error", {
      estado: respuesta.status,
      detalles: cuerpo?.detalles ?? [],
    });
  }
  return cuerpo;
}

export const listarPlantas = () => pedir("/api/plantas");

export const registrarPlanta = (datos) =>
  pedir("/api/plantas", { method: "POST", body: JSON.stringify(datos) });

export const listarRiegos = (idPlanta) =>
  pedir(`/api/plantas/${idPlanta}/riegos`);

export const registrarRiego = (datos) =>
  pedir("/api/riegos", { method: "POST", body: JSON.stringify(datos) });

// Reparte los "detalles" de la API: los que tienen campo en el formulario van junto a él;
// el resto, arriba del formulario.
export function repartirErrores(error, camposDelFormulario) {
  const porCampo = {};
  const generales = [];
  for (const { campo, mensaje } of error.detalles ?? []) {
    if (camposDelFormulario.includes(campo)) {
      porCampo[campo] = mensaje;
    } else {
      generales.push(mensaje);
    }
  }
  return { porCampo, generales };
}
