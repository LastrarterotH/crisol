// Construye public/datos.json a partir de datos/v2: grafo, textos, filtro, preanálisis y ajustes.
// Valida (colisiones, alcanzabilidad, emojis, rayas largas) y calcula los planos de misión.
// Uso: node construir.js
const fs = require("fs");
const path = require("path");
const { cargarGrafo2, clave } = require("./grafo2.js");

const V = p => path.join(__dirname, "datos", "v2", p);
const leer = p => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { if (fs.existsSync(p)) console.log("JSON inválido: " + p + " (" + e.message + ")"); return null; } };
const avisos = [], errores = [];

// ---------- Grafo base + preanálisis + ajustes ----------
const ajustes = leer(V("ajustes.json")) || {};
const extra = [];
// quitar-D.txt: recetas de densificación que acortaban demasiado el camino a hitos y metas de las misiones
const quitarD = new Set((fs.existsSync(V("quitar-D.txt")) ? fs.readFileSync(V("quitar-D.txt"), "utf8") : "").split("\n").filter(l => l.includes("+") && !l.startsWith("#")).map(l => clave(...l.split("+").map(t => t.trim()))));
for (const x of ["P1", "P2", "P3", "D1", "D2"]) {
  const p = leer(V("pre-" + x + ".json"));
  if (!p) { avisos.push("falta pre-" + x); continue; }
  for (const r of p.recetas || []) { if (x[0] === "D" && quitarD.has(clave(r.a, r.b))) continue; const rec = [r.a, r.b, r.r, r.nota || ""]; rec.origen = x; extra.push(rec); }
}
for (const r of ajustes.recetasExtra || []) { const rec = [r[0], r[1], r[2], r[3] || ""]; rec.origen = "ajustes"; extra.push(rec); }
// Expansiones: misiones nuevas con sus fichas. Sus recetas hacia fichas nuevas son parte del grafo diseñado (origen "exp");
// las de conexión hacia fichas existentes son caminos alternativos (origen "expx").
const expFichas = {}, expMisiones = [], expTextos = [];
for (const x of ["E1", "E2", "E3", "E4", "E5", "E6"]) {
  const p = leer(V("expansion-" + x + ".json"));
  if (!p) continue;
  for (const [id, f] of Object.entries(p.fichas || {})) { if (expFichas[id]) { avisos.push(x + ": ficha repetida entre expansiones " + id); continue; } expFichas[id] = { n: f.n, e: f.e, f: f.f, _de: x }; }
  for (const m of p.misiones || []) expMisiones.push({ id: m.id, n: m.n, e: m.e, meta: m.meta, hitos: m.hitos, _de: x });
  expTextos.push([x, p]);
}
for (const [x, p] of expTextos) for (const r of p.recetas || []) { const rec = [r.a, r.b, r.r, r.nota || ""]; rec.origen = expFichas[r.r] ? "exp" : "expx"; rec.de = x; extra.unshift(rec); }
// el preanálisis no debe chocar con lo existente: se descartan sus colisiones en vez de fallar
const base = cargarGrafo2({ quitar: ajustes.quitarRecetas || [], fichas: expFichas });
const ocupadas = new Map(base.recetas.map(r => [clave(r[0], r[1]), r[2]]));
const extraOk = [];
for (const rec of extra) {
  const k = clave(rec[0], rec[1]);
  if ((ajustes.quitarRecetas || []).includes(k)) continue;
  if (ocupadas.has(k)) { if (ocupadas.get(k) !== rec[2]) avisos.push(rec.origen + ": choque " + k + " = " + ocupadas.get(k) + " / " + rec[2] + " (se mantiene " + ocupadas.get(k) + ")"); continue; }
  ocupadas.set(k, rec[2]); extraOk.push(rec);
}
const g = cargarGrafo2({ quitar: ajustes.quitarRecetas || [], recetas: extraOk, fichas: expFichas, misiones: expMisiones });
errores.push(...g.errores);
const F = g.fichas;

