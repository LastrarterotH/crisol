// Sonido sintetizado con WebAudio: nada de archivos, todo se genera al vuelo.
import { E } from "./estado.js";
let ctx = null, maestro = null;
export function activarSonido() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    ctx = new C();
    maestro = ctx.createGain(); maestro.gain.value = .55; maestro.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
}
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const frec = semitono => 392 * Math.pow(2, semitono / 12);
function tono(f, inicio, dur, tipo = "sine", vol = .18) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, inicio);
  g.gain.setValueAtTime(0, inicio); g.gain.linearRampToValueAtTime(vol, inicio + .012); g.gain.exponentialRampToValueAtTime(.0008, inicio + dur);
  o.connect(g); g.connect(maestro); o.start(inicio); o.stop(inicio + dur + .05);
  return o;
}
function ruido(inicio, dur, vol, frecuencia, q = 1.2) {
  const n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = buf; f.type = "bandpass"; f.frequency.value = frecuencia; f.Q.value = q; g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(maestro); s.start(inicio);
}
const listo = () => E.sonido && ctx && ctx.state === "running";
export const sonar = {
  toque() { if (!listo()) return; ruido(ctx.currentTime, .045, .25, 3200, 2.5); },
  exito(nivel = 1) {
    if (!listo()) return; const t = ctx.currentTime, b = Math.min(nivel, 6);
    tono(frec(PENTA[b]), t, .35, "triangle", .14); tono(frec(PENTA[b + 2]), t + .07, .45, "sine", .12); ruido(t, .18, .12, 5200, .8);
  },
  nuevo(nivel = 1) {
    if (!listo()) return; const t = ctx.currentTime, b = Math.min(nivel, 5);
    [0, 2, 4].forEach((p, i) => tono(frec(PENTA[b + p]), t + i * .085, .55, i === 2 ? "sine" : "triangle", .13));
    tono(frec(PENTA[b + 4]) * 2, t + .3, .7, "sine", .05);
  },
  fallo() {
    if (!listo()) return; const t = ctx.currentTime;
    const o = tono(220, t, .3, "sine", .12); o.frequency.exponentialRampToValueAtTime(130, t + .28); ruido(t, .25, .1, 700, .7);
  },
  hito() {
    if (!listo()) return; const t = ctx.currentTime;
    [0, 4, 7, 12].forEach((p, i) => tono(frec(p), t + i * .06, 1.1, "sine", .1)); tono(frec(24), t + .25, 1.2, "triangle", .05);
  },
  meta() {
    if (!listo()) return; const t = ctx.currentTime;
    [0, 4, 7, 12, 16, 19, 24].forEach((p, i) => tono(frec(p), t + i * .09, .9, i % 2 ? "triangle" : "sine", .11));
    [0, 7, 12].forEach(p => tono(frec(p) / 2, t + .7, 1.8, "sine", .08));
  },
  borrar() { if (!listo()) return; const t = ctx.currentTime; for (let i = 0; i < 4; i++) ruido(t + i * .16, .22, .14, 900 + i * 200, .6); },
  chispa() { if (!listo()) return; const t = ctx.currentTime; tono(frec(26), t, .25, "sine", .08); tono(frec(31), t + .06, .3, "sine", .06); },
  pensando() { if (!listo()) return; const t = ctx.currentTime; tono(frec(12), t, .2, "sine", .05); tono(frec(16), t + .12, .25, "sine", .04); }
};
