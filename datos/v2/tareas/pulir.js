// Pule los textos de las expansiones: quita la fórmula "Surge de unir A con B: ..." (o "Nace/Sale de unir/juntar/combinar")
// con la que los agentes describían la receta dentro del why, y quita el campo "reflexiones" de las misiones, que ya no existe.
// Si la fórmula termina en dos puntos, se conserva lo que sigue, con mayúscula inicial; si termina en punto, se quita la oración.
// Uso: node datos/v2/tareas/pulir.js datos/v2/expansion-H1.json [más archivos]
const fs = require("fs");
const FORMULA = /(^|(?<=[.!?]\s))(?:Surge|Nace|Sale|Resulta|Aparece) de (?:unir|juntar|combinar|cruzar|sumar)\b[^.:]*([.:])\s*/g;
for (const archivo of process.argv.slice(2)) {
  const x = JSON.parse(fs.readFileSync(archivo, "utf8"));
  let cambios = 0;
  for (const f of Object.values(x.fichas || {})) for (const campo of ["why", "evidence"]) {
    if (typeof f[campo] !== "string") continue;
    const antes = f[campo];
    f[campo] = antes.replace(FORMULA, (m, ini, fin) => fin === ":" ? "\u0000" : "").replace(/\u0000(\S)/g, (m, c) => c.toUpperCase()).replace(/\s{2,}/g, " ").trim();
    if (f[campo] !== antes) cambios++;
  }
  for (const m of x.misiones || []) if (m.reflexiones) { delete m.reflexiones; cambios++; }
  fs.writeFileSync(archivo, JSON.stringify(x, null, 2) + "\n");
  console.log(archivo.split("/").pop() + ": " + cambios + " textos pulidos");
}
