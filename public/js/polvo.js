// Partículas sobre la mesa: destellos al mezclar, una nubecita al fallar y burbujas al borrar.
let cv, cx, particulas = [], corriendo = false;
export function iniciarPolvo(canvas) { cv = canvas; cx = cv.getContext("2d"); medir(); window.addEventListener("resize", medir); }
function medir() { if (!cv) return; const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * d; cv.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0); }
function bucle() {
  cx.clearRect(0, 0, cv.width, cv.height);
  particulas = particulas.filter(p => p.vida > 0);
  for (const p of particulas) {
    p.x += p.vx; p.y += p.vy; p.vx *= .965; p.vy = p.vy * .965 + p.g; p.vida -= p.decae;
    cx.globalAlpha = Math.max(0, p.vida) * p.a;
    cx.fillStyle = p.color;
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
  }
  cx.globalAlpha = 1;
  if (particulas.length) requestAnimationFrame(bucle); else { corriendo = false; cx.clearRect(0, 0, cv.width, cv.height); }
}
function arrancar() { if (!corriendo) { corriendo = true; medir(); requestAnimationFrame(bucle); } }
const reducido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export function rafaga(x, y, color = "#e0a01a", n = 46, fuerza = 1) {
  if (!cx || reducido()) return;
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * 6.283, v = (1.2 + Math.random() * 4.2) * fuerza;
    particulas.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 1, g: .05, r: .8 + Math.random() * 2.6, vida: 1, decae: .012 + Math.random() * .02, a: .55 + Math.random() * .45, color: Math.random() < .3 ? "#f2b53a" : color });
  }
  arrancar();
}
export function nube(x, y) {
  if (!cx || reducido()) return;
  for (let i = 0; i < 26; i++) {
    const ang = Math.random() * 6.283, v = .4 + Math.random() * 1.4;
    particulas.push({ x: x + (Math.random() - .5) * 30, y: y + (Math.random() - .5) * 14, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v * .5 - .3, g: -.004, r: 3 + Math.random() * 7, vida: 1, decae: .012 + Math.random() * .012, a: .14, color: "#9a9387" });
  }
  arrancar();
}
export function estela(x, y) {
  if (!cx || reducido()) return;
  for (let i = 0; i < 4; i++) particulas.push({ x: x + (Math.random() - .5) * 60, y: y + (Math.random() - .5) * 40, vx: (Math.random() - .5) * .8, vy: Math.random() * .6, g: .02, r: 1 + Math.random() * 3, vida: 1, decae: .02, a: .35, color: "#8cc3e6" });
  arrancar();
}
