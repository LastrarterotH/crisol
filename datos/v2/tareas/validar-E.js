// Valida un archivo de expansión contra el estado actual del juego (public/datos.json).
// Uso: node datos/v2/tareas/validar-E.js datos/v2/expansion-E1.json
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..", "..", "..");
const d = JSON.parse(fs.readFileSync(path.join(RAIZ, "public", "datos.json"), "utf8"));
const archivo = process.argv[2];
if (!archivo) { console.log("Uso: node validar-E.js RUTA"); process.exit(1); }
let x;
try { x = JSON.parse(fs.readFileSync(archivo, "utf8")); } catch (e) { console.log("JSON INVÁLIDO: " + e.message); process.exit(1); }
const etiqueta = (path.basename(archivo).match(/E\d+/) || [""])[0];
const pool = etiqueta && fs.existsSync(path.join(__dirname, "EMOJIS-" + etiqueta + ".txt")) ? new Set(fs.readFileSync(path.join(__dirname, "EMOJIS-" + etiqueta + ".txt"), "utf8").trim().split(/\s+/)) : null;
const errores = [], avisos = [];
const clave = (a, b) => [a, b].sort().join("+");
const palabras = s => (s || "").trim().split(/\s+/).filter(Boolean).length;
const FAMILIAS = Object.keys(d.familias);
const fichas = x.fichas || {}, recetas = x.recetas || [], misiones = x.misiones || [];

if (JSON.stringify(x).includes("—")) errores.push("hay una raya larga (—) en el archivo");
const emojisUsados = new Map(Object.entries(d.fichas).map(([id, f]) => [f.e, id]));
for (const [id, f] of Object.entries(fichas)) {
  if (!/^[a-z0-9_]+$/.test(id)) errores.push("id inválido: " + id);
  if (d.fichas[id]) errores.push("el id ya existe en el juego: " + id);
  if (!f.n || !f.e || !f.f) errores.push(id + ": faltan n, e o f");
  if (f.f && !FAMILIAS.includes(f.f) || f.f === "prim") errores.push(id + ": familia inválida " + f.f);
  if (emojisUsados.has(f.e)) errores.push(id + ": emoji repetido " + f.e + " (lo usa " + emojisUsados.get(f.e) + ")");
  else emojisUsados.set(f.e, id);
  if (pool && f.e && !pool.has(f.e)) avisos.push(id + ": el emoji " + f.e + " no está en tu lista EMOJIS-" + etiqueta + ".txt (puede chocar con otro agente)");
  if (Object.values(d.fichas).some(g => g.n.toLowerCase() === (f.n || "").toLowerCase())) errores.push(id + ": ya existe una ficha llamada " + f.n);
  if (f.f === "mito") { if (!f.belief || !f.evidence) errores.push(id + ": un mito necesita belief y evidence"); }
  else if (!f.why) errores.push(id + ": falta why");
  if (!f.pista) errores.push(id + ": falta pista");
  if (f.f !== "sint" && !f.uni && f.f !== "mito") avisos.push(id + ": falta uni");
  if (palabras(f.pista) > 20) avisos.push(id + ": pista de " + palabras(f.pista) + " palabras (máx. 18)");
  if (palabras(f.why) > 95) avisos.push(id + ": why de " + palabras(f.why) + " palabras (máx. ~85)");
  if (palabras(f.uni) > 40) avisos.push(id + ": uni de " + palabras(f.uni) + " palabras (máx. ~35)");
  if (f.f === "sint" && (!Array.isArray(f.principios) || f.principios.length < 3 || !f.prueba)) errores.push(id + ": una síntesis necesita principios (3 a 5) y prueba");
  for (const k of f.refs || []) if (!d.refs[k] && !(x.refs || {})[k]) errores.push(id + ": referencia desconocida " + k);
  if (!(f.refs || []).length && f.f !== "sint") avisos.push(id + ": sin referencias");
}
const existe = id => !!(d.fichas[id] || fichas[id]);
const ocupadas = new Map(d.recetas.map(r => [clave(r[0], r[1]), r[2]]));
const mias = new Map();
for (const r of recetas) {
  const k = clave(r.a, r.b);
  for (const id of [r.a, r.b, r.r]) if (!existe(id)) errores.push("receta " + k + ": id desconocido " + id);
  if (r.r === r.a || r.r === r.b) errores.push("receta circular " + k);
  if (d.iniciales.includes(r.r)) errores.push("receta " + k + " produce un primigenio");
  if (ocupadas.has(k)) errores.push("la pareja " + k + " ya tiene receta en el juego (= " + ocupadas.get(k) + ")");
  if (mias.has(k) && mias.get(k) !== r.r) errores.push("pareja repetida en tu archivo: " + k);
  mias.set(k, r.r);
  if (!r.nota) errores.push("receta " + k + " sin nota");
  else if (palabras(r.nota) > 32) avisos.push("nota " + k + " de " + palabras(r.nota) + " palabras (máx. ~28)");
}
for (const id of Object.keys(fichas)) if (!recetas.some(r => r.r === id)) errores.push(id + ": ninguna receta lo produce");