// ---------- Textos ----------
const refs = leer(V("refs.json")) || {};
Object.assign(refs, ajustes.refs || {});
const notas = {};
function mezclarRefs(origen, nuevas, remap) {
  for (const [k, v] of Object.entries(nuevas || {})) {
    if (refs[k] && refs[k] !== v) { const nk = k + "_" + origen.toLowerCase(); remap[k] = nk; refs[nk] = v; } else refs[k] = v;
  }
}
const misionesTxt = {};
for (const x of ["N1", "N2"]) {
  const p = leer(V("parte-" + x + ".json"));
  if (!p) { avisos.push("falta parte-" + x); continue; }
  const remap = {};
  mezclarRefs(x, p.refs, remap);
  for (const [id, d] of Object.entries(p.fichas || {})) {
    if (!F[id]) { avisos.push(x + ": ficha desconocida " + id); continue; }
    for (const c of ["pista", "why", "uni", "q", "belief", "evidence", "principios", "prueba"]) if (d[c]) F[id][c] = d[c];
    if (Array.isArray(d.refs)) F[id].refs = d.refs.map(k => remap[k] || k);
  }
  Object.assign(notas, p.notas || {});
  Object.assign(misionesTxt, p.misiones || {});
}
for (const [x, p] of expTextos) {
  const remap = {};
  mezclarRefs(x, p.refs, remap);
  for (const [id, d] of Object.entries(p.fichas || {})) {
    if (!F[id] || F[id]._de !== x) continue;
    for (const c of ["pista", "why", "uni", "q", "belief", "evidence", "principios", "prueba"]) if (d[c]) F[id][c] = d[c];
    if (Array.isArray(d.refs)) F[id].refs = d.refs.map(k => remap[k] || k);
    delete F[id]._de;
  }
  for (const m of p.misiones || []) misionesTxt[m.id] = { encargo: m.encargo, objetivo: m.objetivo, reflexiones: m.reflexiones || {}, cierre: m.cierre };
}
const informeFiltro = [];
for (const x of ["F1", "F2", "F3"]) {
  const p = leer(V("filtro-" + x + ".json"));
  if (!p) { avisos.push("falta filtro-" + x); continue; }
  for (const [id, d] of Object.entries(p.fichas || {})) {
    if (!F[id]) continue;
    for (const c of ["pista", "why", "uni", "belief", "evidence"]) if (typeof d[c] === "string" && d[c].trim()) F[id][c] = d[c];
  }
  Object.assign(notas, p.notas || {});
  informeFiltro.push(...(p.informe || []));
}
for (const [id, d] of Object.entries(ajustes.fichas || {})) if (F[id]) Object.assign(F[id], d);
for (const [k, v] of Object.entries(ajustes.notas || {})) notas[k] = v;
for (const id of Object.keys(F)) if (F[id].f === "mito") F[id].tip = "Combínalo con 📓 Práctica reflexiva para desarmarlo.";
for (const r of g.recetas) { const n = notas[clave(r[0], r[1])]; if (n) r[3] = n; }

