// Misiones: encargos con un plano de piezas, pistas con chispas, hitos con reflexión y una meta que celebra.
import { D, esc, rico, clave, recetasDe } from "./datos.js";
import { E, tiene, guardar, descubiertas, estadoMision } from "./estado.js";
import { $, aviso, avisoRico, abrirPanel, cerrarPanel, miniHtml, chipHtml, descargar } from "./ui.js";
import { abrirFicha, fichaAbierta, domina } from "./ficha.js";
import { sonar } from "./sonido.js";
import { on, emitir } from "./bus.js";
import { COLOR, llevar, elementoDe, restaurarPizarra } from "./mesa.js";

export const misionActiva = () => D.misiones.find(m => m.id === E.mision) || null;
const nodoDe = (m, id) => m.plano.find(n => n.id === id);
const construibles = m => m.plano.filter(n => !D.iniciales.includes(n.id));
const piezasLogradas = m => construibles(m).filter(n => tiene(n.id)).length;
function alcance(m) {
  const pend = m.plano.filter(n => !tiene(n.id) && n.ing);
  const listos = pend.filter(n => n.ing.every(tiene)).sort((a, b) => a.nivel - b.nivel);
  const cerca = pend.filter(n => !n.ing.every(tiene) && n.ing.some(tiene)).sort((a, b) => a.nivel - b.nivel);
  return { listos, cerca };
}

