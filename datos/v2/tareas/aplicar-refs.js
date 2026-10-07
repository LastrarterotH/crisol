// Aplica las decisiones de la revisión de referencias (datos/v2/revision/decision-refs-*.json), pero solo lo que un script
// puede comprobar: un DOI se acepta si Crossref devuelve esa obra con título y año parecidos; una referencia corregida o
// nueva se acepta si Crossref u OpenAlex la confirman; una URL oficial se acepta si responde. Lo demás queda en el informe.
// Escribe las correcciones y las fuentes nuevas en datos/v2/ajustes.json (refs y fichas) y los enlaces en la caché.
// Uso: node datos/v2/tareas/aplicar-refs.js   (después: node construir.js && node datos/v2/tareas/libros-refs.js && node construir.js)
const fs = require("fs");
const path = require("path");
const V = (...p) => path.join(__dirname, "..", ...p);
const d = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "public", "datos.json"), "utf8"));
const CACHE = V("revision", "enlaces-cache.json");
const cache = JSON.parse(fs.readFileSync(CACHE, "utf8"));
const aj = JSON.parse(fs.readFileSync(V("ajustes.json"), "utf8"));
const esperar = ms => new Promise(r => setTimeout(r, ms));
const normal = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/<[^>]+>/g, " ").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2);
const parecido = (a, b) => { const A = new Set(normal(a)), B = new Set(normal(b)); if (!A.size || !B.size) return 0; let c = 0; for (const w of A) if (B.has(w)) c++; return 2 * c / (A.size + B.size); };
const partes = ref => {
  const anio = (ref.match(/\((\d{4})[a-z]?(?:, [^)]*)?\)/) || [])[1];
  const autor = (ref.split(",")[0] || "").replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g, "").trim();
  const tras = ref.split(/\(\d{4}[a-z]?(?:, [^)]*)?\)\.\s*/)[1] || "";
  const titulo = tras.startsWith("_") ? (tras.match(/^_([^_]+)_/) || [])[1] : (tras.match(/^(.+?)(?:[.?!]\s+_|[.?!]\s+In |[.?!]\s+En |\.\s+https?:|\.\s*$)/) || [])[1];
  return { anio, autor, titulo: (titulo || tras.slice(0, 160)).trim(), doi: (ref.match(/10\.\d{4,9}\/[^\s]+[^\s.,;)]/) || [])[0] };
};
async function json(url) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers: { "User-Agent": "crisol-enlaces/1.0" } }); if (r.ok) return await r.json(); if (r.status === 404) return null; } catch (e) { /* reintento */ }
    await esperar(2000 * (i + 1));
  }
  return null;
}
async function responde(url) { try { const r = await fetch(url, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } }); return r.status < 400 || r.status === 403; } catch (e) { return false; } }
const puntaje = (p, c) => parecido(p.titulo, c.titulo) * 0.7 + (p.anio && c.anio === p.anio ? 0.2 : 0) + (p.autor && normal(c.autor).some(w => normal(p.autor).includes(w)) ? 0.1 : 0);
const deCrossref = it => ({ titulo: [(it.title || [""])[0], ...(it.subtitle || [])].join(" "), anio: String(((it.issued || {})["date-parts"] || [[""]])[0][0] || ""), autor: ((it.author || [])[0] || {}).family || "", doi: (it.DOI || "").toLowerCase(), tipo: it.type });
async function porDoi(doi) { const r = await json("https://api.crossref.org/works/" + encodeURIComponent(doi)); return r && r.message ? deCrossref(r.message) : null; }
async function buscar(ref) {
  const p = partes(ref); let mejor = null, nota = 0;
  if (p.doi) { const c = await porDoi(p.doi); if (c) { mejor = c; nota = puntaje(p, c); } }
  if (nota < 0.85) { const r = await json("https://api.crossref.org/works?rows=4&select=DOI,title,subtitle,author,issued,type&query.bibliographic=" + encodeURIComponent(ref.replace(/https?:\/\/\S+/g, "").slice(0, 300))); for (const it of (r && r.message && r.message.items) || []) { const c = deCrossref(it); const s = puntaje(p, c); if (s > nota) { nota = s; mejor = c; } } }
  return { nota, mejor };
}
async function libre(doi) { const r = await json("https://api.openalex.org/works/https://doi.org/" + encodeURIComponent(doi)); return r && r.open_access && r.open_access.is_oa ? ((r.best_oa_location || {}).pdf_url || (r.best_oa_location || {}).landing_page_url || r.open_access.oa_url) : null; }

