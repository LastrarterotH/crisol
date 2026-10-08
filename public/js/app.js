// Arranque: portada, navegación y conexión de todas las piezas.
import { D, cargar, esc } from "./datos.js";
import { E, cargarEstado, guardar, reiniciar, descubiertas, tiene } from "./estado.js";
import { $, aviso, abrirPanel, cerrarPanel } from "./ui.js";
import { activarSonido, sonar } from "./sonido.js";
import { iniciarPolvo } from "./polvo.js";
import { renderCaja, restaurarPizarra, borrarPizarra, colocarPrimigenios, vaciarMesa, fichasEnPizarra } from "./mesa.js";
import { renderCabecera, renderHoja, abrirPlano, abrirMisiones, abrirCuaderno, abrirPlan, darPista, iniciarMision, misionActiva, tutorialPaso } from "./misiones.js";
import { on, emitir } from "./bus.js";
import { esAlcanzable, totalAlcanzables } from "./reglas.js";
import { cerrarFicha } from "./ficha.js";

function mostrar(pantalla) {
  for (const id of ["portada", "juego"]) $(id).hidden = id !== pantalla;
}

/* ---------- Portada ---------- */
const EJEMPLOS = [["mente", "mundo", "experiencia"], ["reflexion", "experiencia", "aprendizaje"], ["dialogo", "error", "retro"], ["herramienta", "saber", "tecnologia"], ["datos", "algoritmo", "aprendizaje_automatico"]];
const fichaMuestra = (id, cls, estilo) => { const f = D.fichas[id]; return '<span class="ficha f-' + f.f + " " + cls + '" data-id="' + esc(id) + '"' + (estilo ? ' style="' + estilo + '"' : "") + '><span class="em">' + esc(f.e) + "</span><span>" + esc(f.n) + "</span></span>"; };
let demoI = 0;
function pintarDemo() {
  const ok = EJEMPLOS.filter(([a, b, r]) => D.fichas[a] && D.fichas[b] && D.fichas[r] && D.recetas.some(x => x[2] === r && ((x[0] === a && x[1] === b) || (x[0] === b && x[1] === a))));
  const demo = $("portadaDemo");
  if (!ok.length) { demo.hidden = true; return; }
  const [a, b, r] = ok[demoI % ok.length];
  demo.innerHTML = fichaMuestra(a, "d-a") + '<span class="d-mas">+</span>' + fichaMuestra(b, "d-b") + '<span class="d-onda f-' + D.fichas[r].f + '"></span>' + fichaMuestra(r, "d-r");
  demo.querySelector(".d-r").addEventListener("animationiteration", () => { demoI++; pintarDemo(); }, { once: true });
}
function pintarPortada() {
  $("portadaSub").textContent = "Un juego de mezclas en el que cuatro elementos dan origen a " + totalAlcanzables() + " ideas sobre cómo se aprende, repartidas en " + D.misiones.length + " misiones. Suelta una ficha sobre otra y recorre la docencia universitaria desde su raíz.";
  const pts = [[7, 16], [81, 12], [9, 80], [80, 78]];
  $("portadaDeco").innerHTML = D.iniciales.map((id, i) => fichaMuestra(id, "", "left:" + pts[i][0] + "%;top:" + pts[i][1] + "%")).join("");
  pintarDemo();
}
function renderPortada() {
  const btns = $("portadaBotones");
  const avanzo = descubiertas().length > D.iniciales.length;
  const m = misionActiva();
  let h = "";
  if (!avanzo) h += '<button class="boton principal grande" type="button" data-p="empezar">Empezar · 2 minutos</button>';
  else if (m && tiene(m.meta)) h += '<button class="boton principal grande" type="button" data-p="misiones">Elegir mi próxima misión</button>';
  else if (m) h += '<button class="boton principal grande" type="button" data-p="continuar">Continuar: ' + esc(m.n) + "</button>";
  else h += '<button class="boton principal grande" type="button" data-p="misiones">Elegir una misión</button>';
  if (!(m && tiene(m.meta) && avanzo)) h += '<button class="boton grande" type="button" data-p="misiones"><span class="em">📜</span>Ver las ' + D.misiones.length + ' misiones</button>';
  btns.innerHTML = '<div class="fila-a">' + h + "</div>" + (avanzo ? '<div class="fila-b"><button class="enlace-btn" type="button" data-p="borrar">Borrar mi partida y empezar de cero</button></div>' : "");
  btns.querySelectorAll("[data-p]").forEach(b => b.addEventListener("click", () => {
    activarSonido();
    const a = b.dataset.p;
    if (a === "empezar") { entrar(); iniciarMision("primeros"); }
    if (a === "continuar") { entrar(); if (!misionActiva()) iniciarMision("primeros"); }
    if (a === "misiones") { entrar(); abrirMisiones(); }
    if (a === "borrar") emitir("pedirReinicio");
  }));
  const hechas = D.misiones.filter(m => E.misiones[m.id] && E.misiones[m.id].completada).length;
  $("portadaPie").textContent = descubiertas().filter(esAlcanzable).length + " de " + totalAlcanzables() + " ideas descubiertas · " + hechas + " de " + D.misiones.length + " misiones cumplidas · funciona sin conexión";
}

