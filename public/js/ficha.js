// Ficha de estudio: lo que se lee al descubrir una idea o al abrirla desde la caja.
import { D, IA, SERVIDOR, esc, rico, refHtml, clave, recetasDe, registrarCartaIA } from "./datos.js";
import { E, tiene, guardar } from "./estado.js";
import { $, miniHtml, aviso } from "./ui.js";
import { emitir } from "./bus.js";

const cola = [];
let abierta = null, focoPrevio = null;

const caminoHallado = k => !!E.caminos[k];
export const caminosHallados = id => recetasDe(id).filter(r => caminoHallado(clave(r[0], r[1]))).length;
export const domina = id => recetasDe(id).length > 1 && caminosHallados(id) === recetasDe(id).length;

function formula(a, b, r) {
  return miniHtml(a) + '<span class="op">+</span>' + miniHtml(b) + (r ? '<span class="op">=</span>' + miniHtml(r) : "");
}

export function abrirFicha(id, opts = {}) {
  const f = D.fichas[id];
  if (!f) return;
  if (abierta && abierta !== id && !opts.refrescar) { cola.push([id, opts]); return; }
  if (!opts.refrescar) focoPrevio = document.activeElement;
  abierta = id;
  const art = $("fichaEstudio");
  art.className = "ficha-estudio f-" + f.f;
  art.style.animation = opts.refrescar ? "none" : "";

  let ceja = '<span class="fam">' + esc(D.familias[f.f] || "") + "</span>";
  if (opts.nueva) ceja = '<span class="nuevo">' + (f.f === "mito" ? "Encontraste un mito" : "Nueva idea") + "</span>" + ceja;
  if (opts.pieza) ceja += '<span class="fe-pieza"><span class="emo">🧩</span>Pieza del plano · ' + esc(opts.pieza) + "</span>";
  if (f.ia) ceja += '<span class="ia">Propuesta por Claude</span>' + (f.estado === "aprobada" ? '<span style="color:#2f7a4a">Revisada</span>' : '<span style="color:#9a6a12">Por revisar</span>');

  let form = "";
  if (opts.via) form = formula(opts.via[0], opts.via[1], id);
  else if (f.f === "prim") form = "<span>Elemento primigenio. Todas las ideas del juego nacen de mezclar estos cuatro.</span>";
  else if (E.como[id]) form = "<span>Tu receta:</span>" + formula(E.como[id][0], E.como[id][1]);
  else if (f.via) form = "<span>Receta:</span>" + formula(f.via[0], f.via[1]);

  let c = "";
  const viaMito = (opts.via || E.como[id] || []).find(x => D.fichas[x] && D.fichas[x].f === "mito");
  if (viaMito && f.f !== "mito") c += '<p class="fe-aviso">Desarmaste un mito. «' + esc(D.fichas[viaMito].n) + "» no se sostiene, y esta ficha cuenta lo que la evidencia sí respalda.</p>";
  if (f.ia && f.estado !== "aprobada") c += '<p class="fe-aviso">Claude propuso esta ficha a partir de una mezcla que no estaba en el núcleo verificado. Contrasta las fuentes antes de llevarla a clase.</p>';
  if (f.f === "mito") {
    c += "<section><h3>Lo que se cree</h3><p>" + rico(f.belief) + "</p></section><section><h3>Lo que dice la evidencia</h3><p>" + rico(f.evidence) + "</p></section>";
  } else if (f.why) {
    c += "<section><h3>" + (f.f === "prim" ? "Qué aporta" : f.f === "sint" ? "Qué integra" : "Por qué funciona") + "</h3><p>" + rico(f.why) + "</p></section>";
  }
  if (f.q) c += '<blockquote class="fe-cita"><p>“' + esc(f.q.t) + '”</p><footer>' + esc(f.q.a) + "</footer></blockquote>";
  if (Array.isArray(f.principios) && f.principios.length) c += '<section><h3>Principios de diseño</h3><ol class="fe-principios">' + f.principios.map(p => "<li>" + rico(p) + "</li>").join("") + "</ol></section>";
  if (f.prueba) c += '<section><h3>Pruébalo la próxima semana</h3><p class="fe-prueba">' + rico(f.prueba) + "</p></section>";
  if (f.uni) c += '<section><h3>En una clase universitaria</h3><p class="fe-aula">' + rico(f.uni) + "</p></section>";
  const via = opts.via || E.como[id];
  const pred = via && E.predicciones[clave(via[0], via[1])];
  if (pred) c += '<p class="fe-prueba"><b>Tu predicción:</b> ' + rico(pred) + "</p>";
  if (f.tip) c += '<p style="font-size:14.5px;color:var(--tinta-2)"><b>Pista:</b> ' + rico(f.tip) + "</p>";

  const recs = recetasDe(id);
  if (recs.length) {
    const h = caminosHallados(id);
    c += '<section><h3>Caminos <small>' + h + " de " + recs.length + (domina(id) ? " · ★ maestría" : "") + '</small></h3><div class="fe-caminos">';
    const kv = via && clave(via[0], via[1]);
    if (kv && !recs.some(r => clave(r[0], r[1]) === kv)) {
      const nv = IA.combos[kv] && IA.combos[kv].nota;
      c += '<div class="fe-camino"><div class="fe-formula">' + formula(via[0], via[1]) + "<span>Tu atajo con Claude</span></div>" + (nv ? "<p>" + rico(nv) + "</p>" : "") + "</div>";
    }
    for (const [a, b, , nota] of [...recs].sort((x, y) => caminoHallado(clave(y[0], y[1])) - caminoHallado(clave(x[0], x[1])))) {
      if (caminoHallado(clave(a, b))) c += '<div class="fe-camino"><div class="fe-formula">' + formula(a, b) + "</div>" + (nota ? "<p>" + rico(nota) + "</p>" : "") + "</div>";
      else c += '<div class="fe-camino oculto"><div class="fe-formula">' + miniHtml(a, !tiene(a)) + '<span class="op">+</span>' + miniHtml(b, true) + "<span>Camino por descubrir</span></div></div>";
    }
    c += "</div></section>";
  }

  if (!["prim", "mito"].includes(f.f)) {
    const m = E.bitacora[id];
    const t = (v, txt) => '<button class="alterna" type="button" data-bit="' + v + '" aria-pressed="' + (m === v) + '">' + txt + "</button>";
    c += '<section><h3>¿Y en tu docencia?</h3><div class="fe-bitacora">' + t("hago", "Ya lo hago") + t("probar", "Quiero probarlo") + t("noaplica", "No aplica a mi curso") + "</div></section>";
  }
  if (f.refs && f.refs.length) c += '<section><h3>Fuentes</h3><ol class="fe-fuentes">' + f.refs.map(k => "<li>" + refHtml(D.refs[k] || k) + "</li>").join("") + "</ol></section>";

  const curar = f.ia && SERVIDOR.local;
  const acciones = (curar ? (f.estado !== "rechazada" ? '<button class="boton-papel" type="button" data-curar="rechazada">Descartar</button>' : "") + (f.estado !== "aprobada" ? '<button class="boton-papel" type="button" data-curar="aprobada">Aprobar</button>' : "") : "") +
    '<button class="boton-papel principal" type="button" data-cerrar>' + (opts.nueva ? "¡A seguir mezclando!" : "Cerrar") + "</button>";

  art.innerHTML = '<div class="fe-cab">' + (f.f === "mito" ? '<div class="fe-mito" aria-hidden="true">MITO</div>' : "") +
    '<button class="fe-cerrar" type="button" aria-label="Cerrar">✕</button><div class="fe-ceja">' + ceja + '</div>' +
    '<h2 class="fe-titulo" id="fichaTitulo"><span class="em">' + esc(f.e) + "</span><span>" + esc(f.n) + "</span></h2>" +
    (form ? '<div class="fe-formula">' + form + "</div>" : "") + "</div>" +
    '<div class="fe-cuerpo">' + c + '</div><div class="fe-acciones">' + acciones + "</div>";
  art.querySelector(".fe-cerrar").addEventListener("click", cerrarFicha);
  art.querySelector("[data-cerrar]").addEventListener("click", cerrarFicha);
  art.querySelectorAll("[data-bit]").forEach(b => b.addEventListener("click", () => {
    E.bitacora[id] = E.bitacora[id] === b.dataset.bit ? undefined : b.dataset.bit;
    if (!E.bitacora[id]) delete E.bitacora[id];
    guardar();
    art.querySelectorAll("[data-bit]").forEach(x => x.setAttribute("aria-pressed", String(E.bitacora[id] === x.dataset.bit)));
    if (E.bitacora[id] === "probar") aviso("Anotado en Mi plan.");
  }));
  art.querySelectorAll("[data-curar]").forEach(b => b.addEventListener("click", () => curar_(id, b.dataset.curar)));
  $("capaFicha").hidden = false;
  if (!opts.refrescar) art.scrollTop = 0;
  art.querySelector("[data-cerrar]").focus({ preventScroll: true });
}
export function cerrarFicha() {
  $("capaFicha").hidden = true;
  const id = abierta;
  abierta = null;
  emitir("fichaCerrada", id);
  if (cola.length) { const [i, o] = cola.shift(); abrirFicha(i, o); return; }
  if (focoPrevio && focoPrevio.focus) focoPrevio.focus({ preventScroll: true });
}
export const fichaAbierta = () => !!abierta || cola.length > 0;
$("capaFicha").addEventListener("click", e => { if (e.target.id === "capaFicha") cerrarFicha(); });

async function curar_(id, estado) {
  try {
    const r = await fetch("api/curar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, estado }) });
    if (!r.ok) throw new Error();
    IA.curaduria[id] = estado;
    if (estado === "rechazada") { delete D.fichas[id]; delete E.descubiertos[id]; guardar(); cerrarFicha(); emitir("cajaCambio"); aviso("Ficha descartada."); return; }
    registrarCartaIA(id, IA.cartas[id]);
    aviso("Ficha aprobada. Ahora aparece como revisada.");
    abrirFicha(id, { refrescar: true });
  } catch (e) { aviso("No se pudo guardar la revisión."); }
}
