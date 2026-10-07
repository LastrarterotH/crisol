// Datos del juego: vienen incrustados en la página empaquetada (window.DATOS) o se leen de datos.json.
export const D = { fichas: {}, recetas: [], misiones: [], familias: {}, orden: [], refs: {}, iniciales: [] };
export const RECETA = new Map();
export const RECETAS_DE = {};

export const clave = (a, b) => [a, b].sort().join("+");
export const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
export const EMOJI = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:\uFE0F|\u200D\p{Extended_Pictographic}\uFE0F?|[\u{1F3FB}-\u{1F3FF}])*/gu;
export const rico = s => esc(s).replace(EMOJI, '<span class="emo">$&</span>');
// Referencia en APA con cursivas y enlaces que se abren aparte (el DOI o la URL quedan clicables; las cursivas no tocan las URL).
export const refHtml = s => esc(s).split(/(https?:\/\/[^\s<]+[^\s<.,;)])/).map((t, i) => i % 2 ? '<a href="' + t + '" target="_blank" rel="noopener">' + t.replace(/^https?:\/\/(www\.)?/, "") + "</a>" : t.replace(/_(.+?)_/g, "<em>$1</em>")).join("");
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
}

export async function cargar() {
  if (window.DATOS) Object.assign(D, window.DATOS);
  else Object.assign(D, await (await fetch("datos.json", { cache: "no-store" })).json());
  indexar();
}
