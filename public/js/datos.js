// Datos del juego (public/datos.json) más las fichas que Claude generó y quedaron en la caché del servidor.
export const D = { fichas: {}, recetas: [], misiones: [], familias: {}, orden: [], refs: {}, iniciales: [], analizadas: [] };
export const RECETA = new Map();
export const RECETAS_DE = {};
export const IA = { cartas: {}, combos: {}, curaduria: {} };
export const SERVIDOR = { ia: false, local: false, lan: "", conectado: false };
export let ANALIZADAS = new Set();

export const clave = (a, b) => [a, b].sort().join("+");
export const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
export const EMOJI = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:\uFE0F|\u200D\p{Extended_Pictographic}\uFE0F?|[\u{1F3FB}-\u{1F3FF}])*/gu;
export const rico = s => esc(s).replace(EMOJI, '<span class="emo">$&</span>');
export const refHtml = s => esc(s).replace(/_(.+?)_/g, "<em>$1</em>");
export const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
export const ficha = id => D.fichas[id];
export const nombre = id => (D.fichas[id] ? D.fichas[id].e + " " + D.fichas[id].n : id);
export const recetasDe = id => RECETAS_DE[id] || [];

function indexar() {
  RECETA.clear();
  for (const k of Object.keys(RECETAS_DE)) delete RECETAS_DE[k];
  for (const rec of D.recetas) {
    RECETA.set(clave(rec[0], rec[1]), rec);
    (RECETAS_DE[rec[2]] = RECETAS_DE[rec[2]] || []).push(rec);
  }
  ANALIZADAS = new Set(D.analizadas);
}

export function registrarCartaIA(id, c) {
  if (!c || D.fichas[id] && !D.fichas[id].ia) return false;
  if (IA.curaduria[id] === "rechazada") { delete D.fichas[id]; return false; }
  D.fichas[id] = Object.assign({ nivel: 9 }, c, { ia: true, estado: IA.curaduria[id] || "pendiente" });
  return true;
}

export async function cargar() {
  const r = await fetch("datos.json", { cache: "no-store" });
  Object.assign(D, await r.json());
  indexar();
  try {
    const est = await (await fetch("api/estado")).json();
    Object.assign(SERVIDOR, est, { conectado: true });
    const ia = await (await fetch("api/ia")).json();
    Object.assign(IA, ia);
    for (const [id, c] of Object.entries(IA.cartas)) registrarCartaIA(id, c);
  } catch (e) { SERVIDOR.conectado = false; }
}
