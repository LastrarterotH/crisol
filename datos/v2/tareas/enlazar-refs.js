// Busca un enlace para compartir en cada referencia del juego, sin gastar tokens de un modelo:
// 1. Crossref: confirma la obra (título, año y primer autor) y trae su DOI.
// 2. OpenAlex: con el DOI (o por título, si no hay DOI) averigua si hay una versión de acceso abierto y dónde.
// Guarda cada resultado en datos/v2/revision/enlaces-cache.json (se puede cortar y retomar) y escribe
// datos/v2/refs-enlaces.json solo con lo confirmado. construir.js lo usa para agregar el DOI y el enlace libre.
// Uso: node datos/v2/tareas/enlazar-refs.js [--todo]   (--todo vuelve a consultar lo que ya está en caché)
const fs = require("fs");
const path = require("path");
const V = (...p) => path.join(__dirname, "..", ...p);
const d = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "public", "datos.json"), "utf8"));
const CACHE = V("revision", "enlaces-cache.json");
const cache = !process.argv.includes("--todo") && fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
// --pendientes vuelve a consultar solo lo que no quedó confirmado (y no tiene una URL oficial ya revisada)
if (process.argv.includes("--pendientes")) for (const [k, v] of Object.entries(cache)) if (v.estado !== "confirmada" && v.estado !== "software" && !v.web) delete cache[k];
const esperar = ms => new Promise(r => setTimeout(r, ms));
const normal = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/<[^>]+>/g, " ").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2);
const parecido = (a, b) => { const A = new Set(normal(a)), B = new Set(normal(b)); if (!A.size || !B.size) return 0; let c = 0; for (const w of A) if (B.has(w)) c++; return 2 * c / (A.size + B.size); };

function partes(ref) {
  const doi = (ref.match(/10\.\d{4,9}\/[^\s]+[^\s.,;)]/) || [])[0];
  const anio = (ref.match(/\((\d{4})[a-z]?(?:, [^)]*)?\)/) || [])[1];
  const autor = (ref.split(",")[0] || "").replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g, "").trim();
  const tras = ref.split(/\(\d{4}[a-z]?(?:, [^)]*)?\)\.\s*/)[1] || "";
  const titulo = tras.startsWith("_") ? (tras.match(/^_([^_]+)_/) || [])[1] : (tras.match(/^(.+?)(?:[.?!]\s+_|[.?!]\s+In |[.?!]\s+En |\.\s+https?:|\.\s*$)/) || [])[1];
  return { doi, anio, autor, titulo: (titulo || tras.slice(0, 160)).trim(), software: /\[(software|sitio web|modelo de lenguaje|large language model|aplicaci[oó]n)/i.test(ref) };
}
async function json(url) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers: { "User-Agent": "crisol-enlaces/1.0" } }); if (r.ok) return await r.json(); if (r.status === 404) return null; } catch (e) { /* reintento */ }
    await esperar(2000 * (i + 1));
  }
  return null;
}
const deCrossref = it => ({ titulo: [(it.title || [""])[0], ...(it.subtitle || [])].join(" "), anio: String(((it.issued || {})["date-parts"] || [[""]])[0][0] || ""), autor: ((it.author || [])[0] || {}).family || "", doi: (it.DOI || "").toLowerCase(), tipo: it.type });
const deOpenAlex = it => ({ titulo: it.title || "", anio: String(it.publication_year || ""), autor: ((((it.authorships || [])[0] || {}).author || {}).display_name || "").split(" ").pop(), doi: (it.doi || "").replace("https://doi.org/", "").toLowerCase(), libre: (it.open_access || {}).is_oa ? ((it.best_oa_location || {}).pdf_url || (it.best_oa_location || {}).landing_page_url || (it.open_access || {}).oa_url) : null, tipo: it.type });

