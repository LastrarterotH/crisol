// Aplica la revisión de validez de las recetas (datos/v2/revision/recetas-decision.json) sobre datos/v2/ajustes.json:
// - "plano": recetas [a, b, resultado] que pasan a ser parte del camino diseñado (ajustes.recetasPlano) y reemplazan a
//   las que no se sostenían; si el par ya daba otra cosa, se reasigna.
// - "quitar": pares que dejan de existir (ajustes.quitarRecetas), venga de donde venga la receta.
// - "extra": recetas alternativas nuevas (ajustes.recetasExtra), que no cambian los planos salvo por una ruta fijada.
// - "rutas": receta fijada por pieza en una misión (ajustes.misiones[id].ruta), para que un concepto no quede fuera.
// - "notas": nota nueva por par (ajustes.notas). "fichas": cambios de texto por ficha (ajustes.fichas).
// Revisa el estilo de cada nota antes de escribir. Uso: node datos/v2/tareas/aplicar-recetas.js && node construir.js
const fs = require("fs");
const path = require("path");
const V = (...p) => path.join(__dirname, "..", ...p);
const d = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "public", "datos.json"), "utf8"));
const dec = JSON.parse(fs.readFileSync(V("revision", "recetas-decision.json"), "utf8"));
const aj = JSON.parse(fs.readFileSync(V("ajustes.json"), "utf8"));
const K = (a, b) => [a, b].sort().join("+");
const errores = [];
const ESTILO = [[/—/, "raya larga"], [/\bSurge de unir\b|\bAl combinar\b|\bNo se trata de\b/i, "fórmula prohibida"], [/\bno (es|son)\b[^.]{0,60}\bsino\b/i, "no es X sino Y"], [/\b(podés|tenés|sabés|querés|hacé|mirá|fijate|vos)\b/i, "voseo"]];
for (const [k, n] of Object.entries(dec.notas || {})) {
  if (n.length > 230) errores.push("nota larga (" + n.length + "): " + k);
  for (const [re, qué] of ESTILO) if (re.test(n)) errores.push(qué + " en la nota de " + k);
}
for (const [a, b, r] of [...(dec.plano || []), ...(dec.extra || [])]) for (const x of [a, b, r]) if (!d.fichas[x]) errores.push("no existe la ficha " + x);
for (const [a, b] of dec.extra || []) if (d.recetas.some(r => K(r[0], r[1]) === K(a, b))) errores.push("el par de la receta extra ya existe: " + K(a, b));
for (const [mid, ruta] of Object.entries(dec.rutas || {})) if (!d.misiones.some(m => m.id === mid)) errores.push("no existe la misión " + mid); else for (const [id, [a, b]] of Object.entries(ruta)) if (!d.fichas[id] || !d.fichas[a] || !d.fichas[b]) errores.push("ruta con ids inexistentes en " + mid);
for (const k of dec.quitar || []) if (!d.recetas.some(r => K(r[0], r[1]) === k)) errores.push("no existe la receta " + k);
if (errores.length) { console.log(errores.join("\n")); process.exit(1); }

const nuevas = new Set((dec.plano || []).map(([a, b]) => K(a, b)));
// el par reasignado se quita en su versión anterior; la versión de la revisión no se ve afectada por quitarRecetas
const reasignados = (dec.plano || []).filter(([a, b, r]) => d.recetas.some(x => K(x[0], x[1]) === K(a, b) && x[2] !== r)).map(([a, b]) => K(a, b));
aj.quitarRecetas = [...new Set([...(aj.quitarRecetas || []), ...(dec.quitar || []), ...reasignados])];
aj.recetasPlano = dec.plano || [];
const extraPrevias = (aj.recetasExtra || []).filter(([a, b]) => !(dec.extra || []).some(([x, y]) => K(x, y) === K(a, b)));
aj.recetasExtra = [...extraPrevias, ...(dec.extra || []).map(([a, b, r]) => [a, b, r])];
aj.misiones = aj.misiones || {};
for (const [mid, ruta] of Object.entries(dec.rutas || {})) aj.misiones[mid] = Object.assign(aj.misiones[mid] || {}, { ruta: Object.assign((aj.misiones[mid] || {}).ruta || {}, ruta) });
aj.notas = aj.notas || {};
for (const k of dec.quitar || []) if (!nuevas.has(k)) delete aj.notas[k];
Object.assign(aj.notas, dec.notas || {});
aj.fichas = aj.fichas || {};
for (const [id, c] of Object.entries(dec.fichas || {})) aj.fichas[id] = Object.assign(aj.fichas[id] || {}, c);
fs.writeFileSync(V("ajustes.json"), JSON.stringify(aj, null, 2));
console.log("recetas del camino: " + aj.recetasPlano.length + " (" + reasignados.length + " pares reasignados) · alternativas nuevas: " + (dec.extra || []).length + " · rutas: " + Object.keys(dec.rutas || {}).length + " misiones · quitadas en total: " + aj.quitarRecetas.length + " · notas: " + Object.keys(dec.notas || {}).length);