/* ---------- Cabecera y hoja ---------- */
export function renderCabecera() {
  const m = misionActiva(), cab = $("misionCab");
  $("chispas").querySelector("b").textContent = E.chispas;
  $("contador").textContent = descubiertas().length + " ideas";
  if (!m) { cab.innerHTML = '<span class="nombre">Laboratorio libre</span>'; return; }
  const n = piezasLogradas(m), tot = construibles(m).length;
  cab.innerHTML = '<span class="nombre">' + rico(m.e + " " + m.n) + '</span><span class="avance"><i style="width:' + (100 * n / tot).toFixed(1) + '%"></i></span><small>' + n + " de " + tot + " piezas</small>";
}
let encargoAbierto = false;
export function renderHoja() {
  const m = misionActiva(), hoja = $("hojaMision");
  if (!m) {
    hoja.innerHTML = '<div class="hoja"><h2><span class="em">🧪</span>Laboratorio libre</h2><p class="encargo libre">Aquí no hay encargo. Mezcla lo que quieras y mira qué aparece. Cada idea nueva te da una chispa ✨.</p><h3>¿Quieres un rumbo?</h3><p class="libre">Las misiones proponen un caso real de docencia y un plano de piezas para resolverlo.</p><p class="pie-hoja"><button class="boton-papel principal" type="button" data-a="misiones">Ver misiones</button></p></div>';
    hoja.querySelector('[data-a="misiones"]').addEventListener("click", abrirMisiones);
    return;
  }
  const st = estadoMision(m.id);
  const { listos, cerca } = alcance(m);
  const hecha = tiene(m.meta);
  let h = '<div class="hoja"><h2><span class="em">' + esc(m.e) + "</span>" + esc(m.n) + "</h2>";
  if (m.encargo) h += '<p class="encargo' + (encargoAbierto ? "" : " plegado") + '">' + rico(m.encargo) + '</p><button class="ver-mas" type="button" data-a="encargo">' + (encargoAbierto ? "ver menos" : "leer el encargo completo") + "</button>";
  if (m.objetivo) h += '<p class="objetivo"><b>Tu objetivo</b>' + rico(m.objetivo) + "</p>";
  if (hecha) h += '<h3>¡Misión cumplida!</h3><p class="logrado">Llegaste a ' + esc(D.fichas[m.meta].n) + '. Puedes seguir explorando o elegir otra misión.</p><p><button class="boton-papel principal" type="button" data-a="celebrar">Ver mi síntesis</button></p>';
  else {
    h += "<h3>A tu alcance</h3>";
    const lista = listos.length ? listos.slice(0, 4) : cerca.slice(0, 3);
    if (!listos.length) h += '<p class="logrado">Todavía no tienes los dos ingredientes de ninguna pieza. Estas están cerca:</p>';
    h += '<div class="alcance">' + lista.map(n => piezaHtml(m, n, st)).join("") + "</div>";
  }
  h += '<p class="pie-hoja"><button class="boton-papel" type="button" data-a="plano"><span class="em">🗺️</span>Ver el plano completo</button></p></div>';
  hoja.innerHTML = h;
  hoja.querySelectorAll("[data-a]").forEach(b => b.addEventListener("click", () => ({ encargo: () => { encargoAbierto = !encargoAbierto; renderHoja(); }, plano: abrirPlano, celebrar: () => celebrar(m), misiones: abrirMisiones })[b.dataset.a]()));
  hoja.querySelectorAll("[data-comprar]").forEach(b => b.addEventListener("click", () => comprarPista(m, b.dataset.comprar)));
  hoja.querySelectorAll("[data-traer]").forEach(b => b.addEventListener("click", () => llevar(b.dataset.traer)));
}
function piezaHtml(m, n, st) {
  const f = D.fichas[n.id];
  const nivelPista = st.pistas[n.id] || 0;
  const hito = m.hitos.includes(n.id) || n.id === m.meta;
  let ing = "";
  if (nivelPista > 0) {
    const vis = nivelPista >= 2 ? n.ing : [n.ing.find(tiene) || n.ing[0]];
    ing = '<div class="ingred">' + n.ing.map(x => vis.includes(x) ? '<button class="mini f-' + D.fichas[x].f + '" data-traer="' + x + '" title="Llevar a la pizarra" type="button" style="cursor:pointer"><span class="em">' + esc(D.fichas[x].e) + "</span>" + esc(D.fichas[x].n) + "</button>" : '<span class="mini oculta">?</span>').join(" + ") + "</div>";
  }
  const coste = nivelPista === 0 ? 1 : 2;
  const iguales = n.ing && n.ing[0] === n.ing[1];
  const comprar = nivelPista < 2 && !(iguales && nivelPista >= 1) ? '<button class="comprar" type="button" data-comprar="' + n.id + '"' + (E.chispas < coste ? " disabled" : "") + "><span class=\"emo\">✨</span>" + coste + " · " + (nivelPista === 0 ? "ver un ingrediente" : "ver el otro ingrediente") + "</button>" : "";
  return '<div class="pieza' + (hito ? " hito" : "") + '"><span class="silueta">' + (hito ? "★" : "?") + "</span><div><p>" + rico(f.pista || "Una pieza del plano.") + "</p>" + ing + comprar + "</div></div>";
}
function comprarPista(m, id) {
  const st = estadoMision(m.id);
  const nivel = st.pistas[id] || 0, coste = nivel === 0 ? 1 : 2;
  if (E.chispas < coste) { aviso("Te faltan chispas. Cada idea nueva te da una."); return; }
  E.chispas -= coste; st.pistas[id] = nivel + 1; guardar();
  sonar.chispa(); renderHoja(); renderCabecera();
}

/* ---------- Descubrimientos: ficha, hitos y meta ---------- */
on("mezcla", ({ id, via, nueva }) => {
  const m = misionActiva();
  const nodo = m && nodoDe(m, id);
  if (nueva) {
    const pieza = nodo ? piezasLogradas(m) + " de " + construibles(m).length : null;
    setTimeout(() => abrirFicha(id, { nueva: true, via, pieza }), via && !matchMedia("(prefers-reduced-motion: reduce)").matches ? 750 : 0);
    if (nodo && m.hitos.includes(id) && id !== m.meta) pendientes.push(() => pedirReflexion(m, id));
    if (m && id === m.meta) { estadoMision(m.id).completada = Date.now(); guardar(); pendientes.push(() => celebrar(m)); }
    else if (nodo) setTimeout(() => sonar.exito(3), 450);
  }
  tutorialPaso();
  renderCabecera(); renderHoja();
});
const pendientes = [];
on("fichaCerrada", () => { if (!fichaAbierta() && pendientes.length) setTimeout(() => { const fn = pendientes.shift(); fn(); }, 220); });

