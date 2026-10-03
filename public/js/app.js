// Arranque: portada, navegación y conexión de todas las piezas.
import rough from "../vendor/rough.esm.js";
import { D, SERVIDOR, cargar, esc } from "./datos.js";
import { E, cargarEstado, guardar, reiniciar, descubiertas } from "./estado.js";
import { $, aviso, abrirPanel, cerrarPanel } from "./ui.js";
import { activarSonido, sonar } from "./sonido.js";
import { iniciarPolvo } from "./polvo.js";
import { renderCaja, restaurarPizarra, borrarPizarra, colocarPrimigenios } from "./mesa.js";
import { renderCabecera, renderHoja, abrirPlano, abrirMisiones, abrirCuaderno, abrirPlan, darPista, iniciarMision, misionActiva, tutorialPaso } from "./misiones.js";
import { abrirCrearTaller, abrirUnirse, pedirNombre, abrirProyeccion, reconectarSiCorresponde } from "./taller.js";
import { on } from "./bus.js";
import { cerrarFicha } from "./ficha.js";

function mostrar(pantalla) {
  for (const id of ["portada", "juego", "proyeccion"]) $(id).hidden = id !== pantalla;
}

/* ---------- Portada ---------- */
function dibujarPortada() {
  const svg = $("portadaDibujo");
  const W = innerWidth, H = innerHeight;
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  svg.innerHTML = "";
  const rc = rough.svg(svg);
  const NS = "http://www.w3.org/2000/svg";
  const prims = D.iniciales.map(id => D.fichas[id]);
  const pts = [[.13, .22], [.87, .24], [.12, .78], [.88, .76]];
  prims.forEach((f, i) => {
    const x = pts[i][0] * W, y = pts[i][1] * H;
    svg.appendChild(rc.circle(x, y, 96, { stroke: "rgba(242,239,228,.55)", strokeWidth: 1.6, roughness: 1.6, seed: i + 3 }));
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", x); t.setAttribute("y", y + 13); t.setAttribute("text-anchor", "middle"); t.setAttribute("font-size", 38); t.setAttribute("style", "font-family:var(--f-emoji)");
    t.textContent = f.e; svg.appendChild(t);
    const n = document.createElementNS(NS, "text");
    n.setAttribute("x", x); n.setAttribute("y", y + 78); n.setAttribute("text-anchor", "middle"); n.setAttribute("font-size", 24); n.setAttribute("style", "font-family:var(--f-mano);fill:rgba(242,239,228,.7)");
    n.textContent = f.n; svg.appendChild(n);
  });
  const ecuaciones = [["🧠", "🌍", "🌄", .22, .5], ["💬", "🪨", "📣", .78, .5]];
  for (const [a, b, c, fx, fy] of ecuaciones) {
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", fx * W); t.setAttribute("y", fy * H); t.setAttribute("text-anchor", "middle"); t.setAttribute("font-size", 26);
    t.setAttribute("style", "font-family:var(--f-mano);fill:rgba(242,239,228,.35)");
    t.textContent = a + " + " + b + " = " + c; svg.appendChild(t);
  }
}
function renderPortada() {
  const btns = $("portadaBotones");
  const avanzo = descubiertas().length > D.iniciales.length;
  const m = misionActiva();
  let h = "";
  if (!avanzo) h += '<button class="boton principal grande" type="button" data-p="empezar">Empezar · 2 minutos</button>';
  else h += '<button class="boton principal grande" type="button" data-p="continuar">Continuar' + (m ? ": " + esc(m.n) : "") + "</button>";
  h += '<button class="boton grande" type="button" data-p="misiones">Misiones</button><button class="boton grande" type="button" data-p="libre">Laboratorio libre</button>';
  h += '<button class="boton" type="button" data-p="unirse">Unirme a un taller</button>';
  if (SERVIDOR.local) h += '<button class="boton" type="button" data-p="crear">Crear un taller</button>';
  btns.innerHTML = h;
  btns.querySelectorAll("[data-p]").forEach(b => b.addEventListener("click", () => {
    activarSonido();
    const a = b.dataset.p;
    if (a === "empezar") { entrar(); iniciarMision("primeros"); }
    if (a === "continuar") entrar();
    if (a === "misiones") { entrar(); abrirMisiones(); }
    if (a === "libre") { entrar(); iniciarMision(null); }
    if (a === "unirse") { entrar(); abrirUnirse(); }
    if (a === "crear") { entrar(); abrirCrearTaller(); }
  }));
  $("portadaPie").textContent = descubiertas().length + " de " + Object.values(D.fichas).filter(f => !f.ia).length + " ideas descubiertas · " +
    (!SERVIDOR.conectado ? "sin servidor: solo recetas verificadas" : SERVIDOR.ia ? "Claude resuelve las mezclas raras" : "IA no disponible: solo recetas verificadas");
}

