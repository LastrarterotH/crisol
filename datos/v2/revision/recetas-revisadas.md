# Revisión de validez de las recetas (7 de octubre de 2026)

Criterio: quien ve A + B en el plano tiene que entender por qué da R, antes de leer la nota. Se revisaron las 1667 recetas agrupadas por resultado. Se quitaron las que solo repetían una palabra (A + A sin sentido propio), las que iban al revés y las que unían ideas sin relación; las recetas del camino de una misión se reemplazaron por otras válidas, sin perder piezas clave.

Lo genera `tareas/aplicar-recetas.js` desde `revision/recetas-decision.json`; `tareas/comparar-planos.js` muestra el efecto en cada plano y `tareas/receta.js` dice si un par está libre.

## Recetas del camino que cambiaron (11)
- **Práctica**: antes Tiempo + Tiempo; ahora Experiencia + Tiempo. Vuelve a la misma experiencia una y otra vez, con días de por medio, y estarás practicando. Lo que al principio exigía atención en cada paso se vuelve fluido.
- **Mapa conceptual**: antes Saber + Saber; ahora Memoria + Saber. Un saber guardado en la memoria como lista suelta se pierde con facilidad. Organizado con relaciones explícitas entre conceptos, se convierte en un mapa conceptual.
- **Teoría de la carga cognitiva**: antes Estudiante + Segmentación; ahora Contenido + Memoria. La memoria de trabajo retiene pocos elementos nuevos a la vez. Si el contenido llega todo junto, la desborda. De ahí parte la teoría de la carga cognitiva.
- **Lectura disciplinar**: antes Escritura + Experto y novato; ahora Experto y novato + Alfabetización académica. Un historiador y un novato leen la misma fuente, y el experto pregunta quién la escribió, cuándo y para qué. La alfabetización académica enseña esa lectura propia de cada disciplina.
- **Copilot**: antes ChatGPT + Práctica; ahora ChatGPT + Herramienta. Lleva un asistente del mismo tipo que ChatGPT dentro de tus herramientas de oficina, como el procesador de texto, la planilla o el correo, y tienes Copilot, de Microsoft.
- **Claude**: antes IA generativa + Lenguaje; ahora IA generativa + Escritura. Una IA generativa a la que le pides redactar, resumir o revisar textos, incluso documentos largos que le adjuntas: así trabaja Claude, de Anthropic.
- **Gemini Notebook**: antes Gemini + Memoria; ahora Gemini + Contenido. Entrégale a Gemini el contenido de tu curso, lecturas y apuntes, y responderá solo desde esos materiales. Así funciona Gemini Notebook, antes llamado NotebookLM.
- **Google Scholar**: antes Movidas retóricas + Wikipedia; ahora Wikipedia + Investigación. La Wikipedia te da una primera idea del tema y sus referencias apuntan a la investigación publicada. Para buscar directamente en esos artículos, tesis y libros está Google Scholar.
- **Desmos**: antes Representaciones múltiples + Simulador de tareas parciales; ahora Representaciones múltiples + Sistemas de respuesta en el aula. Gráfica, tabla y ecuación de una misma función, en actividades donde ves en vivo lo que responde cada estudiante: eso ofrece Desmos.
- **Google Classroom**: antes Competencia digital docente + TPACK; ahora Competencia digital docente + Entorno virtual. Un entorno virtual sencillo, pensado para que un docente que recién gana competencia digital publique tareas, avisos y comentarios en minutos: Google Classroom.
- **Tabla de posiciones**: antes Kahoot! + Motivación autónoma; ahora Kahoot! + Gamificación. El podio que aparece entre pregunta y pregunta en Kahoot! es un elemento de gamificación muy conocido, la tabla de posiciones, que ordena al curso por puntaje.