function pedirReflexion(m, id) {
  const f = D.fichas[id];
  const pregunta = (m.reflexiones && m.reflexiones[id]) || "¿Cómo se vería " + f.n.toLowerCase() + " en tu próximo curso? Escribe una acción concreta.";
  const st = estadoMision(m.id);
  sonar.hito();
  abrirPanel(
    '<h2>★ Hito: ' + esc(f.e + " " + f.n) + '</h2><p class="intro">Antes de seguir, aterriza la idea en tu propia docencia. Lo que escribas queda en Mi plan.</p>' +
    '<label class="campo" for="reflexion">' + esc(pregunta) + '<textarea id="reflexion" maxlength="600" placeholder="Por ejemplo: en mi curso de...">' + esc(st.reflexiones[id] || "") + "</textarea></label>" +
    '<div class="fila-botones"><button class="boton" type="button" data-accion="saltar">Ahora no</button><button class="boton principal" type="button" data-accion="guardar">Guardar en mi plan</button></div>',
    {
      saltar: cerrarPanel,
      guardar: () => {
        const t = $("reflexion").value.trim();
        if (t) { st.reflexiones[id] = t; guardar(); emitir("reflexion", { mision: m.id, hito: id, texto: t }); aviso("Guardado en Mi plan."); }
        cerrarPanel();
      }
    }
  );
}

