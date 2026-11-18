// Captura de pantalla de la app con Playwright, para comparar con los wireframes.
//
// Uso:
//   node scripts/captura.js --salida capturas/lista-movil.png --ancho 390
//   node scripts/captura.js --salida capturas/panel-movil.png --ancho 390 --clic "Regar Mandrágora"
//   node scripts/captura.js --salida capturas/error.png --clic "Regar Mandrágora" --rellenar "Cantidad (ml)=0" --clic "Guardar riego"
//
// Las acciones --clic (por texto o nombre accesible) y --rellenar ("Etiqueta=valor")
// se ejecutan en el orden en que se escriben.

const { chromium } = require("playwright");

const args = process.argv.slice(2);
const opciones = {
  url: "http://localhost:5173",
  ancho: 390,
  alto: 844,
  salida: null,
  pasos: [],
};
for (let i = 0; i < args.length; i += 2) {
  const [clave, valor] = [args[i], args[i + 1]];
  if (clave === "--url") opciones.url = valor;
  else if (clave === "--ancho") opciones.ancho = Number(valor);
  else if (clave === "--alto") opciones.alto = Number(valor);
  else if (clave === "--salida") opciones.salida = valor;
  else if (clave === "--clic") opciones.pasos.push({ tipo: "clic", valor });
  else if (clave === "--rellenar")
    opciones.pasos.push({ tipo: "rellenar", valor });
  else throw new Error(`Opción desconocida: ${clave}`);
}
if (!opciones.salida) throw new Error("Falta --salida <archivo.png>");

(async () => {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({
    viewport: { width: opciones.ancho, height: opciones.alto },
  });
  await pagina.goto(opciones.url);
  await pagina.waitForLoadState("networkidle");
  for (const paso of opciones.pasos) {
    if (paso.tipo === "clic") {
      const porRol = pagina
        .getByRole("button", { name: paso.valor })
        .or(pagina.getByRole("link", { name: paso.valor }));
      const objetivo =
        (await porRol.count()) > 0
          ? porRol.first()
          : pagina.getByText(paso.valor).first();
      await objetivo.click();
    } else {
      const [etiqueta, ...resto] = paso.valor.split("=");
      await pagina.getByLabel(etiqueta).fill(resto.join("="));
    }
    await pagina.waitForTimeout(300);
  }
  await pagina.screenshot({ path: opciones.salida, fullPage: true });
  await navegador.close();
  console.log(`Captura guardada en ${opciones.salida} (${opciones.ancho} px)`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