/* ---------- Juego ---------- */
let enJuego = false, mesaLista = false;
function entrar() {
  mostrar("juego");
  if (!enJuego) { enJuego = true; iniciarPolvo($("polvo")); }
  if (!mesaLista) { mesaLista = true; requestAnimationFrame(() => { restaurarPizarra(); notaPizarra(); }); }
  renderCaja(); renderCabecera(); renderHoja(); tutorialPaso();
}
// La mesa explica qué hacer cuando le faltan fichas para mezclar, y al principio del juego, siempre.
function notaPizarra() {
  const n = $("pizarraNota"), k = fichasEnPizarra().length;
  const novato = descubiertas().length <= D.iniciales.length + 2;
  n.classList.toggle("centro", k === 0);
  if (k >= 2 && !novato) { n.innerHTML = ""; return; }
  n.innerHTML = k === 0 ? "Tu mesa está vacía<small>Toca una ficha de tu caja para traerla, o arrástrala hasta aquí</small>"
    : k === 1 ? "Trae otra ficha<small>Suelta una sobre otra para mezclarlas</small>"
    : "Suelta una ficha sobre otra<small>Arrastra desde tu caja o mueve las que ya están en la mesa</small>";
}
on("mezcla", () => notaPizarra());
on("pizarra", () => notaPizarra());
$("btnInicio").addEventListener("click", () => { renderPortada(); mostrar("portada"); });
$("btnSonido").addEventListener("click", () => { E.sonido = !E.sonido; guardar(); $("btnSonido").textContent = E.sonido ? "🔊" : "🔇"; if (E.sonido) { activarSonido(); sonar.chispa(); } });
$("btnPista").addEventListener("click", darPista);
$("btnBorrar").addEventListener("click", borrarPizarra);
$("btnPlano").addEventListener("click", abrirPlano);
$("btnMisiones").addEventListener("click", abrirMisiones);
$("btnCuaderno").addEventListener("click", abrirCuaderno);
$("btnPlan").addEventListener("click", abrirPlan);
on("pedirReinicio", () => {
  abrirPanel('<h2>¿Empezar de cero?</h2><p class="intro">Se borran tus ideas, caminos, chispas, misiones y lo que marcaste en Mi plan en este navegador.</p><div class="fila-botones"><button class="boton" type="button" data-accion="no">Cancelar</button><button class="boton principal" type="button" data-accion="si">Sí, borrar todo</button></div>',
    { no: cerrarPanel, si: () => {
      reiniciar(); emitir("reinicio");
      cerrarPanel(); $("capaPlano").hidden = true; $("celebracion").hidden = true;
      vaciarMesa(); mesaLista = false;
      renderCaja(); renderCabecera(); renderHoja();
      pintarPortada(); renderPortada(); mostrar("portada");
      aviso("Tu partida se borró. Puedes empezar de nuevo.", { ms: 5000 });
    } });
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("capaFicha").hidden) cerrarFicha();
  else if (!$("capaPlano").hidden) $("capaPlano").hidden = true;
  else if (!$("capaPanel").hidden) cerrarPanel();
  else if (!$("celebracion").hidden) $("celebracion").hidden = true;
});
on("misionCambio", () => requestAnimationFrame(() => requestAnimationFrame(tutorialPaso)));

/* ---------- Arranque ---------- */
(async () => {
  try { await cargar(); }
  catch (e) { document.body.innerHTML = '<p style="padding:40px;font-size:18px">No se pudieron cargar los datos del juego. Abre el archivo empaquetado o ejecuta <code>npm start</code> en la carpeta del proyecto.</p>'; return; }
  cargarEstado();
  $("btnSonido").textContent = E.sonido ? "🔊" : "🔇";
  pintarPortada(); renderPortada(); mostrar("portada");
})();
