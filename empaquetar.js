// Empaqueta el juego en un único archivo HTML que funciona sin conexión y sin servidor:
// código, estilos, tipografías y datos quedan dentro del archivo.
// Uso: node empaquetar.js  (antes: node construir.js)
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const P = (...r) => path.join(__dirname, "public", ...r);
const SALIDA = path.join(__dirname, "dist", "Alquimia-Docente.html");

const js = esbuild.buildSync({ entryPoints: [P("js", "app.js")], bundle: true, format: "iife", target: "es2020", minify: true, write: false, legalComments: "none" }).outputFiles[0].text;
const fuentes = fs.readFileSync(P("fuentes.css"), "utf8").replace(/url\((fuentes\/[^)]+\.woff2)\)/g, (m, f) => "url(data:font/woff2;base64," + fs.readFileSync(P(f)).toString("base64") + ")");
const estilos = fs.readFileSync(P("estilos.css"), "utf8");
const datos = JSON.stringify(JSON.parse(fs.readFileSync(P("datos.json"), "utf8"))).replace(/</g, "\\u003c");
const sinCierre = s => s.replace(/<\/(script|style)/gi, "<\\/$1");

let html = fs.readFileSync(P("index.html"), "utf8");
const reemplazar = (buscar, por) => { if (!html.includes(buscar)) throw new Error("No encontré en index.html: " + buscar); html = html.replace(buscar, () => por); };
reemplazar('<link rel="stylesheet" href="fuentes.css">', "<style>" + fuentes + "</style>");
reemplazar('<link rel="stylesheet" href="estilos.css">', "<style>" + sinCierre(estilos) + "</style>");
reemplazar('<script type="module" src="js/app.js"></script>', "<script>window.DATOS=" + datos + ";</script>\n<script>" + sinCierre(js) + "</script>");

fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
fs.writeFileSync(SALIDA, html);
console.log("Listo: " + path.relative(__dirname, SALIDA) + " (" + Math.round(html.length / 1024) + " KB). Se abre con doble clic y funciona sin conexión.");
