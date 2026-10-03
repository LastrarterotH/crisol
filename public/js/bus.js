// Bus de eventos mínimo entre módulos.
const oyentes = {};
export const on = (ev, fn) => { (oyentes[ev] = oyentes[ev] || []).push(fn); };
export const emitir = (ev, datos) => { for (const fn of oyentes[ev] || []) { try { fn(datos); } catch (e) { console.error(ev, e); } } };
