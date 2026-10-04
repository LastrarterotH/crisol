// Arma un paquete de contexto recortado para cada agente de la expansión H (paquetes/PAQUETE-Hn.md): su asignación, sus
// fichas SIN MISIÓN en detalle (con las recetas que hoy las producen), el catálogo completo en una línea por ficha y las
// referencias que ya usan sus fichas. Reemplaza la lectura de CATALOGO-ACTUAL.md, RECETAS-ACTUALES.txt y REFS-ACTUALES.md.
// Uso: node datos/v2/tareas/paquete.js   (antes: node construir.js y node datos/v2/tareas/contexto.js)
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..", "..", "..");
const d = JSON.parse(fs.readFileSync(path.join(RAIZ, "public", "datos.json"), "utf8"));
const T = (...f) => path.join(__dirname, ...f);
fs.mkdirSync(T("paquetes"), { recursive: true });

const nivel = {}; for (const i of d.iniciales) nivel[i] = 0;
for (let c = true; c;) { c = false; for (const [a, b, r] of d.recetas) { if (nivel[a] === undefined || nivel[b] === undefined) continue; const t = Math.max(nivel[a], nivel[b]) + 1; if (nivel[r] === undefined || t < nivel[r]) { nivel[r] = t; c = true; } } }
const enPlano = new Set(d.misiones.flatMap(m => m.plano.map(n => n.id)));
const ABR = { prim: "prim", cot: "cot", fund: "fund", apr: "apr", met: "met", tec: "tec", her: "her", mod: "mod", eva: "eva", dis: "dis", mito: "mito", sint: "sint" };
const compacto = d.orden.flatMap(f => Object.entries(d.fichas).filter(([, x]) => x.f === f))
  .map(([id, f]) => id + " · " + f.e + " · " + f.n + " · " + ABR[f.f] + " · n" + (nivel[id] ?? "?") + (enPlano.has(id) ? "" : " · S")).join("\n");
const produce = id => d.recetas.filter(r => r[2] === id).sort((x, y) => Math.max(nivel[x[0]], nivel[x[1]]) - Math.max(nivel[y[0]], nivel[y[1]])).slice(0, 3).map(r => r[0] + " + " + r[1]).join("; ");

for (const archivo of fs.readdirSync(__dirname).filter(f => /^ASIGNACION-H\d+\.json$/.test(f)).sort()) {
  const n = archivo.match(/H\d+/)[0];
  const a = JSON.parse(fs.readFileSync(T(archivo), "utf8"));
  const emojis = fs.readFileSync(T("EMOJIS-" + n + ".txt"), "utf8").trim();
  const propias = a.sin_mision.map(id => { const f = d.fichas[id]; return "- " + id + " · " + f.e + " · " + f.n + " · " + d.familias[f.f] + " · n" + nivel[id] + " · pista: " + (f.pista || f.belief || "") + " · hoy sale de: " + produce(id); });
  const claves = [...new Set(a.sin_mision.flatMap(id => d.fichas[id].refs || []))].filter(k => d.refs[k]).sort();
  const md = "# Paquete " + n + "\n\n" +
    "## Tu asignación\n" + a.misiones.map((m, i) => "- Misión " + (i + 1) + ": **" + m[0] + "** (" + m[2] + "). " + m[1] + ".").join("\n") + "\n" +
    "- Herramientas que creas tú (nadie más): " + a.herramientas.join(", ") + ".\n" +
    "- Tu reserva de emojis (usa solo estos, uno distinto por ficha): " + emojis + "\n\n" +
    "## Tus fichas SIN MISIÓN (" + a.sin_mision.length + "): ponlas en el camino de tus misiones\n" +
    "Ya están escritas; no las reescribas (su texto se revisa después). Úsalas como ingredientes de tus piezas siguientes.\n" + propias.join("\n") + "\n\n" +
    "## Referencias que ya usan esas fichas (reutilízalas por su clave)\n" + claves.map(k => "- " + k + ": " + d.refs[k]).join("\n") + "\n\n" +
    "## Catálogo completo en una línea por ficha (" + Object.keys(d.fichas).length + ")\n" +
    "Formato: id · emoji · nombre · familia · nivel · S = sin misión. Para leer la pista de una ficha: grep '^- ID ·' datos/v2/tareas/CATALOGO-ACTUAL.md\n\n" + compacto + "\n";
  fs.writeFileSync(T("paquetes", "PAQUETE-" + n + ".md"), md);
  console.log(n + ": " + Math.round(md.length / 1024) + " KB · " + a.sin_mision.length + " fichas sin misión · " + claves.length + " refs");
}
