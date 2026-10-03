/* ================= Datos ================= */
const FAMILIAS = DATOS.familias;
const ORDEN_FAMILIAS = DATOS.orden;
const REFS = DATOS.refs;
const E = DATOS.fichas;            // se amplía con las fichas generadas con IA
const RECETAS = DATOS.recetas;     // [a, b, resultado, nota]
const RUTAS = DATOS.rutas;
const INICIALES = DATOS.iniciales;
const DESBLOQUEOS = DATOS.desbloqueos;
const PISTA_MITO = DATOS.pistaMito;
const ANALIZADAS = new Set(DATOS.analizadas);

const clave = (a, b) => [a, b].sort().join("+");
const RECETA = new Map();
const RECETAS_DE = {};
for (const rec of RECETAS) {
  RECETA.set(clave(rec[0], rec[1]), rec);
  (RECETAS_DE[rec[2]] = RECETAS_DE[rec[2]] || []).push(rec);
}
const TODOS = Object.keys(E);
const NUCLEO = new Set(TODOS);
const CUMBRES = new Set(RUTAS.map(r => r.destinos[r.destinos.length - 1]));
const REVISION = location.hash === "#revision";
const LS_KEY = "alquimia-docente:v1";
const FAMILIAS_IA = ["fund", "apr", "met", "tec", "mod", "eva", "dis", "mito"];
const COLOR_CIELO = { base: "#e6e9f5", fund: "#ffd84d", apr: "#6ee08a", met: "#ffa04d", tec: "#b79dff", mod: "#5cc8ff", eva: "#ff7ab8", dis: "#4fe0c8", mito: "#ff6b6b" };
const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = id => document.getElementById(id);
const mesa = $("mesa"), lista = $("lista"), biblio = $("biblio"), buscar = $("buscar");
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
const refHtml = s => esc(s).replace(/_(.+?)_/g, "<em>$1</em>");
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const sinRaya = s => String(s || "").replace(/\s*\u2014\s*/g, ", ").trim();
const nombreCorto = id => E[id] ? E[id].e + " " + E[id].n : id;

/* ================= Estado ================= */
function estadoInicial() {
  return {
    descubiertos: [], como: {}, fechas: {}, caminos: {}, mesa: [], combinaciones: 0,
    ruta: null, rutasHechas: {}, bitacora: {}, predicciones: {}, bienvenida: false, taller: null,
    ia: { cartas: {}, combos: {} }
  };
}
let state = estadoInicial();

function cargar() {
  let s = null;
  try { const raw = localStorage.getItem(LS_KEY); if (raw) s = JSON.parse(raw); } catch (e) { s = null; }
  if (s && typeof s === "object") {
    if (s.ia && typeof s.ia === "object") {
      state.ia.cartas = s.ia.cartas && typeof s.ia.cartas === "object" ? s.ia.cartas : {};
      state.ia.combos = s.ia.combos && typeof s.ia.combos === "object" ? s.ia.combos : {};
      for (const [id, def] of Object.entries(state.ia.cartas)) registrarCartaIA(id, def);
    }
    if (!REVISION) {
      if (Array.isArray(s.descubiertos)) state.descubiertos = [...new Set(s.descubiertos.map(al))].filter(id => E[id]);
      for (const k of ["como", "fechas", "caminos", "rutasHechas", "bitacora", "predicciones"]) if (s[k] && typeof s[k] === "object") state[k] = s[k];
      if (Array.isArray(s.mesa)) state.mesa = s.mesa.filter(t => E[t.id]);
      state.combinaciones = s.combinaciones || 0;
      state.ruta = RUTAS.some(r => r.id === s.ruta) ? s.ruta : null;
      state.bienvenida = !!s.bienvenida;
      state.taller = s.taller && s.taller.id ? s.taller : null;
      // versiones anteriores no guardaban caminos: se deducen de las recetas usadas
      for (const [id, via] of Object.entries(state.como)) {
        if (Array.isArray(via) && RECETA.get(clave(via[0], via[1])) && !state.caminos[clave(via[0], via[1])]) state.caminos[clave(via[0], via[1])] = 1;
      }
    }
  }
  if (REVISION) { state.descubiertos = [...TODOS]; state.bienvenida = true; }
  for (const id of INICIALES) if (!state.descubiertos.includes(id)) state.descubiertos.push(id);
}
function guardar() {
  state.mesa = fichas.map(t => ({ id: t.id, x: Math.round(t.x), y: Math.round(t.y) }));
  try {
    if (REVISION) {
      const raw = localStorage.getItem(LS_KEY);
      const s = raw ? JSON.parse(raw) : {};
      s.ia = state.ia;
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } else localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) { /* sin almacenamiento local: se juega igual */ }
  programarSync();
}
const descubierto = id => state.descubiertos.includes(id);
const visibles = () => state.descubiertos.filter(id => E[id] && !rechazada(id));
const caminoHallado = k => REVISION || !!state.caminos[k];

/* ================= Nube: base compartida, identidad e IA ================= */
const NUBE = { db: null, user: null, uid: null, curador: false, downloads: null };
const IA = { sample: null, apagada: false, cartas: {}, combos: {}, curaduria: {}, enCurso: new Set() };
const VOTOS = { mios: {}, todos: {} };
const COMUNIDAD = { jugadores: {} };
const TALLER = { actual: null };
const NOMBRES = {};

const ALIAS = {};   // ficha generada con IA que coincide con una del núcleo -> id del núcleo
const al = id => ALIAS[id] || id;
const estadoIA = id => {
  if (IA.curaduria[id]) return IA.curaduria[id];
  const t = VOTOS.todos[id];
  if (t) {
    if (t.pos >= 3 && t.pos >= 2 * t.neg) return "comunidad";
    if (t.neg >= 3 && t.neg > t.pos) return "cuestionada";
  }
  return "pendiente";
};
const rechazada = id => !!(E[id] && E[id].ia && ["rechazada", "cuestionada"].includes(estadoIA(id)));

function registrarCartaIA(id, d) {
  if (!d || typeof d !== "object" || NUCLEO.has(id) || !/^ia-[a-z0-9-]{1,60}$/.test(id)) return false;
  const n = sinRaya(d.n).slice(0, 70);
  if (!n) return false;
  const igualNucleo = TODOS.find(x => norm(E[x].n) === norm(n));
  if (igualNucleo) { ALIAS[id] = igualNucleo; return false; }
  const f = FAMILIAS_IA.includes(d.f) ? d.f : "apr";
  const carta = {
    n, e: String(d.e || "").trim().slice(0, 8) || "✨", f, ia: true,
    refs: Array.isArray(d.refs) ? d.refs.slice(0, 3).map(r => String(r).replace(/\u2014/g, "-").slice(0, 400)).filter(Boolean) : [],
    via: Array.isArray(d.via) ? d.via.slice(0, 2).map(x => al(String(x))) : null,
    creada: d.creada || null
  };
  if (f === "mito") {
    carta.myth = true;
    carta.belief = sinRaya(d.belief).slice(0, 600);
    carta.evidence = sinRaya(d.evidence).slice(0, 1400);
    carta.tip = PISTA_MITO;
    if (!carta.belief || !carta.evidence) return false;
  } else {
    carta.why = sinRaya(d.why).slice(0, 1400);
    if (d.uni) carta.uni = sinRaya(d.uni).slice(0, 400);
    if (d.pista) carta.pista = sinRaya(d.pista).slice(0, 200);
    if (!carta.why) return false;
  }
  E[id] = carta;
  return true;
}

let syncTimer = null, syncOcupado = false, syncPendiente = false;
function programarSync() {
  if (!NUBE.db || !NUBE.uid || REVISION) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(sincronizar, 1200);
}
async function sincronizar() {
  if (syncOcupado) { syncPendiente = true; return; }
  syncOcupado = true;
  try {
    const desc = {};
    for (const id of state.descubiertos) if (NUCLEO.has(id) || (E[id] && E[id].ia)) desc[id] = state.fechas[id] || 1;
    await NUBE.db.doc("jugadores/" + NUBE.uid).set({
      descubiertos: desc, caminos: Object.keys(state.caminos), taller: state.taller ? state.taller.id : null, actualizado: Date.now()
    });
  } catch (e) { /* sin permiso de escritura: el progreso queda en este navegador */ }
  syncOcupado = false;
  if (syncPendiente) { syncPendiente = false; programarSync(); }
}
let bitTimer = null;
function guardarBitacora() {
  guardar();
  if (!NUBE.db || !NUBE.uid || REVISION) return;
  clearTimeout(bitTimer);
  bitTimer = setTimeout(() => {
    NUBE.db.doc("data/users/" + NUBE.uid + "/bitacora").set({ marcas: state.bitacora, actualizado: Date.now() }).catch(() => {});
  }, 1000);
}

/* ================= Fichas en la mesa ================= */
let fichas = [];
let zTop = 10;

function contenidoFicha(el, id) {
  const d = E[id];
  el.classList.add("f-" + d.f);
  if (d.myth) el.classList.add("is-myth");
  if (d.ia) el.classList.add("is-ia");
  const em = document.createElement("span"); em.className = "em"; em.textContent = d.e;
  const nm = document.createElement("span"); nm.className = "nm";
  const hl = document.createElement("span"); hl.className = "hl"; hl.textContent = d.n; nm.appendChild(hl);
  el.append(em, nm);
}
function ubicar(t) { t.el.style.left = t.x + "px"; t.el.style.top = t.y + "px"; }
function acotar(t) {
  const w = t.el.offsetWidth, h = t.el.offsetHeight;
  const W = mesa.clientWidth, H = mesa.clientHeight;
  t.x = Math.max(4, Math.min(W - w - 4, t.x));
  t.y = Math.max(4, Math.min(H - h - 4, t.y));
  ubicar(t);
}
function agregarFicha(id, x, y, opts = {}) {
  const el = document.createElement("div");
  el.className = "tile";
  contenidoFicha(el, id);
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", E[id].n + ". Arrastra para combinar; Enter para leer la ficha.");
  const t = { id, x, y, el };
  el.style.zIndex = ++zTop;
  mesa.appendChild(el);
  if (opts.centrar) { t.x = x - el.offsetWidth / 2; t.y = y - el.offsetHeight / 2; }
  acotar(t);
  if (opts.pop || opts.shake) {
    const cls = opts.pop ? "pop" : "shake";
    el.classList.add(cls);
    el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
  }
  vincularFicha(t);
  fichas.push(t);
  return t;
}
function quitarFicha(t) { t.el.remove(); fichas = fichas.filter(o => o !== t); }

function objetivoEn(px, py, excluir) {
  let mejor = null, md = Infinity;
  for (const o of fichas) {
    if (o === excluir) continue;
    const w = o.el.offsetWidth, h = o.el.offsetHeight;
    if (px >= o.x - 6 && px <= o.x + w + 6 && py >= o.y - 6 && py <= o.y + h + 6) {
      const d = Math.hypot(px - (o.x + w / 2), py - (o.y + h / 2));
      if (d < md) { md = d; mejor = o; }
    }
  }
  return mejor;
}
function sobreBiblio(cx, cy) {
  const r = biblio.getBoundingClientRect();
  return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
}
function vincularFicha(t) {
  const el = t.el;
  el.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY, ox = t.x, oy = t.y;
    let movida = false, obj = null;
    el.style.zIndex = ++zTop;
    const mover = ev => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!movida && Math.hypot(dx, dy) < 5) return;
      if (!movida) { movida = true; el.classList.add("dragging"); }
      t.x = ox + dx; t.y = oy + dy; ubicar(t);
      const n = objetivoEn(t.x + el.offsetWidth / 2, t.y + el.offsetHeight / 2, t);
      if (n !== obj) { obj && obj.el.classList.remove("target"); obj = n; obj && obj.el.classList.add("target"); }
      biblio.classList.toggle("drop-out", sobreBiblio(ev.clientX, ev.clientY));
    };
    const soltar = ev => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerup", soltar);
      el.removeEventListener("pointercancel", soltar);
      el.classList.remove("dragging");
      obj && obj.el.classList.remove("target");
      biblio.classList.remove("drop-out");
      if (!movida) { if (ev.type === "pointerup") abrirFicha(t.id); return; }
      if (sobreBiblio(ev.clientX, ev.clientY)) { quitarFicha(t); guardar(); return; }
      if (obj) combinar(t, obj); else { acotar(t); guardar(); }
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", soltar);
  });
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrirFicha(t.id); }
    if (e.key === "Delete" || e.key === "Backspace") { quitarFicha(t); guardar(); }
  });
}