/* ---------- Plano ---------- */
let vistaPlano = { x: 0, y: 0, k: 1 };
const NS = "http://www.w3.org/2000/svg";
export function nodoSvg(tag, attrs, texto) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (texto !== undefined) e.textContent = texto;
  return e;
}
export function dibujarPlano(svg, m, opts = {}) {
  svg.innerHTML = "";
  const niveles = {};
  for (const n of m.plano) (niveles[n.nivel] = niveles[n.nivel] || []).push(n);
  const nivelesOrden = Object.keys(niveles).map(Number).sort((a, b) => a - b);
  const anchoMax = Math.max(...Object.values(niveles).map(l => l.length));
  const caja = svg.getBoundingClientRect();
  const horizontal = opts.horizontal !== undefined ? opts.horizontal : caja.width > caja.height * 1.15;
  const grande = !!opts.grande;
  const R = grande ? 30 : 26, RM = grande ? 40 : 34, FL = grande ? 16 : 13.5, FE = grande ? 27 : 23;
  let W, H;
  const pos = {};
  if (horizontal) {
    const DX = grande ? 158 : 146, DY = grande ? 96 : 88;
    W = nivelesOrden.length * DX + 90; H = Math.max(anchoMax * DY + 90, 300);
    nivelesOrden.forEach((nv, col) => {
      const l = niveles[nv];
      if (col > 0) l.sort((a, b) => prom(a, "y") - prom(b, "y"));
      l.forEach((n, i) => { pos[n.id] = { x: 76 + col * DX, y: H / 2 + (i - (l.length - 1) / 2) * DY }; });
    });
  } else {
    const DX = 140, DY = 104;
    W = Math.max(anchoMax * DX + 100, 700); H = nivelesOrden.length * DY + 110;
    nivelesOrden.forEach((nv, fila) => {
      const l = niveles[nv];
      if (fila > 0) l.sort((a, b) => prom(a, "x") - prom(b, "x"));
      l.forEach((n, i) => { pos[n.id] = { x: W / 2 + (i - (l.length - 1) / 2) * DX, y: H - 60 - fila * DY }; });
    });
  }
  function prom(n, eje) { if (!n.ing) return 0; const v = n.ing.map(x => pos[x] ? pos[x][eje] : (eje === "x" ? W : H) / 2); return v.reduce((s, q) => s + q, 0) / v.length; }
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  const g = nodoSvg("g", { class: "mundo" }); svg.appendChild(g);
  const logrado = opts.logrado || tiene;
  const { listos } = alcance(m);
  const alc = new Set(opts.logrado ? [] : listos.map(n => n.id));
  const radio = n => n.id === m.meta ? RM : R;
  for (const n of m.plano) {
    if (!n.ing) continue;
    for (const x of new Set(n.ing)) {
      const a = pos[x], b = pos[n.id];
      if (!a || !b) continue;
      const ok = logrado(x) && logrado(n.id);
      let d;
      if (horizontal) { const x1 = a.x + R + 2, x2 = b.x - radio(n) - 2, mx = (x1 + x2) / 2; d = "M" + x1 + " " + a.y + " C" + mx + " " + a.y + " " + mx + " " + b.y + " " + x2 + " " + b.y; }
      else { const y1 = a.y - R - 2, y2 = b.y + radio(n) + 2, my = (y1 + y2) / 2; d = "M" + a.x + " " + y1 + " C" + a.x + " " + my + " " + b.x + " " + my + " " + b.x + " " + y2; }
      const frontera = !ok && logrado(x) && !logrado(n.id);
      const arista = nodoSvg("path", { d, class: "arista" + (ok ? " ok" : frontera ? " frontera" : ""), style: "--c:var(--c-" + D.fichas[n.id].f + ")" });
      if (ok || frontera) g.appendChild(arista); else g.insertBefore(arista, g.firstChild);
    }
  }
  for (const n of m.plano) {
    const p = pos[n.id], f = D.fichas[n.id], ok = logrado(n.id);
    const esMeta = n.id === m.meta, hito = m.hitos.includes(n.id);
    const nodo = nodoSvg("g", { class: "nodo" + (ok ? " logrado" : " oculto") + (alc.has(n.id) ? " alcance" : "") + (esMeta ? " meta" : hito ? " hito" : ""), style: "--c:var(--c-" + f.f + ")" });
    nodo.dataset.id = n.id;
    const r = radio(n);
    if (esMeta || hito) nodo.appendChild(nodoSvg("circle", { cx: p.x, cy: p.y, r: r + 7, class: "halo" }));
    nodo.appendChild(nodoSvg("circle", { cx: p.x, cy: p.y, r, class: "disco" }));
    const fe = esMeta ? FE * 1.3 : FE;
    if (ok) nodo.appendChild(nodoSvg("text", { x: p.x, y: p.y + fe * .36, "text-anchor": "middle", "font-size": fe, class: "em-svg" }, f.e));
    else nodo.appendChild(nodoSvg("text", { x: p.x, y: p.y + fe * .34, "text-anchor": "middle", "font-size": fe * .85, class: "signo" }, esMeta || hito ? "★" : "?"));
    if (ok) nodo.appendChild(nodoSvg("text", { x: p.x, y: p.y + r + FL + 5, "text-anchor": "middle", "font-size": FL, class: "lab" }, f.n.length > 20 ? f.n.slice(0, 19) + "…" : f.n));
    if (opts.extra) opts.extra(nodo, n, p, r);
    g.appendChild(nodo);
  }
  return { W, H, pos, g };
}
function aplicarVista(g, W, H) { g.setAttribute("transform", "translate(" + vistaPlano.x + "," + vistaPlano.y + ") scale(" + vistaPlano.k + ")"); }
export function abrirPlano(inicio) {
  const m = misionActiva();
  if (!m) { aviso("El plano aparece cuando eliges una misión."); abrirMisiones(); return; }
  $("capaPlano").hidden = false;
  $("planoTitulo").innerHTML = rico(m.e + " " + m.n);
  if (inicio === true) setTimeout(() => avisoRico("Este es el plano de tu misión", "Cada círculo es una pieza que hay que descubrir, y la estrella grande es la meta. Toca un círculo para leer su pista y elige por dónde empezar. En un taller, comparen sus rutas con las de sus colegas.", { oro: true, ms: 9000 }), 300);
  $("planoInfo").innerHTML = '<span class="leyenda"><b>' + piezasLogradas(m) + " de " + construibles(m).length + ' piezas</b><span><i class="l-ok"></i>Lograda</span><span><i class="l-alc"></i>A tu alcance</span><span><i class="l-no"></i>Por descubrir</span><span><i class="l-hito"></i>Hito o meta</span><span>Arrastra para moverte y usa la rueda para acercarte</span></span>';
  $("planoPista").hidden = true;
  const svg = $("planoSvg");
  const { W, H, g } = dibujarPlano(svg, m);
  vistaPlano = { x: 0, y: 0, k: 1 };
  aplicarVista(g, W, H);
  svg.querySelectorAll(".nodo").forEach(nd => nd.addEventListener("click", ev => { ev.stopPropagation(); clicNodo(m, nd.dataset.id); }));
  const lienzo = $("planoLienzo");
  let arr = null;
  lienzo.onpointerdown = e => { if (e.target.closest(".nodo")) return; arr = { x: e.clientX, y: e.clientY, vx: vistaPlano.x, vy: vistaPlano.y }; lienzo.classList.add("moviendo"); lienzo.setPointerCapture(e.pointerId); };
  lienzo.onpointermove = e => { if (!arr) return; const esc_ = W / lienzo.clientWidth; vistaPlano.x = arr.vx + (e.clientX - arr.x) * esc_; vistaPlano.y = arr.vy + (e.clientY - arr.y) * esc_; aplicarVista(g, W, H); };
  lienzo.onpointerup = lienzo.onpointercancel = () => { arr = null; lienzo.classList.remove("moviendo"); };
  lienzo.onwheel = e => { e.preventDefault(); vistaPlano.k = Math.max(.5, Math.min(2.5, vistaPlano.k * Math.exp(-e.deltaY * .0015))); aplicarVista(g, W, H); };
}
function clicNodo(m, id) {
  const n = nodoDe(m, id);
  if (tiene(id)) { abrirFicha(id); return; }
  const st = estadoMision(m.id);
  const caja = $("planoPista");
  caja.hidden = false;
  const listo = n.ing && n.ing.every(tiene);
  caja.innerHTML = "<h3>" + (n.id === m.meta ? "★ La meta" : m.hitos.includes(id) ? "★ Un hito" : "Una pieza") + "</h3>" +
    (n.ing ? '<p class="estado">' + (listo ? "Ya tienes sus dos ingredientes." : n.ing.some(tiene) ? "Tienes uno de sus ingredientes." : "Todavía te faltan sus dos ingredientes.") + "</p>" : "") +
    piezaHtml(m, n, st).replace('class="pieza', 'style="border:0;padding:0;background:none" class="pieza');
  caja.querySelectorAll("[data-comprar]").forEach(b => b.addEventListener("click", () => { comprarPista(m, b.dataset.comprar); clicNodo(m, id); }));
  caja.querySelectorAll("[data-traer]").forEach(b => b.addEventListener("click", () => { cerrarPlano(); llevar(b.dataset.traer); }));
}
export function cerrarPlano() { $("capaPlano").hidden = true; }
$("planoCerrar").addEventListener("click", cerrarPlano);
$("capaPlano").addEventListener("click", e => { if (e.target.id === "capaPlano") cerrarPlano(); });

