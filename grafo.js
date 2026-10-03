// Carga y valida el grafo de fichas y recetas. Uso: node grafo.js [--tiers]
const fs = require("fs");
const path = require("path");
const D = p => path.join(__dirname, "datos", p);

function cargarGrafo() {
  const base = JSON.parse(fs.readFileSync(D("base-v1.json"), "utf8"));
  const cat = JSON.parse(fs.readFileSync(D("catalogo.json"), "utf8"));
  const fichas = {};
  for (const [id, f] of Object.entries(base.fichas)) fichas[id] = { id, n: f.n, e: f.e, f: f.f };
  for (const [id, f] of Object.entries(cat.nuevas)) fichas[id] = { id, ...f };
  const recetas = [];
  const errores = [];
  const vistas = new Map();
  fs.readFileSync(D("recetas.txt"), "utf8").split("\n").forEach((l, i) => {
    l = l.trim();
    if (!l || l.startsWith("#")) return;
    const m = l.match(/^([a-z0-9_]+)\s*\+\s*([a-z0-9_]+)\s*=\s*([a-z0-9_]+)$/);
    if (!m) { errores.push("línea " + (i + 1) + " mal formada: " + l); return; }
    const [, a, b, r] = m;
    for (const x of [a, b, r]) if (!fichas[x]) errores.push("línea " + (i + 1) + ": id inexistente " + x);
    const k = [a, b].sort().join("+");
    if (vistas.has(k)) {
      if (vistas.get(k) !== r) errores.push("COLISIÓN " + k + " = " + vistas.get(k) + " y " + r);
      return;
    }
    if (r === a || r === b) errores.push("receta circular " + l);
    vistas.set(k, r);
    recetas.push([a, b, r]);
  });
  return { base, cat, fichas, recetas, errores };
}

function analizar(g) {
  const { fichas, recetas, base, errores } = g;
  const ids = Object.keys(fichas);
  const bases = ids.filter(i => fichas[i].f === "base");
  const nRec = {};
  for (const [, , r] of recetas) nRec[r] = (nRec[r] || 0) + 1;
  for (const id of ids) if (fichas[id].f !== "base" && !nRec[id]) errores.push("sin receta: " + id);
  // alcanzabilidad con desbloqueos y niveles
  const tier = {};
  for (const id of base.iniciales) tier[id] = 0;
  let cambio = true;
  while (cambio) {
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
  const em = {};
  for (const id of ids) (em[fichas[id].e] = em[fichas[id].e] || []).push(id);
  for (const [e, l] of Object.entries(em)) if (l.length > 1) errores.push("emoji repetido " + e + ": " + l.join(", "));
  const nombres = {};
  for (const id of ids) { const n = fichas[id].n.toLowerCase(); if (nombres[n]) errores.push("nombre repetido: " + n); nombres[n] = id; }
  for (const r of g.cat.rutas) for (const d of r.destinos) if (!fichas[d]) errores.push("ruta " + r.id + ": destino inexistente " + d);
  return { ids, tier, nRec, bases };
}

module.exports = { cargarGrafo, analizar };

if (require.main === module) {
  const g = cargarGrafo();
  const a = analizar(g);
  const porFam = {};
  for (const id of a.ids) porFam[g.fichas[id].f] = (porFam[g.fichas[id].f] || 0) + 1;
  console.log("fichas:", a.ids.length, JSON.stringify(porFam));
  console.log("recetas:", g.recetas.length);
  const porTier = {};
  for (const [id, t] of Object.entries(a.tier)) (porTier[t] = porTier[t] || []).push(id);
  for (const t of Object.keys(porTier).sort((x, y) => x - y)) console.log("nivel " + t + ": " + porTier[t].length + (process.argv.includes("--tiers") ? "  " + porTier[t].join(" ") : ""));
  const una = a.ids.filter(i => g.fichas[i].f !== "base" && a.nRec[i] === 1);
  console.log("con una sola receta (" + una.length + "):", una.join(" "));
  console.log(g.errores.length ? "ERRORES:\n" + g.errores.join("\n") : "OK sin errores");
}
