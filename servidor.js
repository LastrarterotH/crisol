// Servidor local de Alquimia Docente.
// Sirve el juego, resuelve combinaciones nuevas con Claude Code (modo mínimo),
// guarda la caché compartida y coordina talleres en vivo (SSE).
// Uso: node servidor.js   (variables: PUERTO, ALQUIMIA_MODELO, ALQUIMIA_ESFUERZO, ALQUIMIA_SIN_ABRIR)
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn, execFile } = require("child_process");
const QRCode = require("qrcode");

const RAIZ = __dirname;
const PUBLICO = path.join(RAIZ, "public");
const DATOS_DIR = path.join(RAIZ, "servidor-datos");
const TALLERES_DIR = path.join(DATOS_DIR, "talleres");
const PUERTO = Number(process.env.PUERTO || 5480);
const MODELO = process.env.ALQUIMIA_MODELO || "claude-opus-5-5";
const ESFUERZO = process.env.ALQUIMIA_ESFUERZO || "low";
fs.mkdirSync(TALLERES_DIR, { recursive: true });

const TIPOS = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".md": "text/markdown; charset=utf-8"
};

// ---------- Utilidades ----------
const leerJSON = (p, def) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return def; } };
let guardando = new Map();
function guardarJSON(p, obj) {
  // escritura atómica y espaciada para no golpear el disco en cada evento
  clearTimeout(guardando.get(p));
  guardando.set(p, setTimeout(() => {
    const tmp = p + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 1));
    fs.renameSync(tmp, p);
  }, 250));
}
const esLocal = req => ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress);
function ipLan() {
  for (const lista of Object.values(os.networkInterfaces())) for (const i of lista || []) if (i.family === "IPv4" && !i.internal) return i.address;
  return "localhost";
}
function cuerpo(req) {
  return new Promise((ok, mal) => {
    let s = "";
    req.on("data", c => { s += c; if (s.length > 200000) { mal(new Error("demasiado grande")); req.destroy(); } });
    req.on("end", () => { try { ok(s ? JSON.parse(s) : {}); } catch (e) { mal(e); } });
  });
}
function json(res, codigo, obj) {
  res.writeHead(codigo, { "Content-Type": TIPOS[".json"], "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const sinRaya = s => String(s || "").replace(/\s*\u2014\s*/g, ", ").trim();
const corta = (s, n) => { s = sinRaya(s); if (s.length <= n) return s; const c = s.slice(0, n); return c.slice(0, Math.max(c.lastIndexOf(". ") + 1, c.lastIndexOf(" "))).replace(/[,;:]$/, "") + "…"; };
const clave = (a, b) => [a, b].sort().join("+");

// ---------- Datos del juego ----------
let DATOS = null;
function cargarDatos() { DATOS = leerJSON(path.join(PUBLICO, "datos.json"), null); }
cargarDatos();

// ---------- IA: caché compartida ----------
const IA_ARCHIVO = path.join(DATOS_DIR, "ia.json");
const IA = Object.assign({ cartas: {}, combos: {}, curaduria: {} }, leerJSON(IA_ARCHIVO, {}));
const enCurso = new Map();
let iaDisponible = null;
execFile("claude", ["--version"], (err) => { iaDisponible = !err; console.log(iaDisponible ? "IA: Claude Code disponible (" + MODELO + ", esfuerzo " + ESFUERZO + ")" : "IA: Claude Code no está disponible; solo funcionarán las recetas verificadas."); });

function resumenFicha(id) {
  const f = DATOS.fichas[id] || IA.cartas[id];
  if (!f) return id;
  const txt = f.belief ? "Es un mito. Se cree que: " + f.belief : (f.why || "");
  return f.n + " (" + (DATOS.familias[f.f] || "") + "). " + txt.split(/(?<=\.)\s/)[0].slice(0, 260);
}
function promptCombinar(a, b) {
  const existentes = Object.entries(DATOS.fichas).map(([id, f]) => id + " = " + f.e + " " + f.n).concat(
    Object.entries(IA.cartas).filter(([id]) => IA.curaduria[id] !== "rechazada").map(([id, f]) => id + " = " + f.e + " " + f.n)
  ).join("\n");
  return [
    "Eres el motor de recetas de \"Alquimia Docente\", un juego de combinación para docentes de educación superior. Se parte de cuatro elementos primigenios (Mente, Mundo, Otros, Tiempo) y, mezclando de a dos, se llega a conceptos de docencia universitaria. La persona juntó dos fichas y tú decides qué resulta. El resultado se muestra como ficha de estudio: tiene que ser verídico y defendible ante un especialista.",
    "",
    "FICHA A: " + resumenFicha(a),
    "FICHA B: " + resumenFicha(b),
    a === b ? "(Es la misma ficha dos veces: piensa qué idea reconocida surge de combinarla consigo misma.)" : "",
    "",
    "Reglas:",
    "1. Prefiere un resultado: el juego es más divertido cuando las mezclas producen algo. El resultado puede ser un concepto cotidiano de la enseñanza (como Pregunta o Error) o un concepto, modelo, metodología, hallazgo o práctica reconocida en pedagogía, psicología educativa, tecnología educativa, evaluación o docencia universitaria. Debe relacionarse de forma directa con AMBAS fichas y poder leerse como una frase con sentido (por ejemplo: Diálogo + Error = Retroalimentación).",
    "2. Si la relación sería forzada o inventada, responde \"ninguna\" y explica en una oración amable por qué, sugiriendo hacia dónde mirar.",
    "3. Si el resultado correcto ya existe en la lista de fichas, responde \"existente\" con su id. Nunca puede ser la ficha A ni la ficha B.",
    "4. Si la combinación lleva a una creencia popular que la investigación no respalda, responde \"mito\".",
    "5. Fuentes: de 0 a 2 referencias en APA 7 solo si estás seguro de que existen tal cual; omite volumen o páginas si no los recuerdas. Nunca inventes títulos ni DOI.",
    "6. Sin cifras dudosas ni citas textuales. Español latinoamericano neutro, tuteo, sin raya larga (\u2014).",
    "7. Evita estos patrones de escritura: \"no es X, sino Y\"; tríadas retóricas; dos puntos para rematar una idea; muletillas como \"además\" o \"cabe destacar\"; palabras de relleno como crucial, fundamental, fomentar, potenciar, ecosistema.",
    "8. \"familia\" es una de: cot (lo esencial), apr (cómo se aprende), met (metodologías), eva (evaluación), dis (diseño de la enseñanza), tec (tecnología), mod (modalidades), fund (conocimiento docente).",
    "9. \"nombre\" tiene máximo 5 palabras. \"nota\" tiene máximo 30 palabras. \"emoji\" es un solo emoji que no usa ninguna ficha de la lista. \"porque\" tiene 2 o 3 oraciones. \"aula\" es un ejemplo en una clase universitaria (una oración). \"pista\" describe el concepto sin nombrarlo. \"nota\" explica en una oración por qué A + B lleva a este resultado.",
    "",
    "Fichas existentes (id = emoji nombre):",
    existentes,
    "",
    "Responde solo con un objeto JSON, con una de estas formas:",
    "{\"tipo\":\"ninguna\",\"motivo\":\"...\"}",
    "{\"tipo\":\"existente\",\"id\":\"...\",\"nota\":\"...\"}",
    "{\"tipo\":\"nueva\",\"nombre\":\"...\",\"emoji\":\"...\",\"familia\":\"...\",\"porque\":\"...\",\"aula\":\"...\",\"pista\":\"...\",\"nota\":\"...\",\"fuentes\":[\"...\"]}",
    "{\"tipo\":\"mito\",\"nombre\":\"...\",\"emoji\":\"...\",\"creencia\":\"...\",\"evidencia\":\"...\",\"nota\":\"...\",\"fuentes\":[\"...\"]}"
  ].filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n");
}
function llamarClaude(prompt) {
  return new Promise((ok, mal) => {
    const args = ["-p", prompt, "--output-format", "json", "--model", MODELO, "--effort", ESFUERZO, "--tools", "",
      "--system-prompt", "Eres un motor de datos para un juego educativo. Respondes solo con JSON válido, sin texto adicional.",
      "--setting-sources", "", "--no-session-persistence", "--strict-mcp-config", "--exclude-dynamic-system-prompt-sections"];
    const p = spawn("claude", args, { cwd: os.tmpdir(), env: process.env });
    let out = "", err = "";
    const t = setTimeout(() => { p.kill("SIGKILL"); mal(new Error("tiempo agotado")); }, 90000);
    p.stdout.on("data", d => { out += d; });
    p.stderr.on("data", d => { err += d; });
    p.on("close", () => {
      clearTimeout(t);
      try {
        const env = JSON.parse(out.slice(out.indexOf("{"), out.lastIndexOf("}") + 1));
        if (env.is_error) return mal(new Error(env.result || "error de Claude"));
        const r = String(env.result || "");
        ok(JSON.parse(r.slice(r.indexOf("{"), r.lastIndexOf("}") + 1)));
      } catch (e) { mal(new Error("respuesta ilegible: " + (err || out).slice(0, 200))); }
    });
  });
}
function interpretar(o, a, b) {
  const NINGUNA = "estas dos fichas no forman un concepto establecido. Prueba con otra pareja.";
  if (!o || typeof o !== "object") return null;
  const valido = id => (DATOS.fichas[id] || IA.cartas[id]) && id !== a && id !== b && !(DATOS.fichas[id] && DATOS.fichas[id].f === "prim");
  const tipo = String(o.tipo || "");
  if (tipo === "ninguna") return { none: true, motivo: sinRaya(o.motivo).slice(0, 260) || NINGUNA };
  if (tipo === "existente") return valido(String(o.id)) ? { res: String(o.id), nota: corta(o.nota, 360) } : { none: true, motivo: NINGUNA };
  if (tipo !== "nueva" && tipo !== "mito") return null;
  const n = sinRaya(o.nombre).slice(0, 60);
  if (!n) return null;
  const todas = Object.assign({}, IA.cartas, DATOS.fichas);
  const igual = Object.keys(todas).find(id => norm(todas[id].n) === norm(n));
  if (igual) return valido(igual) && IA.curaduria[igual] !== "rechazada" ? { res: igual, nota: corta(o.nota, 360) } : { none: true, motivo: NINGUNA };
  const id = "ia-" + norm(n).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  let e = String(o.emoji || "").trim().slice(0, 8);
  if (!e || Object.values(todas).some(f => f.e === e)) e = "✨";
  const familias = ["cot", "apr", "met", "eva", "dis", "tec", "mod", "fund", "mito"];
  const carta = tipo === "mito"
    ? { n, e, f: "mito", belief: sinRaya(o.creencia).slice(0, 500), evidence: sinRaya(o.evidencia).slice(0, 1200), tip: DATOS.pistaMito }
    : { n, e, f: familias.includes(o.familia) ? o.familia : "apr", why: sinRaya(o.porque).slice(0, 1200), uni: sinRaya(o.aula).slice(0, 400), pista: sinRaya(o.pista).slice(0, 200) };
  carta.refs = (Array.isArray(o.fuentes) ? o.fuentes : []).slice(0, 2).map(s => String(s).replace(/\u2014/g, "-").slice(0, 400));
  carta.ia = true; carta.via = [a, b]; carta.creada = Date.now();
  if (tipo === "mito" ? !(carta.belief && carta.evidence) : !carta.why) return null;
  IA.cartas[id] = carta;
  return { res: id, nota: corta(o.nota, 360), carta };
}
async function combinarIA(a, b) {
  const k = clave(a, b);
  if (IA.combos[k]) return IA.combos[k];
  if (enCurso.has(k)) return enCurso.get(k);
  const tarea = (async () => {
    const salida = await llamarClaude(promptCombinar(a, b));
    const r = interpretar(salida, a, b);
    if (!r) throw new Error("formato inesperado");
    const doc = r.none ? { none: true, motivo: r.motivo } : { res: r.res, nota: r.nota || "" };
    IA.combos[k] = doc;
    guardarJSON(IA_ARCHIVO, IA);
    return doc;
  })();
  enCurso.set(k, tarea);
  try { return await tarea; } finally { enCurso.delete(k); }
}

// ---------- Talleres ----------
const TALLERES = new Map();
for (const f of fs.readdirSync(TALLERES_DIR)) if (f.endsWith(".json")) { const t = leerJSON(path.join(TALLERES_DIR, f), null); if (t && t.codigo) TALLERES.set(t.codigo, t); }
const oyentes = new Map(); // codigo -> Set(res)
function codigoNuevo() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let c;
  do { c = Array.from({ length: 4 }, () => letras[Math.floor(Math.random() * letras.length)]).join(""); } while (TALLERES.has(c));
  return c;
}
function guardarTaller(t) { guardarJSON(path.join(TALLERES_DIR, t.codigo + ".json"), t); }
function emitir(codigo, evento) {
  const set = oyentes.get(codigo);
  if (!set) return;
  const linea = "data: " + JSON.stringify(evento) + "\n\n";
  for (const res of set) res.write(linea);
}
const vistaTaller = t => ({ codigo: t.codigo, titulo: t.titulo, mision: t.mision, banco: t.banco, activo: t.activo, creado: t.creado, jugadores: t.jugadores, eventos: t.eventos.slice(-60), reflexiones: t.reflexiones });
setInterval(() => { for (const set of oyentes.values()) for (const res of set) res.write(": latido\n\n"); }, 25000);

// ---------- Rutas ----------
async function api(req, res, url) {
  const p = url.pathname;
  if (p === "/api/estado" && req.method === "GET") {
    return json(res, 200, { ia: iaDisponible !== false, modelo: MODELO, local: esLocal(req), lan: "http://" + ipLan() + ":" + PUERTO });
  }
  if (p === "/api/ia" && req.method === "GET") return json(res, 200, IA);
  if (p === "/api/combinar" && req.method === "POST") {
    const { a, b } = await cuerpo(req);
    const existe = id => DATOS.fichas[id] || IA.cartas[id];
    if (!existe(a) || !existe(b)) return json(res, 400, { error: "fichas desconocidas" });
    if (iaDisponible === false) return json(res, 503, { error: "La IA no está disponible en este computador." });
    try {
      const doc = await combinarIA(a, b);
      return json(res, 200, Object.assign({}, doc, doc.res && IA.cartas[doc.res] ? { carta: IA.cartas[doc.res] } : {}));
    } catch (e) { return json(res, 502, { error: "No se pudo consultar a Claude: " + e.message }); }
  }
  if (p === "/api/curar" && req.method === "POST") {
    if (!esLocal(req)) return json(res, 403, { error: "Solo desde el computador que aloja el juego." });
    const { id, estado } = await cuerpo(req);
    if (!IA.cartas[id] || !["aprobada", "rechazada", "pendiente"].includes(estado)) return json(res, 400, { error: "datos inválidos" });
    IA.curaduria[id] = estado; guardarJSON(IA_ARCHIVO, IA);
    return json(res, 200, { ok: true });
  }
  if (p === "/api/taller" && req.method === "POST") {
    if (!esLocal(req)) return json(res, 403, { error: "El taller se crea desde el computador que aloja el juego." });
    const { mision, titulo, banco } = await cuerpo(req);
    if (!DATOS.misiones.some(m => m.id === mision)) return json(res, 400, { error: "misión desconocida" });
    const t = { codigo: codigoNuevo(), titulo: String(titulo || "Taller").slice(0, 80), mision, banco: !!banco, activo: true, creado: Date.now(), jugadores: {}, eventos: [], reflexiones: [] };
    TALLERES.set(t.codigo, t); guardarTaller(t);
    const enlace = "http://" + ipLan() + ":" + PUERTO + "/?taller=" + t.codigo;
    const qr = await QRCode.toString(enlace, { type: "svg", margin: 1, color: { dark: "#1c2f26", light: "#f3f1e6" } });
    return json(res, 200, { taller: vistaTaller(t), enlace, qr });
  }
  const m = p.match(/^\/api\/taller\/([A-Z]{4})(?:\/(\w+))?$/);
  if (m) {
    const t = TALLERES.get(m[1]);
    if (!t) return json(res, 404, { error: "No existe un taller con ese código." });
    const accion = m[2];
    if (!accion && req.method === "GET") {
      const enlace = "http://" + ipLan() + ":" + PUERTO + "/?taller=" + t.codigo;
      const qr = await QRCode.toString(enlace, { type: "svg", margin: 1, color: { dark: "#1c2f26", light: "#f3f1e6" } });
      return json(res, 200, { taller: vistaTaller(t), enlace, qr });
    }
    if (accion === "stream" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
      res.write("data: " + JSON.stringify({ tipo: "estado", taller: vistaTaller(t) }) + "\n\n");
      if (!oyentes.has(t.codigo)) oyentes.set(t.codigo, new Set());
      oyentes.get(t.codigo).add(res);
      req.on("close", () => oyentes.get(t.codigo).delete(res));
      return;
    }
    if (accion === "unirse" && req.method === "POST") {
      if (!t.activo) return json(res, 409, { error: "Este taller ya terminó." });
      const { nombre, avatar, id } = await cuerpo(req);
      const jid = id && t.jugadores[id] ? id : "j" + Math.random().toString(36).slice(2, 9);
      t.jugadores[jid] = Object.assign(t.jugadores[jid] || { piezas: {}, nuevas: 0 }, { nombre: String(nombre || "Docente").slice(0, 40), avatar: String(avatar || "🧑‍🏫").slice(0, 8), unido: Date.now() });
      guardarTaller(t);
      emitir(t.codigo, { tipo: "jugador", id: jid, jugador: t.jugadores[jid] });
      return json(res, 200, { id: jid, taller: vistaTaller(t) });
    }
    if (accion === "evento" && req.method === "POST") {
      const e = await cuerpo(req);
      const j = t.jugadores[e.jugador];
      if (!j || !t.activo) return json(res, 409, { error: "No estás en un taller activo." });
      const ahora = Date.now();
      if (e.tipo === "descubrimiento" && typeof e.carta === "string") {
        if (!j.piezas[e.carta]) { j.piezas[e.carta] = ahora; j.nuevas++; }
        const ev = { t: ahora, jugador: e.jugador, tipo: "descubrimiento", carta: e.carta, primero: !Object.entries(t.jugadores).some(([id, o]) => id !== e.jugador && o.piezas[e.carta] && o.piezas[e.carta] < ahora) };
        t.eventos.push(ev); if (t.eventos.length > 400) t.eventos.shift();
        emitir(t.codigo, Object.assign({ tipo: "evento" }, { evento: ev, piezas: j.piezas }));
      } else if (e.tipo === "reflexion" && typeof e.texto === "string") {
        const r = { t: ahora, jugador: e.jugador, hito: String(e.hito || ""), texto: e.texto.slice(0, 600) };
        t.reflexiones.push(r);
        emitir(t.codigo, { tipo: "reflexion", reflexion: r });
      } else return json(res, 400, { error: "evento inválido" });
      guardarTaller(t);
      return json(res, 200, { ok: true });
    }
    if (accion === "cerrar" && req.method === "POST") {
      if (!esLocal(req)) return json(res, 403, { error: "Solo quien facilita puede cerrar el taller." });
      t.activo = false; t.cerrado = Date.now(); guardarTaller(t);
      emitir(t.codigo, { tipo: "cerrado" });
      return json(res, 200, { ok: true });
    }
  }
  return json(res, 404, { error: "ruta desconocida" });
}

function estatico(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/" || rel === "/proyeccion") rel = "/index.html";
  const archivo = path.normalize(path.join(PUBLICO, rel));
  if (!archivo.startsWith(PUBLICO)) { res.writeHead(403); return res.end(); }
  fs.readFile(archivo, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("No encontrado"); }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(archivo)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(buf);
  });
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) return await api(req, res, url);
    if (url.pathname === "/datos.json") cargarDatos();
    return estatico(req, res, url);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) json(res, 500, { error: "Error interno: " + e.message });
  }
});
servidor.listen(PUERTO, "0.0.0.0", () => {
  const local = "http://localhost:" + PUERTO;
  console.log("\nAlquimia Docente está corriendo.\n  En este computador: " + local + "\n  En la red local (para talleres): http://" + ipLan() + ":" + PUERTO + "\n");
  if (!process.env.ALQUIMIA_SIN_ABRIR && process.platform === "darwin") spawn("open", [local], { stdio: "ignore", detached: true }).unref();
});
