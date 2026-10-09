// QA de Crisol: juega las 30 misiones en dist/Crisol.html con mouse real (Chrome sin ventana) y revisa avisos, fichas, plano,
// celebración, Mi plan y Cuaderno. Uso: npm run empaquetar && npm run qa. Fotos, descargas y registro quedan en qa/salida/.
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const ARCHIVO = "file://" + path.join(__dirname, "..", "dist", "Crisol.html");
const DIR = path.join(__dirname, "salida"), FOTOS = path.join(DIR, "fotos"), BAJADAS = path.join(DIR, "bajadas");
fs.rmSync(FOTOS, { recursive: true, force: true }); fs.mkdirSync(FOTOS, { recursive: true });
fs.rmSync(BAJADAS, { recursive: true, force: true }); fs.mkdirSync(BAJADAS, { recursive: true });
const esperar = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(DIR, { recursive: true });
const log = (...a) => { const t = a.join(" "); console.log(t); fs.appendFileSync(path.join(DIR, "qa.log"), t + "\n"); };
fs.writeFileSync(path.join(DIR, "qa.log"), "");

(async () => {
  const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, userDataDir: path.join(DIR, "perfil-" + Date.now()), args: ["--no-first-run", "--no-default-browser-check"], defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  const errores = [];
  page.on("pageerror", e => errores.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errores.push("console: " + m.text()); });
  const cdp = await page.target().createCDPSession();
  await cdp.send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: BAJADAS });
  await page.goto(ARCHIVO);
  await esperar(1500);
  const D = await page.evaluate(() => window.DATOS);
  const estado = () => page.evaluate(() => JSON.parse(localStorage.getItem("alquimia-docente:v2") || "{}"));
  const visible = sel => page.$eval(sel, el => !el.hidden && getComputedStyle(el).display !== "none").catch(() => false);
  const avisos = () => page.$$eval("#avisos .aviso", els => els.map(e => e.textContent));
  const foto = async nombre => { await page.screenshot({ path: path.join(FOTOS, nombre + ".png") }); };
  const fallas = [];
  const fallo = (m, t) => { fallas.push(m + ": " + t); log("   ✗ " + t); };

  async function limpiarMesa() {
    await page.evaluate(() => document.querySelectorAll("#pizarra .ficha").forEach(el => el.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete", bubbles: true }))));
    await esperar(80);
  }
  async function traer(id) {
    const ok = await page.$('#cajaLista .chip[data-id="' + id + '"]');
    if (!ok) return false;
    await page.click('#cajaLista .chip[data-id="' + id + '"]');
    await esperar(260);
    return true;
  }
  async function cajas() {
    return page.$$eval("#pizarra .ficha", els => els.map((e, i) => { const r = e.getBoundingClientRect(); return { i, id: e.dataset.id, x: r.left, y: r.top, w: r.width, h: r.height }; }));
  }
  // Arrastra la ficha a sobre la b, soltando descentrado (como una persona).
  async function arrastrar(ta, tb) {
    await page.mouse.move(ta.x + ta.w / 2, ta.y + ta.h / 2);
    await page.mouse.down();
    const dx = (Math.random() - .5) * tb.w * .5, dy = (Math.random() - .5) * tb.h * .6;
    const fx = tb.x + tb.w / 2 + dx, fy = tb.y + tb.h / 2 + dy;
    const sx = ta.x + ta.w / 2, sy = ta.y + ta.h / 2;
    for (let i = 1; i <= 14; i++) { await page.mouse.move(sx + (fx - sx) * i / 14, sy + (fy - sy) * i / 14); await esperar(14); }
    await page.mouse.up();
  }
  async function mezclar(mid, a, b) {
    await limpiarMesa();
    if (!(await traer(a))) { fallo(mid, "la caja no muestra " + a); return "sin-chip"; }
    if (!(await traer(b))) { fallo(mid, "la caja no muestra " + b); return "sin-chip"; }
    await esperar(150);
    const bx = await cajas();
    const ta = bx.find(t => t.id === a), tb = bx.filter(t => t.id === b).reverse().find(t => t !== ta);
    if (!ta || !tb) { fallo(mid, "no quedaron en la mesa " + a + " y " + b); return "sin-mesa"; }
    await arrastrar(ta, tb);
    await esperar(1150);
    return "ok";
  }
  async function cerrarTodo(mid, stats, esperado) {
    let fichas = 0;
    for (let k = 0; k < 4 && await visible("#capaFicha"); k++) {
      const titulo = await page.$eval("#fichaTitulo", e => e.textContent.trim());
      if (esperado && !titulo.includes(D.fichas[esperado].n)) fallo(mid, "la ficha abierta dice '" + titulo + "' y se esperaba " + D.fichas[esperado].n);
      if (stats && !stats.fotoFicha) { stats.fotoFicha = true; await foto(mid + "-ficha"); }
      fichas++; await page.keyboard.press("Escape"); await esperar(380);
    }
    await esperar(250);
    if (await page.$("#reflexion")) fallo(mid, "apareció una pausa de reflexión, que ya no debería existir");
    if (false) {
      const pregunta = await page.$eval("#panel label.campo", e => e.textContent.trim().slice(0, 90)).catch(() => "");
      if (stats) { stats.reflexiones++; stats.preguntas.push(pregunta); }
      await page.type("#reflexion", "Prueba QA en " + mid + ": en mi curso probaría esto la próxima semana.");
      await page.click('[data-accion="guardar"]'); await esperar(400);
    }
    await esperar(250);
    if (await visible("#celebracion")) {
      if (stats) { stats.celebro = true; await foto(mid + "-celebracion"); }
      const h1 = await page.$eval("#celebracion h1", e => e.textContent).catch(() => "");
      if (!h1.includes("cumplida")) fallo(mid, "celebración sin título");
      await page.click('[data-c="seguir"]'); await esperar(350);
    }
    return fichas;
  }

  // Portada y tutorial
  await foto("00-portada");
  await page.click('[data-p="empezar"]'); await esperar(1300);
  await foto("01-tutorial");
  const resumen = [];
  let primeraNoReceta = true;
  for (const m of D.misiones) {
    const t0 = Date.now();
    const stats = { id: m.id, mezclas: 0, reflexiones: 0, preguntas: [], celebro: false, fuera: "-", pista: "-" };
    log("\n▶ " + m.e + " " + m.n + " (" + m.id + ")");
    if (!m.tutorial) {
      if (await visible("#capaPanel")) { await page.keyboard.press("Escape"); await esperar(300); }
      await page.click("#btnMisiones"); await esperar(600);
      await page.click('[data-m="' + m.id + '"]'); await esperar(1000);
      if (await visible("#capaPlano")) { await foto(m.id + "-plano"); await page.keyboard.press("Escape"); await esperar(300); }
      else fallo(m.id, "no se abrió el plano al empezar");
    }
    const cab = await page.$eval("#hojaMision h2", e => e.textContent).catch(() => "");
    if (!cab.includes(m.n)) fallo(m.id, "la cabecera dice '" + cab + "'");
    const piezas = new Set(m.plano.map(n => n.id));
    const recs = D.recetas.filter(r => piezas.has(r[2]));
    // Pista con chispas (una vez por misión)
    const comprar = await page.$(".pieza .comprar:not([disabled])");
    if (comprar) { await comprar.click(); await esperar(300); stats.pista = (await page.$(".pieza .ingred")) ? "ok" : "sin ingrediente visible"; if (stats.pista !== "ok") fallo(m.id, "comprar pista no mostró el ingrediente"); }
    // Una mezcla fuera del plano: debe avisar la línea investigativa y no descubrir nada
    let est = await estado();
    const tiene = id => !!est.descubiertos[id];
    const fuera = D.recetas.find(r => !piezas.has(r[2]) && tiene(r[0]) && tiene(r[1]) && r[0] !== r[1] && !D.iniciales.includes(r[2]));
    if (fuera && !m.tutorial) {
      const visibles = await page.$$eval("#cajaLista .chip", els => els.map(e => e.dataset.id));
      if (visibles.includes(fuera[0]) && visibles.includes(fuera[1])) {
        await mezclar(m.id, fuera[0], fuera[1]);
        const av = (await avisos()).join(" | ");
        est = await estado();
        stats.fuera = av.includes("línea investigativa") && !(est.descubiertos[fuera[2]] && !tiene(fuera[2])) ? "ok" : "MAL";
        if (stats.fuera !== "ok") fallo(m.id, "mezcla fuera del plano " + fuera[0] + "+" + fuera[1] + " → aviso: " + av.slice(0, 160));
        else if (!stats.fotoFuera) { stats.fotoFuera = true; await foto(m.id + "-fuera"); }
        await esperar(200);
      } else stats.fuera = "n/a";
    }
    // Una pareja sin receta (una sola vez en todo el QA)
    if (primeraNoReceta && !m.tutorial) {
      const vis = await page.$$eval("#cajaLista .chip", els => els.map(e => e.dataset.id));
      const k = (a, b) => [a, b].sort().join("+");
      const conReceta = new Set(D.recetas.map(r => k(r[0], r[1])));
      let par = null;
      for (const a of vis) for (const b of vis) if (!par && a !== b && !conReceta.has(k(a, b))) par = [a, b];
      if (par) {
        await mezclar(m.id, par[0], par[1]);
        const av = (await avisos()).join(" | ");
        log("   pareja sin receta " + par.join("+") + " → " + av.slice(0, 140));
        if (!/no hay camino|no forma ninguna idea|línea investigativa/.test(av)) fallo(m.id, "pareja sin receta sin aviso claro");
        const bx = await cajas();
        const [p1, p2] = [bx.find(t => t.id === par[0]), bx.find(t => t.id === par[1])];
        if (p1 && p2 && !(p1.x + p1.w <= p2.x || p2.x + p2.w <= p1.x || p1.y + p1.h <= p2.y || p2.y + p2.h <= p1.y)) fallo(m.id, "tras una mezcla fallida las fichas quedaron encimadas");
        primeraNoReceta = false;
      }
    }
    // Jugar la misión hasta la meta
    for (let paso = 0; paso < 120; paso++) {
      est = await estado();
      const t = id => !!est.descubiertos[id];
      if (t(m.meta)) break;
      let el = null;
      for (const n of m.plano) if (n.ing && !t(n.id) && n.ing.every(t)) { el = [n.ing[0], n.ing[1], n.id]; break; }
      if (!el) { const r = recs.find(r => !t(r[2]) && t(r[0]) && t(r[1])); if (r) el = r; }
      if (!el) { fallo(m.id, "no queda ninguna mezcla posible y la meta falta"); break; }
      const res = await mezclar(m.id, el[0], el[1]);
      if (res !== "ok") break;
      est = await estado();
      if (!est.descubiertos[el[2]]) {
        const av = (await avisos()).join(" | ");
        fallo(m.id, "falló " + el[0] + " + " + el[1] + " (esperaba " + el[2] + "). Aviso: " + av.slice(0, 160));
        await foto(m.id + "-falla-" + paso);
        // reintento centrado, para distinguir tolerancia de lógica
        await cerrarTodo(m.id, null);
        continue;
      }
      stats.mezclas++;
      const n = await cerrarTodo(m.id, stats, el[2]);
      if (n === 0) fallo(m.id, "no se abrió la ficha de " + el[2]);
    }
    est = await estado();
    const cumplida = !!(est.misiones[m.id] && est.misiones[m.id].completada);
    if (!cumplida) fallo(m.id, "la misión no quedó cumplida");
    if (!stats.celebro) fallo(m.id, "no hubo celebración");
    const esperadas = 0;
    stats.segundos = Math.round((Date.now() - t0) / 1000);
    log("   mezclas " + stats.mezclas + " · reflexiones " + stats.reflexiones + "/" + esperadas + (stats.pendientes ? " (" + stats.pendientes + " desde la hoja)" : "") + " · celebración " + (stats.celebro ? "sí" : "NO") + " · fuera del plano " + stats.fuera + " · pista " + stats.pista + " · " + stats.segundos + " s");
    resumen.push(stats);
    if (m.id === "memoria") {
      // Persistencia: recargar y continuar
      await page.reload(); await esperar(1500);
      const boton = await page.$eval('[data-p]', e => e.textContent).catch(() => "");
      log("   recarga → botón principal: " + boton);
      await page.click('.portada-botones .principal'); await esperar(1200);
    }
  }

  // Mi plan y su descarga
  await page.click("#btnPlan"); await esperar(600);
  await foto("90-mi-plan");
  const cumplidasPlan = await page.$$eval("#panel .plan-mision", els => els.length); if (cumplidasPlan !== D.misiones.length) fallas.push("Mi plan muestra " + cumplidasPlan + " misiones cumplidas");
  log("\nMi plan: " + cumplidasPlan + " síntesis de misiones cumplidas");
  await page.click('[data-accion="bajar"]'); await esperar(1200);
  await page.keyboard.press("Escape"); await esperar(300);
  const bajados = fs.readdirSync(BAJADAS);
  log("Descargas: " + bajados.join(", "));
  if (bajados.length) { const md = fs.readFileSync(path.join(BAJADAS, bajados[0]), "utf8"); log("   plan .md: " + md.length + " caracteres, " + (md.match(/^## /gm) || []).length + " secciones, principios: " + (md.match(/Principios de diseño/g) || []).length); if (md.includes("—")) fallo("plan", "raya larga en el plan"); }
  else fallo("plan", "no se descargó el plan");
  // Cuaderno
  await page.click("#btnCuaderno"); await esperar(600);
  const cuaderno = await page.$$eval("#panel .cuaderno-fam .chip", els => els.length);
  const huecos = await page.$$eval("#panel .hueco", els => els.length);
  log("Cuaderno: " + cuaderno + " descubiertas, " + huecos + " huecos");
  await foto("91-cuaderno");
  await page.keyboard.press("Escape"); await esperar(300);
  // Portada final
  await page.click("#btnInicio"); await esperar(900); await foto("92-portada-final");
  log("Pie de portada: " + await page.$eval("#portadaPie", e => e.textContent));
  // Teléfono
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.click('.portada-botones .principal').catch(() => {}); await esperar(1200);
  await foto("93-telefono");
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (desborde) fallo("telefono", "hay desborde horizontal");

  log("\n===== RESUMEN =====");
  const ests = await estado();
  log("Ideas descubiertas: " + Object.keys(ests.descubiertos).length + " de " + Object.keys(D.fichas).length + " · misiones cumplidas: " + Object.values(ests.misiones).filter(x => x.completada).length + " de " + D.misiones.length);
  log("Errores de JavaScript: " + (errores.length ? "\n  " + errores.join("\n  ") : "ninguno"));
  log("Fallas: " + (fallas.length ? "\n  " + fallas.join("\n  ") : "ninguna"));
  fs.writeFileSync(path.join(DIR, "resumen.json"), JSON.stringify({ resumen, fallas, errores }, null, 2));
  await browser.close();
})().catch(e => { log("QA CAÍDO: " + e.stack); process.exit(1); });