## Alternativas que se agregaron para que un concepto siga en su misión (3)
- Aumento (SAMR) + TPACK = **Modificación (SAMR)**. Pasar de mejorar una tarea con tecnología a rediseñarla pide mirar juntos contenido, didáctica y herramienta, como propone TPACK. Ese rediseño es el nivel de modificación.
- Gamificación + Motivación autónoma = **Efecto de sobrejustificación**. Si premias con puntos lo que el curso ya hacía por interés propio, la motivación autónoma puede caer cuando se acaban los premios. Eso es el efecto de sobrejustificación.
- Estudiante + Movidas retóricas = **Identidad de autor**. Cuando un estudiante aprende las movidas retóricas de su disciplina, como señalar el vacío que llena su trabajo, empieza a escribir con voz de autor dentro de ella.

Rutas fijadas en ajustes.json (misiones[id].ruta): memoria (Práctica intercalada = Problema real + Práctica espaciada), ia (Competencia digital = Nativos digitales + Práctica reflexiva), plataforma (Modificación (SAMR) = Aumento (SAMR) + TPACK), jugar_serio (Efecto de sobrejustificación = Gamificación + Motivación autónoma), leer_escribir_fuentes (Identidad de autor = Estudiante + Movidas retóricas).

## Alternativas que se quitaron (69)
No estaban en ningún plano y su resultado conserva otras recetas.
- Asistencia lingüística automática + Privacidad y ética de los datos = Accesibilidad digital
- Lenguaje + Otros = Alfabetización académica
- Aprendizaje + Herramienta = Analítica del aprendizaje
- Otros + Prácticas profesionales = Andamiaje
- Algoritmo + Gamificación = Aprendizaje adaptativo
- Aprendizaje + Aprendizaje = Aprendizaje autorregulado
- Aprendizaje basado en problemas + Mente = Aprendizaje autorregulado
- Experiencia + Experiencia = Aprendizaje experiencial
- Memoria + Memoria = Aprendizaje significativo
- Instrucción entre pares + PhET = Aula de aprendizaje activo
- Error + Herramienta = Aumento (SAMR)
- Práctica deliberada + Práctica deliberada = Autoeficacia
- Emoción + Conocimientos previos = Autoeficacia
- Modelado cognitivo + Motivación intrínseca = Autoeficacia
- Aprendizaje-servicio + Tecnología = Brecha digital
- Error + Error = Cambio conceptual
- Conocimientos previos + Conocimientos previos = Cambio conceptual
- Alfabetización en retroalimentación + Grammarly = Comentarios sin nota
- Currículo + Error = Conceptos umbral
- Docente + Universidad = Conocimiento pedagógico del contenido
- Herramienta + Otros = Conocimiento tecnopedagógico
- Aprendizaje basado en problemas + Mapa conceptual = Conocimientos previos
- Aprendizaje basado en problemas + Universidad = Currículo
- Comunidad + Reflexión = Currículo oculto
- Juego + Pregunta = Descubrimiento puro sin guía
- Gamificación + Investigación = Docencia informada por evidencia
- Práctica espaciada + Universidad = Efecto retroactivo de la evaluación
- Emoción + Escritura = Emociones de logro
- Emoción + Universidad = Emociones de logro
- Aprendizaje + Saber = Enfoque profundo de aprendizaje
- Memoria + Propósito = Enfoque profundo de aprendizaje
- Claude + Escritura = Escribir para aprender
- Mapa conceptual + Pregunta = Evaluación
- Curva del olvido + Práctica reflexiva = Evaluación diagnóstica
- Otros + Conocimientos previos = Evaluación diagnóstica
- Metacognición + Otros = Evaluación entre pares
- Mapa conceptual + Piensa, discute, comparte = Evaluación entre pares
- Error + Piensa, discute, comparte = Evaluación entre pares
- Práctica de recuperación + Universidad = Evaluación sumativa
- DeepL + Translenguaje = Fondos de conocimiento
- Juego + Juego = Gamificación
- Universidad + Universidad = Internet
- Práctica reflexiva + Práctica reflexiva = Investigación sobre la propia docencia (SoTL)
- Debriefing + Clase grabada = Más tecnología, más aprendizaje
- Comunidad de práctica + Otros = Modelado cognitivo
- Experiencia + Propósito = Modelo ARCS de motivación
- Emoción + Emoción = Motivación intrínseca
- Currículo oculto + Tecnología = Nativos digitales
- Docente + Curva del olvido = Nueve eventos de instrucción
- Mente + Universidad = Pensamiento crítico
- Pensamiento crítico + Tiempo = Perfil de egreso
- Propósito + Propósito = Perfil de egreso
- Pedagogía + Pedagogía = Práctica reflexiva
- Alucinaciones de la IA + Docencia informada por evidencia = Pregunta de indagación docente
- Otros + Universidad = Recursos educativos abiertos
- Mente + Práctica de recuperación = Releer y subrayar
- Alfabetización en retroalimentación + Retroalimentación automática = Retroalimentación sabia
- Evaluación entre pares + Google Sheets = Revisión entre pares de textos
- Diálogo + Informe de similitud = Seguridad psicológica
- Error + Mundo = Simulación
- Método de casos + Tiempo = Simulación
- Otros + Pregunta = Sistemas de respuesta en el aula
- Error + Grupo = Sistemas de respuesta en el aula
- Herramienta + Práctica reflexiva = Sustitución (SAMR)
- Mapa conceptual + Mapa conceptual = Taxonomía SOLO
- Aprendizaje basado en problemas + Aprendizaje basado en problemas = Teoría de la carga cognitiva
- Lenguaje + Lenguaje = Teoría de la carga cognitiva
- Claude + Gemini = Triangulación
- Aprendizaje + Lenguaje = Zona de desarrollo próximo

