// Música y efectos del tráiler, sintetizados por código (sin archivos ni licencias de terceros).
// Electrónica a 128 pulsos por minuto en La menor (La menor, Fa, Do, Sol): bombo con golpe, bajo que rueda en semicorcheas,
// acordes anchos de sierras desafinadas que respiran con el bombo, arpegio filtrado, subidas de tensión y golpes graves.
// La forma sigue al video (linea.js): entrada tensa, golpe en la primera mezcla, la cadena va armando, silencio de un pulso
// y caída con todo en el muro de fichas, quiebre en la evidencia, silencio y golpe en el sello MITO, y cierre con un acorde largo.
// Uso: node audio.js → audio.wav (48 kHz, estéreo). export.js lo mezcla con el video.
const fs = require("fs"), path = require("path");
const { LINEA } = require("./linea.js");
const SR = 48000, DUR = LINEA.DUR, N = Math.ceil(SR * DUR), P = LINEA.PULSO, COMPAS = 4 * P, B = LINEA.B;
const TAU = Math.PI * 2;
const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
const bateria = bus(), graves = bus(), ancho = bus(), arpegio = bus(), efectos = bus();
const bombos = [];

let semilla = 98765;
const azar = () => (semilla = (semilla * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const ruido = () => azar() * 2 - 1;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const coef = fc => 1 - Math.exp(-TAU * Math.min(fc, SR * .45) / SR);

function sumar(b, t0, dur, fn, pan = 0, vol = 1) {
  const i0 = Math.max(0, Math.round(t0 * SR)), i1 = Math.min(N, Math.round((t0 + dur) * SR));
  const gl = vol * Math.cos((pan + 1) * Math.PI / 4), gr = vol * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = i0; i < i1; i++) { const v = fn((i - t0 * SR) / SR); b.L[i] += v * gl; b.R[i] += v * gr; }
}

/* ---------- Forma de la canción, pegada a los cortes del video ---------- */
const S = {
  intro: [0, B(4)], verso: [B(4), B(12)], verso2: [B(12), B(20)], sube: [B(20), B(23)], hueco: [B(23), B(24)],
  caida: [B(24), B(36)], ritmo: [B(36), B(50)], sube2: [B(50), B(56)], caida2: [B(56), B(62)], quiebre: [B(62), B(71)],
  hueco2: [B(71), B(72)], caida3: [B(72), B(84)], sube3: [B(84), B(87)], hueco3: [B(87), B(88)], final: [B(88), DUR]
};
const seccion = t => { for (const k in S) if (t >= S[k][0] - 1e-6 && t < S[k][1] - 1e-6) return k; return "final"; };
const LLENO = new Set(["caida", "caida2", "caida3"]);
const ACORDES = {
  Am: { raiz: 45, sierras: [57, 60, 64, 69], arp: [69, 72, 76, 81] },
  F: { raiz: 41, sierras: [57, 60, 65, 69], arp: [69, 72, 77, 81] },
  C: { raiz: 36, sierras: [55, 60, 64, 67], arp: [67, 72, 76, 79] },
  G: { raiz: 43, sierras: [55, 59, 62, 67], arp: [67, 71, 74, 79] }
};
const PROG = ["Am", "F", "C", "G"];
const acordeDe = t => { const m = Math.floor(t / COMPAS + 1e-6); return m >= 22 ? "Am" : PROG[((m - 6) % 4 + 4) % 4]; };

/* ---------- Batería ---------- */
function bombo(t0, vol = 1) {
  bombos.push(t0); let fase = 0;
  sumar(bateria, t0, .45, t => { fase += TAU * (47 + 150 * Math.exp(-t * 38)) / SR; return Math.tanh(2.2 * Math.sin(fase) * Math.exp(-t * 6.5) + ruido() * Math.exp(-t * 400) * .35); }, 0, vol);
}
function palmas(t0, vol = .5, pan = 0) {
  let hp = 0, ant = 0, lp = 0;
  sumar(bateria, t0, .4, t => {
    const n = ruido(); hp = .92 * (hp + n - ant); ant = n; lp += .4 * (hp - lp);
    const e = (t < .009 ? 1 : t < .018 ? .55 : t < .027 ? 1 : .8) * Math.exp(-t * 13);
    return lp * e;
  }, pan, vol);
}
function charles(t0, abierto, vol, pan = .2) {
  let hp = 0, ant = 0;
  sumar(bateria, t0, abierto ? .28 : .06, t => { const n = ruido(); hp = .75 * (hp + n - ant); ant = n; return hp * Math.exp(-t * (abierto ? 11 : 75)); }, pan, vol);
}
function platillo(t0, vol = .35) {
  let hp = 0, ant = 0;
  sumar(bateria, t0, 2.4, t => { const n = ruido(); hp = .6 * (hp + n - ant); ant = n; return hp * Math.exp(-t * 1.9); }, 0, vol);
}
function redoble(desde, hasta, vol = .4) {
  const dur = hasta - desde;
  for (let t = desde; t < hasta - .005;) { const p = (t - desde) / dur; palmas(t, vol * (.25 + .75 * p), (azar() - .5) * .3); t += p < .5 ? P / 2 : p < .8 ? P / 4 : P / 8; }
}

/* ---------- Instrumentos ---------- */
// bajo: sierra filtrada con sub, en semicorcheas; la nota del pulso va al grave y las de entremedio a la octava
function bajo(t0, dur, m, brillo = 700, vol = .5) {
  const f = hz(m); let fa = 0, lp = 0, lp2 = 0;
  sumar(graves, t0, dur + .02, t => {
    fa = (fa + f / SR) % 1;
    const saw = 2 * fa - 1, c = coef(brillo * (.35 + .65 * Math.exp(-t * 18)));
    lp += c * (saw - lp); lp2 += c * (lp - lp2);
    const sub = Math.sin(TAU * f * t);
    const g = Math.min(1, t / .004) * (t > dur ? Math.exp(-(t - dur) * 120) : 1);
    return Math.tanh(1.6 * (lp2 * .8 + sub * .7)) * g;
  }, 0, vol);
}
// acordes anchos: cinco sierras desafinadas por nota, filtradas, abiertas en estéreo
function sierras(t0, dur, notas, brillo = 2600, vol = .07, ataque = .02) {
  notas.forEach((m, j) => [-17, -8, 0, 8, 17].forEach((c, k) => {
    const f = hz(m) * Math.pow(2, c / 1200); let fa = azar(), lp = 0, lp2 = 0; const cf = coef(brillo);
    sumar(ancho, t0, dur + .35, t => {
      fa = (fa + f / SR) % 1; const saw = 2 * fa - 1;
      lp += cf * (saw - lp); lp2 += cf * (lp - lp2);
      return lp2 * Math.min(1, t / ataque) * (t > dur ? Math.exp(-(t - dur) * 9) : 1);
    }, (k - 2) * .38, vol);
  }));
}
// golpe de acorde corto (para las mezclas y las cifras)
const golpeAcorde = (t0, notas, vol = .09) => sierras(t0, .22, notas.map(m => m + 12), 4200, vol, .004);
// arpegio: pulsación de sierra y cuadrada con filtro que se cierra rápido
function pulsacion(t0, m, vol = .12, pan = 0, brillo = 3200) {
  const f = hz(m); let fa = 0, lp = 0;
  sumar(arpegio, t0, .32, t => {
    fa = (fa + f / SR) % 1;
    const x = .6 * (2 * fa - 1) + .4 * (fa < .5 ? 1 : -1);
    lp += coef(900 + brillo * Math.exp(-t * 14)) * (x - lp);
    return lp * Math.exp(-t * 7);
  }, pan, vol);
}
function colchonOscuro(t0, dur, notas, brillo, vol = .05) {
  notas.forEach((m, j) => [-10, 10].forEach((c, k) => {
    const f = hz(m) * Math.pow(2, c / 1200); let fa = azar(), lp = 0; const cf = coef(brillo);
    sumar(ancho, t0, dur + .4, t => { fa = (fa + f / SR) % 1; lp += cf * ((2 * fa - 1) - lp); return lp * Math.min(1, t / .25) * (t > dur ? Math.exp(-(t - dur) * 6) : 1); }, k ? .5 : -.5, vol);
  }));
}

/* ---------- Efectos de transición ---------- */
function subida(t0, dur, vol = .3) {
  let lp = 0, fa = 0;
  sumar(efectos, t0, dur, t => {
    const p = t / dur; lp += coef(150 + 9000 * p * p) * (ruido() - lp);
    fa = (fa + (120 + 1100 * p * p) / SR) % 1;
    return (lp * .8 + (2 * fa - 1) * .18 * p) * p * p;
  }, 0, vol);
}
function invertido(tGolpe, dur = .9, vol = .28) {
  let hp = 0, ant = 0;
  sumar(efectos, tGolpe - dur, dur, t => { const n = ruido(); hp = .7 * (hp + n - ant); ant = n; return hp * Math.pow(t / dur, 3); }, 0, vol);
}
function impacto(t0, vol = .8) {
  let fase = 0, lp = 0;
  sumar(efectos, t0, 3.0, t => {
    fase += TAU * (34 + 90 * Math.exp(-t * 9)) / SR; lp += coef(900) * (ruido() - lp);
    return Math.tanh(1.5 * Math.sin(fase) * Math.exp(-t * 2.4)) * .9 + lp * Math.exp(-t * 7) * .6;
  }, 0, vol);
}
function soplo(t0, dur = .55, vol = .22, pan = -.6) {
  let lp = 0, lp2 = 0;
  sumar(efectos, t0, dur, t => { const p = t / dur, c = coef(400 + 5200 * Math.sin(Math.PI * p)); lp += c * (ruido() - lp); lp2 += c * (lp - lp2); return lp2 * Math.sin(Math.PI * p) * 1.6; }, pan, vol);
}
function chasquido(t0, vol = .35) {
  let fase = 0, hp = 0, ant = 0;
  sumar(efectos, t0, .25, t => { fase += TAU * (60 + 160 * Math.exp(-t * 40)) / SR; const n = ruido(); hp = .85 * (hp + n - ant); ant = n; return Math.sin(fase) * Math.exp(-t * 14) + hp * Math.exp(-t * 55) * .5; }, 0, vol);
}
function tic(t0, f = 3000, vol = .06, pan = 0) { sumar(efectos, t0, .025, t => Math.sin(TAU * f * t) * Math.exp(-t * 200), pan, vol); }
function sello(t0) {
  let lp = 0, fase = 0;
  sumar(efectos, t0, 1.4, t => { lp += coef(2500) * (ruido() - lp); fase += TAU * (70 - 30 * Math.min(1, t * 4)) / SR; return lp * Math.exp(-t * 18) * 1.1 + Math.tanh(2 * Math.sin(fase) * Math.exp(-t * 4)); }, 0, .7);
}

/* ---------- La canción, pulso a pulso ---------- */
const nPulsos = Math.round(DUR / P);
for (let n = 0; n < nPulsos; n++) {
  const t = n * P, s = seccion(t), a = ACORDES[acordeDe(t)], enCompas = n % 4, lleno = LLENO.has(s);
  // bombo
  if (["verso", "verso2", "sube", "ritmo", "sube2", "sube3"].includes(s) || lleno) bombo(t, s === "verso" ? .85 : 1);
  if (s === "quiebre" && enCompas === 0) bombo(t, .55);
  // palmas en 2 y 4
  if ((["verso2", "ritmo", "sube2"].includes(s) || lleno) && enCompas % 2 === 1) palmas(t, .5);
  // charles: contratiempo abierto y semicorcheas cerradas
  if (s !== "intro" && !s.startsWith("hueco") && s !== "final") {
    charles(t + P / 2, lleno || s === "ritmo", lleno ? .16 : .1);
    if (s !== "verso") for (const q of [1, 3]) charles(t + q * P / 4, false, .05, -.25);
  }
  if (s === "intro" || s === "quiebre") charles(t + P / 2, false, .06);
  // bajo: corcheas a contratiempo en el verso, semicorcheas que ruedan desde que arranca la cadena
  if (s === "verso") bajo(t + P / 2, P / 2 - .02, a.raiz, 600, .45);
  if (["verso2", "sube", "ritmo", "sube2", "sube3"].includes(s) || lleno) for (let q = 0; q < 4; q++) bajo(t + q * P / 4, P / 4 - .015, a.raiz + (q === 0 ? 0 : 12), lleno ? 1100 : 800, q === 0 ? .55 : .4);
  if (s === "quiebre" && enCompas === 0) bajo(t, COMPAS - .05, a.raiz, 300, .4);
  if (s === "intro") bajo(t, .18, 33, 200, .5);
  // arpegio en semicorcheas sobre las notas del acorde
  if (["verso2", "sube", "ritmo", "sube2", "sube3", "quiebre"].includes(s) || lleno) {
    const patron = [0, 2, 1, 3, 2, 1, 3, 2];
    for (let q = 0; q < 4; q++) {
      const paso = (n * 4 + q) % 8;
      pulsacion(t + q * P / 4, a.arp[patron[paso] % 4] + (paso === 7 ? 12 : 0), s === "quiebre" ? .28 : .4, paso % 2 ? .45 : -.45, lleno ? 4200 : 2600);
    }
  }
  // acordes: anchos y abiertos en las caídas, oscuros y cerrados en el resto
  if (enCompas === 0) {
    if (lleno) sierras(t, COMPAS - .05, a.sierras, 3000, .065);
    else if (s === "intro" || s === "verso" || s === "verso2") colchonOscuro(t, COMPAS - .05, a.sierras, s === "verso2" ? 1400 : 700, .045);
    else if (s === "quiebre") colchonOscuro(t, COMPAS - .05, a.sierras, 900, .055);
    else if (s === "ritmo" || s === "sube2" || s === "sube" || s === "sube3") colchonOscuro(t, COMPAS - .05, a.sierras, 1800, .045);
  }
}
// subidas, redobles, silencios y golpes en los cortes
subida(0, B(4), .22); invertido(B(4), 1.0, .2);
redoble(B(20), B(23)); subida(B(19), B(5), .3); invertido(B(24), .45);
platillo(B(24)); impacto(B(24), .7);
subida(B(52), B(4), .22); platillo(B(56)); impacto(B(56), .45);
invertido(B(72), .45, .3); platillo(B(72), .3);
redoble(B(84), B(87)); subida(B(83), B(5), .32); invertido(B(88), .45);
// final: golpe grave, platillo y acorde ancho de La menor con novena que se apaga
impacto(B(88), .85); platillo(B(88), .4);
sierras(B(88), 2.9, [45, 57, 60, 64, 69, 71, 76], 2200, .055, .01);
bajo(B(88), 2.8, 33, 400, .5);
for (let i = 0; i < 8; i++) pulsacion(B(88) + 1.0 + i * P / 2, [81, 76, 72, 69, 76, 72, 69, 64][i], .18 * (1 - i / 9), i % 2 ? .4 : -.4, 1800);

// «Pronto.»: el acorde del logo se apaga, sube un barrido invertido y cae un último golpe grave con La menor abajo
invertido(B(96), 1.2, .32); impacto(B(96), .9); platillo(B(96), .3);
sierras(B(96), 2.6, [33, 45, 52, 57], 1200, .07, .005); bajo(B(96), 2.6, 33, 300, .55);

/* ---------- Efectos sincronizados con la imagen ---------- */
const X = LINEA.salida;
// 1. Mente + Mundo = Experiencia: el primer golpe del video
soplo(X(1, 1.1), X(1, 1.66) - X(1, 1.1) + .05, .25, 0); chasquido(B(4), .45); impacto(B(4), .55); golpeAcorde(B(4), ACORDES.Am.sierras, .1); platillo(B(4), .25);
// 2. la cadena: cada mezcla entra con un soplo y revienta con un acorde sobre el pulso
[3.6, 4.45, 5.25, 6.05].forEach((t0, i) => { soplo(X(2, t0), .4, .12, i % 2 ? .6 : -.6); const g = B(13 + 3 * i); chasquido(g, .35); golpeAcorde(g, ACORDES[["Am", "F", "C", "G"][i]].sierras, .085); });
// 3. el muro de fichas y las dos cifras
for (let i = 0; i < 50; i++) tic(X(3, 7.62 + azar() * .98), 2400 + azar() * 2400, .05, azar() * 2 - 1);
for (let i = 0; i < 22; i++) tic(X(3, 8.05 + .8 * (1 - Math.pow(1 - i / 22, 2))), 1800 + i * 70, .07);
chasquido(B(28), .3); golpeAcorde(B(28), ACORDES.C.sierras, .08);
for (let i = 0; i < 28; i++) tic(X(3, 8.85 + 1.1 * (1 - Math.pow(1 - i / 28, 2))), 2000 + i * 70, .07);
chasquido(B(32), .35); golpeAcorde(B(32), ACORDES.Am.sierras, .09);
// telones de color en cada corte
LINEA.CORTES.slice(1).forEach((tc, i) => soplo(tc - .32, .62, .26, i % 2 ? .6 : -.6));
// 4. misiones: entran las tarjetas y luego la cita
soplo(B(36) + .05, .6, .14, .4); chasquido(X(4, 13.0), .25);
// 5. el plano se enciende pulso a pulso, en La menor, y la meta revienta
[69, 72, 76, 79, 81].forEach((m, i) => { pulsacion(B(51 + i), m, .45, i % 2 ? .4 : -.4, 4500); tic(B(51 + i), 3200, .05); });
chasquido(B(56), .45); golpeAcorde(B(56), ACORDES.Am.sierras, .1);
// 6. evidencia y mito: silencio de un pulso y el sello cae sobre el golpe
soplo(X(6, 19.5) - .05, .5, .14, .5); tic(X(6, 20.45), 2600, .08); tic(X(6, 20.5), 3200, .07);
soplo(X(6, 21.0), .35, .1, -.5); chasquido(X(6, 21.05), .2); sello(B(72)); impacto(B(72), .55);
// 7. capturas del juego
[23.45, 24.2, 24.95].forEach((t0, i) => soplo(X(7, t0) - .05, .45, .15, [0, .7, -.7][i]));
// 8. el logo
chasquido(X(8, 26.75), .3); [81, 84, 88].forEach((m, i) => pulsacion(X(8, 26.8) + i * .06, m, .22, i - 1, 5000));

/* ---------- Mezcla final ---------- */
// todo lo armónico se agacha con cada bombo; los acordes anchos, más, para que respiren
const agache = (prof, tau) => { const d = new Float32Array(N).fill(1); for (const tk of bombos) { const i0 = Math.round(tk * SR), n = Math.round(P * SR); for (let i = 0; i < n && i0 + i < N; i++) d[i0 + i] = Math.min(d[i0 + i], 1 - prof * Math.exp(-i / SR * tau)); } return d; };
const dGraves = agache(.55, 14), dAncho = agache(.75, 7), dArp = agache(.35, 12);
const L = new Float32Array(N), R = new Float32Array(N);
let pico = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, fin = t > DUR - 2.2 ? Math.max(0, (DUR - t) / 2.2) : 1, entrada = Math.min(1, t / .03);
  const m = (b, k) => b.L[i] * k, n = (b, k) => b.R[i] * k;
  const l = (m(bateria, .42) + m(graves, .55 * dGraves[i]) + m(ancho, .9 * dAncho[i]) + m(arpegio, 1.4 * dArp[i]) + m(efectos, 1.1)) * fin * entrada;
  const r = (n(bateria, .42) + n(graves, .55 * dGraves[i]) + n(ancho, .9 * dAncho[i]) + n(arpegio, 1.4 * dArp[i]) + n(efectos, 1.1)) * fin * entrada;
  L[i] = l; R[i] = r; pico = Math.max(pico, Math.abs(l), Math.abs(r));
}
if (process.env.MEDIR) {
  const rms = (b, k, a, z) => { let s = 0, c = 0; for (let i = Math.round(a * SR); i < Math.round(z * SR); i++) { s += (b.L[i] * k) ** 2 + (b.R[i] * k) ** 2; c += 2; } return (10 * Math.log10(s / c + 1e-12)).toFixed(1); };
  for (const [k_, [a, z]] of Object.entries(S)) console.log(k_.padEnd(8), "bateria", rms(bateria, .42, a, z), "| graves", rms(graves, .55, a, z), "| ancho", rms(ancho, .9, a, z), "| arpegio", rms(arpegio, 1.4, a, z), "| efectos", rms(efectos, 1.1, a, z));
}
const g = .89 / pico, buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.tanh(L[i] * g * 1.2) / Math.tanh(1.2) * 32000), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.tanh(R[i] * g * 1.2) / Math.tanh(1.2) * 32000), 46 + i * 4);
}
const ruta = path.join(__dirname, "audio.wav");
fs.writeFileSync(ruta, buf);
console.log("audio: " + ruta + " (" + DUR + " s, pico antes de normalizar " + pico.toFixed(2) + ")");