/* ---------- Celebración ---------- */
export function celebrar(m) {
  const f = D.fichas[m.meta], st = estadoMision(m.id);
  sonar.meta();
  const cel = $("celebracion");
  const refl = Object.entries(st.reflexiones).filter(([, t]) => t);
  cel.innerHTML = '<canvas id="confeti" aria-hidden="true"></canvas><div class="contenido"><div class="sello-meta">' + esc(f.e) + '</div><h1>¡Misión <em>cumplida</em>!</h1>' +
    '<p class="cierre">' + rico(m.cierre || "Llegaste a la meta.") + "</p>" +
    '<div class="plano-mini" style="width:min(100%,780px);height:260px"><svg id="planoFinal" style="width:100%;height:100%"></svg></div>' +
    '<div class="acciones"><button class="boton principal grande" type="button" data-c="sintesis">Leer la síntesis</button>' +
    '<button class="boton grande" type="button" data-c="plan"><span class="em">📝</span>Descargar mi plan</button><button class="boton grande" type="button" data-c="misiones"><span class="em">📜</span>Otra misión</button><button class="boton grande" type="button" data-c="seguir">Seguir mezclando</button></div>' +
    (refl.length ? '<p class="cierre">' + (refl.length === 1 ? "Tu reflexión quedó guardada en Mi plan." : "Tus " + refl.length + " reflexiones quedaron guardadas en Mi plan.") + "</p>" : "") + "</div>";
  cel.hidden = false;
  dibujarPlano($("planoFinal"), m);
  confeti($("confeti"));
  cel.querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.c;
    if (a === "sintesis") { cel.hidden = true; abrirFicha(m.meta); }
    if (a === "plan") descargar("mi-plan-" + m.id + ".md", textoPlan(m));
    if (a === "misiones") { cel.hidden = true; abrirMisiones(); }
    if (a === "seguir") cel.hidden = true;
  }));
}
function confeti(cv) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
  const cols = Object.values(COLOR);
  const ps = Array.from({ length: 160 }, () => ({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .5, vy: 1.5 + Math.random() * 3, vx: (Math.random() - .5) * 1.5, r: 2 + Math.random() * 4, c: cols[Math.floor(Math.random() * cols.length)], g: Math.random() * 6 }));
  let t0 = performance.now();
  const paso = t => {
    if (!cv.isConnected || t - t0 > 6000) { cx.clearRect(0, 0, cv.width, cv.height); return; }
    cx.clearRect(0, 0, cv.width, cv.height);
    for (const p of ps) { p.y += p.vy; p.x += p.vx + Math.sin((t / 400) + p.g) * .6; cx.globalAlpha = .85; cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill(); }
    requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* ---------- Plan ---------- */
function textoPlan(m) {
  const lineas = [];
  const fecha = new Date().toLocaleDateString("es-CL");
  const misiones = m ? [m] : D.misiones.filter(x => E.misiones[x.id]);
  lineas.push("# Mi plan docente", "", "Generado en Alquimia Docente el " + fecha + ".", "");
  for (const mi of misiones) {
    const st = E.misiones[mi.id]; if (!st) continue;
    const meta = D.fichas[mi.meta];
    lineas.push("## " + mi.n + (st.completada ? " (cumplida)" : ""), "");
    if (mi.encargo) lineas.push("**Encargo.** " + mi.encargo, "");
    if (st.completada && meta) {
      lineas.push("**Síntesis: " + meta.n + ".** " + (meta.why || ""), "");
      if (meta.principios) { lineas.push("Principios de diseño:"); meta.principios.forEach(p => lineas.push("- " + p)); lineas.push(""); }
      if (meta.prueba) lineas.push("**Para la próxima semana.** " + meta.prueba, "");
    }
    const refl = Object.entries(st.reflexiones || {}).filter(([, t]) => t);
    if (refl.length) { lineas.push("### Mis reflexiones"); for (const [h, t] of refl) lineas.push("- **" + (D.fichas[h] ? D.fichas[h].n : h) + ".** " + t); lineas.push(""); }
  }
  const probar = Object.keys(E.bitacora).filter(id => E.bitacora[id] === "probar" && D.fichas[id]);
  if (probar.length) {
    lineas.push("## Quiero probar", "");
    for (const id of probar) lineas.push("- **" + D.fichas[id].n + ".** " + (D.fichas[id].uni || ""));
    lineas.push("");
    const lecturas = [...new Set(probar.flatMap(id => (D.fichas[id].refs || []).map(k => D.refs[k] || k)))];
    if (lecturas.length) { lineas.push("## Lecturas", ""); lecturas.forEach(l => lineas.push("- " + l.replace(/_/g, ""))); lineas.push(""); }
  }
  return lineas.join("\n");
}
export function abrirPlan() {
  const conRefl = D.misiones.filter(m => E.misiones[m.id] && Object.values(E.misiones[m.id].reflexiones || {}).some(Boolean));
  const probar = Object.keys(E.bitacora).filter(id => E.bitacora[id] === "probar" && D.fichas[id]);
  const hago = Object.keys(E.bitacora).filter(id => E.bitacora[id] === "hago" && D.fichas[id]);
  let h = '<h2>📝 Mi plan</h2><p class="intro">Aquí se juntan las reflexiones de tus misiones y lo que marcaste en las fichas como “Quiero probarlo”. Descárgalo y llévalo a tu próximo curso.</p>';
  if (!conRefl.length && !probar.length && !hago.length) h += '<p class="vacio">Todavía está en blanco. Juega una misión o marca fichas con “Quiero probarlo”.</p>';
  for (const m of conRefl) {
    h += '<h3 class="subtitulo">' + esc(m.e + " " + m.n) + '</h3><div class="plan-lista">' +
      Object.entries(E.misiones[m.id].reflexiones).filter(([, t]) => t).map(([hid, t]) => '<div class="plan-hito"><b>' + esc(D.fichas[hid] ? D.fichas[hid].e + " " + D.fichas[hid].n : hid) + "</b><p>" + esc(t) + "</p></div>").join("") + "</div>";
  }
  if (probar.length) h += '<h3 class="subtitulo">Quiero probarlo</h3><div class="plan-lista">' + probar.map(id => '<div class="plan-hito"><b>' + esc(D.fichas[id].e + " " + D.fichas[id].n) + "</b><p>" + esc(D.fichas[id].uni || "") + "</p></div>").join("") + "</div>";
  if (hago.length) h += '<h3 class="subtitulo">Ya lo hago</h3><div class="cuaderno-fam" style="margin-top:12px"><div class="fila">' + hago.map(id => chipHtml(id)).join("") + "</div></div>";
  h += '<div class="fila-botones"><button class="boton" type="button" data-accion="reiniciar">Empezar de cero</button><button class="boton principal" type="button" data-accion="bajar">Descargar mi plan (.md)</button></div>';
  const p = abrirPanel(h, { bajar: () => descargar("mi-plan-docente.md", textoPlan(null)), reiniciar: () => emitir("pedirReinicio") });
  p.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => abrirFicha(c.dataset.id)));
}

