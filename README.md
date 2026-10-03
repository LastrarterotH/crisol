# Alquimia Docente

Juego serio de combinación (estilo Infinite Craft) para docentes de educación superior.

- `index.html`: página publicada como artifact (se genera, no editar a mano).
- `src/`: plantilla (`cuerpo.html`), estilos (`estilos.css`) y lógica (`motor.js`).
- `datos/`: contenido. `recetas.txt` (grafo base), `catalogo.json` (fichas nuevas y rutas), `parte-*.json` (textos), `pre-P*.json` (preanálisis de parejas), `ajustes.json` (correcciones manuales: textos, recetas extra o a quitar), `analizadas.json` (fichas cuyas parejas están preanalizadas), `sugerencias.json` (conceptos propuestos que aún no están en el juego).
- `node build.js`: une, valida (colisiones, alcanzabilidad, emojis, rayas largas, referencias) y escribe `index.html`.
- `node grafo.js --tiers`: valida solo el grafo de `recetas.txt`.
- Agregar `#revision` a la URL muestra todas las fichas y sus caminos, para revisar el contenido.
