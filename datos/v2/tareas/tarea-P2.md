# Tarea P2

Lee primero /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/REGLAS.md (incluye el filtro obligatorio), REFS.md y CATALOGO.md.
Escribe tu resultado en /Users/lastraroth/Code/alquimia-docente/datos/v2/pre-P2.json

Lee también /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/RECETAS.md.

## Objetivo
En esta versión casi toda mezcla entre fichas comunes debe producir algo, porque eso hace divertido el juego. Las 79 fichas de los niveles 0 a 3 son las que más se combinan. Tu trabajo: para cada ficha X de tu lista, recorre todas las fichas Y de ese conjunto (incluida X consigo misma) y decide si X + Y lleva de forma natural y defendible a una ficha R del catálogo completo.

Conjunto de los niveles 0 a 3: estudiante, contenido, pedagogia, tecnologia, tiempo, espacio, proposito, reflexiva, mapa, previos, significativo, zdp, metacognicion, autorregulado, espaciada, ritmo, situado, grupo, activo, cooperativo, problema, abp, proyectos, retro, recuperacion, bloom, inverso, investigacion_accion, enfoques_ensenanza, comunidad_practica, intercalada, dificultades_deseables, reaprendizaje, olvido, motivacion, experiencial, cambio_conceptual, pensamiento_critico, escribir, casos, retos, servicio, tps, gamificacion, abj, indagacion, practicas, perfil_egreso, curriculo, curriculo_oculto, gagne, syllabus, espiral, carga_trabajo, mente, mundo, otros, reflexion, experiencia, dialogo, memoria, comunidad, cambio, saber, practica, pregunta, error, emocion, lenguaje, escritura, herramienta, juego, docente, aprendizaje, universidad, investigacion, curiosidad, practica_deliberada, algoritmo

## Criterios
- La receta debe leerse como una frase con sentido para un docente de cualquier disciplina (por ejemplo, Diálogo + Error = Retroalimentación).
- R debe ser más elaborada que sus ingredientes (de mayor nivel que ambos, idealmente) y distinta de ellos.
- No repitas parejas que ya tienen receta.
- Evita atajos que lleven en una mezcla a fichas muy profundas (de nivel 6 o más): la gracia está en el camino.
- Si una pareja produce un concepto reconocido que no está en el catálogo, anótalo como sugerencia.
- Apunta a encontrar entre 3 y 8 recetas por cada ficha X. Calidad antes que cantidad, pero sé generoso.
- Cada receta lleva una nota (máximo ~28 palabras) que pasa el filtro obligatorio.

Formato: { "recetas": [ {"a":"","b":"","r":"","nota":""} ], "sugerencias": [ {"a":"","b":"","concepto":"","por_que":""} ] }

## Tu lista de fichas X
- 🌍 Mundo (mundo), nivel 0
- 🦋 Cambio (cambio), nivel 1
- 🌄 Experiencia (experiencia), nivel 1
- ✏️ Práctica (practica), nivel 1
- 📚 Saber (saber), nivel 1
- 🧶 Comunidad de práctica (comunidad_practica), nivel 2
- ❤️ Emoción (emocion), nivel 2
- 📅 Práctica espaciada (espaciada), nivel 2
- 🔬 Investigación (investigacion), nivel 2
- 🕸️ Mapa conceptual (mapa), nivel 2
- 🧭 Pedagogía (pedagogia), nivel 2
- ❓ Pregunta (pregunta), nivel 2
- 📦 Aprendizaje basado en proyectos (proyectos), nivel 2
- 🗺️ Aprendizaje situado (situado), nivel 2
- 🎲 Aprendizaje basado en juegos (abj), nivel 3
- 🔁 Aprendizaje autorregulado (autorregulado), nivel 3
- ⏳ Carga de trabajo del estudiante (carga_trabajo), nivel 3
- 🫱 Aprendizaje cooperativo (cooperativo), nivel 3
- 🏋️ Dificultades deseables (dificultades_deseables), nivel 3
- 🏫 Aula (espacio), nivel 3
- 9️⃣ Nueve eventos de instrucción (gagne), nivel 3
- 🃏 Práctica intercalada (intercalada), nivel 3
- 🔥 Motivación intrínseca (motivacion), nivel 3
- 🔃 Reaprendizaje sucesivo (reaprendizaje), nivel 3
- 🐢 Ritmo propio (ritmo), nivel 3
- 📋 Programa de asignatura centrado en el aprendizaje (syllabus), nivel 3