/* ---------- Misiones ---------- */
export function abrirMisiones() {
  let h = '<h2>📜 Misiones</h2><p class="intro">Cada misión es un encargo real de docencia universitaria. Cada una trae un plano de piezas que se arma mezclando desde los cuatro primigenios hasta la meta. Las piezas que logres sirven para las demás misiones.</p><div class="misiones-grid">';
  const orden = [...D.misiones].sort((a, b) => (b.tutorial ? 1 : 0) - (a.tutorial ? 1 : 0) || construibles(a).length - construibles(b).length);
  orden.forEach(m => {
    const n = piezasLogradas(m), st = E.misiones[m.id], tot = construibles(m).length;
    const estrellas = tot < 12 ? "●○○" : tot < 30 ? "●●○" : "●●●";
    h += '<button class="mision-carta' + (E.mision === m.id ? " activa" : "") + '" type="button" data-m="' + m.id + '">' +
      (st && st.completada ? '<span class="sello">Cumplida</span>' : "") + '<span class="em">' + esc(m.e) + "</span><h3>" + esc(m.n) + "</h3><p>" + rico(m.encargo || "") + '</p><div class="meta-dato"><span>' + n + " de " + tot + ' piezas</span><span class="barrita"><i style="width:' + (100 * n / tot).toFixed(1) + '%"></i></span><span class="dificultad" title="Dificultad">' + estrellas + "</span></div></button>";
  });
  h += '</div><div class="fila-botones"><button class="boton" type="button" data-accion="libre"><span class="em">🧪</span>Laboratorio libre</button></div>';
  const p = abrirPanel(h, { libre: () => { iniciarMision(null); cerrarPanel(); } });
  p.querySelectorAll("[data-m]").forEach(b => b.addEventListener("click", () => { cerrarPanel(); iniciarMision(b.dataset.m); }));
}
export function iniciarMision(id) {
  E.mision = id; if (id) estadoMision(id); guardar();
  encargoAbierto = false;
  renderCabecera(); renderHoja();
  emitir("misionCambio", id);
  const m = misionActiva();
  if (m && m.tutorial) tutorialPaso();
  else ocultarCoach();
  // La primera vez que se abre una misión se muestra su plano: el desafío completo, para discutir cómo llegar.
  if (m && !m.tutorial && !estadoMision(m.id).planoVisto) { estadoMision(m.id).planoVisto = true; guardar(); setTimeout(() => abrirPlano(true), 350); }
}

