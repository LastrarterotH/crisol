// Progreso de quien juega, guardado en este navegador.
import { D } from "./datos.js";
const CLAVE = "alquimia-docente:v2";
const inicial = () => ({
  descubiertos: {}, como: {}, caminos: {}, chispas: 3, mision: null, misiones: {}, mesa: [], sonido: true,
  orden: "recientes", bitacora: {}, predicciones: {}, taller: null, tutorialVisto: false, regalos: {}
});
export const E = inicial();
export function cargarEstado() {
  try { const s = JSON.parse(localStorage.getItem(CLAVE) || "null"); if (s && typeof s === "object") Object.assign(E, inicial(), s); } catch (e) { /* sin almacenamiento */ }
  for (const id of D.iniciales) if (!E.descubiertos[id]) E.descubiertos[id] = 1;
  for (const id of Object.keys(E.descubiertos)) if (!D.fichas[id]) delete E.descubiertos[id];
}
let t = null;
export function guardar() {
  clearTimeout(t);
  t = setTimeout(() => { try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (e) { /* lleno o bloqueado */ } }, 120);
}
export function reiniciar() { const sonido = E.sonido; Object.keys(E).forEach(k => delete E[k]); Object.assign(E, inicial(), { sonido }); cargarEstado(); guardar(); }
export const tiene = id => !!E.descubiertos[id];
export const descubiertas = () => Object.keys(E.descubiertos).filter(id => D.fichas[id]);
export function estadoMision(id) { return E.misiones[id] = E.misiones[id] || { iniciada: Date.now(), completada: null, reflexiones: {}, pistas: {} }; }