async function enlazar(clave, ref) {
  const p = partes(ref);
  if (p.software) return { estado: "software", url: (ref.match(/https?:\/\/\S+/) || [])[0] || null };
  const puntuar = c => parecido(p.titulo, c.titulo) * 0.7 + (p.anio && c.anio === p.anio ? 0.2 : 0) + (p.autor && normal(c.autor).some(w => normal(p.autor).includes(w)) ? 0.1 : 0);
  let mejor = null, nota = 0;
  if (p.doi) { const r = await json("https://api.crossref.org/works/" + encodeURIComponent(p.doi)); if (r && r.message) { mejor = deCrossref(r.message); nota = puntuar(mejor); } }
  if (nota < 0.85) {
    const r = await json("https://api.crossref.org/works?rows=4&select=DOI,title,subtitle,author,issued,type&query.bibliographic=" + encodeURIComponent(ref.replace(/https?:\/\/\S+/g, "").slice(0, 300)));
    for (const it of (r && r.message && r.message.items) || []) { const c = deCrossref(it); const s = puntuar(c); if (s > nota) { nota = s; mejor = c; } }
  }
  let oa = null;
  if (mejor && mejor.doi && nota >= 0.75) oa = await json("https://api.openalex.org/works/https://doi.org/" + encodeURIComponent(mejor.doi));
  if (!oa || nota < 0.75) {
    const r = await json("https://api.openalex.org/works?per-page=4&search=" + encodeURIComponent(p.titulo.slice(0, 200)));
    for (const it of (r && r.results) || []) { const c = deOpenAlex(it); const s = puntuar(c); if (s > nota || (s >= 0.75 && !oa)) { if (s > nota) { nota = s; mejor = c; } oa = it; } }
  }
  const alex = oa ? deOpenAlex(oa) : null;
  const doi = mejor && mejor.doi ? mejor.doi : (alex && alex.doi) || null;
  const libre = alex && alex.libre && !/doi\.org/.test(alex.libre) ? alex.libre : (alex && alex.libre) || null;
  const estado = nota >= 0.85 ? "confirmada" : nota >= 0.6 ? "probable" : "sin_coincidencia";
  return { estado, similitud: Math.round(nota * 100) / 100, doi: estado === "sin_coincidencia" ? null : doi, libre: estado === "sin_coincidencia" ? null : libre, candidato: mejor ? mejor.autor + " (" + mejor.anio + "). " + mejor.titulo : null, tipo: mejor && mejor.tipo };
}

(async () => {
  const claves = Object.keys(d.refs).filter(k => !cache[k]);
  console.log("referencias: " + Object.keys(d.refs).length + " · por consultar: " + claves.length);
  let hechas = 0;
  const trabajar = async () => { while (claves.length) { const k = claves.shift(); cache[k] = await enlazar(k, d.refs[k]); hechas++; if (hechas % 25 === 0) { fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1)); process.stdout.write(hechas + " "); } await esperar(150); } };
  await Promise.all([trabajar(), trabajar(), trabajar(), trabajar()]);
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));
  const salida = {};
  for (const [k, v] of Object.entries(cache)) if (d.refs[k] && v.estado === "confirmada" && (v.doi || v.libre)) salida[k] = { doi: v.doi || undefined, libre: v.libre || undefined };
  fs.writeFileSync(V("refs-enlaces.json"), JSON.stringify(salida, null, 1));
  const cuenta = {}; for (const v of Object.values(cache)) cuenta[v.estado] = (cuenta[v.estado] || 0) + 1;
  const conDoi = Object.values(salida).filter(v => v.doi).length, conLibre = Object.values(salida).filter(v => v.libre).length;
  console.log("");
  console.log(Object.entries(cuenta).map(([k, v]) => k + " " + v).join(" · ") + " · con DOI confirmado " + conDoi + " · con versión libre " + conLibre);
  // fichas que quedan sin ninguna fuente para compartir
  const compartible = k => !!(salida[k] || /https?:\/\//.test(d.refs[k] || ""));
  const sin = Object.entries(d.fichas).filter(([, f]) => (f.refs || []).length && !(f.refs || []).some(compartible)).map(([id]) => id);
  const alcanzables = new Set(d.misiones.flatMap(m => m.plano.map(n => n.id)));
  console.log("fichas descubribles sin ninguna fuente con enlace: " + sin.filter(id => alcanzables.has(id)).length + " de " + [...alcanzables].filter(id => (d.fichas[id].refs || []).length).length);
})();
