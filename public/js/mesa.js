// La mesa: fichas que se arrastran y se mezclan de a dos.
import { D, RECETA, clave, esc, norm, recetasDe } from "./datos.js";
import { E, tiene, guardar, descubiertas } from "./estado.js";
import { $, aviso, avisoRico, chipHtml } from "./ui.js";
import { sonar, activarSonido } from "./sonido.js";
import { rafaga, nube, estela } from "./polvo.js";
import { caminosHallados } from "./ficha.js";
import { emitir, on } from "./bus.js";
import { abrirFicha } from "./ficha.js";

export const COLOR = { prim: "#9a7432", cot: "#c27c1e", fund: "#8b5e3c", apr: "#23935f", met: "#db5a2a", eva: "#cf3f74", dis: "#13909a", tec: "#6a54d1", mod: "#2f74c9", mito: "#c23a2e", sint: "#d99a12" };
const pizarra = $("pizarra"), lista = $("cajaLista"), caja = $("caja"), buscar = $("buscar");
let fichas = [];
let z = 10;
const reducido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const espera = ms => new Promise(r => setTimeout(r, reducido() ? 0 : ms));

/* ---------- Fichas sobre la pizarra ---------- */
function contenido(el, id) {
  const f = D.fichas[id];
  el.classList.add("f-" + f.f);
  if (f.f === "mito") el.classList.add("mito");
  if (f.ia) el.classList.add("ia");
  el.innerHTML = '<span class="em">' + esc(f.e) + "</span><span>" + esc(f.n) + "</span>";
}
const ubicar = t => { t.el.style.left = t.x + "px"; t.el.style.top = t.y + "px"; };
function acotar(t) {
  const W = pizarra.clientWidth, H = pizarra.clientHeight;
  t.x = Math.max(6, Math.min(W - t.el.offsetWidth - 6, t.x));
  t.y = Math.max(6, Math.min(H - t.el.offsetHeight - 6, t.y));
  ubicar(t);
}
export function agregar(id, x, y, opts = {}) {
  if (!D.fichas[id]) return null;
  const el = document.createElement("div");
  el.className = "ficha";
  contenido(el, id);
  el.style.setProperty("--giro", ((Math.random() - .5) * 4).toFixed(2) + "deg");
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", D.fichas[id].n + ". Arrástrala sobre otra para mezclar. Enter abre su ficha.");
  el.dataset.id = id;
  el.style.zIndex = ++z;
  pizarra.appendChild(el);
  const t = { id, x, y, el };
  if (opts.centrar) { t.x = x - el.offsetWidth / 2; t.y = y - el.offsetHeight / 2; }
  acotar(t);
  if (opts.nace) { el.classList.add("nace"); el.addEventListener("animationend", () => el.classList.remove("nace"), { once: true }); }
  if (opts.niega) { el.classList.add("niega"); el.addEventListener("animationend", () => el.classList.remove("niega"), { once: true }); }
  vincular(t);
  fichas.push(t);
  return t;
}
export function quitar(t) { t.el.remove(); fichas = fichas.filter(o => o !== t); }
export const fichasEnPizarra = () => fichas;
function objetivoEn(px, py, excluir) {
  let mejor = null, md = Infinity;
  for (const o of fichas) {
    if (o === excluir) continue;
    const w = o.el.offsetWidth, h = o.el.offsetHeight;
    if (px >= o.x - 8 && px <= o.x + w + 8 && py >= o.y - 8 && py <= o.y + h + 8) {
      const d = Math.hypot(px - (o.x + w / 2), py - (o.y + h / 2));
      if (d < md) { md = d; mejor = o; }
    }
  }
  return mejor;
}
const sobreCaja = (cx, cy) => { const r = caja.getBoundingClientRect(); return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom; };
function vincular(t) {
  const el = t.el;
  el.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    activarSonido();
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY, ox = t.x, oy = t.y;
    let movida = false, obj = null;
    el.style.zIndex = ++z;
    const mover = ev => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!movida && Math.hypot(dx, dy) < 5) return;
      if (!movida) { movida = true; el.classList.add("arrastrando"); sonar.toque(); }
      t.x = ox + dx; t.y = oy + dy; ubicar(t);
      const n = objetivoEn(t.x + el.offsetWidth / 2, t.y + el.offsetHeight / 2, t);
      if (n !== obj) { obj && obj.el.classList.remove("objetivo"); obj = n; obj && obj.el.classList.add("objetivo"); }
      caja.classList.toggle("soltar-aqui", sobreCaja(ev.clientX, ev.clientY));
    };
    const soltar = ev => {
      el.removeEventListener("pointermove", mover); el.removeEventListener("pointerup", soltar); el.removeEventListener("pointercancel", soltar);
      el.classList.remove("arrastrando");
      obj && obj.el.classList.remove("objetivo");
      caja.classList.remove("soltar-aqui");
      if (!movida) { if (ev.type === "pointerup") abrirFicha(t.id); return; }
      if (sobreCaja(ev.clientX, ev.clientY)) { quitar(t); guardarPizarra(); return; }
      if (obj) combinar(t, obj); else { acotar(t); acomodar(t); guardarPizarra(); }
    };
    el.addEventListener("pointermove", mover); el.addEventListener("pointerup", soltar); el.addEventListener("pointercancel", soltar);
  });
  el.addEventListener("dblclick", () => { const c = agregar(t.id, t.x + 26, t.y + 26, { nace: true }); if (c) { acomodar(c); guardarPizarra(); } });
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrirFicha(t.id); }
    if (e.key === "Delete" || e.key === "Backspace") { quitar(t); guardarPizarra(); }
  });
}
export function guardarPizarra() {
  const W = pizarra.clientWidth || 1, H = pizarra.clientHeight || 1;
  E.mesa = fichas.map(t => ({ id: t.id, x: +((t.x + t.el.offsetWidth / 2) / W).toFixed(4), y: +((t.y + t.el.offsetHeight / 2) / H).toFixed(4) }));
  guardar();
}

