// Reglas de la misión activa: qué mezclas valen (las que llevan a piezas del plano),
// qué fichas sirven para la misión y cuáles ya no llevan a ninguna pieza pendiente.
import { D, RECETA, clave } from "./datos.js";
import { E, tiene } from "./estado.js";

export const misionActiva = () => D.misiones.find(m => m.id === E.mision) || null;

let cache = { id: null };
function reglas(m) {
  if (cache.id === m.id) return cache;
  const piezas = new Set(m.plano.map(n => n.id));
  const recetas = D.recetas.filter(r => piezas.has(r[2]) && !D.iniciales.includes(r[2]));
  const ingredientes = new Set(recetas.flatMap(r => [r[0], r[1]]));
  cache = { id: m.id, piezas, recetas, ingredientes };
  return cache;
}

// La receta de una pareja, solo si su resultado es una pieza del plano de la misión.
export function recetaEnMision(a, b) {
  const rec = RECETA.get(clave(a, b));
  const m = misionActiva();
  if (!rec || !m) return rec || null;
  return reglas(m).piezas.has(rec[2]) ? rec : null;
}
export const recetaFuera = (a, b) => !!RECETA.get(clave(a, b)) && !recetaEnMision(a, b);
export const recetasMision = () => { const m = misionActiva(); return m ? reglas(m).recetas : D.recetas; };
export const esPieza = id => { const m = misionActiva(); return !!m && reglas(m).piezas.has(id); };

// Sirve si es primigenio, pieza del plano o ingrediente de alguna receta que lleva a una pieza.
export function sirveEnMision(id) {
  const m = misionActiva();
  if (!m) return true;
  const r = reglas(m);
  return D.iniciales.includes(id) || r.piezas.has(id) || r.ingredientes.has(id);
}

// Agotada: ninguna receta con esta ficha lleva a una pieza que todavía falte.
export function agotada(id) {
  const m = misionActiva();
  if (!m) return false;
  return !reglas(m).recetas.some(r => (r[0] === id || r[1] === id) && !tiene(r[2]));
}

// Las ideas que se pueden descubrir: las que están en el plano de alguna misión.
let alcanzables = null;
export function esAlcanzable(id) {
  if (!alcanzables) alcanzables = new Set(D.misiones.flatMap(m => m.plano.map(n => n.id)));
  return alcanzables.has(id);
}
export const totalAlcanzables = () => Object.keys(D.fichas).filter(esAlcanzable).length;
