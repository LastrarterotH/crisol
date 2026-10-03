// Utilidades de interfaz: avisos, panel a tiza y fichas en miniatura.
import { D, esc } from "./datos.js";
const $ = id => document.getElementById(id);
export { $ };
export function aviso(contenido, opts = {}) {
  const el = document.createElement("div");
  el.className = "aviso" + (opts.oro ? " oro" : "") + (opts.familia ? " f-" + opts.familia : "");
  if (typeof contenido === "string") el.textContent = contenido; else el.appendChild(contenido);
  $("avisos").appendChild(el);
  setTimeout(() => { el.style.transition = "opacity .4s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 400); }, opts.ms || 4200);
  const todos = $("avisos").children;
  if (todos.length > 3) todos[0].remove();
}
export function avisoRico(titulo, texto, opts = {}) {
  const f = document.createDocumentFragment();
  const b = document.createElement("b"); b.textContent = titulo; f.appendChild(b);
  if (texto) { const s = document.createElement("span"); s.textContent = texto; f.appendChild(s); }
  aviso(f, opts);
}
let alCerrar = null;
export function abrirPanel(html, acciones = {}, cerrar) {
  const p = $("panel");
  p.innerHTML = '<button class="icono cerrar" type="button" aria-label="Cerrar">✕</button>' + html;
  p.querySelector(".cerrar").addEventListener("click", cerrarPanel);
  p.querySelectorAll("[data-accion]").forEach(b => b.addEventListener("click", ev => (acciones[b.dataset.accion] || cerrarPanel)(ev, b)));
  alCerrar = cerrar || null;
  $("capaPanel").hidden = false;
  p.scrollTop = 0;
  const f = p.querySelector("[autofocus], input, .boton.principal");
  if (f) setTimeout(() => f.focus({ preventScroll: true }), 50);
  return p;
}
export function cerrarPanel() { $("capaPanel").hidden = true; const fn = alCerrar; alCerrar = null; if (fn) fn(); }
export function miniHtml(id, oculta) {
  const f = D.fichas[id];
  if (!f || oculta) return '<span class="mini oculta">?</span>';
  return '<span class="mini f-' + f.f + '"><span class="em">' + esc(f.e) + "</span>" + esc(f.n) + "</span>";
}
export function chipHtml(id, extra = "") {
  const f = D.fichas[id];
  return '<button class="chip f-' + f.f + (f.f === "mito" ? " mito" : "") + (f.ia ? " ia" : "") + '" type="button" data-id="' + esc(id) + '"><span class="em">' + esc(f.e) + "</span>" + esc(f.n) + extra + "</button>";
}
export function descargar(nombreArchivo, texto) {
  const url = URL.createObjectURL(new Blob([texto], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = nombreArchivo; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
}