/* ---------- Mezclar ---------- */
async function fundir(a, b, cx, cy) {
  for (const t of [a, b]) {
    fichas = fichas.filter(o => o !== t);
    const w = t.el.offsetWidth, h = t.el.offsetHeight;
    t.el.style.transition = "transform .22s cubic-bezier(.5,0,.8,.4), opacity .22s";
    t.el.style.transform = "translate(" + (cx - t.x - w / 2) + "px," + (cy - t.y - h / 2) + "px) scale(.5) rotate(18deg)";
    t.el.style.opacity = "0";
    setTimeout(() => t.el.remove(), reducido() ? 0 : 240);
  }
  await espera(200);
}
function sugerencia(a, b) {
  for (const x of [a, b]) {
    const posible = D.recetas.find(r => (r[0] === x || r[1] === x) && !tiene(r[2]) && tiene(r[0]) && tiene(r[1]));
    if (posible) return "Prueba " + D.fichas[x].e + " " + D.fichas[x].n + " con otra de tus fichas, que hay una mezcla esperándote.";
  }
  return "Prueba con otra pareja.";
}
function noCombina(a, b) {
  const cx = b.x + b.el.offsetWidth / 2, cy = b.y + b.el.offsetHeight / 2;
  a.el.classList.add("niega"); b.el.classList.add("niega");
  setTimeout(() => { a.el.classList.remove("niega"); b.el.classList.remove("niega"); }, 460);
  a.x = b.x + b.el.offsetWidth + 14; a.y = b.y + 6; acotar(a); acomodar(a);
  nube(cx, cy); sonar.fallo();
  avisoRico(D.fichas[a.id].e + " " + D.fichas[a.id].n + " + " + D.fichas[b.id].e + " " + D.fichas[b.id].n, "Esta pareja no forma una idea del juego. " + sugerencia(a.id, b.id));
  guardarPizarra();
}
export async function combinar(a, b) {
  const rec = RECETA.get(clave(a.id, b.id));
  if (!rec) { noCombina(a, b); return; }
  const ida = a.id, idb = b.id;
  const cx = b.x + b.el.offsetWidth / 2, cy = b.y + b.el.offsetHeight / 2;
  await fundir(a, b, cx, cy);
  concretar(ida, idb, rec, cx, cy);
}
function concretar(ida, idb, rec, cx, cy) {
  const res = rec[2], f = D.fichas[res];
  const t = agregar(res, cx, cy, { centrar: true, nace: true });
  if (t) acomodar(t);
  if (!reducido()) { const onda = document.createElement("span"); onda.className = "onda-mezcla f-" + f.f; onda.style.left = cx + "px"; onda.style.top = cy + "px"; pizarra.appendChild(onda); setTimeout(() => onda.remove(), 900); }
  rafaga(cx, cy, COLOR[f.f] || "#e0a01a", f.f === "sint" ? 90 : 48, f.f === "sint" ? 1.4 : 1);
  const k = clave(ida, idb);
  const caminoNuevo = !E.caminos[k];
  E.caminos[k] = Date.now();
  const nueva = !tiene(res);
  if (nueva) {
    E.descubiertos[res] = Date.now();
    E.como[res] = [ida, idb];
    E.chispas++;
    sonar.nuevo(f.nivel || 1);
    const ch = $("chispas"); ch.classList.remove("ganar"); void ch.offsetWidth; ch.classList.add("ganar");
    renderCaja(res);
  } else if (caminoNuevo) {
    sonar.exito(f.nivel || 1);
    avisoRico("Nuevo camino hacia " + f.e + " " + f.n + " (" + caminosHallados(res) + " de " + recetasDe(res).length + ")", rec[3] || "", { familia: f.f, ms: 6500 });
  } else sonar.exito(f.nivel || 1);
  guardarPizarra();
  emitir("mezcla", { id: res, via: [ida, idb], nueva, caminoNuevo });
}

