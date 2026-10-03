# Tarea P3

Lee primero /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/REGLAS.md (incluye el filtro obligatorio), REFS.md y CATALOGO.md.
Escribe tu resultado en /Users/lastraroth/Code/alquimia-docente/datos/v2/pre-P3.json

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
- 🤝 Otros (otros), nivel 0
- 🏘️ Comunidad (comunidad), nivel 1
- 👥 Grupo (grupo), nivel 1
- 🧩 Problema real (problema), nivel 1
- 🧗 Aprendizaje basado en problemas (abp), nivel 2
- 🗓️ Currículo (curriculo), nivel 2
- 🪨 Error (error), nivel 2
- 🧑‍🎓 Estudiante (estudiante), nivel 2
- 🪁 Juego (juego), nivel 2
- 💭 Metacognición (metacognicion), nivel 2
- 🧐 Pensamiento crítico (pensamiento_critico), nivel 2
- 🧳 Conocimientos previos (previos), nivel 2
- 🧲 Práctica de recuperación (recuperacion), nivel 2
- 👫 Piensa, discute, comparte (tps), nivel 2
- 🏃 Aprendizaje activo (activo), nivel 3
- 📶 Taxonomía de Bloom (bloom), nivel 3
- 📂 Método de casos (casos), nivel 3
- 🐈 Curiosidad (curiosidad), nivel 3
- 🎚️ Enfoques de enseñanza (enfoques_ensenanza), nivel 3
- 🐚 Currículo en espiral (espiral), nivel 3
- 🎮 Gamificación (gamificacion), nivel 3
- 🔙 Diseño inverso (inverso), nivel 3
- 🎓 Perfil de egreso (perfil_egreso), nivel 3
- 🏔️ Aprendizaje basado en retos (retos), nivel 3
- 🤲 Aprendizaje-servicio (servicio), nivel 3
- 💻 Tecnología (tecnologia), nivel 3