(async () => {
  const informe = { confirmadas: [], corregidas: [], web: [], sin_enlace: [], dudosas: [], rechazadas: [], nuevas: [], nuevas_rechazadas: [] };
  aj.refs = aj.refs || {}; aj.fichas = aj.fichas || {};
  for (const f of fs.readdirSync(V("revision")).filter(f => /^decision-refs-\d+\.json$/.test(f)).sort()) {
    const x = JSON.parse(fs.readFileSync(V("revision", f), "utf8"));
    for (const [k, dec] of Object.entries(x.refs || {})) {
      const ref = d.refs[k]; if (!ref) continue;
      if (dec.accion === "confirmar" && dec.doi) {
        const c = await porDoi(dec.doi.replace(/^https?:\/\/doi\.org\//, ""));
        const s = c ? puntaje(partes(ref), c) : 0;
        const libroComoArticulo = /\(\d{4}[a-z]?\)\.\s*_/.test(ref) && c && /journal-article/.test(c.tipo || "");
        if (c && s >= 0.75 && !libroComoArticulo) { cache[k] = Object.assign(cache[k] || {}, { estado: "confirmada", doi: c.doi, libre: await libre(c.doi), similitud: Math.round(s * 100) / 100 }); informe.confirmadas.push(k); }
        else informe.rechazadas.push(k + " (doi " + dec.doi + ", similitud " + Math.round(s * 100) / 100 + (libroComoArticulo ? ", es un artículo" : "") + ")");
      } else if (dec.accion === "corregir" && dec.apa) {
        const { nota, mejor } = await buscar(dec.apa);
        if (nota >= 0.85) { aj.refs[k] = dec.apa.replace(/\s*https?:\/\/doi\.org\/\S+$/, ""); cache[k] = { estado: "confirmada", doi: mejor.doi, libre: mejor.doi ? await libre(mejor.doi) : null, similitud: Math.round(nota * 100) / 100, candidato: mejor.autor + " (" + mejor.anio + "). " + mejor.titulo }; informe.corregidas.push(k); }
        else informe.rechazadas.push(k + " (corrección no confirmada, similitud " + Math.round(nota * 100) / 100 + "): " + dec.apa);
      } else if (dec.accion === "sin_enlace") {
        if (dec.url && await responde(dec.url)) { cache[k] = Object.assign(cache[k] || {}, { web: dec.url }); informe.web.push(k + " → " + dec.url); }
        else informe.sin_enlace.push(k + ": " + (dec.motivo || "") + (dec.url ? " (la URL no respondió: " + dec.url + ")" : ""));
      } else if (dec.accion === "dudosa") informe.dudosas.push(k + ": " + (dec.motivo || "") + " · " + ref);
      await esperar(200);
    }
    for (const [k, apa] of Object.entries(x.nuevas || {})) {
      if (d.refs[k] || aj.refs[k]) {
        // el agente propuso una referencia que ya está en el juego: si es la misma obra, solo se suma a la ficha
        const misma = parecido(partes(d.refs[k] || aj.refs[k]).titulo, partes(apa).titulo) >= 0.6;
        if (misma) for (const [id, claves] of Object.entries(x.fichas || {})) if (claves.includes(k) && d.fichas[id]) {
          const actuales = (aj.fichas[id] && aj.fichas[id].refs) || d.fichas[id].refs || [];
          aj.fichas[id] = Object.assign(aj.fichas[id] || {}, { refs: [...new Set([...actuales, k])] });
        }
        (misma ? informe.nuevas : informe.nuevas_rechazadas).push(k + (misma ? " (ya existía) → " + Object.entries(x.fichas || {}).filter(([, c]) => c.includes(k)).map(([id]) => id).join(", ") : " (la clave existe con otra obra)"));
        continue;
      }
      const { nota, mejor } = await buscar(apa);
      if (nota >= 0.85 && mejor.doi) {
        aj.refs[k] = apa.replace(/\s*https?:\/\/doi\.org\/\S+$/, "");
        cache[k] = { estado: "confirmada", doi: mejor.doi, libre: await libre(mejor.doi), similitud: Math.round(nota * 100) / 100 };
        for (const [id, claves] of Object.entries(x.fichas || {})) if (claves.includes(k) && d.fichas[id]) {
          const actuales = (aj.fichas[id] && aj.fichas[id].refs) || d.fichas[id].refs || [];
          aj.fichas[id] = Object.assign(aj.fichas[id] || {}, { refs: [...new Set([...actuales, k])] });
        }
        informe.nuevas.push(k + " → " + Object.entries(x.fichas || {}).filter(([, c]) => c.includes(k)).map(([id]) => id).join(", "));
      } else informe.nuevas_rechazadas.push(k + " (no confirmada, similitud " + Math.round(nota * 100) / 100 + "): " + apa);
      await esperar(200);
    }
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));
  fs.writeFileSync(V("ajustes.json"), JSON.stringify(aj, null, 2));
  let md = "# Aplicación de la revisión de referencias\n";
  for (const [k, v] of Object.entries(informe)) md += "\n## " + k + " (" + v.length + ")\n" + v.map(s => "- " + s).join("\n") + "\n";
  fs.writeFileSync(V("revision", "refs-aplicadas.md"), md);
  console.log(Object.entries(informe).map(([k, v]) => k + " " + v.length).join(" · "));
})();
