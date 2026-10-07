// Grafo de la versión 2: une fichas y recetas, calcula niveles y planos de misión.
// Uso: node grafo2.js [--planos]
const fs = require("fs");
const path = require("path");
const V = p => path.join(__dirname, "datos", "v2", p);
const clave = (a, b) => [a, b].sort().join("+");

function leerRecetasTxt(archivo, errores) {
  const out = [];
  if (!fs.existsSync(archivo)) return out;
  fs.readFileSync(archivo, "utf8").split("\n").forEach((l, i) => {
    l = l.trim();
    if (!l || l.startsWith("#")) return;
    const m = l.match(/^([a-z0-9_]+)\s*\+\s*([a-z0-9_]+)\s*=\s*([a-z0-9_]+)$/);
    if (!m) { errores.push(path.basename(archivo) + " línea " + (i + 1) + " mal formada: " + l); return; }
    out.push([m[1], m[2], m[3], ""]);
  });
  return out;
}

function cargarGrafo2(extra = {}) {
  const errores = [], avisos = [];
  const cat = JSON.parse(fs.readFileSync(V("catalogo.json"), "utf8"));
  const v1 = JSON.parse(fs.readFileSync(V("fichas-v1.json"), "utf8"));
  const fichas = {};
  for (const [id, f] of Object.entries(v1)) fichas[id] = { ...f };
  for (const [id, f] of Object.entries(cat.nuevas)) fichas[id] = { ...(fichas[id] || {}), ...f };
  for (const [id, c] of Object.entries(cat.cambios)) { if (!fichas[id]) errores.push("cambio a ficha inexistente " + id); else Object.assign(fichas[id], c); }
  // fichas y misiones de las expansiones (expansion-E*.json), ya leídas por construir.js
  for (const [id, f] of Object.entries(extra.fichas || {})) { if (fichas[id]) errores.push("la expansión repite el id " + id); else fichas[id] = { ...f }; }
  if (extra.misiones) cat.misiones = cat.misiones.concat(extra.misiones);
  const quitar = new Set(fs.readFileSync(V("quitar.txt"), "utf8").split("\n").map(s => s.trim()).filter(s => s && !s.startsWith("#")));
  // quitar.txt solo saca recetas de la versión 1; lo que quita ajustes.json (extra.quitar) sale venga de donde venga
  const quitarAjustes = new Set(extra.quitar || []);
  const recetas = [], porClave = new Map();
  const agregar = (rec, origen, sobrescribir) => {
    const [a, b, r] = rec;
    for (const x of [a, b, r]) if (!fichas[x]) { errores.push(origen + ": id inexistente " + x + " en " + a + "+" + b + "=" + r); return; }
    if (r === a || r === b) { errores.push(origen + ": circular " + a + "+" + b + "=" + r); return; }
    if (fichas[r].f === "prim") { errores.push(origen + ": produce un primigenio " + r); return; }
    const k = clave(a, b);
    if (quitar.has(k) && origen === "v1") return;
    if (quitarAjustes.has(k) && origen !== "revision") return;
    if (porClave.has(k)) {
      const prev = porClave.get(k);
      if (prev[2] !== r) {
        if (sobrescribir) { avisos.push(origen + " reemplaza " + k + ": " + prev[2] + " -> " + r); prev[2] = r; prev[3] = rec[3] || ""; }
        else errores.push("COLISIÓN " + k + " = " + prev[2] + " (" + prev.origen + ") / " + r + " (" + origen + ")");
      } else if (rec[3] && !prev[3]) prev[3] = rec[3];
      return;
    }
    const nuevo = [a, b, r, rec[3] || ""]; nuevo.origen = origen;
    porClave.set(k, nuevo); recetas.push(nuevo);
  };
  for (const rec of JSON.parse(fs.readFileSync(V("recetas-v1.json"), "utf8"))) agregar(rec, "v1", false);
  for (const rec of leerRecetasTxt(V("recetas-nuevas.txt"), errores)) agregar(rec, "nuevas", true);
  // revisión de validez (ajustes.recetasPlano): recetas del camino diseñado que reemplazan a otras
  for (const rec of extra.base || []) agregar(rec, "revision", true);
  for (const rec of extra.recetas || []) agregar(rec, rec.origen || "extra", false);
  return { cat, fichas, recetas, porClave, errores, avisos };
}

function niveles(g) {
  const tier = {};
  for (const id of g.cat.iniciales) tier[id] = 0;
  for (let cambio = true; cambio;) {
    cambio = false;
    for (const [a, b, r] of g.recetas) {
      if (tier[a] === undefined || tier[b] === undefined) continue;
      const t = Math.max(tier[a], tier[b]) + 1;
      if (tier[r] === undefined || t < tier[r]) { tier[r] = t; cambio = true; }
    }
  }
  return tier;
}

// Plano: para cada ficha, la receta principal es la que tiene ingredientes de menor nivel.
function plano(g, tier, meta) {
  const nodos = new Map();
  const visitar = id => {
    if (nodos.has(id)) return;
    if (g.cat.iniciales.includes(id)) { nodos.set(id, null); return; }
    const recs = g.recetas.filter(r => r[2] === id && tier[r[0]] !== undefined && tier[r[1]] !== undefined);
    recs.sort((x, y) => Math.max(tier[x[0]], tier[x[1]]) - Math.max(tier[y[0]], tier[y[1]]));
    const p = recs[0];
    nodos.set(id, p ? [p[0], p[1]] : null);
    if (p) { visitar(p[0]); visitar(p[1]); }
  };
  visitar(meta);
  return nodos;
}

module.exports = { cargarGrafo2, niveles, plano, clave };

if (require.main === module) {
  const g = cargarGrafo2();
  const tier = niveles(g);
  const ids = Object.keys(g.fichas);
  const inal = ids.filter(i => tier[i] === undefined);
  if (inal.length) g.errores.push("inalcanzables: " + inal.join(", "));
  const em = {};
  for (const id of ids) (em[g.fichas[id].e] = em[g.fichas[id].e] || []).push(id);
  for (const [e, l] of Object.entries(em)) if (l.length > 1) g.errores.push("emoji repetido " + e + ": " + l.join(", "));
  const porT = {};
  for (const id of ids) { const t = tier[id]; (porT[t] = porT[t] || []).push(id); }
  console.log("fichas " + ids.length + " · recetas " + g.recetas.length);
  for (const t of Object.keys(porT).sort((a, b) => a - b)) console.log("nivel " + t + " (" + porT[t].length + "): " + (process.argv.includes("--todo") || t <= 2 ? porT[t].join(" ") : ""));
  for (const m of g.cat.misiones) {
    const p = plano(g, tier, m.meta);
    console.log("misión " + m.id + ": meta nivel " + tier[m.meta] + ", " + p.size + " piezas" + (process.argv.includes("--planos") ? "\n   " + [...p.entries()].map(([k, v]) => k + (v ? "=" + v.join("+") : "")).join("  ") : ""));
  }
  if (g.avisos.length) console.log("AVISOS:\n  " + g.avisos.join("\n  "));
  console.log(g.errores.length ? "ERRORES:\n  " + g.errores.join("\n  ") : "OK");
}
