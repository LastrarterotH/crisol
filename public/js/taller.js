// Talleres en vivo: quien facilita crea la sesión en su computador y el grupo se une desde la misma red.
import { D, SERVIDOR, esc, rico } from "./datos.js";
import { E, tiene, guardar } from "./estado.js";
import { $, aviso, abrirPanel, cerrarPanel, chipHtml, descargar } from "./ui.js";
import { on, emitir } from "./bus.js";
import { iniciarMision, dibujarPlano, nodoSvg } from "./misiones.js";
import { llevar, renderCaja } from "./mesa.js";

const AVATARES = ["🧑‍🏫", "👩‍🏫", "👨‍🏫", "🦉", "🦊", "🐢", "🦋", "🌻", "🚀", "🎻", "🧪", "📐", "🌋", "🐙", "🍄", "🪐"];
let fuente = null, taller = null;
const piezasDe = m => m.plano.filter(n => !D.iniciales.includes(n.id));

const post = async (url, cuerpo) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo || {}) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Error de conexión");
  return j;
};

/* ---------- Crear (solo en el computador anfitrión) ---------- */
export function abrirCrearTaller() {
  if (!SERVIDOR.local) { aviso("Los talleres se crean desde el computador donde corre el juego."); return; }
  const opciones = D.misiones.filter(m => !m.tutorial).map(m => '<option value="' + m.id + '">' + esc(m.e + " " + m.n + " · " + piezasDe(m).length + " piezas") + "</option>").join("");
  abrirPanel(
    '<h2>👥 Crear un taller</h2><p class="intro">El grupo trabaja en la misma misión desde sus computadores o celulares, conectados a la misma red que este equipo. En la proyección se ve, en vivo, el plano del grupo, quién descubre qué y un muro con las reflexiones.</p>' +
    '<div style="display:grid;gap:14px;margin-top:16px;max-width:560px">' +
    '<label class="campo" for="tTitulo">Nombre del taller<input id="tTitulo" type="text" maxlength="80" value="Taller de docencia universitaria"></label>' +
    '<label class="campo" for="tMision">Misión del grupo<select id="tMision">' + opciones + "</select></label>" +
    '<label class="casilla"><input id="tBanco" type="checkbox" checked><span><b>Banco del grupo.</b> Cada pieza descubierta queda disponible para quienes aún no la tienen, con el crédito de quien la encontró.</span></label></div>' +
    '<div class="fila-botones"><button class="boton" type="button" data-accion="cancelar">Cancelar</button><button class="boton principal" type="button" data-accion="crear">Crear taller</button></div>',
    {
      cancelar: cerrarPanel,
      crear: async () => {
        try {
          const r = await post("api/taller", { titulo: $("tTitulo").value, mision: $("tMision").value, banco: $("tBanco").checked });
          mostrarCreado(r);
        } catch (e) { aviso(e.message); }
      }
    }
  );
}
function mostrarCreado(r) {
  const t = r.taller;
  abrirPanel(
    '<h2>👥 ' + esc(t.titulo) + '</h2><p class="intro">Comparte el código o el QR. Quienes se unan deben estar en la misma red wifi que este computador.</p>' +
    '<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:18px"><div class="qr">' + r.qr + '</div><div style="display:grid;gap:10px">' +
    '<p class="etiqueta">Código del taller</p><p class="codigo-taller">' + t.codigo + "</p>" +
    '<p style="margin:0">o abre <span class="enlace">' + esc(r.enlace) + "</span></p></div></div>" +
    '<div class="fila-botones"><button class="boton" type="button" data-accion="jugar">Jugar también desde aquí</button><button class="boton principal" type="button" data-accion="proyectar">Abrir la proyección</button></div>',
    {
      proyectar: () => { window.open("/proyeccion?taller=" + t.codigo, "_blank"); },
      jugar: () => { cerrarPanel(); pedirNombre(t.codigo); }
    }
  );
}

