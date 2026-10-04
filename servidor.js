// Servidor de desarrollo: solo sirve los archivos de public/ en este computador.
// El juego no necesita servidor para funcionar; para repartirlo se usa el archivo de `npm run empaquetar`.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PUERTO = Number(process.env.PUERTO || 5480);
const PUBLICO = path.join(__dirname, "public");
const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };

http.createServer((req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const archivo = path.normalize(path.join(PUBLICO, ruta === "/" ? "index.html" : ruta));
  if (!archivo.startsWith(PUBLICO) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) { res.writeHead(404); res.end("No encontrado"); return; }
  res.writeHead(200, { "Content-Type": TIPOS[path.extname(archivo)] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(archivo).pipe(res);
}).listen(PUERTO, "127.0.0.1", () => {
  const url = "http://localhost:" + PUERTO;
  console.log("Crisol (desarrollo) en " + url);
  if (!process.env.ALQUIMIA_SIN_ABRIR && process.platform === "darwin") spawn("open", [url], { stdio: "ignore", detached: true }).unref();
});