/* ---------- Que ninguna ficha quede encima de otra ---------- */
// Busca el hueco libre más cercano dentro de la mesa; si la ficha no choca con nada, no se mueve.
function acomodar(t) {
  const W = pizarra.clientWidth, H = pizarra.clientHeight, M = 6, G = 10;
  const w = t.el.offsetWidth, h = t.el.offsetHeight;
  const otras = fichas.filter(o => o !== t);
  const choca = (x, y) => otras.some(o => x < o.x + o.el.offsetWidth + G && x + w + G > o.x && y < o.y + o.el.offsetHeight + G && y + h + G > o.y);
  if (!choca(t.x, t.y)) return;
  let mejor = null, md = Infinity;
  for (let y = M; y <= H - h - M; y += 8) for (let x = M; x <= W - w - M; x += 8) {
    const dd = (x - t.x) ** 2 + (y - t.y) ** 2;
    if (dd >= md || choca(x, y)) continue;
    md = dd; mejor = { x, y };
  }
  if (!mejor) return;
  t.x = mejor.x; t.y = mejor.y;
  if (!reducido()) { t.el.style.transition = "left .28s cubic-bezier(.2,.8,.3,1), top .28s cubic-bezier(.2,.8,.3,1)"; setTimeout(() => { t.el.style.transition = ""; }, 320); }
  ubicar(t);
}

