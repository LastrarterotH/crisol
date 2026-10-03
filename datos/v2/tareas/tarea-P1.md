# Tarea P1

Lee primero /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/REGLAS.md (incluye el filtro obligatorio), REFS.md y CATALOGO.md.
Escribe tu resultado en /Users/lastraroth/Code/alquimia-docente/datos/v2/pre-P1.json

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
- 🧠 Mente (mente), nivel 0
- ⏰ Tiempo (tiempo), nivel 0
- 💬 Diálogo (dialogo), nivel 1
- 🗄️ Memoria (memoria), nivel 1
- 🪞 Reflexión (reflexion), nivel 1
- 🌱 Aprendizaje (aprendizaje), nivel 2
- 🧑‍🏫 Docente (docente), nivel 2
- ✍️ Escritura (escritura), nivel 2
- 🔨 Herramienta (herramienta), nivel 2
- 🗨️ Lenguaje (lenguaje), nivel 2
- 🍂 Curva del olvido (olvido), nivel 2
- 🎹 Práctica deliberada (practica_deliberada), nivel 2
- 🎯 Propósito (proposito), nivel 2
- 📓 Práctica reflexiva (reflexiva), nivel 2
- 🏛️ Universidad (universidad), nivel 2
- 🔣 Algoritmo (algoritmo), nivel 3
- 💡 Cambio conceptual (cambio_conceptual), nivel 3
- 📖 Contenido (contenido), nivel 3
- 👻 Currículo oculto (curriculo_oculto), nivel 3
- 🖊️ Escribir para aprender (escribir), nivel 3
- 🌀 Aprendizaje experiencial (experiencial), nivel 3
- 🔦 Indagación guiada (indagacion), nivel 3
- ♻️ Investigación-acción (investigacion_accion), nivel 3
- 🧰 Prácticas profesionales (practicas), nivel 3
- 📣 Retroalimentación (retro), nivel 3
- 🔗 Aprendizaje significativo (significativo), nivel 3
- 🌉 Zona de desarrollo próximo (zdp), nivel 3
