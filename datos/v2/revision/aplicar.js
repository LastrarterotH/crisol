// Aplica la revisión pedagógica (propuesta-ajustes.json, ya consolidada y curada) a ajustes.json
// y las decisiones sobre recetas. Guarda una copia de ajustes.json antes de tocarlo.
const fs = require("fs");
const path = require("path");
const V = p => path.join(__dirname, "..", p);
const aj = JSON.parse(fs.readFileSync(V("ajustes.json"), "utf8"));
fs.writeFileSync(V("ajustes.antes-revision.json"), JSON.stringify(aj, null, 2));
const p = JSON.parse(fs.readFileSync(path.join(__dirname, "propuesta-ajustes.json"), "utf8"));

aj.fichas = aj.fichas || {}; aj.notas = aj.notas || {}; aj.refs = aj.refs || {}; aj.misiones = aj.misiones || {};
for (const [id, c] of Object.entries(p.fichas)) aj.fichas[id] = Object.assign(aj.fichas[id] || {}, c);
Object.assign(aj.notas, p.notas);
Object.assign(aj.refs, p.refs);
for (const [mid, c] of Object.entries(p.misiones)) {
  const { hitos, reflexiones, ...textos } = c;
  const m = aj.misiones[mid] = aj.misiones[mid] || {};
  Object.assign(m, textos);
  if (reflexiones) m.reflexiones = Object.assign(m.reflexiones || {}, reflexiones);
}

// Recetas: se quitan las que enseñan una relación falsa o forzada (fuera del camino diseñado).
const QUITAR = ["mundo+olvido", "memoria+mundo", "mundo+practica_deliberada", "grupo+otros", "escritura+olvido", "curriculo+curriculo", "investigacion_accion+tecnologia", "emocion+tiempo", "estudiante+proposito",
  // reemplazadas en el camino diseñado (ver recetas-nuevas.txt)
  "activo+bloom", "dominio+motivacion", "proposito+tiempo", "blended+ritmo", "estudiante+motivacion"];
aj.quitarRecetas = [...new Set([...(aj.quitarRecetas || []), ...QUITAR.map(k => k.split("+").sort().join("+"))])];
aj.notas["dominio+estudiante"] = "Cuando un estudiante domina por fin un tema difícil con su propio esfuerzo, vive lo que Bandura consideró la fuente más poderosa de autoeficacia.";
aj.notas["estudiante+mente"] = aj.notas["estudiante+mente"] || "Imaginar que la mente del estudiante trabaja a una fracción de su capacidad es una idea vieja y atractiva. De ahí sale el mito del 10 % del cerebro.";
aj.notas["activo+memoria"] = "Querer saber cuánto recuerda el curso según la actividad tienta a creer en una pirámide con porcentajes de retención que ningún estudio respalda.";

fs.writeFileSync(V("ajustes.json"), JSON.stringify(aj, null, 2));
const nuevas = fs.readFileSync(V("recetas-nuevas.txt"), "utf8");
const agregar = ["dominio + estudiante = autoeficacia", "activo + memoria = piramide", "mente + estudiante = cerebro10", "proposito + saber = resultados"].filter(l => !nuevas.includes(l));
if (agregar.length) fs.appendFileSync(V("recetas-nuevas.txt"), "\n# Revisión pedagógica: reemplazan recetas que enseñaban una relación falsa\n" + agregar.join("\n") + "\n");
console.log("ajustes: fichas " + Object.keys(aj.fichas).length + " · notas " + Object.keys(aj.notas).length + " · refs " + Object.keys(aj.refs).length + " · misiones " + Object.keys(aj.misiones).length + " · quitar " + aj.quitarRecetas.length + " · recetas nuevas agregadas " + agregar.length);
