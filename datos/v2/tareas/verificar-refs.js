// Verifica referencias contra Crossref y OpenAlex sin gastar tokens de un modelo: busca cada referencia, compara título,
// año y primer autor, y la clasifica en "ok", "dudosa" o "no encontrada". Las citas de software ([Software], [Modelo de
// lenguaje]...) se informan aparte, porque no están en esas bases.
// Uso: node datos/v2/tareas/verificar-refs.js datos/v2/expansion-H1.json [más archivos]   (sin argumentos: todas las H)
// Escribe el informe en datos/v2/revision/refs-verificadas.md
const fs = require("fs");
const path = require("path");
const V = (...p) => path.join(__dirname, "..", ...p);
const archivos = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(V()).filter(f => /^expansion-H\d+\.json$/.test(f)).map(f => V(f));
const esperar = ms => new Promise(r => setTimeout(r, ms));
const normal = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/<[^>]+>/g, " ").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2);
const parecido = (a, b) => { const A = new Set(normal(a)), B = new Set(normal(b)); if (!A.size || !B.size) return 0; let c = 0; for (const w of A) if (B.has(w)) c++; return c / Math.max(A.size, B.size); };

function partes(ref) {
  const doi = (ref.match(/10\.\d{4,9}\/[^\s]+[^\s.,;)]/) || [])[0];
  const anio = (ref.match(/\((\d{4})[a-z]?(?:, [^)]*)?\)/) || [])[1];
  const autor = (ref.split(",")[0] || "").replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g, "").trim();
  let tras = ref.split(/\(\d{4}[a-z]?(?:, [^)]*)?\)\.\s*/)[1] || "";
  let titulo = tras.startsWith("_") ? (tras.match(/^_([^_]+)_/) || [])[1] : (tras.match(/^(.+?)(?:[.?!]\s+_|[.?!]\s+In |[.?!]\s+En |\.\s+https?:|\.\s*$)/) || [])[1];
  return { doi, anio, autor, titulo: (titulo || tras.slice(0, 160)).trim(), software: /\[(software|modelo de lenguaje|large language model|aplicaci[oó]n m[oó]vil|mobile app)/i.test(ref) };
}
async function json(url) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers: { "User-Agent": "crisol-verificador/1.0" } }); if (r.ok) return await r.json(); if (r.status === 404) return null; } catch (e) { /* reintento */ }
    await esperar(1500 * (i + 1));
  }
  return null;
}
const deCrossref = it => ({ titulo: (it.title || [""])[0], anio: String(((it.issued || {})["date-parts"] || [[""]])[0][0] || ""), autor: ((it.author || [])[0] || {}).family || "", fuente: "Crossref", doi: it.DOI });
const deOpenAlex = it => ({ titulo: it.title || it.display_name || "", anio: String(it.publication_year || ""), autor: ((((it.authorships || [])[0] || {}).author || {}).display_name || "").split(" ").pop(), fuente: "OpenAlex", doi: (it.doi || "").replace("https://doi.org/", "") });

async function verificar(ref) {
  const p = partes(ref);
  if (p.software) return { estado: "software", p };
  const candidatos = [];
  if (p.doi) { const r = await json("https://api.crossref.org/works/" + encodeURIComponent(p.doi)); if (r && r.message) candidatos.push(deCrossref(r.message)); }
  if (!candidatos.length) { const r = await json("https://api.crossref.org/works?rows=4&query.bibliographic=" + encodeURIComponent(ref.slice(0, 300))); for (const it of (r && r.message && r.message.items) || []) candidatos.push(deCrossref(it)); }
  let mejor = null, nota = 0;
  const puntuar = c => parecido(p.titulo, c.titulo) * 0.7 + (p.anio && c.anio === p.anio ? 0.2 : 0) + (p.autor && normal(c.autor).some(w => normal(p.autor).includes(w)) ? 0.1 : 0);
  for (const c of candidatos) { const s = puntuar(c); if (s > nota) { nota = s; mejor = c; } }
  if (nota < 0.75) {
    const r = await json("https://api.openalex.org/works?per-page=4&search=" + encodeURIComponent(p.titulo.slice(0, 200)));
    for (const it of (r && r.results) || []) { const c = deOpenAlex(it); const s = puntuar(c); if (s > nota) { nota = s; mejor = c; } }
  }
  const estado = nota >= 0.75 ? "ok" : nota >= 0.45 ? "dudosa" : "no encontrada";
  return { estado, nota: Math.round(nota * 100) / 100, p, mejor };
}

(async () => {
  const filas = [], cuenta = { ok: 0, dudosa: 0, "no encontrada": 0, software: 0 };
  for (const a of archivos) {
    const x = JSON.parse(fs.readFileSync(a, "utf8"));
    for (const [k, ref] of Object.entries(x.refs || {})) {
      const v = await verificar(ref);
      cuenta[v.estado]++;
      filas.push({ archivo: path.basename(a), clave: k, ref, ...v });
      process.stdout.write(v.estado === "ok" ? "." : v.estado[0].toUpperCase());
      await esperar(250);
    }
  }
  console.log("\n" + Object.entries(cuenta).map(([k, v]) => k + " " + v).join(" · "));
  let md = "# Referencias nuevas verificadas contra Crossref y OpenAlex\n\n" + Object.entries(cuenta).map(([k, v]) => "- " + k + ": " + v).join("\n") + "\n";
  for (const est of ["no encontrada", "dudosa", "software", "ok"]) {
    const g = filas.filter(f => f.estado === est); if (!g.length) continue;
    md += "\n## " + est + " (" + g.length + ")\n" + g.map(f => "- **" + f.clave + "** (" + f.archivo + ", similitud " + (f.nota ?? "-") + ")\n  - escrita: " + f.ref + (f.mejor ? "\n  - lo más cercano (" + f.mejor.fuente + "): " + f.mejor.autor + " (" + f.mejor.anio + "). " + f.mejor.titulo + (f.mejor.doi ? ". doi " + f.mejor.doi : "") : "")).join("\n") + "\n";
  }
  fs.mkdirSync(V("revision"), { recursive: true });
  fs.writeFileSync(V("revision", "refs-verificadas.md"), md);
  console.log("Informe: datos/v2/revision/refs-verificadas.md");
})();
