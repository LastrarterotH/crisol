// Arma los lotes para la revisión de referencias que los scripts no resolvieron: cada lote trae las referencias sin enlace
// (texto APA, mejor candidato de Crossref u OpenAlex y fichas que la usan) y algunas fichas descubribles que no tienen
// ninguna fuente para compartir. Uso: node datos/v2/tareas/lotes-refs.js [cantidad de lotes]
const fs = require("fs");
const path = require("path");
const V = (...p) => path.join(__dirname, "..", ...p);
const d = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "public", "datos.json"), "utf8"));
const cache = JSON.parse(fs.readFileSync(V("revision", "enlaces-cache.json"), "utf8"));
const enlaces = JSON.parse(fs.readFileSync(V("refs-enlaces.json"), "utf8"));
const N = +process.argv[2] || 2;
const compartible = k => !!(enlaces[k] || /https?:\/\//.test(d.refs[k] || ""));
const alc = new Set(d.misiones.flatMap(m => m.plano.map(n => n.id)));
const usan = k => Object.entries(d.fichas).filter(([, f]) => (f.refs || []).includes(k)).map(([id, f]) => f.n + (alc.has(id) ? "" : " (sin misión)"));
const pend = Object.keys(d.refs).filter(k => !compartible(k)).sort((a, b) => usan(b).length - usan(a).length);
const fichas = [...alc].filter(id => (d.fichas[id].refs || []).length && !(d.fichas[id].refs || []).some(compartible));
const lotes = Array.from({ length: N }, () => ({ refs: [], fichas: [] }));
pend.forEach((k, i) => lotes[i % N].refs.push(k));
fichas.forEach((id, i) => lotes[i % N].fichas.push(id));
lotes.forEach((l, i) => {
  let md = "# Lote " + (i + 1) + " de referencias\n\n## A. Referencias sin enlace (" + l.refs.length + ")\n";
  for (const k of l.refs) {
    const c = cache[k] || {};
    md += "\n- **" + k + "**: " + d.refs[k] + "\n  - mejor candidato (" + (c.estado || "?") + ", similitud " + (c.similitud ?? "-") + "): " + (c.candidato || "ninguno") + (c.doi ? " · doi " + c.doi : "") + (c.nota_revision ? " · ojo: " + c.nota_revision : "") + "\n  - la usan: " + usan(k).join("; ") + "\n";
  }
  md += "\n## B. Fichas descubribles sin ninguna fuente para compartir (" + l.fichas.length + ")\n";
  for (const id of l.fichas) { const f = d.fichas[id]; md += "\n- **" + id + "** · " + f.n + " · refs actuales: " + (f.refs || []).join(", ") + "\n  - why: " + (f.why || f.evidence || "") + "\n"; }
  fs.writeFileSync(V("revision", "lote-refs-" + (i + 1) + ".md"), md);
  console.log("lote " + (i + 1) + ": " + l.refs.length + " refs · " + l.fichas.length + " fichas · " + Math.round(md.length / 1024) + " KB");
});