/* ---------- Caja de fichas ---------- */
let ignorarClicHasta = 0;
const angosta = () => matchMedia("(max-width: 980px)").matches;
function lugarLibre() {
  const W = pizarra.clientWidth, H = pizarra.clientHeight;
  let p = { x: W / 2, y: H / 2 };
  for (let i = 0; i < 40; i++) {
    const x = W * (.15 + Math.random() * .7), y = H * (.18 + Math.random() * .64);
    p = { x, y };
    if (!fichas.some(o => Math.abs(o.x + o.el.offsetWidth / 2 - x) < 120 && Math.abs(o.y + o.el.offsetHeight / 2 - y) < 46)) break;
  }
  return p;
}
export function llevar(id) { const p = lugarLibre(); const t = agregar(id, p.x, p.y, { centrar: true, nace: true }); if (t) acomodar(t); sonar.toque(); guardarPizarra(); return t; }
const ORDENES = ["recientes", "alfabetico", "familia"];
$("btnOrden").addEventListener("click", () => { E.orden = ORDENES[(ORDENES.indexOf(E.orden) + 1) % ORDENES.length]; guardar(); renderCaja(); aviso("Orden: " + { recientes: "lo más reciente primero", alfabetico: "alfabético", familia: "por familia" }[E.orden], { ms: 1600 }); });
buscar.addEventListener("input", () => renderCaja());
export function renderCaja(nueva) {
  const q = norm(buscar.value);
  let ids = descubiertas().filter(id => !q || norm(D.fichas[id].n).includes(q));
  if (E.orden === "alfabetico") ids.sort((a, b) => D.fichas[a].n.localeCompare(D.fichas[b].n, "es"));
  else if (E.orden === "familia") ids.sort((a, b) => D.orden.indexOf(D.fichas[a].f) - D.orden.indexOf(D.fichas[b].f) || D.fichas[a].n.localeCompare(D.fichas[b].n, "es"));
  else ids.sort((a, b) => (E.descubiertos[b] || 0) - (E.descubiertos[a] || 0));
  lista.innerHTML = ids.length ? ids.map(id => chipHtml(id)).join("") : '<p class="caja-vacia">Ninguna ficha coincide con la búsqueda.</p>';
  lista.querySelectorAll(".chip").forEach(ch => {
    const id = ch.dataset.id;
    if (id === nueva) ch.classList.add("nuevo");
    ch.addEventListener("click", () => { if (performance.now() < ignorarClicHasta) return; activarSonido(); llevar(id); });
    ch.addEventListener("pointerdown", e => arrastrarDesdeCaja(e, id, ch));
  });
  $("cajaCuenta").textContent = descubiertas().length + " de " + Object.keys(D.fichas).filter(i => !D.fichas[i].ia).length;
  emitir("cajaRender");
}
function arrastrarDesdeCaja(e, id, chip) {
  if (e.button !== 0 || (e.pointerType === "touch" && angosta())) return;
  activarSonido();
  const sx = e.clientX, sy = e.clientY;
  let fantasma = null, obj = null;
  chip.setPointerCapture(e.pointerId);
  const enPizarra = (x, y) => { const r = pizarra.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom ? { x: x - r.left, y: y - r.top } : null; };
  const mover = ev => {
    if (!fantasma) {
      if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
      fantasma = document.createElement("div"); fantasma.className = "ficha fantasma"; contenido(fantasma, id); document.body.appendChild(fantasma);
      sonar.toque();
    }
    fantasma.style.left = (ev.clientX - fantasma.offsetWidth / 2) + "px"; fantasma.style.top = (ev.clientY - fantasma.offsetHeight / 2) + "px";
    const p = enPizarra(ev.clientX, ev.clientY);
    const n = p ? objetivoEn(p.x, p.y, null) : null;
    if (n !== obj) { obj && obj.el.classList.remove("objetivo"); obj = n; obj && obj.el.classList.add("objetivo"); }
  };
  const soltar = ev => {
    chip.removeEventListener("pointermove", mover); chip.removeEventListener("pointerup", soltar); chip.removeEventListener("pointercancel", soltar);
    if (!fantasma) return;
    ignorarClicHasta = performance.now() + 350;
    fantasma.remove(); obj && obj.el.classList.remove("objetivo");
    const p = enPizarra(ev.clientX, ev.clientY);
    if (!p || ev.type !== "pointerup") return;
    const t = agregar(id, p.x, p.y, { centrar: true });
    if (obj) combinar(t, obj); else { acomodar(t); guardarPizarra(); }
  };
  chip.addEventListener("pointermove", mover); chip.addEventListener("pointerup", soltar); chip.addEventListener("pointercancel", soltar);
}

