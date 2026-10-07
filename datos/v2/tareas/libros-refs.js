// Segundo paso para las referencias que Crossref no confirmó: libros y capítulos de libro. Los busca en Open Library
// (título del libro y primer autor o editor) y, si coinciden, guarda la página pública del libro como enlace para compartir;
// si Open Library tiene una copia de lectura libre, también la marca. Sin tokens de un modelo.
// Uso: node datos/v2/tareas/libros-refs.js   (después de enlazar-refs.js; actualiza la caché y refs-enlaces.json)
const fs = require("fs");
const path = require("path");
const V = (...p) => path.join(__dirname, "..", ...p);
const d = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "public", "datos.json"), "utf8"));
const CACHE = V("revision", "enlaces-cache.json");
const cache = JSON.parse(fs.readFileSync(CACHE, "utf8"));
const esperar = ms => new Promise(r => setTimeout(r, ms));
const normal = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2);
const parecido = (a, b) => { const A = new Set(normal(a)), B = new Set(normal(b)); if (!A.size || !B.size) return 0; let c = 0; for (const w of A) if (B.has(w)) c++; return c / Math.max(A.size, B.size); };

function libro(ref) {
  const anio = (ref.match(/\((\d{4})[a-z]?\)/) || [])[1];
  const autor = (ref.split(",")[0] || "").replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g, "").trim();
  const tras = ref.split(/\(\d{4}[a-z]?(?:, [^)]*)?\)\.\s*/)[1] || "";
  if (tras.startsWith("_")) return { titulo: (tras.match(/^_([^_]+)_/) || [])[1], autor, anio, capitulo: false };
  const en = ref.match(/\b(?:In|En) ([^_]*?)\(Eds?\.\), _([^_]+)_/);
  if (en) return { titulo: en[2], autor: (en[1].split(/,| & | y /)[0] || "").trim().split(" ").pop(), anio, capitulo: true };
  return null;
}
async function json(url) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers: { "User-Agent": "crisol-enlaces/1.0" } }); if (r.ok) return await r.json(); if (r.status === 404) return null; } catch (e) { /* reintento */ }
    await esperar(2000 * (i + 1));
  }
  return null;
}
(async () => {
  const pendientes = Object.entries(cache).filter(([k, v]) => d.refs[k] && !(v.estado === "confirmada" && (v.doi || v.libre)) && !v.libro && v.estado !== "software");
  let hallados = 0, revisados = 0;
  for (const [k, v] of pendientes) {
    const b = libro(d.refs[k]);
    if (!b || !b.titulo) continue;
    revisados++;
    const r = await json("https://openlibrary.org/search.json?limit=5&fields=key,title,author_name,first_publish_year,ebook_access&title=" + encodeURIComponent(b.titulo.split(":")[0]) + (b.autor ? "&author=" + encodeURIComponent(b.autor) : ""));
    let mejor = null, nota = 0;
    for (const it of (r && r.docs) || []) {
      const s = parecido(b.titulo.split(":")[0], it.title) * 0.8 + ((it.author_name || []).some(a => normal(a).some(w => normal(b.autor).includes(w))) ? 0.2 : 0);
      if (s > nota) { nota = s; mejor = it; }
    }
    if (mejor && nota >= 0.75) {
      v.libro = "https://openlibrary.org" + mejor.key;
      if (mejor.ebook_access === "public") v.libro_libre = true;
      v.libro_nota = Math.round(nota * 100) / 100;
      hallados++;
    }
    await esperar(400);
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));
  // refs-enlaces.json: DOI confirmado, versión libre y, para libros, su página en Open Library
  const salida = {};
  for (const [k, e] of Object.entries(cache)) {
    if (!d.refs[k]) continue;
    const o = {};
    if (e.estado === "confirmada" && e.doi) o.doi = e.doi;
    if (e.estado === "confirmada" && e.libre) o.libre = e.libre;
    if (e.libro) { o.libro = e.libro; if (e.libro_libre) o.libre = o.libre || e.libro; }
    if (e.web) o.web = e.web;
    if (Object.keys(o).length) salida[k] = o;
  }
  fs.writeFileSync(V("refs-enlaces.json"), JSON.stringify(salida, null, 1));
  console.log("libros o capítulos revisados: " + revisados + " · encontrados en Open Library: " + hallados + " · referencias con algún enlace: " + Object.keys(salida).length + " de " + Object.keys(d.refs).length);
})();
