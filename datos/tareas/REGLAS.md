# Reglas para escribir fichas de Alquimia Docente

Alquimia Docente es un juego serio de combinación (estilo Infinite Craft) para **docentes de educación superior**. Se combinan dos fichas y aparece un concepto de docencia universitaria. Cada ficha se muestra como una "ficha de estudio" que el docente lee para aprender. La veracidad es lo más importante: el usuario pidió explícitamente que todo sea "100 % verídico".

## Idioma y estilo
- Español latinoamericano neutro. Tuteo (tú puedes, tienes). NUNCA voseo ni giros argentinos.
- NUNCA uses la raya larga "—" (em dash). Usa comas, dos puntos, punto o paréntesis.
- Frases claras y directas, sin jerga innecesaria. Público: docentes universitarios de cualquier disciplina.
- Ejemplos siempre de educación superior (cursos universitarios), nunca de colegio.

## Veracidad (estricto)
- Solo afirmaciones que un especialista en educación aceptaría. Si una idea es discutida, dilo con honestidad (por ejemplo "la evidencia es mixta", "el efecto es pequeño").
- Referencias: de 1 a 3 por ficha, en APA 7, SOLO obras que estés seguro de que existen tal cual (autores, año, título, revista o editorial). Prefiere obras fundacionales, muy citadas y metaanálisis conocidos. Si no recuerdas con certeza el volumen, el número o las páginas, OMITE esos datos. Nunca inventes DOI, páginas ni títulos. Usa _guiones bajos_ para marcar la cursiva APA (título del libro, o nombre de la revista y volumen), igual que en las referencias existentes.
- Cifras: úsalas solo si estás seguro (por ejemplo, el número de estudios de un metaanálisis famoso). Si dudas, describe el hallazgo sin números.
- Citas textuales ("q"): solo si conoces la cita exacta con total certeza. Si la traduces tú, el autor va como "Nombre Apellido (año), traducción propia". En la duda, NO pongas cita. La mayoría de las fichas no la llevan.
- Puedes reutilizar las referencias existentes por su clave (lista en REFS_EXISTENTES.md). Si agregas una nueva, dale una clave corta tipo apellido+año (ej. "sweller88"); si ya existe esa clave con otra obra, agrega una letra (sweller88b).

## Campos de cada ficha NUEVA
- "pista": UNA frase de máximo 20 palabras que describa el concepto como adivinanza, SIN nombrarlo ni usar palabras de su nombre. Se muestra como silueta en las rutas ("Llega a: ...").
- "why": 2 a 4 oraciones (máximo ~90 palabras). Qué es el concepto, por qué surge de combinar sus ingredientes (en general) y qué dice la investigación. Menciona a los autores clave como aparecen en las referencias.
- "uni": UNA oración (máximo ~35 palabras) con un ejemplo concreto en una clase universitaria.
- "refs": lista de claves de referencias.
- "q": opcional, { "t": "cita", "a": "Autor (año)" }.
- Fichas de familia "mito": en vez de "why" usan "belief" (lo que se cree, máximo ~30 palabras) y "evidence" (2 a 4 oraciones con lo que dice la investigación). No escribas "tip".

## Fichas EXISTENTES (ya escritas)
- NO reescribas su texto. Solo agrega su "pista" (mismas reglas de arriba).

## Notas de receta
- Para CADA receta de tus fichas (nuevas y existentes) escribe una "nota" de máximo ~30 palabras que explique por qué ESA pareja lleva a ese resultado. Cada camino debe mostrar una faceta distinta del concepto: no repitas la misma nota en recetas distintas.
- La clave de la nota es "idA+idB" con los dos ids ordenados alfabéticamente (tal como aparece en tu tarea).

## Formato de salida
Escribe un archivo JSON válido (UTF-8) en la ruta que indica tu tarea, con esta forma exacta:
{
  "refs": { "clave": "Referencia APA completa" },
  "fichas": {
    "id_nueva": { "pista": "...", "why": "...", "uni": "...", "refs": ["clave"] },
    "id_mito": { "pista": "...", "belief": "...", "evidence": "...", "refs": ["clave"] },
    "id_existente": { "pista": "..." }
  },
  "notas": { "idA+idB": "..." }
}
Valida el JSON antes de terminar (por ejemplo con `node -e "JSON.parse(require('fs').readFileSync('RUTA','utf8'))"`). Revisa que no haya ningún "—". Al terminar, responde con un resumen breve: cuántas fichas, notas y referencias nuevas escribiste, y cualquier duda de veracidad que tengas (referencias de las que no estés 100 % seguro).