// Niveles y mezclas mínimas con todo junto
const todas = d.recetas.map(r => [r[0], r[1], r[2]]).concat(recetas.map(r => [r.a, r.b, r.r]));
const nivel = {}; for (const i of d.iniciales) nivel[i] = 0;
for (let c = true; c;) { c = false; for (const [a, b, r] of todas) { if (nivel[a] === undefined || nivel[b] === undefined) continue; const t = Math.max(nivel[a], nivel[b]) + 1; if (nivel[r] === undefined || t < nivel[r]) { nivel[r] = t; c = true; } } }
for (const id of Object.keys(fichas)) if (nivel[id] === undefined) errores.push(id + ": inalcanzable desde los primigenios");
const nec = {}; for (const i of d.iniciales) nec[i] = new Set();
for (let c = true; c;) { c = false; for (const [a, b, r] of todas) { if (!nec[a] || !nec[b] || d.iniciales.includes(r)) continue; const u = new Set([...nec[a], ...nec[b], r]); if (!nec[r] || u.size < nec[r].size) { nec[r] = u; c = true; } } }

for (const m of misiones) {
  for (const c of ["id", "n", "e", "meta", "encargo", "objetivo", "cierre"]) if (!m[c]) errores.push("misión " + (m.id || "?") + ": falta " + c);
  if (d.misiones.some(o => o.id === m.id)) errores.push("misión " + m.id + ": el id ya existe");
  if (!fichas[m.meta] || fichas[m.meta].f !== "sint") errores.push("misión " + m.id + ": la meta debe ser una ficha nueva de familia sint");
  if (fichas[m.meta] && (fichas[m.meta].n !== m.n || fichas[m.meta].e !== m.e)) avisos.push("misión " + m.id + ": usa el mismo nombre y emoji que su meta");
  if (!Array.isArray(m.hitos) || m.hitos.length !== 3) errores.push("misión " + m.id + ": necesita exactamente 3 hitos");
  const camino = nec[m.meta];
  if (!camino) { errores.push("misión " + m.id + ": la meta es inalcanzable"); continue; }
  for (const h of m.hitos || []) { if (!existe(h)) errores.push("misión " + m.id + ": hito desconocido " + h); else if (!camino.has(h)) avisos.push("misión " + m.id + ": el hito " + h + " no queda en el camino mínimo a la meta (debe ser un paso obligado)"); }
  for (const h of m.hitos || []) if (!(m.reflexiones || {})[h]) avisos.push("misión " + m.id + ": falta reflexión para el hito " + h);
  const n = camino.size;
  (n < 12 || n > 28 ? avisos : []).push("misión " + m.id + ": la meta exige " + n + " mezclas mínimas (busca entre 12 y 28)");
  console.log("misión " + m.id + ": meta en nivel " + nivel[m.meta] + ", " + n + " mezclas mínimas. Camino: " + [...camino].join(", "));
}
console.log("fichas nuevas " + Object.keys(fichas).length + " · recetas " + recetas.length + " · misiones " + misiones.length + " · refs nuevas " + Object.keys(x.refs || {}).length);
const porNivel = {}; for (const id of Object.keys(fichas)) porNivel[nivel[id]] = (porNivel[nivel[id]] || 0) + 1;
console.log("niveles de tus fichas: " + JSON.stringify(porNivel));
if (avisos.length) console.log("AVISOS (" + avisos.length + "):\n  " + avisos.join("\n  "));
console.log(errores.length ? "ERRORES (" + errores.length + "):\n  " + errores.join("\n  ") : "SIN ERRORES");
process.exitCode = errores.length ? 1 : 0;