/* ---------- Cuaderno ---------- */
export function abrirCuaderno() {
  let h = '<h2>📒 Cuaderno</h2><p class="intro">Todas las ideas del juego, por familia. Las que ya descubriste se pueden releer; los huecos esperan su mezcla. Una ★ marca las fichas que dominas, porque encontraste todos sus caminos.</p>';
  for (const f of D.orden) {
    const ids = Object.keys(D.fichas).filter(id => D.fichas[id].f === f && !D.fichas[id].ia);
    if (!ids.length) continue;
    const hechas = ids.filter(tiene);
    h += '<div class="cuaderno-fam f-' + f + '"><h3>' + esc(D.familias[f]) + " <small>" + hechas.length + " de " + ids.length + '</small></h3><div class="fila">' +
      ids.sort((a, b) => (D.fichas[a].nivel || 0) - (D.fichas[b].nivel || 0)).map(id => tiene(id) ? chipHtml(id, domina(id) ? " ★" : "") : '<span class="hueco" title="' + esc(D.fichas[id].pista || "") + '">?</span>').join("") + "</div></div>";
  }
  const ia = Object.keys(D.fichas).filter(id => D.fichas[id].ia && tiene(id));
  if (ia.length) h += '<div class="cuaderno-fam"><h3>Propuestas por Claude <small>' + ia.length + '</small></h3><div class="fila">' + ia.map(id => chipHtml(id)).join("") + "</div></div>";
  const p = abrirPanel(h);
  p.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => abrirFicha(c.dataset.id)));
}