// Las síntesis citan autores en sus principios: esas obras se suman a su lista de fuentes.
const norma = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
for (const id of Object.keys(F)) {
  const f = F[id];
  if (f.f !== "sint" || !Array.isArray(f.principios)) continue;
  f.refs = f.refs || [];
  for (const pr of f.principios) {
    const cita = pr.match(/\(([^()]+)\)\s*\.?\s*$/);
    if (!cita) continue;
    for (const parte of cita[1].split(";")) {
      const m = parte.match(/([A-ZÁÉÍÓÚÑ][\wáéíóúñü'-]+).*?(\d{4})/);
      if (!m) continue;
      const clave = Object.keys(refs).find(k => norma(refs[k]).startsWith(norma(m[1])) && refs[k].includes("(" + m[2]));
      if (clave && !f.refs.includes(clave)) f.refs.push(clave);
    }
  }
}

// ---------- Limpieza: nunca raya larga ----------
function limpiar(o, donde) {
  if (typeof o === "string") return o.includes("\u2014") ? (avisos.push("raya larga reemplazada en " + donde), o.replace(/\s*\u2014\s*/g, ", ")) : o;
  if (Array.isArray(o)) return o.map((v, i) => limpiar(v, donde + "[" + i + "]"));
  if (o && typeof o === "object") { for (const k of Object.keys(o)) o[k] = limpiar(o[k], donde + "." + k); return o; }
  return o;
}
limpiar(F, "fichas"); limpiar(refs, "refs"); limpiar(misionesTxt, "misiones");
for (const r of g.recetas) r[3] = limpiar(r[3], "nota " + r[0] + "+" + r[1]);

// ---------- Niveles ----------
const nivel = {};
for (const id of g.cat.iniciales) nivel[id] = 0;
for (let cambio = true; cambio;) {
  cambio = false;
  for (const [a, b, r] of g.recetas) {
    if (nivel[a] === undefined || nivel[b] === undefined) continue;
    const t = Math.max(nivel[a], nivel[b]) + 1;
    if (nivel[r] === undefined || t < nivel[r]) { nivel[r] = t; cambio = true; }
  }
}
const ids = Object.keys(F);
const inal = ids.filter(i => nivel[i] === undefined);
if (inal.length) errores.push("inalcanzables: " + inal.join(", "));
const emojis = {};
for (const id of ids) { const e = F[id].e; if (emojis[e]) errores.push("emoji repetido " + e + ": " + emojis[e] + ", " + id); emojis[e] = id; }
for (const id of ids) {
  const f = F[id];
  if (f.f === "prim") { if (!f.why) avisos.push("primigenio sin texto: " + id); continue; }
  if (f.f === "mito" ? !(f.belief && f.evidence) : !f.why) avisos.push("sin texto: " + id);
  if (!f.pista) avisos.push("sin pista: " + id);
  for (const k of f.refs || []) if (!refs[k]) errores.push("ref inexistente " + k + " en " + id);
}
const sinNota = g.recetas.filter(r => !r[3]);
if (sinNota.length) avisos.push(sinNota.length + " recetas sin nota (ej.: " + sinNota.slice(0, 5).map(r => r[0] + "+" + r[1]).join(", ") + ")");

// ---------- Planos de misión ----------
// El plano sigue el grafo diseñado (recetas base y nuevas); los atajos del preanálisis son caminos alternativos.
const nivelBase = {};
for (const id of g.cat.iniciales) nivelBase[id] = 0;
const recetasBase = g.recetas.filter(r => r.origen === "v1" || r.origen === "nuevas" || r.origen === "exp");
for (let cambio = true; cambio;) {
  cambio = false;
  for (const [a, b, r] of recetasBase) {
    if (nivelBase[a] === undefined || nivelBase[b] === undefined) continue;
    const t = Math.max(nivelBase[a], nivelBase[b]) + 1;
    if (nivelBase[r] === undefined || t < nivelBase[r]) { nivelBase[r] = t; cambio = true; }
  }
}
function plano(meta) {
  const nodos = new Map();
  const visitar = id => {
    if (nodos.has(id)) return;
    if (g.cat.iniciales.includes(id)) { nodos.set(id, null); return; }
    const recs = recetasBase.filter(r => r[2] === id && nivelBase[r[0]] !== undefined && nivelBase[r[1]] !== undefined && nivelBase[r[0]] < nivelBase[id] && nivelBase[r[1]] < nivelBase[id]);
    recs.sort((x, y) => Math.max(nivelBase[x[0]], nivelBase[x[1]]) - Math.max(nivelBase[y[0]], nivelBase[y[1]]) || (x.origen === "nuevas" ? -1 : 0));
    const p = recs[0];
    nodos.set(id, p ? [p[0], p[1]] : null);
    if (p) { visitar(p[0]); visitar(p[1]); }
  };
  visitar(meta);
  return [...nodos.entries()].map(([id, ing]) => ({ id, ing, nivel: nivelBase[id] }));
}
const misiones = g.cat.misiones.map(({ _de, ...m }) => {
  const txt = misionesTxt[m.id] || {};
  const pl = plano(m.meta);
  for (const h of m.hitos) if (!pl.some(n => n.id === h)) avisos.push("misión " + m.id + ": el hito " + h + " no está en el plano");
  if (!txt.encargo) avisos.push("misión " + m.id + " sin textos");
  const reflexiones = Object.assign({}, txt.reflexiones || {}, ((ajustes.misiones || {})[m.id] || {}).reflexiones || {});
  return Object.assign({}, m, { encargo: txt.encargo || "", objetivo: txt.objetivo || "", reflexiones, cierre: txt.cierre || "", plano: pl });
});

// ---------- Informe de patrones sospechosos (para revisión humana) ----------
const PATRONES = [
  ["A1", /\bno (es|son|se trata de)\b[^.;]{0,80}\b(sino|es|son)\b/i],
  ["A1b", /\bNo se trata de\b/],
  ["A10", /^[^:]{8,90}: [a-záéíóúñ]/],
  ["B4", /\b(Además|Cabe destacar|En este sentido|Por otro lado|En definitiva|En resumen)\b/],
  ["C", /\b(fomenta\w*|crucial\w*|fundamental\w*|esencial\w*|potencia(r|n)?\b|enriquec\w*|ecosistema|panorama|robust\w*|sinergia|adentr\w*|subraya\w*)\b/i]
];
const sospechas = [];
const revisar = (txt, donde) => { if (typeof txt !== "string") return; for (const [c, re] of PATRONES) if (re.test(txt)) sospechas.push(c + "  " + donde + "  " + txt.slice(0, 160)); };
for (const id of ids) for (const c of ["pista", "why", "uni", "belief", "evidence", "prueba"]) revisar(F[id][c], id + "." + c);
for (const r of g.recetas) revisar(r[3], "nota " + r[0] + "+" + r[1]);
for (const m of misiones) for (const c of ["encargo", "objetivo", "cierre"]) revisar(m[c], "mision " + m.id + "." + c);
fs.writeFileSync(V("informe-patrones.txt"), sospechas.join("\n") + "\n");

// ---------- Salida ----------
for (const id of ids) { F[id].nivel = nivel[id]; delete F[id]._de; }
const DATOS = {
  version: new Date().toISOString(),
  familias: g.cat.familias, orden: g.cat.orden, iniciales: g.cat.iniciales,
  fichas: F, refs, recetas: g.recetas.map(r => [r[0], r[1], r[2], r[3] || ""]), misiones,
  pistaMito: "Combínalo con 📓 Práctica reflexiva para desarmarlo."
};
const json = JSON.stringify(DATOS);
if (json.includes("\u2014")) errores.push("quedó una raya larga en los datos");
fs.mkdirSync(path.join(__dirname, "public"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "public", "datos.json"), json);

const porNivel = {};
for (const id of ids) porNivel[nivel[id]] = (porNivel[nivel[id]] || 0) + 1;
console.log("fichas " + ids.length + " · recetas " + g.recetas.length + " (preanálisis +" + extraOk.length + ") · refs " + Object.keys(refs).length + " · niveles " + JSON.stringify(porNivel));
console.log("misiones: " + misiones.map(m => m.id + " " + m.plano.length + "p/n" + nivelBase[m.meta]).join(", "));
console.log("patrones sospechosos: " + sospechas.length + " (ver datos/v2/informe-patrones.txt) · correcciones del filtro: " + informeFiltro.length);
if (avisos.length) console.log("AVISOS (" + avisos.length + "):\n  " + avisos.slice(0, 40).join("\n  ") + (avisos.length > 40 ? "\n  ..." : ""));
console.log(errores.length ? "ERRORES:\n  " + errores.join("\n  ") : "OK · public/datos.json " + Math.round(json.length / 1024) + " KB");
process.exitCode = errores.length ? 1 : 0;
