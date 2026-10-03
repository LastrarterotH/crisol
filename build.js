// Arma index.html: une los datos (base, catálogo, partes escritas, preanálisis y ajustes),
// valida el grafo, calcula la constelación e inyecta todo en la plantilla.
// Uso: node build.js
const fs = require("fs");
const path = require("path");
const { cargarGrafo } = require("./grafo.js");

const R = p => path.join(__dirname, p);
const leer = p => { try { return JSON.parse(fs.readFileSync(R(p), "utf8")); } catch (e) { if (fs.existsSync(R(p))) console.log("JSON inválido: " + p + " (" + e.message + ")"); return null; } };
const avisos = [], errores = [];
const clave = (a, b) => [a, b].sort().join("+");

const g = cargarGrafo();
errores.push(...g.errores);
const base = g.base;
const ajustes = leer("datos/ajustes.json") || {};

// ---------- Referencias ----------
const refs = { ...base.refs };
const remapeo = {};
for (const x of ["A", "B", "C", "D", "E", "F"]) {
  const p = leer("datos/parte-" + x + ".json");
  if (!p) { avisos.push("falta parte " + x); continue; }
  remapeo[x] = {};
  for (const [k, v] of Object.entries(p.refs || {})) {
    if (refs[k] && refs[k] !== v) {
      const nk = k + "_" + x.toLowerCase();
      remapeo[x][k] = nk; refs[nk] = v;
    } else refs[k] = v;
  }
}
Object.assign(refs, ajustes.refs || {});

// ---------- Fichas ----------
const fichas = {};
for (const [id, f] of Object.entries(base.fichas)) fichas[id] = { ...f };
for (const [id, f] of Object.entries(g.cat.nuevas)) fichas[id] = { ...f };
const notas = {};
for (const x of ["A", "B", "C", "D", "E", "F"]) {
  const p = leer("datos/parte-" + x + ".json");
  if (!p) continue;
  const mapa = k => (remapeo[x] && remapeo[x][k]) || k;
  for (const [id, d] of Object.entries(p.fichas || {})) {
    if (!fichas[id]) { avisos.push("parte " + x + ": ficha desconocida " + id); continue; }
    const f = fichas[id];
    if (d.pista) f.pista = d.pista;
    if (base.fichas[id]) continue; // las existentes conservan su texto
    for (const c of ["why", "uni", "belief", "evidence", "q", "tip"]) if (d[c]) f[c] = d[c];
    if (Array.isArray(d.refs)) f.refs = d.refs.map(mapa);
  }
  for (const [k, v] of Object.entries(p.notas || {})) notas[k] = v;
}
for (const [id, d] of Object.entries(ajustes.fichas || {})) if (fichas[id]) Object.assign(fichas[id], d);
for (const id of Object.keys(fichas)) if (fichas[id].f === "mito" && !fichas[id].tip) fichas[id].tip = base.pistaMito;

// ---------- Recetas ----------
const recetas = [];
const porClave = new Map();
const quitar = new Set(ajustes.quitarRecetas || []);
function agregar(a, b, r, nota, origen) {
  const k = clave(a, b);
  if (quitar.has(k)) return;
  if (!fichas[a] || !fichas[b] || !fichas[r]) { avisos.push(origen + ": id inexistente en " + a + " + " + b + " = " + r); return; }
  if (r === a || r === b || fichas[r].f === "base") { avisos.push(origen + ": receta inválida " + k + " = " + r); return; }
  if (porClave.has(k)) {
    const prev = porClave.get(k);
    if (prev[2] !== r) avisos.push(origen + ": choque " + k + " = " + prev[2] + " / " + r + " (se mantiene " + prev[2] + ")");
    else if (nota && !prev[3]) prev[3] = nota;
    return;
  }
  const rec = [a, b, r, nota || ""];
  porClave.set(k, rec); recetas.push(rec);
}
for (const [a, b, r] of g.recetas) agregar(a, b, r, notas[clave(a, b)], "recetas.txt");
for (const [a, b, r, n] of ajustes.recetasExtra || []) agregar(a, b, r, n, "ajustes");
const sugerencias = [];
for (let i = 1; i <= 5; i++) {
  const p = leer("datos/pre-P" + i + ".json");
  if (!p) { avisos.push("falta preanálisis P" + i); continue; }
  for (const x of p.recetas || []) agregar(x.a, x.b, x.r, x.nota, "P" + i);
  for (const s of p.sugerencias || []) sugerencias.push({ ...s, grupo: "P" + i });
}