/* ---------- Juego ---------- */
let enJuego = false;
function entrar() {
  mostrar("juego");
  if (!enJuego) {
    enJuego = true;
    iniciarPolvo($("polvo"));
    requestAnimationFrame(() => { restaurarPizarra(); notaPizarra(); });
  }
  renderCaja(); renderCabecera(); renderHoja(); tutorialPaso();
}
function notaPizarra() {
  const n = $("pizarraNota");
  if (descubiertas().length > D.iniciales.length + 2) { n.innerHTML = ""; return; }
  n.innerHTML = "Suelta una ficha sobre otra<small>y mira qué idea nace</small>";
}
on("mezcla", () => notaPizarra());
$("btnInicio").addEventListener("click", () => { renderPortada(); mostrar("portada"); dibujarPortada(); });
$("btnSonido").addEventListener("click", () => { E.sonido = !E.sonido; guardar(); $("btnSonido").textContent = E.sonido ? "🔊" : "🔇"; if (E.sonido) { activarSonido(); sonar.chispa(); } });
$("btnPista").addEventListener("click", darPista);
$("btnBorrar").addEventListener("click", borrarPizarra);
$("btnPlano").addEventListener("click", abrirPlano);
$("btnMisiones").addEventListener("click", abrirMisiones);
$("btnCuaderno").addEventListener("click", abrirCuaderno);
$("btnPlan").addEventListener("click", abrirPlan);
on("pedirReinicio", () => {
  abrirPanel('<h2>¿Empezar de cero?</h2><p class="intro">Se borran tus ideas, caminos, chispas, reflexiones y misiones de este navegador. Las fichas que propuso Claude siguen guardadas en el servidor.</p><div class="fila-botones"><button class="boton" type="button" data-accion="no">Cancelar</button><button class="boton principal" type="button" data-accion="si">Sí, borrar todo</button></div>',
    { no: cerrarPanel, si: () => { reiniciar(); cerrarPanel(); renderCaja(); renderCabecera(); renderHoja(); for (const el of [...document.querySelectorAll("#pizarra .ficha")]) el.remove(); restaurarPizarra(); notaPizarra(); } });
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("capaFicha").hidden) cerrarFicha();
  else if (!$("capaPlano").hidden) $("capaPlano").hidden = true;
  else if (!$("capaPanel").hidden) cerrarPanel();
  else if (!$("celebracion").hidden) $("celebracion").hidden = true;
});
on("misionCambio", id => {
  const m = D.misiones.find(x => x.id === id);
  if (m && m.tutorial && enJuego) {
    for (const el of [...document.querySelectorAll("#pizarra .ficha")]) el.remove();
    E.mesa = []; guardar();
    requestAnimationFrame(() => { restaurarPizarra(); tutorialPaso(); });
  }
});

/* ---------- Arranque ---------- */
(async () => {
  try { await cargar(); }
  catch (e) { document.body.innerHTML = '<p style="padding:40px;font-size:18px">No se pudieron cargar los datos del juego. Ejecuta <code>npm start</code> en la carpeta del proyecto.</p>'; return; }
  cargarEstado();
  $("btnSonido").textContent = E.sonido ? "🔊" : "🔇";
  const url = new URL(location.href);
  const codigo = (url.searchParams.get("taller") || "").toUpperCase();
  if (location.pathname.startsWith("/proyeccion") && codigo) { mostrar("proyeccion"); abrirProyeccion(codigo); return; }
  if (codigo) {
    entrar();
    if (E.taller && E.taller.codigo === codigo) { reconectarSiCorresponde(); } else pedirNombre(codigo);
    history.replaceState(null, "", "/");
    return;
  }
  reconectarSiCorresponde();
  renderPortada(); mostrar("portada"); dibujarPortada();
  window.addEventListener("resize", () => { if (!$("portada").hidden) dibujarPortada(); });
})();
