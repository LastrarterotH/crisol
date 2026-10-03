const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const data = html.split('/*DATA-START*/')[1].split('/*DATA-END*/')[0];
const ctx = {};
new Function('ctx', data + '\nObject.assign(ctx,{FAMILIAS,REFS,E,RECETAS,INICIALES,DESBLOQUEOS});')(ctx);
const { FAMILIAS, REFS, E, RECETAS, INICIALES, DESBLOQUEOS } = ctx;
const errs = [];
const ids = Object.keys(E);
const keys = new Map();
for (const [a, b, r] of RECETAS) {
  for (const x of [a, b, r]) if (!E[x]) errs.push('id inexistente: ' + x);
  const k = [a, b].sort().join('+');
  if (keys.has(k)) errs.push('receta duplicada: ' + k);
  keys.set(k, r);
}
for (const id of ids) {
  const d = E[id];
  if (!FAMILIAS[d.f]) errs.push('familia mala: ' + id);
  for (const k of d.refs || []) if (!REFS[k]) errs.push('ref inexistente ' + k + ' en ' + id);
  if (!(d.refs || []).length) errs.push('sin fuentes: ' + id);
  if (d.f !== 'base' && !RECETAS.some(r => r[2] === id)) errs.push('sin receta: ' + id);
  if (d.myth ? !(d.belief && d.evidence) : !d.why) errs.push('texto faltante: ' + id);
}
// alcanzabilidad simulando desbloqueos
const have = new Set(INICIALES);
let changed = true;
while (changed) {
  changed = false;
  const derived = [...have].filter(i => E[i].f !== 'base').length;
  for (const u of DESBLOQUEOS) if (derived >= u.tras && !have.has(u.id)) { have.add(u.id); changed = true; }
  for (const [a, b, r] of RECETAS) if (have.has(a) && have.has(b) && !have.has(r)) { have.add(r); changed = true; }
}
const unreach = ids.filter(i => !have.has(i));
if (unreach.length) errs.push('inalcanzables: ' + unreach.join(', '));
const emojis = ids.map(i => E[i].e); const dupE = emojis.filter((e, i) => emojis.indexOf(e) !== i);
if (dupE.length) errs.push('emoji repetido: ' + dupE.join(' '));
const unusedRefs = Object.keys(REFS).filter(k => !ids.some(i => (E[i].refs || []).includes(k)));
if (unusedRefs.length) console.log('refs sin uso:', unusedRefs.join(', '));
if (html.includes('—')) errs.push('hay em dash');
console.log('elementos:', ids.length, '| recetas:', RECETAS.length, '| mitos:', ids.filter(i => E[i].myth).length);
console.log(errs.length ? 'ERRORES:\n' + errs.join('\n') : 'OK: datos íntegros y todo alcanzable');
// syntax check del script completo
const script = html.split('<script>')[1].split('</script>')[0];
try { new Function(script); console.log('OK: sintaxis del script'); } catch (e) { console.log('ERROR sintaxis:', e.message); }