/* Fusión: las dos fichas se juntan y aparece el resultado con un destello del color de su familia */
function fundir(a, b, cx, cy) {
  for (const t of [a, b]) {
    fichas = fichas.filter(o => o !== t);
    const w = t.el.offsetWidth, h = t.el.offsetHeight;
    t.el.classList.add("funde");
    t.el.style.transform = "translate(" + (cx - t.x - w / 2) + "px," + (cy - t.y - h / 2) + "px) scale(.45)";
    t.el.style.opacity = "0";
    setTimeout(() => t.el.remove(), reducido ? 0 : 260);
  }
  return new Promise(r => setTimeout(r, reducido ? 0 : 230));
}
function estallar(cx, cy, fam) {
  if (reducido) return;
  const d = document.createElement("div");
  d.className = "destello f-" + fam; d.style.left = cx + "px"; d.style.top = cy + "px";
  mesa.appendChild(d); setTimeout(() => d.remove(), 650);
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("div");
    s.className = "chispa f-" + fam;
    const ang = i / 10 * Math.PI * 2 + Math.random() * .4, r = 42 + Math.random() * 30;
    s.style.left = cx + "px"; s.style.top = cy + "px";
    s.style.setProperty("--dx", (Math.cos(ang) * r).toFixed(1) + "px");
    s.style.setProperty("--dy", (Math.sin(ang) * r).toFixed(1) + "px");
    mesa.appendChild(s); setTimeout(() => s.remove(), 750);
  }
}

/* ================= Combinar ================= */
function recetaIA(k) {
  const c = IA.combos[k] || state.ia.combos[k];
  if (!c) return undefined;
  if (c.none) return { none: true, motivo: c.motivo };
  const res = al(c.res);
  if (!E[res] || rechazada(res)) return undefined;
  return { res };
}

async function combinar(a, b) {
  const k = clave(a.id, b.id);
  const cx = b.x + b.el.offsetWidth / 2, cy = b.y + b.el.offsetHeight / 2;
  const ida = a.id, idb = b.id;
  const rec = RECETA.get(k);
  if (rec) { await fundir(a, b, cx, cy); concretar(ida, idb, rec[2], cx, cy, rec); return; }
  const ia = recetaIA(k);
  if (ia && ia.res) { await fundir(a, b, cx, cy); concretar(ida, idb, ia.res, cx, cy, null); return; }
  if (ia && ia.none) { noCombina(a, b, ia.motivo); return; }
  if (ANALIZADAS.has(ida) && ANALIZADAS.has(idb)) { noCombina(a, b, "combinación ya analizada: juntas no forman un concepto establecido. Prueba otra pareja."); return; }
  if (!IA.sample || IA.apagada) { noCombina(a, b, "no hay una receta verificada para esta pareja."); return; }
  if (IA.enCurso.has(k)) { noCombina(a, b, "Claude ya está pensando esta misma combinación."); return; }
  await fundir(a, b, cx, cy);
  consultarIA(ida, idb, k, cx, cy);
}

function concretar(ida, idb, res, cx, cy, rec, prediccion) {
  agregarFicha(res, cx, cy, { pop: true, centrar: true });
  estallar(cx, cy, E[res].f);
  state.combinaciones++;
  ocultarNota();
  const k = clave(ida, idb);
  const caminoNuevo = !!rec && !state.caminos[k];
  if (rec) state.caminos[k] = Date.now();
  if (prediccion) state.predicciones[k] = prediccion;
  if (!descubierto(res)) {
    descubrir(res, [ida, idb]);
    abrirFicha(res, { nuevo: true, via: [ida, idb] });
    revisarDesbloqueos();
  } else if (caminoNuevo) {
    avisoCamino(rec);
  }
  if (caminoNuevo) revisarMaestria(res);
  revisarRutas(res);
  renderStats(); renderDestinos();
  guardar();
}

function noCombina(a, b, motivo) {
  a.el.classList.add("shake"); b.el.classList.add("shake");
  setTimeout(() => { a.el.classList.remove("shake"); b.el.classList.remove("shake"); }, 420);
  a.x = b.x + b.el.offsetWidth + 12; a.y = b.y; acotar(a); guardar();
  aviso(nombreCorto(a.id) + " + " + nombreCorto(b.id) + ": " + (motivo || "no hay relación directa. Prueba otra pareja."));
}
function devolver(ida, idb, cx, cy) {
  agregarFicha(ida, cx - 80, cy, { centrar: true, shake: true });
  agregarFicha(idb, cx + 80, cy, { centrar: true, shake: true });
  guardar();
}

function descubrir(id, via) {
  state.descubiertos.push(id);
  state.fechas[id] = Date.now();
  if (via) state.como[id] = via;
  renderLista(id);
  renderStats();
}
function revisarDesbloqueos() {
  const derivados = state.descubiertos.filter(id => E[id] && E[id].f !== "base").length;
  for (const u of DESBLOQUEOS) {
    if (derivados >= u.tras && !descubierto(u.id)) {
      descubrir(u.id, null);
      abrirFicha(u.id, { base: true });
    }
  }
}
const recetasDe = id => RECETAS_DE[id] || [];
const caminosHallados = id => recetasDe(id).filter(r => caminoHallado(clave(r[0], r[1]))).length;
const domina = id => recetasDe(id).length > 1 && caminosHallados(id) === recetasDe(id).length;
function revisarMaestria(id) {
  if (domina(id)) avisoLogro("★ Maestría en " + E[id].n + ": encontraste sus " + recetasDe(id).length + " caminos.");
}
function revisarRutas(id) {
  for (const r of RUTAS) {
    if (!r.destinos.includes(id) || state.rutasHechas[r.id]) continue;
    if (r.destinos.every(descubierto)) {
      state.rutasHechas[r.id] = Date.now();
      setTimeout(() => abrirRutaCompleta(r), 300);
    }
  }
}

/* ================= IA: combinaciones fuera del núcleo ================= */
function resumen(id) {
  const d = E[id];
  const txt = d.myth ? "Es un mito. Se cree que: " + d.belief : (d.why || "");
  const primera = txt.split(/(?<=\.)\s/)[0].slice(0, 280);
  return d.n + " (" + FAMILIAS[d.f] + (d.myth ? ", mito" : "") + "). " + primera;
}
function promptIA(a, b) {
  const existentes = Object.keys(E).filter(id => !rechazada(id)).map(id => id + " = " + E[id].e + " " + E[id].n + (E[id].myth ? " (mito)" : "")).join("\n");
  return [
    "Eres el motor de recetas de \"Alquimia Docente\", un juego serio de combinación para docentes de educación superior. La persona juntó dos fichas y tú decides qué resulta. Cada resultado se le muestra como una ficha de estudio, así que debe ser verídico y defendible ante un especialista en educación.",
    "",
    "FICHA A: " + resumen(a),
    "FICHA B: " + resumen(b),
    a === b ? "(Es la misma ficha dos veces: piensa qué concepto reconocido surge de combinar esa idea consigo misma.)" : "",
    "",
    "Qué puede resultar: un concepto, teoría, modelo, marco, metodología, técnica, modalidad, tipo de evaluación, hallazgo de investigación o práctica reconocida en pedagogía, didáctica, psicología educativa, tecnología educativa, evaluación, diseño curricular o docencia universitaria, cuya relación con AMBAS fichas sea directa y conocida en la literatura.",
    "",
    "Reglas:",
    "1. Si la relación es forzada, ambigua o inventada, responde \"ninguna\". Es mejor \"ninguna\" que un resultado dudoso.",
    "2. Si el resultado correcto ya está en la lista de fichas existentes, responde \"existente\" con su id. El resultado nunca puede ser la ficha A ni la ficha B.",
    "3. Si una ficha es un mito y la otra es Práctica reflexiva, el resultado es el concepto respaldado por evidencia que reemplaza a ese mito.",
    "4. Si la combinación lleva a una creencia popular en educación que la investigación no respalda (un mito o neuromito documentado), responde \"mito\".",
    "5. Fuentes: de 1 a 3 referencias en formato APA 7 que estés seguro de que existen tal cual. Prefiere obras fundacionales y muy citadas. Si no recuerdas con certeza el volumen, el número o las páginas, omite esos datos; nunca inventes DOI, páginas ni títulos. Si no puedes dar ni una fuente segura, responde \"ninguna\".",
    "6. Cifras: úsalas solo si son ampliamente conocidas y estás seguro de ellas; si no, describe el hallazgo sin números. No incluyas citas textuales.",
    "7. Escribe en español latinoamericano neutro, tuteando y sin voseo. Nunca uses la raya (\u2014).",
    "8. \"porque\" explica en 2 a 4 oraciones por qué A + B da este resultado y qué dice la investigación. \"aula\" es un ejemplo concreto en una clase universitaria, en una oración. \"pista\" describe el concepto en una frase sin nombrarlo.",
    "9. \"familia\" es una de: fund (conocimiento docente), apr (cómo se aprende), met (metodologías), tec (integración tecnológica), mod (modalidades), eva (evaluación), dis (diseño de la enseñanza).",
    "10. \"nombre\" tiene como máximo 5 palabras y es el nombre con que se conoce en la literatura en español. \"emoji\" es un solo emoji que no use ninguna ficha de la lista.",
    "",
    "Ejemplos de recetas del juego, para calibrar el criterio:",
    "Estudiante + Pedagogía = Aprendizaje activo",
    "Contenido + Pedagogía = Conocimiento pedagógico del contenido",
    "Evaluación + Retroalimentación = Evaluación formativa",
    "Tecnología + Espacio = Entorno virtual",
    "Estudiante + Tecnología = Nativos digitales (mito)",
    "Estilos de aprendizaje (mito) + Práctica reflexiva = Diseño Universal para el Aprendizaje",
    "",
    "Fichas existentes (id = emoji nombre):",
    existentes,
    "",
    "Responde solo con un objeto JSON, con una de estas formas:",
    "{\"tipo\":\"ninguna\",\"motivo\":\"una oración que explique por qué no hay una relación directa\"}",
    "{\"tipo\":\"existente\",\"id\":\"id de la lista\"}",
    "{\"tipo\":\"nueva\",\"nombre\":\"...\",\"emoji\":\"...\",\"familia\":\"...\",\"porque\":\"...\",\"aula\":\"...\",\"pista\":\"...\",\"fuentes\":[\"...\"]}",
    "{\"tipo\":\"mito\",\"nombre\":\"...\",\"emoji\":\"...\",\"creencia\":\"lo que se cree\",\"evidencia\":\"lo que dice la investigación\",\"fuentes\":[\"...\"]}"
  ].filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n");
}
function interpretarIA(o, ida, idb) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const tipo = String(o.tipo || "");
  const NINGUNA = "no hay un concepto distinto de las dos fichas que las una de forma directa.";
  const DESCARTADA = "una propuesta anterior para esta combinación se descartó en la revisión docente.";
  if (tipo === "ninguna") return { none: true, motivo: sinRaya(o.motivo).slice(0, 280) || NINGUNA };
  const valido = id => E[id] && E[id].f !== "base" && id !== ida && id !== idb;
  if (tipo === "existente") {
    const id = String(o.id || "");
    if (rechazada(id)) return { none: true, motivo: DESCARTADA };
    return valido(id) ? { res: id } : { none: true, motivo: NINGUNA };
  }
  if (tipo !== "nueva" && tipo !== "mito") return null;
  const n = sinRaya(o.nombre).slice(0, 70);
  if (!n) return null;
  const igual = Object.keys(E).find(id => norm(E[id].n) === norm(n));
  if (igual) {
    if (rechazada(igual)) return { none: true, motivo: DESCARTADA };
    return valido(igual) ? { res: igual } : { none: true, motivo: NINGUNA };
  }
  const id = "ia-" + norm(n).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  let emoji = String(o.emoji || "").trim();
  if (Object.values(E).some(f => f.e === emoji)) emoji = "✨";
  const fuentes = Array.isArray(o.fuentes) ? o.fuentes : [];
  const creada = Date.now();
  const def = tipo === "mito"
    ? { n, e: emoji, f: "mito", belief: o.creencia, evidence: o.evidencia, refs: fuentes, via: [ida, idb], creada }
    : { n, e: emoji, f: o.familia, why: o.porque, uni: o.aula, pista: o.pista, refs: fuentes, via: [ida, idb], creada };
  if (!registrarCartaIA(id, def)) return null;
  state.ia.cartas[id] = def;
  if (NUBE.db && !IA.cartas[id]) {
    IA.cartas[id] = def;
    NUBE.db.doc("cartas/" + id).set(Object.assign({}, def)).catch(() => {});
  }
  return { res: id };
}
function guardarCombo(k, r) {
  const doc = r.none ? { none: true, motivo: r.motivo } : { res: r.res };
  state.ia.combos[k] = doc;
  if (NUBE.db) NUBE.db.doc("combos/" + k).set(Object.assign({ creada: Date.now() }, doc)).catch(() => {});
}
function crearEspera(cx, cy) {
  const el = document.createElement("div");
  el.className = "tile pensando";
  el.setAttribute("role", "status");
  el.innerHTML = '<span class="spin" aria-hidden="true"></span><span>Claude está combinando</span>';
  const cancelar = document.createElement("button");
  cancelar.type = "button"; cancelar.className = "cancelar"; cancelar.textContent = "×";
  cancelar.setAttribute("aria-label", "Cancelar la consulta");
  el.appendChild(cancelar);
  const pred = document.createElement("label");
  pred.className = "prediccion";
  pred.innerHTML = "<span>Mientras tanto: ¿qué crees que saldrá?</span>";
  const inp = document.createElement("input");
  inp.type = "text"; inp.maxLength = 80; inp.placeholder = "Tu predicción";
  inp.id = "pred-" + Date.now();
  pred.appendChild(inp);
  el.appendChild(pred);
  el.addEventListener("pointerdown", e => e.stopPropagation());
  el.style.zIndex = ++zTop;
  mesa.appendChild(el);
  el.style.left = Math.max(4, Math.min(mesa.clientWidth - el.offsetWidth - 4, cx - el.offsetWidth / 2)) + "px";
  el.style.top = Math.max(4, Math.min(mesa.clientHeight - el.offsetHeight - 4, cy - el.offsetHeight / 2)) + "px";
  const ctl = new AbortController();
  cancelar.addEventListener("click", () => ctl.abort());
  return { ctl, quitar: () => el.remove(), prediccion: () => inp.value.trim().slice(0, 80) };
}
async function consultarIA(ida, idb, k, cx, cy) {
  IA.enCurso.add(k);
  ocultarNota();
  guardar();
  const espera = crearEspera(cx, cy);
  let salida;
  try {
    salida = await IA.sample.json(promptIA(ida, idb), { modelTier: "default", signal: espera.ctl.signal });
  } catch (e) {
    espera.quitar(); IA.enCurso.delete(k);
    devolver(ida, idb, cx, cy);
    errorIA(e);
    return;
  }
  const pred = espera.prediccion();
  espera.quitar(); IA.enCurso.delete(k);
  const r = interpretarIA(salida, ida, idb);
  if (!r) { devolver(ida, idb, cx, cy); aviso("La respuesta de Claude no tenía el formato esperado. Vuelve a intentarlo."); return; }
  guardarCombo(k, r);
  if (r.none) {
    devolver(ida, idb, cx, cy);
    aviso(nombreCorto(ida) + " + " + nombreCorto(idb) + ": " + r.motivo + (pred ? " (Tu predicción: " + pred + ".)" : ""));
    return;
  }
  concretar(ida, idb, r.res, cx, cy, null, pred);
  renderLista(r.res);
}
function errorIA(e) {
  const code = e && e.code;
  if (code === "cancelled") return;
  if (["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"].includes(code)) {
    IA.apagada = true; renderEstadoIA();
    aviso("La IA no está disponible para ti en esta página. Siguen funcionando las recetas verificadas.");
    return;
  }
  if (code === "rate_limited") { aviso("Hiciste muchas consultas seguidas. Espera un momento y vuelve a intentarlo."); return; }
  if (code === "session_expired") { aviso("Tu sesión expiró. Vuelve a iniciar sesión en Claude para usar la IA."); return; }
  if (code === "refused") { aviso("Claude no quiso responder esta combinación. Prueba otra pareja."); return; }
  if (code === "invalid_json" || code === "empty_completion") { aviso("La respuesta de Claude no tenía el formato esperado. Vuelve a intentarlo."); return; }
  aviso("No se pudo consultar a Claude. Vuelve a intentarlo en un momento.");
}
function renderEstadoIA() {
  const el = $("iaEstado");
  const activa = IA.sample && !IA.apagada;
  el.hidden = false;
  el.className = "ia-estado " + (activa ? "on" : "off");
  el.textContent = activa ? "IA activa" : "Solo núcleo verificado";
  el.title = activa
    ? "Si una combinación no está en el núcleo verificado ni en el preanálisis, Claude propone el resultado."
    : "Las combinaciones fuera del núcleo verificado no generan fichas nuevas en esta vista.";
}

