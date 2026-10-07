// Compara los planos de misión actuales (public/datos.json) con una foto anterior (datos/v2/revision/planos-antes.json):
// piezas que entran y salen por misión, hitos fuera del plano, ideas que dejan de poder descubrirse y herramientas.
// Uso: node datos/v2/tareas/comparar-planos.js   (la foto se toma con --foto, antes de cambiar recetas)
const fs = require("fs");
const path = require("path");
const d = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "public", "datos.json"), "utf8"));
const FOTO = path.join(__dirname, "..", "revision", "planos-antes.json");
const ahora = {};
for (const m of d.misiones) ahora[m.id] = m.plano.map(x => x.id + (x.ing ? "=" + x.ing.join("+") : ""));
if (process.argv.includes("--foto")) { fs.writeFileSync(FOTO, JSON.stringify(ahora, null, 1)); console.log("foto guardada: " + Object.keys(ahora).length + " planos"); process.exit(0); }
const antes = JSON.parse(fs.readFileSync(FOTO, "utf8"));
const piezas = p => new Set(p.map(s => s.split("=")[0]));
const F = d.fichas, nom = id => (F[id] ? F[id].n : id);
let cambiadas = 0;
for (const m of d.misiones) {
  const A = piezas(antes[m.id] || []), B = piezas(ahora[m.id]);
  const salen = [...A].filter(x => !B.has(x)), entran = [...B].filter(x => !A.has(x));
  const recetas = ahora[m.id].filter(s => !(antes[m.id] || []).includes(s) && B.has(s.split("=")[0]) && A.has(s.split("=")[0])).length;
  const faltan = [m.meta, ...m.hitos].filter(h => !B.has(h));
  if (!salen.length && !entran.length && !recetas && !faltan.length) continue;
  cambiadas++;
  console.log(m.id + ": " + A.size + " → " + B.size + " piezas" + (recetas ? " · " + recetas + " recetas distintas" : "") + (entran.length ? " · entran " + entran.map(nom).join(", ") : "") + (salen.length ? " · salen " + salen.map(nom).join(", ") : "") + (faltan.length ? " · ¡FALTAN HITOS! " + faltan.join(", ") : ""));
}
const todas = o => new Set(Object.values(o).flatMap(p => [...piezas(p)]));
const A = todas(antes), B = todas(ahora);
const perdidas = [...A].filter(x => !B.has(x)), ganadas = [...B].filter(x => !A.has(x));
const her = Object.keys(F).filter(id => F[id].f === "her");
console.log("\nmisiones con cambios: " + cambiadas + " de " + d.misiones.length);
console.log("ideas descubribles: " + A.size + " → " + B.size + (perdidas.length ? " · dejan de estar en un plano: " + perdidas.map(nom).join(", ") : "") + (ganadas.length ? " · entran: " + ganadas.map(nom).join(", ") : ""));
console.log("herramientas en algún plano: " + her.filter(x => B.has(x)).length + " de " + her.length);