/* ---------- Unirse ---------- */
export async function pedirNombre(codigo) {
  let info;
  try { const r = await fetch("api/taller/" + codigo); info = await r.json(); if (!r.ok) throw new Error(info.error); }
  catch (e) { aviso(e.message || "No se encontró el taller."); return; }
  const t = info.taller;
  if (!t.activo) { aviso("Ese taller ya terminó."); return; }
  const m = D.misiones.find(x => x.id === t.mision);
  let avatar = AVATARES[Math.floor(Math.random() * 6)];
  const p = abrirPanel(
    '<h2>👋 ' + esc(t.titulo) + '</h2><p class="intro">Misión del grupo: <b>' + rico(m.e + " " + m.n) + '</b>. Escribe tu nombre como quieres que aparezca en la proyección.</p>' +
    '<div style="display:grid;gap:14px;margin-top:16px;max-width:520px"><label class="campo" for="jNombre">Tu nombre<input id="jNombre" type="text" maxlength="40" placeholder="Por ejemplo: Ana, de Enfermería" autofocus></label>' +
    '<div class="campo">Elige un avatar<div class="avatares">' + AVATARES.map(a => '<button type="button" data-av="' + a + '" aria-pressed="' + (a === avatar) + '">' + a + "</button>").join("") + "</div></div></div>" +
    '<div class="fila-botones"><button class="boton principal" type="button" data-accion="unirme">Unirme</button></div>',
    {
      unirme: async () => {
        const nombre = $("jNombre").value.trim();
        if (!nombre) { aviso("Escribe tu nombre para unirte."); return; }
        try {
          const prev = E.taller && E.taller.codigo === codigo ? E.taller.jugador : null;
          const r = await post("api/taller/" + codigo + "/unirse", { nombre, avatar, id: prev });
          E.taller = { codigo, jugador: r.id, nombre, avatar }; guardar();
          cerrarPanel();
          conectar(codigo);
          iniciarMision(t.mision);
          for (const id of Object.keys(E.descubiertos)) if (!D.iniciales.includes(id) && m.plano.some(n => n.id === id)) enviarDescubrimiento(id);
          aviso("Ya estás en el taller. Tu avance se verá en la proyección.", { oro: true });
        } catch (e) { aviso(e.message); }
      }
    }
  );
  p.querySelectorAll("[data-av]").forEach(b => b.addEventListener("click", () => { avatar = b.dataset.av; p.querySelectorAll("[data-av]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); }));
}
export function abrirUnirse() {
  abrirPanel(
    '<h2>👥 Unirme a un taller</h2><p class="intro">Escribe el código de cuatro letras que aparece en la proyección.</p>' +
    '<label class="campo" for="cod" style="max-width:300px;margin-top:16px">Código<input id="cod" type="text" maxlength="4" style="text-transform:uppercase;letter-spacing:.3em;font-size:28px" autofocus></label>' +
    '<div class="fila-botones"><button class="boton principal" type="button" data-accion="ir">Continuar</button></div>',
    { ir: () => { const c = $("cod").value.trim().toUpperCase(); if (c.length === 4) { cerrarPanel(); pedirNombre(c); } else aviso("El código tiene cuatro letras."); } }
  );
}

/* ---------- Conexión en vivo (participantes) ---------- */
export function conectar(codigo) {
  if (fuente) fuente.close();
  fuente = new EventSource("api/taller/" + codigo + "/stream");
  fuente.onmessage = ev => {
    const d = JSON.parse(ev.data);
    if (d.tipo === "estado") { taller = d.taller; }
    else if (!taller) return;
    else if (d.tipo === "jugador") taller.jugadores[d.id] = d.jugador;
    else if (d.tipo === "evento") {
      const j = taller.jugadores[d.evento.jugador];
      if (j) j.piezas = d.piezas;
      if (d.evento.jugador !== (E.taller && E.taller.jugador) && d.evento.primero && D.fichas[d.evento.carta]) {
        const f = D.fichas[d.evento.carta];
        aviso((j ? j.avatar + " " + j.nombre : "Alguien") + " fue la primera persona en descubrir " + f.e + " " + f.n + ".", { familia: f.f, ms: 3500 });
      }
    } else if (d.tipo === "cerrado") { aviso("Quien facilita cerró el taller. ¡Gracias por participar!", { oro: true }); desconectar(); }
    renderBanco(); renderIndicador();
  };
  renderIndicador();
}
function desconectar() { if (fuente) fuente.close(); fuente = null; taller = null; E.taller = null; guardar(); renderBanco(); renderIndicador(); }
function renderIndicador() {
  const el = $("bandejaTaller");
  if (!E.taller) { el.hidden = true; return; }
  el.hidden = false;
  const n = taller ? Object.keys(taller.jugadores).length : 0;
  el.innerHTML = '<span class="punto"></span>Taller ' + esc(E.taller.codigo) + " · " + rico(E.taller.avatar + " " + E.taller.nombre) + (n ? " · " + n + (n === 1 ? " persona" : " personas") : "");
}
function enviarDescubrimiento(id) {
  if (!E.taller) return;
  post("api/taller/" + E.taller.codigo + "/evento", { jugador: E.taller.jugador, tipo: "descubrimiento", carta: id }).catch(() => {});
}
on("mezcla", ({ id, nueva }) => { if (nueva) enviarDescubrimiento(id); });
on("reflexion", ({ hito, texto }) => {
  if (!E.taller) return;
  post("api/taller/" + E.taller.codigo + "/evento", { jugador: E.taller.jugador, tipo: "reflexion", hito, texto }).catch(() => {});
});

/* ---------- Banco del grupo ---------- */
function renderBanco() {
  const el = $("banco");
  if (!E.taller || !taller || !taller.banco) { el.hidden = true; return; }
  const m = D.misiones.find(x => x.id === taller.mision);
  const ofertas = {};
  for (const [jid, j] of Object.entries(taller.jugadores)) {
    if (jid === E.taller.jugador) continue;
    for (const id of Object.keys(j.piezas || {})) if (!tiene(id) && D.fichas[id] && m.plano.some(n => n.id === id) && !ofertas[id]) ofertas[id] = j;
  }
  const ids = Object.keys(ofertas);
  el.hidden = !ids.length;
  if (!ids.length) return;
  el.innerHTML = "<h3><span class=\"emo\">🤝</span>Banco del grupo</h3><p>Piezas que otras personas ya descubrieron. Tómalas si te ayudan a avanzar.</p><div class=\"fila\">" + ids.map(id => chipHtml(id, " <small>· " + esc(ofertas[id].nombre.split(/[ ,]/)[0]) + "</small>")).join("") + "</div>";
  el.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    const id = c.dataset.id;
    E.descubiertos[id] = Date.now(); E.regalos[id] = ofertas[id].nombre; guardar();
    renderCaja(id); llevar(id);
    emitir("mezcla", { id, via: null, nueva: true });
  }));
}

/* ---------- Proyección ---------- */
export async function abrirProyeccion(codigo) {
  const pant = $("proyeccion");
  let info;
  try { const r = await fetch("api/taller/" + codigo); info = await r.json(); if (!r.ok) throw new Error(info.error); }
  catch (e) { pant.hidden = false; pant.innerHTML = '<div class="proy-cab"><h1>No se encontró el taller ' + esc(codigo) + "</h1></div>"; return; }
  taller = info.taller;
  pant.hidden = false;
  const m = D.misiones.find(x => x.id === taller.mision);
  pant.innerHTML =
    '<div class="proy-cab"><div class="titulo"><h1>' + esc(taller.titulo) + '</h1><span class="mision">' + rico(m.e + " " + m.n) + "</span></div>" +
    '<div class="unirse"><div class="qr">' + info.qr + '</div><div><p>Únete en</p><b>' + taller.codigo + '</b><p class="enlace" style="margin-top:4px">' + esc(info.enlace) + "</p></div>" +
    (SERVIDOR.local ? '<button class="boton" type="button" id="proyCerrar">Cerrar taller</button>' : "") + "</div></div>" +
    '<div class="proy-plano"><svg id="proySvg"></svg></div>' +
    '<aside class="proy-lado"><div class="proy-stats" id="proyStats"></div><h2>Lo último</h2><div class="feed" id="proyFeed"></div><div class="proy-bloque"><h2>Muro de reflexiones</h2><div class="muro" id="proyMuro"></div></div></aside>';
  const cerrar = $("proyCerrar");
  if (cerrar) cerrar.addEventListener("click", async () => { try { await post("api/taller/" + codigo + "/cerrar"); resumenTaller(m); } catch (e) { aviso(e.message); } });
  renderProyeccion(m);
  if (fuente) fuente.close();
  fuente = new EventSource("api/taller/" + codigo + "/stream");
  fuente.onmessage = ev => {
    const d = JSON.parse(ev.data);
    if (d.tipo === "estado") taller = d.taller;
    else if (d.tipo === "jugador") taller.jugadores[d.id] = d.jugador;
    else if (d.tipo === "evento") { taller.eventos.push(d.evento); const j = taller.jugadores[d.evento.jugador]; if (j) j.piezas = d.piezas; }
    else if (d.tipo === "reflexion") taller.reflexiones.push(d.reflexion);
    else if (d.tipo === "cerrado") taller.activo = false;
    renderProyeccion(m);
  };
}
function conteo() {
  const c = {};
  for (const j of Object.values(taller.jugadores)) for (const id of Object.keys(j.piezas || {})) c[id] = (c[id] || 0) + 1;
  return c;
}
function renderProyeccion(m) {
  const c = conteo();
  const primero = {};
  for (const e of taller.eventos) if (!primero[e.carta] && taller.jugadores[e.jugador]) primero[e.carta] = taller.jugadores[e.jugador];
  dibujarPlano($("proySvg"), m, {
    logrado: id => !!c[id] || D.iniciales.includes(id), grande: true,
    extra: (nodo, n, p, r) => {
      if (!c[n.id] || D.iniciales.includes(n.id)) return;
      const b = nodoSvg("g", { class: "conteo" });
      b.appendChild(nodoSvg("circle", { cx: p.x + r * .78, cy: p.y - r * .78, r: 13 }));
      b.appendChild(nodoSvg("text", { x: p.x + r * .78, y: p.y - r * .78 + 4.5, "text-anchor": "middle", "font-size": 12.5 }, "×" + c[n.id]));
      nodo.appendChild(b);
    }
  });
  const piezasGrupo = piezasDe(m).filter(n => c[n.id]).length;
  const nombres = Object.values(taller.jugadores);
  $("proyStats").innerHTML = "<div><b>" + nombres.length + "</b><span>personas</span></div><div><b>" + piezasGrupo + "/" + piezasDe(m).length + "</b><span>piezas del grupo</span></div><div><b>" + taller.reflexiones.length + "</b><span>reflexiones</span></div>";
  const hace = ts => { const s = Math.round((Date.now() - ts) / 1000); return s < 60 ? "recién" : "hace " + Math.round(s / 60) + " min"; };
  $("proyFeed").innerHTML = taller.eventos.filter(e => D.fichas[e.carta] && !D.iniciales.includes(e.carta) && taller.jugadores[e.jugador]).slice(-30).reverse().map(e => {
    const j = taller.jugadores[e.jugador], f = D.fichas[e.carta];
    return "<div" + (e.primero ? ' class="primero"' : "") + "><span class=\"em\">" + esc(j.avatar) + "</span> " + esc(j.nombre) + " descubrió <span class=\"em\">" + esc(f.e) + "</span> " + esc(f.n) + (e.primero ? " · ¡primera vez en el grupo!" : "") + " <small style=\"opacity:.6\">" + hace(e.t) + "</small></div>";
  }).join("") || "<div>Esperando los primeros descubrimientos…</div>";
  $("proyMuro").innerHTML = taller.reflexiones.slice().reverse().map((r, i) => {
    const j = taller.jugadores[r.jugador], h = D.fichas[r.hito];
    return '<div class="nota-muro" style="--giro:' + ((i % 5) - 2) * .8 + 'deg">' + esc(r.texto) + "<small>" + esc((j ? j.avatar + " " + j.nombre : "") + (h ? " · " + h.n : "")) + "</small></div>";
  }).join("") || '<p class="vacio">Cuando alguien llega a un hito, su reflexión aparece aquí.</p>';
}
function resumenTaller(m) {
  const jugadores = Object.values(taller.jugadores);
  const c = conteo(), piezas = piezasDe(m), logradas = piezas.filter(n => c[n.id]).length;
  const nPiezas = j => Object.keys(j.piezas || {}).filter(id => !D.iniciales.includes(id)).length;
  const lineas = ["# " + taller.titulo, "", "Misión: " + m.n + ". Fecha: " + new Date().toLocaleDateString("es-CL") + ".", "", "El grupo reunió " + logradas + " de " + piezas.length + " piezas del plano" + (c[m.meta] ? " y llegó a la meta." : "."), "", "## Participantes", ""];
  for (const j of jugadores) lineas.push("- " + j.nombre + ": " + nPiezas(j) + " piezas");
  lineas.push("", "## Reflexiones", "");
  for (const r of taller.reflexiones) { const j = taller.jugadores[r.jugador]; lineas.push("- **" + (D.fichas[r.hito] ? D.fichas[r.hito].n : r.hito) + "** (" + (j ? j.nombre : "") + "): " + r.texto); }
  const personas = jugadores.map(j => '<li><span class="emo">' + esc(j.avatar) + "</span>" + esc(j.nombre) + " <small>" + nPiezas(j) + " piezas</small></li>").join("");
  const refl = taller.reflexiones.map(r => { const j = taller.jugadores[r.jugador], h = D.fichas[r.hito]; return '<div class="plan-hito"><b>' + rico((h ? h.e + " " + h.n : "") + (j ? " · " + j.nombre : "")) + "</b><p>" + esc(r.texto) + "</p></div>"; }).join("");
  abrirPanel('<h2>Taller cerrado</h2><p class="intro">El grupo reunió <b>' + logradas + " de " + piezas.length + "</b> piezas del plano" + (c[m.meta] ? " y llegó a la meta" : "") + ". Usa estas reflexiones para la puesta en común y descarga el resumen para retomarlas en la próxima sesión.</p>" +
    (personas ? '<h3 class="subtitulo">Participantes</h3><ul class="lista-personas">' + personas + "</ul>" : "") +
    (refl ? '<h3 class="subtitulo">Reflexiones del grupo</h3><div class="plan-lista">' + refl + "</div>" : "") +
    '<div class="fila-botones"><button class="boton principal" type="button" data-accion="bajar">Descargar resumen (.md)</button></div>',
    { bajar: () => descargar("taller-" + taller.codigo + ".md", lineas.join("\n")) });
}
export async function reconectarSiCorresponde() {
  if (!E.taller) return;
  try {
    const r = await fetch("api/taller/" + E.taller.codigo);
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.taller || !j.taller.activo) { desconectar(); aviso("El taller " + (j.taller ? "ya terminó" : "ya no existe") + ". Puedes seguir jugando por tu cuenta."); return; }
  } catch (e) { return; }
  conectar(E.taller.codigo);
}