/* ================= Caja de fichas ================= */
let ignorarClickHasta = 0;
const esMovil = () => matchMedia("(max-width: 860px)").matches;
function chipDe(id, tag = "button") {
  const el = document.createElement(tag);
  el.className = "chip";
  if (tag === "button") el.type = "button";
  contenidoFicha(el, id);
  if (domina(id)) el.classList.add("maestria");
  return el;
}
function lugarLibre() {
  const W = mesa.clientWidth, H = mesa.clientHeight;
  let p = { x: W / 2, y: H / 2 };
  for (let i = 0; i < 30; i++) {
    const x = W * (0.18 + Math.random() * 0.64), y = H * (0.2 + Math.random() * 0.6);
    p = { x, y };
    if (!fichas.some(o => Math.abs(o.x + o.el.offsetWidth / 2 - x) < 110 && Math.abs(o.y + o.el.offsetHeight / 2 - y) < 44)) break;
  }
  return p;
}
function llevarAMesa(id) {
  const p = lugarLibre();
  agregarFicha(id, p.x, p.y, { pop: true, centrar: true });
  guardar();
}
function renderLista(nuevo) {
  const q = norm(buscar.value);
  lista.innerHTML = "";
  const ids = visibles().filter(id => !q || norm(E[id].n).includes(q));
  for (const id of ids) {
    const el = chipDe(id);
    el.dataset.id = id;
    el.setAttribute("aria-label", E[id].n + ": llevar a la mesa");
    el.addEventListener("click", () => { if (performance.now() < ignorarClickHasta) return; llevarAMesa(id); });
    el.addEventListener("pointerdown", e => arrastrarDesdeCaja(e, id, el));
    if (id === nuevo) el.classList.add("hint");
    lista.appendChild(el);
  }
  if (!ids.length) {
    const p = document.createElement("p"); p.className = "vacio";
    p.textContent = "Ninguna ficha coincide con la búsqueda.";
    lista.appendChild(p);
  }
  $("listaCount").textContent = visibles().length;
}
function arrastrarDesdeCaja(e, id, chip) {
  if (e.button !== 0) return;
  if (e.pointerType === "touch" && esMovil()) return;
  const sx = e.clientX, sy = e.clientY;
  let fantasma = null, obj = null;
  chip.setPointerCapture(e.pointerId);
  const enMesa = (cx, cy) => {
    const m = mesa.getBoundingClientRect();
    return cx >= m.left && cx <= m.right && cy >= m.top && cy <= m.bottom ? { x: cx - m.left, y: cy - m.top } : null;
  };
  const mover = ev => {
    if (!fantasma) {
      if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
      fantasma = document.createElement("div");
      fantasma.className = "tile ghost";
      contenidoFicha(fantasma, id);
      document.body.appendChild(fantasma);
    }
    fantasma.style.left = (ev.clientX - fantasma.offsetWidth / 2) + "px";
    fantasma.style.top = (ev.clientY - fantasma.offsetHeight / 2) + "px";
    const p = enMesa(ev.clientX, ev.clientY);
    const n = p ? objetivoEn(p.x, p.y, null) : null;
    if (n !== obj) { obj && obj.el.classList.remove("target"); obj = n; obj && obj.el.classList.add("target"); }
  };
  const soltar = ev => {
    chip.removeEventListener("pointermove", mover);
    chip.removeEventListener("pointerup", soltar);
    chip.removeEventListener("pointercancel", soltar);
    if (!fantasma) return;
    ignorarClickHasta = performance.now() + 350;
    fantasma.remove();
    obj && obj.el.classList.remove("target");
    const p = enMesa(ev.clientX, ev.clientY);
    if (!p || ev.type !== "pointerup") return;
    const t = agregarFicha(id, p.x, p.y, { centrar: true });
    if (obj) combinar(t, obj); else guardar();
  };
  chip.addEventListener("pointermove", mover);
  chip.addEventListener("pointerup", soltar);
  chip.addEventListener("pointercancel", soltar);
}
function renderStats() {
  const vis = visibles();
  const nucleo = vis.filter(id => NUCLEO.has(id)).length;
  $("count").textContent = vis.length;
  $("nucleo").textContent = nucleo + " de " + TODOS.length;
  $("bar").style.width = (100 * nucleo / TODOS.length) + "%";
  $("mythCount").textContent = vis.filter(id => E[id].myth).length;
  $("caminosCount").textContent = Object.keys(state.caminos).filter(k => RECETA.has(k)).length + " de " + RECETAS.length;
  const probar = Object.values(state.bitacora).filter(v => v === "probar").length;
  $("planCount").textContent = probar ? String(probar) : "";
}

/* ================= Destinos de la ruta activa ================= */
const rutaActiva = () => RUTAS.find(r => r.id === state.ruta) || null;
function renderDestinos() {
  const cont = $("destinos");
  cont.innerHTML = "";
  const r = rutaActiva();
  if (!r) {
    const s = document.createElement("span"); s.className = "sin-ruta";
    s.textContent = "Exploras sin ruta. Elige una para tener destinos y pistas que te guíen.";
    cont.appendChild(s);
  } else {
    const hechos = r.destinos.filter(descubierto).length;
    const tit = document.createElement("div"); tit.className = "ruta-tit";
    tit.innerHTML = '<span class="em" aria-hidden="true">' + esc(r.e) + "</span><div><b>" + esc(r.n) + "</b><small>" + hechos + " de " + r.destinos.length + " destinos</small></div>";
    cont.appendChild(tit);
    const pasos = document.createElement("div"); pasos.className = "pasos";
    let siguiente = r.destinos.find(d => !descubierto(d));
    r.destinos.forEach((d, i) => {
      const b = document.createElement("button");
      b.type = "button";
      const ok = descubierto(d), cumbre = i === r.destinos.length - 1;
      b.className = "paso f-" + E[d].f + (ok ? " logrado" : "") + (d === siguiente ? " siguiente" : "") + (cumbre ? " cumbre" : "");
      if (ok) {
        b.innerHTML = '<span class="em">' + esc(E[d].e) + '</span><span class="txt">' + esc(E[d].n) + "</span>";
        b.addEventListener("click", () => abrirFicha(d));
      } else {
        b.innerHTML = '<span class="em">' + (cumbre ? "★" : "?") + '</span><span class="txt">' + (d === siguiente ? esc(E[d].pista || "Próximo destino") : (cumbre ? "Cumbre" : "")) + "</span>";
        b.title = E[d].pista || "";
        b.addEventListener("click", () => aviso("Destino por descubrir: " + (E[d].pista || "sigue combinando.")));
      }
      pasos.appendChild(b);
    });
    cont.appendChild(pasos);
  }
  const herr = document.createElement("div"); herr.className = "herr";
  herr.innerHTML = '<button class="btn small" type="button" data-a="pista">Pista</button><button class="btn small quiet" type="button" data-a="limpiar">Limpiar mesa</button>' + (r ? "" : '<button class="btn small primary" type="button" data-a="rutas">Elegir ruta</button>');
  herr.querySelector('[data-a="pista"]').addEventListener("click", darPista);
  herr.querySelector('[data-a="limpiar"]').addEventListener("click", () => { [...fichas].forEach(quitarFicha); guardar(); });
  const br = herr.querySelector('[data-a="rutas"]');
  if (br) br.addEventListener("click", () => irA("rutas"));
  cont.appendChild(herr);
}

