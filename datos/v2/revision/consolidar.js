// Consolida las revisiones R1..R4: informe por gravedad, control de los textos propuestos
// y una propuesta de ajustes (no toca ajustes.json; eso se decide después).
const fs = require("fs");
const path = require("path");
const DIR = __dirname;
const d = JSON.parse(fs.readFileSync(path.join(DIR, "..", "..", "..", "public", "datos.json"), "utf8"));
const palabras = s => (s || "").trim().split(/\s+/).filter(Boolean).length;
const PATRONES = [
  ["A1 no X sino Y", /\bno (es|son|se trata de)\b[^.;]{0,80}\bsino\b/i],
  ["A10 dos puntos de remate", /^[^:]{8,90}: [a-záéíóúñ]/],
  ["B4 muletilla", /\b(Además|Cabe destacar|En este sentido|Por otro lado|En definitiva|En resumen)\b/],
  ["C relleno", /\b(fomenta\w*|crucial\w*|fundamental\w*|esencial\w*|potencia(r|n)?\b|ecosistema|panorama|robust\w*|sinergia|adentr\w*)\b/i],
  ["raya larga", /—/],
  ["voseo", /\b(podés|tenés|sabés|querés|mirá|fijate|vos)\b/i]
];
const LIMITES = { pista: 20, why: 95, uni: 40, nota: 32 };
const alertas = [];
const revisarTexto = (t, donde, limite) => {
  if (typeof t !== "string") return;
  for (const [n, re] of PATRONES) if (re.test(t)) alertas.push(n + " · " + donde + " · " + t.slice(0, 120));
  if (limite && palabras(t) > limite) alertas.push("largo " + palabras(t) + " palabras · " + donde);
};
const propuesta = { fichas: {}, notas: {}, refs: {}, misiones: {}, recetas_dudosas: [] };
const informe = { alta: [], media: [], baja: [] };
const resúmenes = [];
for (const r of ["R1", "R2", "R3", "R4"]) {
  const f = path.join(DIR, r + ".json");
  if (!fs.existsSync(f)) { resúmenes.push(r + ": falta"); continue; }
  const x = JSON.parse(fs.readFileSync(f, "utf8"));
  resúmenes.push(r + ": " + (x.resumen || ""));
  for (const [mid, m] of Object.entries(x.misiones || {})) {
    for (const h of m.hallazgos || []) (informe[h.gravedad] || informe.baja).push(r + " misión " + mid + " [" + h.tipo + "] " + h.detalle + (h.propuesta ? " → " + h.propuesta : ""));
    if (m.cambios && Object.keys(m.cambios).length) {
      propuesta.misiones[mid] = Object.assign(propuesta.misiones[mid] || {}, m.cambios);
      for (const [c, t] of Object.entries(m.cambios)) if (c === "reflexiones") for (const [h, q] of Object.entries(t)) revisarTexto(q, mid + ".reflexion." + h); else revisarTexto(t, mid + "." + c);
    }
    informe.veredictos = (informe.veredictos || []).concat(mid + ": " + m.veredicto);
  }
  for (const [id, c] of Object.entries(x.fichas || {})) {
    if (!d.fichas[id]) { alertas.push("ficha desconocida " + id + " en " + r); continue; }
    (informe[c.gravedad] || informe.baja).push(r + " ficha " + id + ": " + c.problema);
    propuesta.fichas[id] = Object.assign(propuesta.fichas[id] || {}, c.cambios || {});
    for (const [campo, t] of Object.entries(c.cambios || {})) {
      if (Array.isArray(t)) t.forEach((v, i) => typeof v === "string" && campo !== "refs" && revisarTexto(v, id + "." + campo + "[" + i + "]"));
      else revisarTexto(t, id + "." + campo, LIMITES[campo]);
    }
    for (const k of (c.cambios || {}).refs || []) if (!d.refs[k] && !(x.refs_nuevas || {})[k]) alertas.push("ref desconocida " + k + " en " + id);
  }
  for (const [k, n] of Object.entries(x.notas || {})) {
    const par = k.split("+").sort().join("+");
    if (!d.recetas.some(rr => [rr[0], rr[1]].sort().join("+") === par)) { alertas.push("nota para receta inexistente " + k); continue; }
    informe.media.push(r + " nota " + par + ": " + n.problema);
    propuesta.notas[par] = n.nota; revisarTexto(n.nota, "nota " + par, LIMITES.nota);
  }
  for (const rd of x.recetas_dudosas || []) { propuesta.recetas_dudosas.push(Object.assign({ revisor: r }, rd)); (informe[rd.gravedad] || informe.media).push(r + " receta " + rd.a + "+" + rd.b + "=" + rd.r + ": " + rd.problema + " → " + rd.propuesta); }
  for (const [k, v] of Object.entries(x.refs || {})) { informe.media.push(r + " ref " + k + ": " + v.problema); propuesta.refs[k] = v.apa; revisarTexto(v.apa, "ref " + k); }
  for (const [k, v] of Object.entries(x.refs_nuevas || {})) { if (d.refs[k] && d.refs[k] !== v) alertas.push("ref nueva choca con existente " + k); propuesta.refs[k] = v; }
}
fs.writeFileSync(path.join(DIR, "propuesta-ajustes.json"), JSON.stringify(propuesta, null, 2));
let md = "# Informe consolidado de la revisión pedagógica\n\n## Resúmenes\n" + resúmenes.map(s => "- " + s).join("\n") + "\n\n## Veredictos por misión\n" + (informe.veredictos || []).map(s => "- " + s).join("\n");
for (const g of ["alta", "media", "baja"]) md += "\n\n## Gravedad " + g + " (" + informe[g].length + ")\n" + informe[g].map(s => "- " + s).join("\n");
md += "\n\n## Alertas sobre los textos propuestos (" + alertas.length + ")\n" + alertas.map(s => "- " + s).join("\n") + "\n";
fs.writeFileSync(path.join(DIR, "informe-revision.md"), md);
console.log("alta " + informe.alta.length + " · media " + informe.media.length + " · baja " + informe.baja.length + " · alertas " + alertas.length);
console.log("fichas con cambios " + Object.keys(propuesta.fichas).length + " · notas " + Object.keys(propuesta.notas).length + " · refs " + Object.keys(propuesta.refs).length + " · misiones con cambios " + Object.keys(propuesta.misiones).length + " · recetas dudosas " + propuesta.recetas_dudosas.length);
