// Consulta rápida para quien revisa recetas: dice si un par de fichas ya está ocupado y el nivel de cada una.
// Uso: node datos/v2/tareas/receta.js practica+tiempo mente+mundo ...   (ids separados por +)
const path = require("path");
const d = require(path.join(__dirname, "..", "..", "..", "public", "datos.json"));
const F = d.fichas;
const ocupado = new Map(d.recetas.map(([a, b, r]) => [[a, b].sort().join("+"), r]));
for (const par of process.argv.slice(2)) {
  const [a, b] = par.split("+").map(s => s.trim());
  const malos = [a, b].filter(x => !F[x]);
  if (malos.length) { console.log(par + ": no existe " + malos.join(", ")); continue; }
  const r = ocupado.get([a, b].sort().join("+"));
  console.log(par + ": " + (r ? "OCUPADO, ya da " + F[r].n + " [" + r + "]" : "libre") + " · niveles " + a + " " + F[a].nivel + ", " + b + " " + F[b].nivel);
}
