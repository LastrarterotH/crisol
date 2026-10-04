// Revisa que cada cita en el texto de una ficha, como "(Mayer, 2009)" o "(Szpunar et al., 2013)", tenga una referencia con
// ese primer autor y ese año, en el juego o en la expansión, y que la ficha la incluya en sus refs. También avisa si un
// encargo nombra una universidad real (las misiones dicen "una universidad de ...").
// Uso: node datos/v2/tareas/citas.js [--arreglar] datos/v2/expansion-H1.json [más archivos]
// Con --arreglar agrega a las refs de la ficha la clave citada cuando hay una sola candidata.
const fs = require("fs");
const path = require("path");
const d = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "public", "datos.json"), "utf8"));
const sinTilde = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const ARREGLAR = process.argv.includes("--arreglar");
for (const archivo of process.argv.slice(2).filter(a => a !== "--arreglar")) {
  let arreglos = 0;
  const x = JSON.parse(fs.readFileSync(archivo, "utf8"));
  const refs = Object.assign({}, d.refs, x.refs || {});
  const primero = k => { const r = refs[k] || ""; return { autor: sinTilde((r.split(",")[0] || "").trim()), anio: (r.match(/\((\d{4})/) || [])[1] }; };
  const problemas = [];
  for (const [id, f] of Object.entries(x.fichas || {})) {
    const texto = [f.why, f.evidence, f.belief, ...(f.principios || [])].filter(Boolean).join(" ");
    for (const m of texto.matchAll(/\(([^()]*?\d{4}[a-z]?)\)/g)) {
      for (const cita of m[1].split(";")) {
        const c = cita.trim().match(/^(?:p\. ej\., )?([A-ZÁÉÍÓÚÑ][^,]*?)(?: et al\.| y | & |,)[^0-9]*?(\d{4})/) || cita.trim().match(/^([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚáéíóúñü'-]+)[^0-9]*?(\d{4})/);
        if (!c) continue;
        const autor = sinTilde(c[1].split(/ y | & | et al/)[0].trim().split(" ").pop()), anio = c[2];
        const claves = Object.keys(refs).filter(k => { const p = primero(k); return p.anio === anio && p.autor.endsWith(autor); });
        if (!claves.length) problemas.push(id + ": cita " + c[1] + " (" + anio + ") sin referencia en el juego");
        else if (!claves.some(k => (f.refs || []).includes(k))) {
          if (ARREGLAR && claves.length === 1) { f.refs = [...(f.refs || []), claves[0]]; arreglos++; }
          else problemas.push(id + ": cita " + c[1] + " (" + anio + ") sin ponerla en refs (" + claves.join(" o ") + ")");
        }
      }
    }
  }
  for (const m of x.misiones || []) if (/Universidad (Nacional|Autónoma|Católica|de [A-Z]|del [A-Z])|Pontificia|Instituto Tecnológico/.test(m.encargo)) problemas.push("misión " + m.id + ": el encargo nombra una institución real; usa \"una universidad de CIUDAD\"");
  if (arreglos) { fs.writeFileSync(archivo, JSON.stringify(x, null, 2) + "\n"); console.log(path.basename(archivo) + ": " + arreglos + " refs agregadas"); }
  console.log(path.basename(archivo) + ": " + (problemas.length ? problemas.length + " problemas\n  " + problemas.join("\n  ") : "sin problemas"));
}
