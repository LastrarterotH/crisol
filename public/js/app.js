// Arranque: portada, navegación y conexión de todas las piezas.
import { D, SERVIDOR, cargar, esc } from "./datos.js";
import { E, cargarEstado, guardar, reiniciar, descubiertas, tiene } from "./estado.js";
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
const EJEMPLOS = [["mente", "mundo", "experiencia"], ["reflexion", "experiencia", "aprendizaje"], ["dialogo", "error", "retro"], ["herramienta", "saber", "tecnologia"], ["datos", "algoritmo", "aprendizaje_automatico"]];
const fichaMuestra = (id, cls, estilo) => { const f = D.fichas[id]; return '<span class="ficha f-' + f.f + " " + cls + '"' + (estilo ? ' style="' + estilo + '"' : "") + '><span class="em">' + esc(f.e) + "</span><span>" + esc(f.n) + "</span></span>"; };
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
  const pts = [[7, 16], [81, 12], [9, 80], [80, 78]];
  $("portadaDeco").innerHTML = D.iniciales.map((id, i) => fichaMuestra(id, "", "left:" + pts[i][0] + "%;top:" + pts[i][1] + "%")).join("");
  pintarDemo();
}
function renderPortada() {
  const btns = $("portadaBotones");
  const avanzo = descubiertas().length > D.iniciales.length;
  const m = misionActiva();
  let h = "";
  if (E.taller) h += '<button class="boton principal grande" type="button" data-p="continuar">Volver al taller ' + esc(E.taller.codigo) + "</button>";
  else if (!avanzo) h += '<button class="boton principal grande" type="button" data-p="empezar">Empezar · 2 minutos</button>';
  else if (m && tiene(m.meta)) h += '<button class="boton principal grande" type="button" data-p="misiones">Elegir mi próxima misión</button>';
  else h += '<button class="boton principal grande" type="button" data-p="continuar">Continuar' + (m ? ": " + esc(m.n) : "") + "</button>";
  if (!(m && tiene(m.meta) && avanzo)) h += '<button class="boton grande" type="button" data-p="misiones"><span class="em">📜</span>Misiones</button>';
  h += '<button class="boton grande" type="button" data-p="libre"><span class="em">🧪</span>Laboratorio libre</button>';
  let t = '<span>¿En un taller?</span><button class="enlace-btn" type="button" data-p="unirse">Unirme con un código</button>';
  if (SERVIDOR.local) t += '<span aria-hidden="true">·</span><button class="enlace-btn" type="button" data-p="crear">Crear un taller para mi grupo</button>';
  btns.innerHTML = '<div class="fila-a">' + h + '</div><div class="fila-b">' + t + "</div>";
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
  n.innerHTML = "Suelta una ficha sobre otra<small>Arrastra desde tu caja o mueve las que ya están en la mesa</small>";
}
on("mezcla", () => notaPizarra());
$("btnInicio").addEventListener("click", () => { renderPortada(); mostrar("portada"); });
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
  pintarPortada(); renderPortada();
  if (E.taller) { entrar(); return; }
  mostrar("portada");
})();