// ---------- Limpieza de texto: nunca raya larga ----------
function limpiar(o, donde) {
  if (typeof o === "string") {
    if (o.includes("—")) { avisos.push("raya larga reemplazada en " + donde); return o.replace(/\s*—\s*/g, ", "); }
    return o;
  }
  if (Array.isArray(o)) return o.map((v, i) => limpiar(v, donde + "[" + i + "]"));
  if (o && typeof o === "object") { for (const k of Object.keys(o)) o[k] = limpiar(o[k], donde + "." + k); return o; }
  return o;
}
limpiar(fichas, "fichas"); limpiar(refs, "refs");
for (const r of recetas) r[3] = limpiar(r[3], "nota " + r[0] + "+" + r[1]);

// ---------- Validación ----------
const ids = Object.keys(fichas);
for (const id of ids) {
  const f = fichas[id];
  if (f.f === "base") continue;
  if (f.f === "mito" ? !(f.belief && f.evidence) : !f.why) errores.push("sin texto: " + id);
  if (!f.pista) avisos.push("sin pista: " + id);
  if (!f.refs || !f.refs.length) avisos.push("sin fuentes: " + id);
  for (const k of f.refs || []) if (!refs[k]) errores.push("ref inexistente " + k + " en " + id);
}
const sinNota = recetas.filter(r => !r[3]).length;
if (sinNota) avisos.push(sinNota + " recetas sin nota");
const tier = {};
for (const id of base.iniciales) tier[id] = 0;
for (let cambio = true; cambio;) {
  cambio = false;
  const deriv = Object.keys(tier).filter(i => fichas[i].f !== "base").length;
  for (const u of base.desbloqueos) if (deriv >= u.tras && tier[u.id] === undefined) { tier[u.id] = 0; cambio = true; }
  for (const [a, b, r] of recetas) {
    if (tier[a] === undefined || tier[b] === undefined) continue;
    const t = Math.max(tier[a], tier[b]) + 1;
    if (tier[r] === undefined || t < tier[r]) { tier[r] = t; cambio = true; }
  }
}
const inal = ids.filter(i => tier[i] === undefined);
if (inal.length) errores.push("inalcanzables: " + inal.join(", "));
const emojis = {};
for (const id of ids) { const e = fichas[id].e; if (emojis[e]) errores.push("emoji repetido " + e + ": " + emojis[e] + ", " + id); emojis[e] = id; }