## Notas aclaradas sin cambiar la receta
- Procesamiento grupal + Tecnología = Miro. Al cerrar un trabajo en equipo, cada integrante pega en una pizarra digital notas sobre qué funcionó y qué cambiar. Miro sirve para ese procesamiento grupal.
- Las encuestas docentes miden el aprendizaje + Google Sheets = Tasa de respuesta. Antes de creer que la encuesta docente mide el aprendizaje, cuenta en una hoja cuántos respondieron sobre cuántos podían. Con una tasa de respuesta baja, el promedio dice poco.
- Conectivismo + Microsoft Teams = Canal del curso. Para el conectivismo aprendes en una red de personas y recursos que sigue activa. Un canal de Teams del curso mantiene viva esa red entre una clase y otra.
- Claude + Gemini Notebook = Alucinaciones de la IA. Pregunta lo mismo a Claude, que responde desde su entrenamiento, y a Gemini Notebook, que responde desde tus documentos. Donde no coinciden suele asomar algo inventado con aplomo, una alucinación.

## Casos que se discutieron y quedaron
- Mundo + Mundo = Problema real: es el clásico agua + agua de estos juegos, y la nota lo sostiene (dos partes del mundo que chocan). Cambiarla subía un nivel a Problema real y desarmaba los caminos de 23 misiones.
- Canvas (Programa + Accesibilidad digital), Moodle (Curso de alta estructura + Conocimiento tecnopedagógico) y Miro (Procesamiento grupal + Tecnología): sus ingredientes son funciones o usos reales de la herramienta, y son el único camino de varios conceptos en su misión.
- Claude + Gemini Notebook = Alucinaciones de la IA: comparar un asistente que responde de memoria con otro que responde desde tus fuentes es una forma real de detectar lo inventado; se reescribió la nota.
- Microsoft Teams + Conectivismo = Canal del curso y Google Sheets + "Las encuestas docentes miden el aprendizaje" = Tasa de respuesta: se reescribió la nota para que la relación se lea sola.

## Efecto
- 1667 recetas pasan a 1598.
- Ideas descubribles: 415 → 414. Sale Simulador de tareas parciales, que solo servía para fabricar Desmos con una relación forzada.
- Las 49 herramientas y todas las piezas clave siguen en su plano.