/* ---------- Pista general ---------- */
export function darPista() {
  const m = misionActiva();
  if (m && !tiene(m.meta)) {
    const { listos, cerca } = alcance(m);
    const n = listos[0] || cerca[0];
    if (n) { avisoRico("Pista", (D.fichas[n.id].pista || "") + " En la hoja de la misión puedes ver sus ingredientes a cambio de chispas ✨.", { oro: true, ms: 6500 }); return; }
  }
  const posibles = D.recetas.filter(([a, b, r]) => !tiene(r) && tiene(a) && tiene(b));
  if (!posibles.length) { aviso("Ya descubriste todo lo que el núcleo permite con tus fichas actuales. Prueba combinaciones raras, que Claude las resuelve."); return; }
  const [a] = posibles[Math.floor(Math.random() * posibles.length)];
  avisoRico("Pista", "Hay algo nuevo esperando si mezclas " + D.fichas[a].e + " " + D.fichas[a].n + " con otra de tus fichas.", { oro: true, ms: 6000 });
}

/* ---------- Tutorial ---------- */
const PASOS = [
  { necesita: "experiencia", texto: "Arrastra 🧠 Mente y suéltala sobre 🌍 Mundo", de: "mente", a: "mundo" },
  { necesita: "reflexion", texto: "Trae 🧠 Mente desde tu caja dos veces y suelta una sobre la otra", de: "mente", a: "mente" },
  { necesita: "aprendizaje", texto: "Por último, junta 🪞 Reflexión con 🌄 Experiencia", de: "reflexion", a: "experiencia" }
];
let coachTimer = null;
function ocultarCoach() { $("coach").hidden = true; clearInterval(coachTimer); }
export function tutorialPaso() {
  const m = misionActiva();
  if (!m || !m.tutorial) { ocultarCoach(); return; }
  const paso = PASOS.find(p => !tiene(p.necesita));
  if (!paso) { ocultarCoach(); return; }
  const coach = $("coach");
  coach.hidden = false;
  coach.innerHTML = '<span class="flecha">↙</span><span>' + rico(paso.texto) + "</span>";
  clearInterval(coachTimer);
  const ubicar = () => {
    const enPizarra = elementoDe(paso.de);
    const el = enPizarra || document.querySelector('#cajaLista .chip[data-id="' + paso.de + '"]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (enPizarra) { coach.style.left = Math.min(innerWidth - 330, r.right + 12) + "px"; coach.style.top = Math.max(70, r.top - 74) + "px"; coach.querySelector(".flecha").textContent = "↙"; }
    else { const c = $("caja").getBoundingClientRect(); coach.style.left = Math.max(10, c.left - 330) + "px"; coach.style.top = Math.max(70, r.top - 30) + "px"; coach.querySelector(".flecha").textContent = "→"; coach.querySelector(".flecha").style.textAlign = "right"; }
  };
  ubicar(); coachTimer = setInterval(ubicar, 400);
}
on("cajaRender", () => { if (misionActiva() && misionActiva().tutorial) tutorialPaso(); });