// ---------- Constelación ----------
function semilla(s) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function constelacion() {
  const orden = ["apr", "met", "mod", "tec", "mito", "eva", "dis", "fund"];
  const anclas = { base: { x: 0, y: 0 } };
  orden.forEach((f, i) => { const ang = -Math.PI / 2 + i * 2 * Math.PI / orden.length; anclas[f] = { x: Math.cos(ang) * 640, y: Math.sin(ang) * 470 }; });
  const rnd = semilla(20261003);
  const N = ids.map(id => ({ id, f: fichas[id].f, x: anclas[fichas[id].f].x + (rnd() - .5) * 220, y: anclas[fichas[id].f].y + (rnd() - .5) * 220, vx: 0, vy: 0 }));
  const idx = Object.fromEntries(N.map((n, i) => [n.id, i]));
  const aristas = [];
  for (const [a, b, r] of recetas) { aristas.push([idx[a], idx[r]]); aristas.push([idx[b], idx[r]]); }
  const IT = 700;
  for (let it = 0; it < IT; it++) {
    const temp = 1 - it / IT;
    for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
      const p = N[i], q = N[j];
      let dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
      if (d2 < 1) { dx = rnd() - .5; dy = rnd() - .5; d2 = 1; }
      const d = Math.sqrt(d2);
      let f = 2600 / d2;
      if (d < 46) f += (46 - d) * 0.6;
      f = Math.min(f, 30);
      p.vx += dx / d * f; p.vy += dy / d * f; q.vx -= dx / d * f; q.vy -= dy / d * f;
    }
    for (const [i, j] of aristas) {
      const p = N[i], q = N[j];
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1;
      const k = p.f === q.f ? 0.012 : 0.0016;
      const f = (d - 80) * k;
      p.vx += dx / d * f; p.vy += dy / d * f; q.vx -= dx / d * f; q.vy -= dy / d * f;
    }
    for (const n of N) {
      const a = anclas[n.f], k = n.f === "base" ? 0.08 : 0.018;
      n.vx += (a.x - n.x) * k; n.vy += (a.y - n.y) * k;
      n.vx *= 0.82; n.vy *= 0.82;
      n.x += n.vx * (0.25 + temp); n.y += n.vy * (0.25 + temp);
    }
  }
  const bases = N.filter(n => n.f === "base");
  bases.forEach((n, i) => { const ang = -Math.PI / 2 + i * 2 * Math.PI / bases.length; n.x = Math.cos(ang) * 150; n.y = Math.sin(ang) * 115; });
  for (const n of N) { fichas[n.id].x = Math.round(n.x); fichas[n.id].y = Math.round(n.y); }
  return anclas;
}
const anclas = constelacion();

// ---------- Salida ----------
const rutas = g.cat.rutas;
const DATOS = {
  version: new Date().toISOString().slice(0, 10),
  familias: base.familias, orden: base.orden, refs, fichas, recetas, rutas,
  iniciales: base.iniciales, desbloqueos: base.desbloqueos, pistaMito: base.pistaMito,
  analizadas: leer("datos/analizadas.json") || [], anclas
};
const json = JSON.stringify(DATOS);
if (json.includes("—")) errores.push("quedó una raya larga en los datos");
const css = fs.readFileSync(R("src/estilos.css"), "utf8");
const cuerpo = fs.readFileSync(R("src/cuerpo.html"), "utf8");
const motor = fs.readFileSync(R("src/motor.js"), "utf8");
const html = cuerpo
  .replace("/*ESTILOS*/", () => css)
  .replace("/*DATOS*/", () => "const DATOS = " + json.replace(/<\/script/gi, "<\\/script") + ";")
  .replace("/*MOTOR*/", () => motor);
for (const s of [css, cuerpo, motor]) if (s.includes("—")) errores.push("raya larga en el código fuente");
fs.writeFileSync(R("index.html"), html);
fs.writeFileSync(R("datos/sugerencias.json"), JSON.stringify(sugerencias, null, 1));

const porTier = {};
for (const t of Object.values(tier)) porTier[t] = (porTier[t] || 0) + 1;
const nRec = {};
for (const [, , r] of recetas) nRec[r] = (nRec[r] || 0) + 1;
const una = ids.filter(i => fichas[i].f !== "base" && nRec[i] === 1).length;
console.log("fichas " + ids.length + " · recetas " + recetas.length + " · refs " + Object.keys(refs).length + " · niveles " + JSON.stringify(porTier) + " · con una sola receta " + una + " · sugerencias " + sugerencias.length);
console.log("index.html " + Math.round(html.length / 1024) + " KB");
if (avisos.length) console.log("AVISOS (" + avisos.length + "):\n  " + avisos.slice(0, 60).join("\n  ") + (avisos.length > 60 ? "\n  ..." : ""));
console.log(errores.length ? "ERRORES:\n  " + errores.join("\n  ") : "OK");
process.exitCode = errores.length ? 1 : 0;
