// Regenera el contexto que leen los agentes que escriben expansiones, a partir del estado actual (public/datos.json):
// CATALOGO-ACTUAL.md (marca las fichas que todavía no están en ningún plano), RECETAS-ACTUALES.txt, REFS-ACTUALES.md
// y una reserva de emojis libres por agente (EMOJIS-H1.txt ... EMOJIS-H7.txt), sin repetidos entre agentes.
// Uso: node datos/v2/tareas/contexto.js
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..", "..", "..");
const d = JSON.parse(fs.readFileSync(path.join(RAIZ, "public", "datos.json"), "utf8"));
const T = f => path.join(__dirname, f);
const sinVariacion = s => s.replace(/️/g, "");

// nivel de cada ficha (mínimo número de pasos desde los primigenios)
const nivel = {}; for (const i of d.iniciales) nivel[i] = 0;
for (let c = true; c;) { c = false; for (const [a, b, r] of d.recetas) { if (nivel[a] === undefined || nivel[b] === undefined) continue; const t = Math.max(nivel[a], nivel[b]) + 1; if (nivel[r] === undefined || t < nivel[r]) { nivel[r] = t; c = true; } } }
const enPlano = new Set(d.misiones.flatMap(m => m.plano.map(n => n.id)));

const filas = d.orden.flatMap(f => Object.entries(d.fichas).filter(([, x]) => x.f === f)).map(([id, f]) =>
  "- " + id + " · " + f.e + " · " + f.n + " · " + d.familias[f.f] + " · n" + (nivel[id] ?? "?") + (enPlano.has(id) ? "" : " · SIN MISIÓN") + " · " + (f.pista || ""));
fs.writeFileSync(T("CATALOGO-ACTUAL.md"), "# Catálogo actual (" + filas.length + " fichas)\n\n" +
  "Formato: id · emoji · nombre · familia · nivel · [SIN MISIÓN] · pista\n\n" +
  "SIN MISIÓN marca las fichas que ya están escritas pero no aparecen en el plano de ninguna misión, así que hoy nadie puede descubrirlas.\n" +
  "Hay " + filas.filter(l => l.includes("SIN MISIÓN")).length + " así. Ponerlas en el camino de tus misiones las vuelve descubribles.\n\n" + filas.join("\n") + "\n");

fs.writeFileSync(T("RECETAS-ACTUALES.txt"), "# Parejas que YA tienen receta (no las repitas con otro resultado)\n" +
  d.recetas.map(r => [r[0], r[1]].sort().join("+") + " = " + r[2]).sort().join("\n") + "\n");

fs.writeFileSync(T("REFS-ACTUALES.md"), "# Referencias existentes (reutilízalas por su clave)\n\n" +
  Object.entries(d.refs).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => "- " + k + ": " + v).join("\n") + "\n");

// Reserva de emojis: primero los temáticos de cada agente, después un reparto parejo del resto.
const usados = new Set(Object.values(d.fichas).map(f => sinVariacion(f.e)));
const libre = e => !usados.has(sinVariacion(e));
const TEMATICOS = {
  H1: "📽️ 🖼️ 🎞️ 📹 🎬 📺 🎨 🖌️ 🖍️ 🪧 ▶️ 🔆",
  H2: "📧 ✉️ 📨 📩 📬 📮 📱 📲 🔔 📢 📣 🏫 🗃️ 🗄️",
  H3: "🎮 🕹️ 🎲 🎯 🏆 🥇 🃏 🧩 🙋 📶 🎰 🪅",
  H4: "📝 🗂️ 📌 📎 🖇️ 📑 🔖 🧷 🗒️ 🌐 🖊️ 🖋️",
  H5: "🤖 🪄 🔍 🔎 📋 ✅ ☑️ 🧾 🔏 🔐 🛡️ 🗝️",
  H6: "🎧 🎙️ 📷 📸 🗓️ 📆 📅 ⏳ ⌛ ⏱️ 🛌 🌙",
  H7: "🧪 🔬 🧫 🧬 🧮 📈 📉 📊 📐 📏 🔭 💾"
};
const agentes = Object.keys(TEMATICOS);
const reserva = Object.fromEntries(agentes.map(a => [a, TEMATICOS[a].split(" ").filter(libre)]));
const ya = new Set(Object.values(reserva).flat().map(sinVariacion));
const RANGOS = [[0x1F300, 0x1F5FF], [0x1F680, 0x1F6FF], [0x1F900, 0x1F9FF], [0x1FA70, 0x1FAFF], [0x2600, 0x27BF]];
const pozo = [];
for (const [a, b] of RANGOS) for (let c = a; c <= b; c++) {
  const e = String.fromCodePoint(c);
  if (!/^\p{Emoji_Presentation}$/u.test(e) || (c >= 0x1F3FB && c <= 0x1F3FF)) continue;
  if (!libre(e) || ya.has(e)) continue;
  pozo.push(e);
}
pozo.forEach((e, i) => reserva[agentes[i % agentes.length]].push(e));
for (const a of agentes) fs.writeFileSync(T("EMOJIS-" + a + ".txt"), reserva[a].join(" ") + "\n");
console.log("catálogo " + filas.length + " fichas (" + filas.filter(l => l.includes("SIN MISIÓN")).length + " sin misión) · " + d.recetas.length + " recetas · " + Object.keys(d.refs).length + " refs");
console.log("emojis por agente: " + agentes.map(a => a + " " + reserva[a].length).join(" · "));