/* ================= Pista ================= */
function caminoListo(obj, prof = 0, vistos = new Set()) {
  if (prof > 4 || vistos.has(obj)) return null;
  vistos.add(obj);
  const recs = recetasDe(obj);
  for (const [a, b] of recs) if (descubierto(a) && descubierto(b)) return { a, b, r: obj };
  for (const [a, b] of recs) {
    for (const falta of [a, b].filter(x => !descubierto(x))) {
      const sub = caminoListo(falta, prof + 1, vistos);
      if (sub) return sub;
    }
  }
  return null;
}
function resaltarChip(id) {
  if (buscar.value) { buscar.value = ""; renderLista(); }
  const chip = lista.querySelector('[data-id="' + id + '"]');
  if (chip) { chip.classList.remove("hint"); void chip.offsetWidth; chip.classList.add("hint"); chip.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
}
function darPista() {
  const r = rutaActiva();
  const objetivo = r && r.destinos.find(d => !descubierto(d));
  if (objetivo) {
    const c = caminoListo(objetivo);
    if (c) {
      const uno = Math.random() < 0.5 ? c.a : c.b;
      aviso(c.r === objetivo
        ? "Para tu próximo destino, prueba con " + nombreCorto(uno) + " y otra ficha."
        : "Antes de tu próximo destino necesitas otra ficha. Prueba con " + nombreCorto(uno) + " y otra ficha.");
      resaltarChip(uno);
      return;
    }
  }
  const posibles = RECETAS.filter(([a, b, x]) => !descubierto(x) && descubierto(a) && descubierto(b));
  if (!posibles.length) {
    aviso("Ya descubriste todo el núcleo verificado que está a tu alcance. Sigue combinando: Claude propondrá el resto.");
    return;
  }
  const [a, b] = posibles[Math.floor(Math.random() * posibles.length)];
  const uno = Math.random() < 0.5 ? a : b;
  aviso("Pista: prueba con " + nombreCorto(uno) + " y otra ficha.");
  resaltarChip(uno);
}

/* ================= Ficha de estudio ================= */
const cola = [];
let fichaAbierta = false, focoPrevio = null, fichaActual = null;

function chipHtml(id) {
  const d = E[id];
  if (!d) return "";
  return '<span class="chip f-' + d.f + (d.myth ? " is-myth" : "") + (d.ia ? " is-ia" : "") + '"><span class="em">' + esc(d.e) + '</span><span class="nm"><span class="hl">' + esc(d.n) + "</span></span></span>";
}
function formulaHtml(a, b, r) {
  if (!E[a] || !E[b]) return "";
  return chipHtml(a) + '<span class="op">+</span>' + chipHtml(b) + (r ? '<span class="op">=</span>' + chipHtml(r) : "");
}
const ETIQUETA_IA = {
  aprobada: '<span class="ia-ok">Revisada por docente</span>',
  comunidad: '<span class="ia-ok">Validada por la comunidad</span>',
  rechazada: '<span class="ia-no">Descartada</span>',
  cuestionada: '<span class="ia-no">Cuestionada por la comunidad</span>',
  pendiente: '<span class="ia-pend">Por verificar</span>'
};

function abrirFicha(id, opts = {}) {
  if (!E[id]) return;
  if (fichaAbierta && fichaActual !== id) { cola.push([id, opts]); return; }
  fichaAbierta = true; fichaActual = id;
  if (!opts.refresco) focoPrevio = document.activeElement;
  const d = E[id];
  const art = $("ficha");
  art.className = "ficha f-" + d.f + (d.myth ? " is-myth" : "") + (d.ia ? " is-ia" : "");
  if (opts.refresco) art.style.animation = "none"; else art.style.animation = "";

  let eyebrow = '<span class="fam">' + esc(FAMILIAS[d.f]) + "</span>";
  if (d.ia) eyebrow += '<span class="ia-sello">Generada con IA</span>' + ETIQUETA_IA[estadoIA(id)];
  if (opts.nuevo) eyebrow = '<span class="nuevo">' + (d.myth ? "Encontraste un mito" : "Nuevo descubrimiento") + "</span>" + eyebrow;
  if (opts.base) eyebrow = '<span class="nuevo">Nuevo elemento base desbloqueado</span>' + eyebrow;
  const r = rutaActiva();
  if (r && r.destinos.includes(id) && opts.nuevo) {
    eyebrow = '<span class="nuevo">🎯 Destino ' + (r.destinos.filter(descubierto).length) + " de " + r.destinos.length + " · " + esc(r.n) + "</span>" + eyebrow;
  }

  let formula = "";
  if (opts.via) formula = formulaHtml(opts.via[0], opts.via[1], id);
  else if (d.f === "base") formula = "<span>Elemento base: está disponible desde el inicio o se desbloquea al avanzar.</span>";
  else if (state.como[id]) formula = "<span>Tu receta:</span>" + formulaHtml(state.como[id][0], state.como[id][1]);
  else if (d.via) formula = "<span>Receta:</span>" + formulaHtml(d.via[0], d.via[1]);

  let cuerpo = "";
  const viaMito = (opts.via || state.como[id] || []).find(x => E[x] && E[x].myth);
  if (viaMito && !d.myth) cuerpo += '<p class="prediccion-box"><b>Desarmaste un mito.</b> «' + esc(E[viaMito].n) + "» no se sostiene; esto es lo que la evidencia sí respalda.</p>";
  if (d.ia && !["aprobada", "comunidad"].includes(estadoIA(id))) {
    cuerpo += '<p class="aviso-ia">Esta ficha la propuso Claude a partir de una combinación y todavía no la valida un docente. Contrasta las fuentes antes de usarla en clase.</p>';
  }
  if (d.myth) {
    cuerpo += "<section><h3>Lo que se cree</h3><p>" + esc(d.belief) + "</p></section>";
    cuerpo += "<section><h3>Lo que dice la evidencia</h3><p>" + esc(d.evidence) + "</p></section>";
  } else {
    cuerpo += "<section><h3>" + (d.f === "base" ? "Qué es" : "Por qué funciona") + "</h3><p>" + esc(d.why) + "</p></section>";
  }
  if (d.q) cuerpo += '<blockquote class="cita"><p>“' + esc(d.q.t) + '”</p><footer>' + esc(d.q.a) + "</footer></blockquote>";
  if (d.uni) cuerpo += '<section><h3>En el aula universitaria</h3><p class="nota">' + esc(d.uni) + "</p></section>";
  const via = opts.via || state.como[id];
  const pred = via && state.predicciones[clave(via[0], via[1])];
  if (pred) cuerpo += '<p class="prediccion-box"><b>Tu predicción:</b> ' + esc(pred) + "</p>";
  if (d.tip) cuerpo += '<p class="pista-txt"><b>Pista:</b> ' + esc(d.tip) + "</p>";

  const recs = recetasDe(id);
  if (recs.length) {
    const hallados = caminosHallados(id);
    let h = '<section><h3>Caminos <small>' + hallados + " de " + recs.length + " encontrados" + (domina(id) ? ' · <span class="maestria-sello">★ Maestría</span>' : "") + "</small></h3><div class=\"caminos\">";
    for (const [a, b, , nota] of recs) {
      if (caminoHallado(clave(a, b))) {
        h += '<div class="camino-item"><div class="formula">' + formulaHtml(a, b) + "</div>" + (nota ? "<p>" + esc(nota) + "</p>" : "") + "</div>";
      } else {
        h += '<div class="camino-item oculto"><div class="formula"><span class="ph">?</span><span class="op">+</span><span class="ph">?</span><span>Camino por descubrir</span></div></div>';
      }
    }
    cuerpo += h + "</div></section>";
  }

  if (d.f !== "base" && !d.myth) {
    const m = state.bitacora[id];
    const t = (v, txt) => '<button class="toggle" type="button" data-bit="' + v + '" aria-pressed="' + (m === v) + '">' + txt + "</button>";
    cuerpo += '<section><h3>¿Y en tu docencia?</h3><div class="bitacora">' + t("hago", "Ya lo hago") + t("probar", "Quiero probarlo") + t("noaplica", "No aplica a mi curso") + "</div></section>";
  }

  if (d.ia && NUBE.db && NUBE.uid) {
    const t = VOTOS.todos[id] || { pos: 0, neg: 0 };
    const mio = VOTOS.mios[id];
    cuerpo += '<section><h3>Validación docente</h3><div class="validar"><small>' + t.pos + (t.pos === 1 ? " docente dice" : " docentes dicen") + " que tiene sentido · " + t.neg + (t.neg === 1 ? " no se convence" : " no se convencen") + ". Con tres validaciones pasa a validada por la comunidad.</small>" +
      '<textarea id="motivoVoto" maxlength="240" placeholder="Opcional: ¿por qué? (por ejemplo, una fuente que falta o un matiz)">' + esc(mio && mio.m || "") + "</textarea>" +
      '<div class="fila"><button class="toggle" type="button" data-voto="1" aria-pressed="' + (mio && mio.v === 1) + '">Tiene sentido</button><button class="toggle" type="button" data-voto="-1" aria-pressed="' + (mio && mio.v === -1) + '">No me convence</button></div></div></section>';
  }

  if (d.refs && d.refs.length) cuerpo += '<section><h3>Fuentes</h3><ol class="fuentes">' + d.refs.map(k => "<li>" + refHtml(REFS[k] || k) + "</li>").join("") + "</ol></section>";

  const est = d.ia ? estadoIA(id) : "";
  const curar = d.ia && NUBE.curador && NUBE.db;
  const acciones = (curar
    ? (est !== "rechazada" ? '<button class="btn" type="button" data-curar="rechazada">Descartar</button>' : "") +
      (est !== "aprobada" ? '<button class="btn" type="button" data-curar="aprobada">' + (est === "rechazada" ? "Restaurar y aprobar" : "Aprobar ficha") + "</button>" : "")
    : "") + '<button class="btn primary" type="button" data-cerrar>Seguir explorando</button>';

  art.innerHTML =
    '<div class="ficha-head">' +
      (d.myth ? '<div class="sello" aria-hidden="true">MITO</div>' : "") +
      '<button class="cerrar" type="button" aria-label="Cerrar ficha">×</button>' +
      '<div class="ficha-eyebrow">' + eyebrow + "</div>" +
      '<h2 id="fichaTitulo"><span class="em">' + esc(d.e) + "</span><span>" + esc(d.n) + "</span></h2>" +
      (formula ? '<div class="formula">' + formula + "</div>" : "") +
    "</div>" +
    '<div class="ficha-body">' + cuerpo + "</div>" +
    '<div class="ficha-actions">' + acciones + "</div>";
  art.querySelector(".cerrar").addEventListener("click", cerrarFicha);
  art.querySelector("[data-cerrar]").addEventListener("click", cerrarFicha);
  art.querySelectorAll("[data-curar]").forEach(b => b.addEventListener("click", () => curarFicha(id, b.dataset.curar)));
  art.querySelectorAll("[data-bit]").forEach(b => b.addEventListener("click", () => {
    state.bitacora[id] = state.bitacora[id] === b.dataset.bit ? undefined : b.dataset.bit;
    if (!state.bitacora[id]) delete state.bitacora[id];
    guardarBitacora(); renderStats();
    art.querySelectorAll("[data-bit]").forEach(x => x.setAttribute("aria-pressed", String(state.bitacora[id] === x.dataset.bit)));
    if (b.dataset.bit === "probar" && state.bitacora[id]) aviso("Agregado a tu plan: lo verás en Mi plan.");
  }));
  art.querySelectorAll("[data-voto]").forEach(b => b.addEventListener("click", () => votar(id, Number(b.dataset.voto), ($("motivoVoto") || {}).value || "")));
  $("fichaOv").hidden = false;
  if (!opts.refresco) art.scrollTop = 0;
  art.querySelector("[data-cerrar]").focus({ preventScroll: true });
}
function cerrarFicha() {
  $("fichaOv").hidden = true;
  fichaAbierta = false; fichaActual = null;
  if (cola.length) { const [i, o] = cola.shift(); abrirFicha(i, o); return; }
  if (focoPrevio && focoPrevio.focus) focoPrevio.focus({ preventScroll: true });
}
$("fichaOv").addEventListener("click", e => { if (e.target.id === "fichaOv") cerrarFicha(); });

async function curarFicha(id, estado) {
  try {
    await NUBE.db.doc("curaduria/" + id).set({ estado, fecha: Date.now() });
    IA.curaduria[id] = estado;
    aviso(estado === "aprobada" ? "Ficha aprobada: ahora aparece como revisada para todos." : "Ficha descartada: ya no aparecerá en el juego.");
    cerrarFicha();
    if (estado === "rechazada") fichas.filter(t => t.id === id).forEach(quitarFicha);
    renderLista(); renderStats(); guardar();
    if (vistaActual === "cuaderno") renderCuaderno();
  } catch (e) { aviso("No se pudo guardar la revisión. Vuelve a intentarlo."); }
}
async function votar(id, v, motivo) {
  const previo = VOTOS.mios[id];
  if (previo && previo.v === v && previo.m === motivo.trim()) { delete VOTOS.mios[id]; }
  else VOTOS.mios[id] = { v, m: motivo.trim().slice(0, 240), t: Date.now() };
  try {
    await NUBE.db.doc("votos/" + NUBE.uid).set({ fichas: VOTOS.mios });
    aviso(VOTOS.mios[id] ? "Gracias: tu validación cuenta para toda la comunidad." : "Quitaste tu validación.");
  } catch (e) { aviso("No se pudo guardar tu validación. Vuelve a intentarlo."); }
  recontarVotos();
  if (fichaActual === id) abrirFicha(id, { refresco: true });
}

/* ================= Avisos y logros ================= */
function aviso(txt, clase) {
  const t = document.createElement("div");
  t.className = "toast" + (clase ? " " + clase : "");
  if (typeof txt === "string") t.textContent = txt; else t.appendChild(txt);
  $("toasts").appendChild(t);
  setTimeout(() => t.remove(), clase === "camino" ? 7000 : 4200);
  const todos = $("toasts").children;
  if (todos.length > 3) todos[0].remove();
}
function avisoCamino(rec) {
  const [a, b, r, nota] = rec;
  const frag = document.createDocumentFragment();
  const tit = document.createElement("b");
  tit.textContent = "Nuevo camino hacia " + E[r].n + " (" + caminosHallados(r) + " de " + recetasDe(r).length + ")";
  const p = document.createElement("p");
  p.textContent = E[a].e + " " + E[a].n + " + " + E[b].e + " " + E[b].n + (nota ? ". " + nota : "");
  frag.append(tit, p);
  aviso(frag, "camino");
}
function avisoLogro(txt) { aviso(txt, "logro"); }
function ocultarNota() { $("mesaNota").hidden = true; }

/* ================= Vistas ================= */
let vistaActual = "lab";
const VISTAS = { lab: "vLab", rutas: "vRutas", mapa: "vMapa", cuaderno: "vCuaderno", plan: "vPlan" };
function irA(v) {
  vistaActual = v;
  for (const [k, id] of Object.entries(VISTAS)) $(id).hidden = k !== v;
  document.querySelectorAll(".tab[data-vista]").forEach(t => t.setAttribute("aria-selected", String(t.dataset.vista === v)));
  if (v === "rutas") renderRutas();
  if (v === "cuaderno") renderCuaderno();
  if (v === "plan") renderPlan();
  if (v === "mapa") { cieloMapa.iniciar(); } else cieloMapa.detener();
  if (v === "lab") fichas.forEach(acotar);
}
document.querySelectorAll(".tab[data-vista]").forEach(t => t.addEventListener("click", () => irA(t.dataset.vista)));

/* Rutas */
function renderRutas() {
  const g = $("rutasGrid");
  g.innerHTML = "";
  for (const r of RUTAS) {
    const hechos = r.destinos.filter(descubierto).length;
    const caminos = r.destinos.reduce((s, d) => s + caminosHallados(d), 0);
    const totalCam = r.destinos.reduce((s, d) => s + recetasDe(d).length, 0);
    const card = document.createElement("article");
    card.className = "ruta-card" + (state.ruta === r.id ? " activa" : "");
    const puntos = r.destinos.map((d, i) => {
      const ok = descubierto(d), cumbre = i === r.destinos.length - 1;
      return '<span class="punto f-' + E[d].f + (ok ? " ok" : "") + (cumbre ? " cumbre" : "") + '" title="' + esc(ok ? E[d].n : (E[d].pista || "Por descubrir")) + '">' + (ok ? esc(E[d].e) : (cumbre ? "★" : "")) + "</span>";
    }).join("");
    card.innerHTML = (state.rutasHechas[r.id] ? '<span class="completa">Completada</span>' : "") +
      '<div class="cab"><span class="em" aria-hidden="true">' + esc(r.e) + "</span><h3>" + esc(r.n) + "</h3></div>" +
      "<p>" + esc(r.d) + "</p>" +
      '<div class="puntos">' + puntos + "</div>" +
      '<div class="pie"><small>' + hechos + " de " + r.destinos.length + " destinos · " + caminos + " de " + totalCam + " caminos</small></div>";
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn small" + (state.ruta === r.id ? "" : " primary");
    b.textContent = state.ruta === r.id ? "Ruta activa: ir a la mesa" : (hechos ? "Seguir esta ruta" : "Empezar esta ruta");
    b.addEventListener("click", () => { state.ruta = r.id; guardar(); renderDestinos(); irA("lab"); aviso("Ruta activa: " + r.n + ". Tus destinos aparecen sobre la mesa."); });
    card.querySelector(".pie").appendChild(b);
    g.appendChild(card);
  }
}
$("btnLibre").addEventListener("click", () => { state.ruta = null; guardar(); renderDestinos(); irA("lab"); });

function abrirRutaCompleta(r) {
  const caminos = r.destinos.reduce((s, d) => s + caminosHallados(d), 0);
  const totalCam = r.destinos.reduce((s, d) => s + recetasDe(d).length, 0);
  abrirPanel(
    '<h2 id="panelTitulo">' + esc(r.e) + " Completaste la ruta</h2>" +
    "<p><b>" + esc(r.n) + "</b>: llegaste a sus " + r.destinos.length + " destinos y encontraste " + caminos + " de " + totalCam + " caminos. Cada camino que falta muestra otra faceta de un concepto que ya conoces.</p>" +
    '<div class="logro-lista">' + r.destinos.map(chipHtml).join("") + "</div>" +
    "<p>Revisa Mi plan: marca en cada ficha si ya lo haces o quieres probarlo, y tendrás un plan concreto para tu curso.</p>" +
    '<div class="row"><button class="btn" type="button" data-p="rutas">Elegir otra ruta</button><button class="btn primary" type="button" data-p="plan">Ver mi plan</button></div>',
    { rutas: () => { cerrarPanel(); irA("rutas"); }, plan: () => { cerrarPanel(); irA("plan"); } }
  );
}

/* Cuaderno */
function renderCuaderno() {
  const cont = $("cuadernoCuerpo");
  cont.innerHTML = "";
  for (const f of ORDEN_FAMILIAS) {
    const ids = TODOS.filter(id => E[id].f === f);
    const hechos = ids.filter(descubierto);
    const sec = document.createElement("section");
    sec.className = "familia f-" + f;
    sec.innerHTML = '<h3><span class="fam">' + esc(FAMILIAS[f]) + "</span><small>" + hechos.length + " de " + ids.length + "</small></h3>";
    const fila = document.createElement("div"); fila.className = "fila";
    for (const id of ids) {
      if (descubierto(id)) {
        const el = chipDe(id);
        el.addEventListener("click", () => abrirFicha(id));
        fila.appendChild(el);
      } else {
        const ph = document.createElement("span"); ph.className = "ph"; ph.textContent = "?";
        ph.title = E[id].pista || "Ficha por descubrir";
        fila.appendChild(ph);
      }
    }
    sec.appendChild(fila);
    cont.appendChild(sec);
  }
  const verTodas = NUBE.curador || REVISION;
  const iaIds = Object.keys(E).filter(id => E[id].ia && (verTodas ? true : descubierto(id) && !rechazada(id)));
  if (iaIds.length) {
    const pend = iaIds.filter(id => estadoIA(id) === "pendiente").length;
    const sec = document.createElement("section");
    sec.className = "familia f-ia";
    sec.innerHTML = '<h3><span class="fam">Generadas con IA</span><small>' + iaIds.length + (pend ? " · " + pend + " por verificar" : "") + "</small></h3>" +
      (NUBE.curador ? '<p class="nota-curador">Abre cada ficha para aprobarla o descartarla. Las validaciones de la comunidad aparecen en cada ficha.</p>' : '<p class="nota-curador">Fichas que Claude propuso a partir de combinaciones fuera del núcleo. Puedes validarlas desde cada ficha.</p>');
    const fila = document.createElement("div"); fila.className = "fila";
    for (const id of iaIds) {
      const el = chipDe(id);
      el.classList.add("est-" + estadoIA(id));
      el.addEventListener("click", () => abrirFicha(id));
      fila.appendChild(el);
    }
    sec.appendChild(fila);
    cont.appendChild(sec);
  }
}

/* Mi plan */
function itemsPlan(v) { return Object.keys(state.bitacora).filter(id => state.bitacora[id] === v && E[id]); }
function textoPlan() {
  const fecha = new Date().toLocaleDateString("es-CL");
  const probar = itemsPlan("probar"), hago = itemsPlan("hago");
  let t = "# Mi plan de desarrollo docente\n\nGenerado en Alquimia Docente el " + fecha + ".\n\n## Quiero probar\n";
  t += probar.length ? probar.map(id => "- **" + E[id].n + "**" + (E[id].uni ? ". Primer paso: " + E[id].uni : "")).join("\n") : "- (todavía nada marcado)";
  t += "\n\n## Ya lo hago\n" + (hago.length ? hago.map(id => "- " + E[id].n).join("\n") : "- (todavía nada marcado)");
  const lecturas = [...new Set(probar.flatMap(id => (E[id].refs || []).map(k => REFS[k] || k)))];
  if (lecturas.length) t += "\n\n## Lecturas para profundizar\n" + lecturas.map(x => "- " + x.replace(/_/g, "")).join("\n");
  return t + "\n";
}
function renderPlan() {
  const p = $("planPagina");
  const probar = itemsPlan("probar"), hago = itemsPlan("hago"), noap = itemsPlan("noaplica");
  const maestrias = TODOS.filter(domina).length;
  const rutasOk = Object.keys(state.rutasHechas).length;
  const item = (id, extra) => '<div class="plan-item f-' + E[id].f + '"><b data-abrir="' + esc(id) + '"><span class="em">' + esc(E[id].e) + '</span><span class="hl">' + esc(E[id].n) + "</span></b>" + (extra ? "<span>" + esc(extra) + "</span>" : "") + "</div>";
  p.innerHTML =
    "<header><h2>Mi plan de desarrollo docente</h2><p>Se arma con lo que marcas en cada ficha. Lo que quieres probar viene con un primer paso concreto para tu curso universitario y lecturas para profundizar.</p></header>" +
    '<div class="plan-resumen"><div class="dato"><b>' + visibles().length + "</b><span>fichas descubiertas</span></div>" +
    '<div class="dato"><b>' + Object.keys(state.caminos).filter(k => RECETA.has(k)).length + "</b><span>caminos encontrados</span></div>" +
    '<div class="dato"><b>' + maestrias + "</b><span>maestrías</span></div>" +
    '<div class="dato"><b>' + rutasOk + " de " + RUTAS.length + "</b><span>rutas completadas</span></div></div>" +
    '<div class="plan-grid">' +
      '<section class="plan-col"><h3>Quiero probarlo</h3>' + (probar.length ? probar.map(id => item(id, E[id].uni ? "Primer paso: " + E[id].uni : "")).join("") : "<p>Marca “Quiero probarlo” en las fichas que te interese llevar a tu curso.</p>") + "</section>" +
      '<section class="plan-col"><h3>Ya lo hago</h3>' + (hago.length ? hago.map(id => item(id)).join("") : "<p>Marca “Ya lo hago” en lo que ya forma parte de tu docencia: son tus fortalezas.</p>") + "</section>" +
      (noap.length ? '<section class="plan-col"><h3>No aplica a mi curso</h3>' + noap.map(id => item(id)).join("") + "</section>" : "") +
    "</div>" +
    '<div class="plan-acciones"><button class="btn primary" type="button" id="planCopiar">Copiar plan</button>' +
    (NUBE.downloads ? '<button class="btn" type="button" id="planBajar">Descargar plan (.md)</button>' : "") +
    '<button class="btn quiet" type="button" id="planReiniciar">Empezar de cero</button></div>';
  p.querySelectorAll("[data-abrir]").forEach(b => b.addEventListener("click", () => abrirFicha(b.dataset.abrir)));
  $("planCopiar").addEventListener("click", () => {
    const txt = textoPlan();
    navigator.clipboard.writeText(txt).then(() => aviso("Plan copiado: pégalo donde quieras."), () => aviso("No se pudo copiar automáticamente. Usa Descargar plan."));
  });
  const bajar = $("planBajar");
  if (bajar) bajar.addEventListener("click", async () => {
    try { await NUBE.downloads.save({ filename: "mi-plan-docente.md", data: textoPlan() }); }
    catch (e) { if (e && e.code !== "declined") aviso("No se pudo descargar el plan. Usa Copiar plan."); }
  });
  $("planReiniciar").addEventListener("click", pedirReinicio);
}

/* ================= Constelación ================= */
function posicion(id) {
  const f = E[id];
  if (typeof f.x === "number") return f;
  const a = DATOS.anclas[f.f] || { x: 0, y: 0 };
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  const ang = (h % 360) * Math.PI / 180, rad = 90 + (Math.abs(h) % 120);
  f.x = Math.round(a.x + Math.cos(ang) * rad); f.y = Math.round(a.y + Math.sin(ang) * rad);
  return f;
}
class Cielo {
  constructor(canvas, tip, fuente) {
    this.cv = canvas; this.ctx = canvas.getContext("2d"); this.tip = tip; this.fuente = fuente;
    this.v = { x: 0, y: 0, k: .6 }; this.activo = false; this.hover = null; this.punteros = new Map(); this.ajustado = false;
    let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    this.fondo = Array.from({ length: 260 }, () => ({ x: r(), y: r(), a: .15 + r() * .5, p: r() * 6.28, z: r() < .1 ? 1.4 : .8 }));
    this.eventos();
  }
  iniciar() {
    this.activo = true; this.medir();
    if (!this.ajustado) { this.centrar(); this.ajustado = true; }
    const paso = t => { if (!this.activo) return; this.dibujar(t); requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  }
  detener() { this.activo = false; }
  medir() {
    const r = this.cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = r.width; this.H = r.height;
    this.cv.width = Math.max(1, r.width * dpr); this.cv.height = Math.max(1, r.height * dpr);
    this.dpr = dpr;
  }
  centrar() {
    const ids = Object.keys(E);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const id of ids) { const p = posicion(id); x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
    for (const a of Object.values(DATOS.anclas)) { x0 = Math.min(x0, a.x * 1.3); x1 = Math.max(x1, a.x * 1.3); y0 = Math.min(y0, a.y * 1.3 - 20); y1 = Math.max(y1, a.y * 1.3 + 30); }
    const k = Math.min((this.W - (this.W < 600 ? 40 : 170)) / (x1 - x0), (this.H - 150) / (y1 - y0));
    this.v = { k: Math.max(.09, Math.min(1.6, k)), x: -(x0 + x1) / 2, y: -(y0 + y1) / 2 + 10 };
  }
  aPantalla(p) { return { x: this.W / 2 + (p.x + this.v.x) * this.v.k, y: this.H / 2 + (p.y + this.v.y) * this.v.k }; }
  zoom(f, cx = this.W / 2, cy = this.H / 2) {
    const k2 = Math.max(.09, Math.min(3, this.v.k * f));
    const wx = (cx - this.W / 2) / this.v.k - this.v.x, wy = (cy - this.H / 2) / this.v.k - this.v.y;
    this.v.k = k2;
    this.v.x = (cx - this.W / 2) / k2 - wx; this.v.y = (cy - this.H / 2) / k2 - wy;
  }
  cercano(mx, my) {
    const d = this.fuente();
    let mejor = null, md = 14;
    for (const id of Object.keys(E)) {
      if (rechazada(id)) continue;
      const p = this.aPantalla(posicion(id));
      const dist = Math.hypot(p.x - mx, p.y - my);
      if (dist < md && (d.peso(id) > 0 || this.v.k > .5)) { md = dist; mejor = id; }
    }
    return mejor;
  }
  eventos() {
    const cv = this.cv;
    let arrastre = null, movido = false, pinza = null;
    cv.addEventListener("pointerdown", e => {
      cv.setPointerCapture(e.pointerId);
      this.punteros.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (this.punteros.size === 2) { const [a, b] = [...this.punteros.values()]; pinza = Math.hypot(a.x - b.x, a.y - b.y); arrastre = null; }
      else { arrastre = { x: e.offsetX, y: e.offsetY, vx: this.v.x, vy: this.v.y }; movido = false; cv.classList.add("arrastrando"); }
    });
    cv.addEventListener("pointermove", e => {
      if (this.punteros.has(e.pointerId)) this.punteros.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (this.punteros.size === 2 && pinza) {
        const [a, b] = [...this.punteros.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        this.zoom(d / pinza, (a.x + b.x) / 2, (a.y + b.y) / 2); pinza = d; return;
      }
      if (arrastre) {
        const dx = e.offsetX - arrastre.x, dy = e.offsetY - arrastre.y;
        if (Math.hypot(dx, dy) > 4) movido = true;
        this.v.x = arrastre.vx + dx / this.v.k; this.v.y = arrastre.vy + dy / this.v.k;
        return;
      }
      this.hover = this.cercano(e.offsetX, e.offsetY);
      this.mostrarTip(e.offsetX, e.offsetY);
    });
    const fin = e => {
      this.punteros.delete(e.pointerId);
      if (this.punteros.size < 2) pinza = null;
      cv.classList.remove("arrastrando");
      if (arrastre && !movido && e.type === "pointerup") {
        const id = this.cercano(e.offsetX, e.offsetY);
        if (id) {
          if (this.fuente().peso(id) > 0 && descubierto(id)) abrirFicha(id);
          else aviso(E[id].pista ? "Por descubrir: " + E[id].pista : "Ficha por descubrir.");
        }
      }
      arrastre = null;
    };
    cv.addEventListener("pointerup", fin);
    cv.addEventListener("pointercancel", fin);
    cv.addEventListener("pointerleave", () => { this.hover = null; this.tip.hidden = true; });
    cv.addEventListener("wheel", e => { e.preventDefault(); this.zoom(Math.exp(-e.deltaY * .0015), e.offsetX, e.offsetY); }, { passive: false });
    window.addEventListener("resize", () => { if (this.activo) this.medir(); });
  }
  mostrarTip(mx, my) {
    const id = this.hover;
    if (!id) { this.tip.hidden = true; return; }
    const d = this.fuente(), w = d.peso(id);
    this.tip.hidden = false;
    this.tip.style.left = mx + "px"; this.tip.style.top = my + "px";
    if (w > 0) this.tip.innerHTML = esc(E[id].e + " " + E[id].n) + "<small>" + esc(FAMILIAS[E[id].f]) + (d.etiqueta ? " · " + esc(d.etiqueta(id)) : "") + "</small>";
    else this.tip.innerHTML = "Por descubrir<small>" + esc(E[id].pista || FAMILIAS[E[id].f]) + "</small>";
  }
  dibujar(t) {
    const { ctx, W, H, dpr } = this;
    if (!W || !H) { this.medir(); return; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createRadialGradient(W * .5, H * .45, 40, W * .5, H * .5, Math.max(W, H) * .8);
    g.addColorStop(0, "#131c3a"); g.addColorStop(1, "#060914");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const s of this.fondo) {
      const px = ((s.x * W + this.v.x * .04 * this.v.k) % W + W) % W, py = ((s.y * H + this.v.y * .04 * this.v.k) % H + H) % H;
      ctx.globalAlpha = s.a * (.7 + .3 * Math.sin(t / 1400 + s.p));
      ctx.fillStyle = "#cdd6ff"; ctx.fillRect(px, py, s.z, s.z);
    }
    ctx.globalAlpha = 1;
    const d = this.fuente();
    const k = this.v.k;
    // nebulosas por familia
    for (const [f, a] of Object.entries(DATOS.anclas)) {
      if (f === "base") continue;
      const p = this.aPantalla(a), r = 260 * k;
      const ng = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      ng.addColorStop(0, COLOR_CIELO[f] + "1c"); ng.addColorStop(1, COLOR_CIELO[f] + "00");
      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.283); ctx.fill();
      if (k < .3) continue;
      const lx = this.aPantalla({ x: a.x * 1.3, y: a.y * 1.3 });
      ctx.font = "600 " + Math.max(10, Math.min(14, 12 * k + 4)) + "px Lexend, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.fillStyle = COLOR_CIELO[f]; ctx.globalAlpha = .55;
      if ("letterSpacing" in ctx) ctx.letterSpacing = "2px";
      ctx.fillText(FAMILIAS[f].toUpperCase(), lx.x, lx.y);
      if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;
    }
    // caminos
    const rel = this.hover;
    ctx.lineWidth = 1;
    for (const [a, r] of d.aristas()) {
      if (!E[a] || !E[r]) continue;
      const p = this.aPantalla(posicion(a)), q = this.aPantalla(posicion(r));
      const resalta = rel && (rel === a || rel === r);
      ctx.strokeStyle = COLOR_CIELO[E[r].f]; ctx.globalAlpha = resalta ? .85 : (rel ? .12 : .3);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // estrellas
    const etiquetas = [];
    const pocas = Object.keys(E).filter(id => d.peso(id) > 0).length < 45;
    for (const id of Object.keys(E)) {
      if (rechazada(id)) continue;
      const f = E[id], p = this.aPantalla(posicion(id));
      if (p.x < -40 || p.y < -40 || p.x > W + 40 || p.y > H + 40) continue;
      const w = d.peso(id);
      if (!w) {
        ctx.globalAlpha = .38; ctx.fillStyle = "#b8c2e6";
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.2, 1.7 * Math.min(1.4, k + .3)), 0, 6.283); ctx.fill();
        ctx.globalAlpha = 1; continue;
      }
      const col = COLOR_CIELO[f.f];
      const base = 2.4 + Math.min(recetasDe(id).length, 4) * .6 + Math.log2(1 + w) * (d.escalaPeso || 0);
      const r = base * Math.max(.75, Math.min(1.5, k + .35));
      const tw = .85 + .15 * Math.sin(t / 700 + (p.x + p.y) * .05);
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
      halo.addColorStop(0, col + "88"); halo.addColorStop(1, col + "00");
      ctx.globalAlpha = tw; ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(p.x, p.y, r * 5, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(p.x, p.y, r * .55, 0, 6.283); ctx.fill();
      ctx.fillStyle = col; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
      if (CUMBRES.has(id)) { ctx.strokeStyle = "#ffd84d"; ctx.globalAlpha = .8; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, r + 4, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
      if (d.destacada && d.destacada(id)) { ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5; ctx.globalAlpha = .5 + .5 * Math.sin(t / 300); ctx.beginPath(); ctx.arc(p.x, p.y, r + 8, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
      if (k > .78 || id === rel || CUMBRES.has(id) || (d.destacada && d.destacada(id)) || (pocas && k > .4)) etiquetas.push([id, p, r]);
    }
    ctx.font = "500 11.5px Lexend, system-ui, sans-serif"; ctx.textAlign = "center";
    const ocupado = [];
    etiquetas.sort((a, b) => (b[0] === rel) - (a[0] === rel) || CUMBRES.has(b[0]) - CUMBRES.has(a[0]));
    for (const [id, p, r] of etiquetas) {
      const txt = E[id].n.length > 30 ? E[id].n.slice(0, 29) + "…" : E[id].n;
      const w = ctx.measureText(txt).width, caja = [p.x - w / 2 - 3, p.y + r + 2, p.x + w / 2 + 3, p.y + r + 17];
      if (id !== rel && ocupado.some(o => caja[0] < o[2] && caja[2] > o[0] && caja[1] < o[3] && caja[3] > o[1])) continue;
      ocupado.push(caja);
      ctx.globalAlpha = id === rel ? 1 : .82;
      ctx.fillStyle = "#060914"; ctx.fillText(txt, p.x + 1, p.y + r + 14);
      ctx.fillStyle = "#e9eefc"; ctx.fillText(txt, p.x, p.y + r + 13);
    }
    ctx.globalAlpha = 1;
  }
}
let modoMapa = "mio";
const fuenteMia = () => ({
  peso: id => (descubierto(id) ? 1 : 0),
  aristas: () => {
    const out = [];
    for (const k of Object.keys(state.caminos)) { const rec = RECETA.get(k); if (rec && descubierto(rec[2])) { out.push([rec[0], rec[2]]); out.push([rec[1], rec[2]]); } }
    for (const [id, via] of Object.entries(state.como)) if (E[id] && E[id].ia && Array.isArray(via)) { out.push([via[0], id]); out.push([via[1], id]); }
    return out;
  },
  escalaPeso: 0
});
function conteoComunidad(filtro) {
  const c = {};
  for (const [uid, j] of Object.entries(COMUNIDAD.jugadores)) {
    if (filtro && !filtro(uid, j)) continue;
    for (const id of Object.keys(j.descubiertos || {})) c[id] = (c[id] || 0) + 1;
  }
  if (!filtro) for (const id of state.descubiertos) if (!c[id]) c[id] = 1;
  return c;
}
const fuenteComunidad = () => {
  const c = conteoComunidad(null);
  return { peso: id => c[id] || 0, aristas: () => [], escalaPeso: 1.6, etiqueta: id => (c[id] || 0) + (c[id] === 1 ? " persona" : " personas") };
};
const cieloMapa = new Cielo($("canvasMapa"), $("tipMapa"), () => (modoMapa === "mio" ? fuenteMia() : fuenteComunidad()));
function renderLeyenda(cont, peso) {
  cont.innerHTML = ORDEN_FAMILIAS.filter(f => f !== "base").map(f => {
    const ids = TODOS.filter(id => E[id].f === f);
    return '<span><i style="background:' + COLOR_CIELO[f] + ";color:" + COLOR_CIELO[f] + '"></i>' + esc(FAMILIAS[f]) + " " + ids.filter(id => peso(id) > 0).length + "/" + ids.length + "</span>";
  }).join("");
}
function modo(m) {
  modoMapa = m;
  $("mapaMio").setAttribute("aria-pressed", String(m === "mio"));
  $("mapaComunidad").setAttribute("aria-pressed", String(m === "comunidad"));
  $("mapaInfo").textContent = m === "mio"
    ? "Cada estrella es una ficha; cada línea, un camino que encontraste. Arrastra para moverte y usa la rueda o los botones para acercarte."
    : "Todo lo que la comunidad ha descubierto. Mientras más grande la estrella, más docentes llegaron a ella.";
  renderLeyenda($("leyendaMapa"), (m === "mio" ? fuenteMia() : fuenteComunidad()).peso);
}
$("mapaMio").addEventListener("click", () => modo("mio"));
$("mapaComunidad").addEventListener("click", () => { if (!NUBE.db) { aviso("La vista de comunidad necesita abrir el juego desde Claude con tu sesión iniciada."); return; } modo("comunidad"); });
$("mapaMas").addEventListener("click", () => cieloMapa.zoom(1.25));
$("mapaMenos").addEventListener("click", () => cieloMapa.zoom(.8));
$("mapaCentrar").addEventListener("click", () => cieloMapa.centrar());

/* ================= Taller ================= */
async function nombres(ids) {
  const faltan = ids.filter(i => !(i in NOMBRES));
  if (faltan.length && NUBE.user) {
    try { const ps = await NUBE.user.profiles(faltan); for (const i of faltan) NOMBRES[i] = (ps[i] && ps[i].name) || ""; } catch (e) { /* sin nombres */ }
  }
  return id => NOMBRES[id] || "Alguien";
}
const tallerActivo = () => TALLER.actual && TALLER.actual.activo ? TALLER.actual : null;
const enTaller = () => { const t = tallerActivo(); return !!(t && state.taller && state.taller.id === t.id); };
function renderTallerUI() {
  const t = tallerActivo();
  $("tabTaller").hidden = !(NUBE.curador || t);
  const ban = $("tallerBanner");
  if (!t) { ban.hidden = true; return; }
  ban.hidden = false;
  const dest = E[t.destino];
  const unido = enTaller();
  ban.innerHTML = '<span class="pulso" aria-hidden="true"></span><p><b>Taller en curso: ' + esc(t.titulo || "Taller") + ".</b> Destino del grupo: " +
    (dest && descubierto(t.destino) ? esc(dest.e + " " + dest.n) : esc(dest && dest.pista ? "“" + dest.pista + "”" : "por descubrir")) + "</p>";
  const b = document.createElement("button");
  b.type = "button"; b.className = "btn small " + (unido ? "" : "primary");
  b.textContent = unido ? "Ver proyección" : "Unirme al taller";
  b.addEventListener("click", () => (unido ? abrirProyeccion() : unirseTaller()));
  ban.appendChild(b);
}
function unirseTaller() {
  const t = tallerActivo();
  if (!t) return;
  state.taller = { id: t.id, desde: Date.now() };
  if (t.ruta) state.ruta = t.ruta;
  guardar(); sincronizar();
  renderTallerUI(); renderDestinos();
  aviso("Te uniste al taller. Tus descubrimientos aparecerán en la proyección del grupo.");
}
function opcionesDestino() {
  let h = '<optgroup label="Una ruta completa (el destino es su cumbre)">' + RUTAS.map(r => '<option value="ruta:' + r.id + '">' + esc(r.e + " " + r.n) + "</option>").join("") + "</optgroup>";
  const ids = TODOS.filter(id => E[id].f !== "base").sort((a, b) => E[a].n.localeCompare(E[b].n, "es"));
  h += '<optgroup label="Un concepto">' + ids.map(id => '<option value="ficha:' + id + '">' + esc(E[id].e + " " + E[id].n) + "</option>").join("") + "</optgroup>";
  return h;
}
function abrirPanelTaller() {
  const t = tallerActivo();
  if (!NUBE.db) { aviso("El modo taller necesita abrir el juego desde Claude con tu sesión iniciada."); return; }
  if (!t) {
    if (!NUBE.curador) { aviso("Solo quien administra el juego puede iniciar un taller."); return; }
    abrirPanel(
      '<h2 id="panelTitulo">Iniciar un taller</h2>' +
      "<p>Propón un destino común. Quienes abran el juego verán un aviso para unirse, y la proyección mostrará en vivo lo que el grupo va descubriendo y las fichas generadas con IA para validarlas juntos.</p>" +
      '<label for="tallerTitulo">Nombre del taller<input type="text" id="tallerTitulo" maxlength="60" value="Taller de docencia universitaria"></label>' +
      '<label for="tallerDestino">Destino del grupo<select id="tallerDestino">' + opcionesDestino() + "</select></label>" +
      '<div class="row"><button class="btn" type="button" data-p="cerrar">Cancelar</button><button class="btn primary" type="button" data-p="iniciar">Iniciar taller</button></div>',
      { cerrar: cerrarPanel, iniciar: iniciarTaller }
    );
  } else {
    const parts = participantes(t).length;
    abrirPanel(
      '<h2 id="panelTitulo">' + esc(t.titulo || "Taller") + "</h2>" +
      "<p>En curso desde las " + new Date(t.inicio).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) + " · " + parts + (parts === 1 ? " participante" : " participantes") + ".</p>" +
      '<div class="row">' + (NUBE.curador ? '<button class="btn" type="button" data-p="terminar">Terminar taller</button>' : "") + (enTaller() ? "" : '<button class="btn" type="button" data-p="unirme">Unirme</button>') + '<button class="btn primary" type="button" data-p="proyectar">Abrir proyección</button></div>',
      { terminar: terminarTaller, proyectar: () => { cerrarPanel(); abrirProyeccion(); }, unirme: () => { cerrarPanel(); unirseTaller(); } }
    );
  }
}
async function iniciarTaller() {
  const titulo = ($("tallerTitulo").value || "Taller").trim().slice(0, 60);
  const sel = $("tallerDestino").value;
  let destino, ruta = null;
  if (sel.startsWith("ruta:")) { ruta = sel.slice(5); const r = RUTAS.find(x => x.id === ruta); destino = r.destinos[r.destinos.length - 1]; }
  else destino = sel.slice(6);
  const doc = { activo: true, id: "t" + Date.now(), titulo, destino, ruta, inicio: Date.now() };
  try {
    await NUBE.db.doc("taller/actual").set(doc);
    TALLER.actual = doc;
    cerrarPanel();
    unirseTaller();
    abrirProyeccion();
  } catch (e) { aviso("No se pudo iniciar el taller. Revisa que tengas permiso de edición."); }
}
async function terminarTaller() {
  const t = tallerActivo();
  if (!t) return;
  try {
    await NUBE.db.doc("taller/actual").set(Object.assign({}, t, { activo: false, fin: Date.now() }));
    const resumenHtml = await resumenTaller(t);
    TALLER.actual = Object.assign({}, t, { activo: false });
    renderTallerUI();
    cerrarProyeccion();
    abrirPanel('<h2 id="panelTitulo">Taller terminado</h2>' + resumenHtml + '<div class="row"><button class="btn primary" type="button" data-p="cerrar">Listo</button></div>', { cerrar: cerrarPanel });
  } catch (e) { aviso("No se pudo terminar el taller. Vuelve a intentarlo."); }
}
function participantes(t) { return Object.entries(COMUNIDAD.jugadores).filter(([, j]) => j.taller === t.id); }
async function resumenTaller(t) {
  const ps = participantes(t);
  const c = conteoComunidad((uid, j) => j.taller === t.id);
  const llegaron = ps.filter(([, j]) => j.descubiertos && j.descubiertos[t.destino]);
  const nombre = await nombres(llegaron.map(([u]) => u));
  const nuevasIA = Object.keys(E).filter(id => E[id].ia && E[id].creada && E[id].creada >= t.inicio);
  return "<p>" + ps.length + (ps.length === 1 ? " participante" : " participantes") + " · " + Object.keys(c).length + " fichas distintas descubiertas · " + llegaron.length + " llegaron al destino " + esc(E[t.destino].e + " " + E[t.destino].n) + ".</p>" +
    (llegaron.length ? "<p>Llegaron: " + llegaron.map(([u]) => esc(nombre(u))).join(", ") + ".</p>" : "") +
    (nuevasIA.length ? "<p>Fichas generadas con IA durante el taller, para validarlas juntos:</p><div class=\"logro-lista\">" + nuevasIA.map(chipHtml).join("") + "</div>" : "");
}
let cieloProy = null;
function abrirProyeccion() {
  const t = tallerActivo();
  if (!t) return;
  $("proyeccion").hidden = false;
  $("proyTitulo").textContent = t.titulo || "Taller";
  if (!cieloProy) {
    cieloProy = new Cielo($("canvasProy"), $("tipProy"), () => {
      const tt = tallerActivo();
      const c = tt ? conteoComunidad((uid, j) => j.taller === tt.id) : {};
      return { peso: id => c[id] || 0, aristas: () => [], escalaPeso: 2, destacada: id => tt && id === tt.destino, etiqueta: id => (c[id] || 0) + (c[id] === 1 ? " persona" : " personas") };
    });
  }
  cieloProy.ajustado = false;
  cieloProy.iniciar();
  renderProyeccion();
}
function cerrarProyeccion() { $("proyeccion").hidden = true; if (cieloProy) cieloProy.detener(); }
$("proyCerrar").addEventListener("click", cerrarProyeccion);
async function renderProyeccion() {
  if ($("proyeccion").hidden) return;
  const t = tallerActivo();
  if (!t) { cerrarProyeccion(); return; }
  const ps = participantes(t);
  const c = conteoComunidad((uid, j) => j.taller === t.id);
  const llegaron = ps.filter(([, j]) => j.descubiertos && j.descubiertos[t.destino]);
  const eventos = [];
  for (const [uid, j] of ps) for (const [id, ts] of Object.entries(j.descubiertos || {})) if (ts >= t.inicio && E[id]) eventos.push([ts, uid, id]);
  eventos.sort((a, b) => b[0] - a[0]);
  const nombre = await nombres([...new Set([...eventos.slice(0, 30).map(e => e[1]), ...llegaron.map(([u]) => u)])]);
  const dest = E[t.destino];
  const alguien = llegaron.length > 0;
  $("proyDestino").innerHTML = '<span class="em">' + (alguien ? esc(dest.e) : "?") + "</span><b>" + (alguien ? esc(dest.n) : "Por descubrir") + "</b><small>" +
    (alguien ? "Llegaron: " + llegaron.slice(0, 6).map(([u]) => esc(nombre(u))).join(", ") + (llegaron.length > 6 ? " y " + (llegaron.length - 6) + " más" : "") : "Pista: " + esc(dest.pista || "sigan combinando")) + "</small>";
  const nuevasIA = Object.keys(E).filter(id => E[id].ia && E[id].creada && E[id].creada >= t.inicio).length;
  $("proyStats").innerHTML = "<div><b>" + ps.length + "</b><span>participantes</span></div><div><b>" + Object.keys(c).length + "</b><span>fichas distintas</span></div><div><b>" + nuevasIA + "</b><span>fichas IA por validar</span></div>";
  const hace = ts => { const m = Math.round((Date.now() - ts) / 60000); return m < 1 ? "recién" : "hace " + m + " min"; };
  $("proyFeed").innerHTML = eventos.slice(0, 30).map(([ts, uid, id]) => "<div>" + esc(nombre(uid)) + ' descubrió <span class="em">' + esc(E[id].e) + "</span> " + esc(E[id].n) + " <small>· " + hace(ts) + "</small></div>").join("") || "<div>Aún no hay descubrimientos. ¡A combinar!</div>";
  renderLeyenda($("leyendaProy"), id => c[id] || 0);
}
$("tabTaller").addEventListener("click", abrirPanelTaller);

/* ================= Paneles ================= */
function abrirPanel(html, acciones = {}) {
  const p = $("panel");
  p.innerHTML = '<button class="cerrar" type="button" aria-label="Cerrar">×</button>' + html;
  p.querySelector(".cerrar").addEventListener("click", cerrarPanel);
  p.querySelectorAll("[data-p]").forEach(b => b.addEventListener("click", () => (acciones[b.dataset.p] || cerrarPanel)()));
  $("panelOv").hidden = false;
  const f = p.querySelector("input, select, .btn.primary");
  if (f) f.focus({ preventScroll: true });
}
function cerrarPanel() { $("panelOv").hidden = true; }
$("panelOv").addEventListener("click", e => { if (e.target.id === "panelOv") cerrarPanel(); });

function bienvenida() {
  abrirPanel(
    '<h2 id="panelTitulo">Bienvenida a Alquimia Docente</h2>' +
    '<div class="bienvenida"><ul>' +
    "<li>Suelta una ficha sobre otra para descubrir conceptos de docencia universitaria.</li>" +
    "<li>Cada ficha explica por qué funciona, con un ejemplo de aula y fuentes que puedes consultar.</li>" +
    "<li>Un mismo concepto tiene varios caminos: encontrarlos todos te da su maestría.</li>" +
    "<li>Las rutas te dan destinos y pistas. También puedes explorar libre.</li>" +
    "<li>Marca en cada ficha si ya lo haces o quieres probarlo: así se arma tu plan.</li>" +
    "</ul></div>" +
    '<div class="row"><button class="btn" type="button" data-p="libre">Explorar libre</button><button class="btn primary" type="button" data-p="rutas">Elegir una ruta</button></div>',
    { libre: () => { cerrarPanel(); }, rutas: () => { cerrarPanel(); irA("rutas"); } }
  );
  state.bienvenida = true; guardar();
}

/* ================= Reinicio ================= */
function pedirReinicio() {
  $("confirmTexto").textContent = "Se perderán las " + visibles().length + " fichas que tienes, tus caminos, rutas y tu plan. No se puede deshacer.";
  $("confirmOv").hidden = false;
  $("confirmNo").focus({ preventScroll: true });
}
$("confirmNo").addEventListener("click", () => { $("confirmOv").hidden = true; });
$("confirmSi").addEventListener("click", () => {
  $("confirmOv").hidden = true;
  const ia = state.ia;
  state = estadoInicial();
  state.ia = ia; state.bienvenida = true;
  if (REVISION) state.descubiertos = [...TODOS];
  for (const id of INICIALES) if (!state.descubiertos.includes(id)) state.descubiertos.push(id);
  [...fichas].forEach(quitarFicha);
  $("mesaNota").hidden = false;
  colocarIniciales();
  renderLista(); renderStats(); renderDestinos(); guardarBitacora();
  irA("lab");
});

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!$("confirmOv").hidden) $("confirmOv").hidden = true;
  else if (fichaAbierta) cerrarFicha();
  else if (!$("panelOv").hidden) cerrarPanel();
  else if (!$("proyeccion").hidden) cerrarProyeccion();
});

/* ================= Conexión con la plataforma ================= */
function recontarVotos(snapDocs) {
  if (snapDocs) VOTOS.docs = snapDocs;
  const t = {};
  for (const [uid, data] of Object.entries(VOTOS.docs || {})) {
    const fichasV = uid === NUBE.uid ? VOTOS.mios : (data && data.fichas) || {};
    for (const [id, v] of Object.entries(fichasV)) {
      t[id] = t[id] || { pos: 0, neg: 0 };
      if (v && v.v === 1) t[id].pos++; else if (v && v.v === -1) t[id].neg++;
    }
  }
  if (NUBE.uid && !(VOTOS.docs || {})[NUBE.uid]) for (const [id, v] of Object.entries(VOTOS.mios)) { t[id] = t[id] || { pos: 0, neg: 0 }; if (v.v === 1) t[id].pos++; else t[id].neg++; }
  VOTOS.todos = t;
}
async function conectar() {
  if (!window.claude || typeof window.claude.use !== "function") { renderEstadoIA(); return; }
  const usar = n => window.claude.use(n).catch(() => null);
  const [sample, db, user, downloads] = await Promise.all([usar("sample"), usar("db"), usar("user"), usar("downloads")]);
  IA.sample = sample; NUBE.db = db; NUBE.user = user; NUBE.downloads = downloads;
  if (user) { NUBE.uid = await user.id(); NUBE.curador = await user.canEdit(); }
  renderEstadoIA(); renderTallerUI();
  if (vistaActual === "plan") renderPlan();
  if (!db) return;
  const refrescar = () => { renderLista(); renderStats(); if (vistaActual === "cuaderno") renderCuaderno(); };
  const nada = () => {};
  db.collection("cartas").limit(1000).onSnapshot(snap => {
    for (const d of snap.docs) { const def = d.data(); if (def && registrarCartaIA(d.id, def)) IA.cartas[d.id] = def; }
    refrescar();
  }, nada);
  db.collection("combos").limit(1000).onSnapshot(snap => { const m = {}; for (const d of snap.docs) m[d.id] = d.data(); IA.combos = m; }, nada);
  db.collection("curaduria").limit(1000).onSnapshot(snap => {
    const m = {}; for (const d of snap.docs) { const v = d.data(); if (v && v.estado) m[d.id] = String(v.estado); }
    IA.curaduria = m; refrescar();
  }, nada);
  db.collection("votos").limit(1000).onSnapshot(snap => {
    const docs = {}; for (const d of snap.docs) docs[d.id] = d.data();
    if (NUBE.uid && docs[NUBE.uid] && docs[NUBE.uid].fichas && !Object.keys(VOTOS.mios).length) VOTOS.mios = Object.assign({}, docs[NUBE.uid].fichas);
    recontarVotos(docs); refrescar();
  }, nada);
  db.collection("jugadores").limit(1000).onSnapshot(snap => {
    const m = {}; for (const d of snap.docs) m[d.id] = d.data();
    COMUNIDAD.jugadores = m;
    if (modoMapa === "comunidad") renderLeyenda($("leyendaMapa"), fuenteComunidad().peso);
    renderProyeccion();
  }, nada);
  db.doc("taller/actual").onSnapshot(snap => {
    const prev = tallerActivo();
    TALLER.actual = snap.exists ? snap.data() : null;
    const ahora = tallerActivo();
    if (ahora && (!prev || prev.id !== ahora.id) && !enTaller() && !NUBE.curador) aviso("Hay un taller en curso: " + (ahora.titulo || "Taller") + ". Puedes unirte desde el aviso de arriba.");
    if (!ahora) cerrarProyeccion();
    renderTallerUI(); renderProyeccion();
  }, nada);
  if (NUBE.uid && !REVISION) {
    try {
      const mio = await db.doc("jugadores/" + NUBE.uid).get();
      if (mio.exists) {
        const d = mio.data();
        let cambio = false;
        for (const [id0, ts] of Object.entries(d.descubiertos || {})) { const id = al(id0); if (E[id] && !descubierto(id)) { state.descubiertos.push(id); state.fechas[id] = ts; cambio = true; } }
        for (const k of d.caminos || []) if (!state.caminos[k]) { state.caminos[k] = 1; cambio = true; }
        if (cambio) { renderLista(); renderStats(); renderDestinos(); guardar(); }
      }
      const bit = await db.doc("data/users/" + NUBE.uid + "/bitacora").get();
      if (bit.exists && bit.data().marcas) {
        state.bitacora = Object.assign({}, bit.data().marcas, state.bitacora);
        renderStats(); guardar();
      }
    } catch (e) { /* sin lectura: se juega con lo local */ }
    programarSync();
  }
}

/* ================= Inicio ================= */
function colocarIniciales() {
  const W = mesa.clientWidth, H = mesa.clientHeight;
  const pos = W < 520 ? [[0.27, 0.45], [0.73, 0.45], [0.27, 0.68], [0.73, 0.68]] : [[0.32, 0.42], [0.62, 0.42], [0.32, 0.66], [0.62, 0.66]];
  INICIALES.forEach((id, i) => agregarFicha(id, W * pos[i][0], H * pos[i][1], { centrar: true }));
}
buscar.addEventListener("input", () => renderLista());
window.addEventListener("resize", () => { if (vistaActual === "lab") fichas.forEach(acotar); });

cargar();
if (REVISION) $("revFlag").hidden = false;
renderLista();
renderStats();
renderDestinos();
modo("mio");
requestAnimationFrame(() => {
  if (state.mesa.length) state.mesa.forEach(t => agregarFicha(t.id, t.x, t.y));
  else colocarIniciales();
  if (state.combinaciones > 0) ocultarNota();
  if (!state.bienvenida) bienvenida();
});
conectar();