/* ---------- Borrar la pizarra con la esponja ---------- */
export async function borrarPizarra() {
  if (!fichas.length) return;
  activarSonido(); sonar.borrar();
  const W = pizarra.clientWidth, H = pizarra.clientHeight;
  const esp = document.createElement("div"); esp.className = "esponja"; esp.textContent = "🧽"; pizarra.appendChild(esp);
  const pasos = 26, filas = [.25, .5, .75];
  for (let i = 0; i <= pasos * filas.length; i++) {
    const fila = Math.min(filas.length - 1, Math.floor(i / pasos)), avance = (i % pasos) / pasos;
    const x = (fila % 2 ? 1 - avance : avance) * (W - 60), y = filas[fila] * H - 32;
    esp.style.left = x + "px"; esp.style.top = y + "px";
    estela(x + 32, y + 40);
    for (const t of [...fichas]) {
      if (Math.abs(t.y + t.el.offsetHeight / 2 - (y + 32)) < H / 6 && Math.abs(t.x + t.el.offsetWidth / 2 - (x + 32)) < 70) { t.el.style.transition = "opacity .25s, transform .25s"; t.el.style.opacity = "0"; t.el.style.transform = "scale(.8)"; setTimeout(() => quitar(t), 250); }
    }
    await espera(14);
  }
  esp.remove();
  [...fichas].forEach(quitar);
  guardarPizarra();
}

/* ---------- Disposición inicial ---------- */
export function restaurarPizarra() {
  const W = pizarra.clientWidth, H = pizarra.clientHeight;
  [...fichas].forEach(quitar);
  if (E.mesa && E.mesa.length) { for (const m of E.mesa) agregar(m.id, m.x * W, m.y * H, { centrar: true }); desencimar(); return; }
  colocarPrimigenios();
}
// Al pasar de una pantalla ancha a una angosta las fichas guardadas pueden quedar encimadas:
// cada una busca el hueco libre más cercano a donde estaba.
function desencimar() {
  const W = pizarra.clientWidth, H = pizarra.clientHeight, M = 6, G = 8;
  const puestas = [];
  const choca = (x, y, w, h) => puestas.some(p => x < p.x + p.w + G && x + w + G > p.x && y < p.y + p.h + G && y + h + G > p.y);
  for (const t of fichas) {
    const w = t.el.offsetWidth, h = t.el.offsetHeight;
    if (choca(t.x, t.y, w, h)) {
      let mejor = null, md = Infinity;
      for (let y = M; y <= H - h - M; y += 8) for (let x = M; x <= W - w - M; x += 8) {
        if (choca(x, y, w, h)) continue;
        const d = (x - t.x) ** 2 + (y - t.y) ** 2;
        if (d < md) { md = d; mejor = { x, y }; }
      }
      if (mejor) { t.x = mejor.x; t.y = mejor.y; ubicar(t); }
    }
    puestas.push({ x: t.x, y: t.y, w, h });
  }
  guardarPizarra();
}
export function colocarPrimigenios() {
  const W = pizarra.clientWidth, H = pizarra.clientHeight;
  const r = Math.min(W, H) * .22;
  D.iniciales.forEach((id, i) => {
    const ang = -Math.PI / 2 + i * Math.PI / 2;
    agregar(id, W / 2 + Math.cos(ang) * r * 1.35, H / 2 + Math.sin(ang) * r, { centrar: true, nace: true });
  });
  guardarPizarra();
}
export const elementoDe = id => (fichas.find(t => t.id === id) || {}).el || null;
on("cajaCambio", () => renderCaja());
new ResizeObserver(() => { for (const t of fichas) acotar(t); }).observe(pizarra);
