# Tarea C

Lee primero datos/tareas/REGLAS.md, datos/tareas/REFS_EXISTENTES.md y datos/tareas/CATALOGO.md (todas en /Users/lastraroth/Code/alquimia-docente).
Escribe tu resultado en /Users/lastraroth/Code/alquimia-docente/datos/parte-C.json

## EXISTENTE: grupo = 👥 Grupo [Metodologías]
Texto actual (no reescribir): Juntar estudiantes crea un grupo, pero no garantiza que aprendan juntos. Johnson y Johnson muestran que el trabajo grupal rinde cuando hay interdependencia positiva y responsabilidad individual; sin eso, es común que unos trabajen y otros miren.
Recetas (escribe una nota para cada una, con esta clave):
- "estudiante+estudiante": 🧑‍🎓 Estudiante (estudiante) + 🧑‍🎓 Estudiante (estudiante)

## EXISTENTE: activo = 🏃 Aprendizaje activo [Metodologías]
Texto actual (no reescribir): Cuando la pedagogía pone al estudiante a hacer y a pensar sobre lo que hace, aprende más. Freeman y colaboradores analizaron 225 estudios en carreras de ciencias, ingeniería y matemáticas: con clase expositiva tradicional, los estudiantes tenían 1,5 veces más probabilidad de reprobar que con aprendizaje activo, y los puntajes en exámenes subieron en promedio 0,47 desviaciones estándar.
Recetas (escribe una nota para cada una, con esta clave):
- "estudiante+pedagogia": 🧑‍🎓 Estudiante (estudiante) + 🧭 Pedagogía (pedagogia)
- "atencion10+reflexiva": ⏲️ La atención dura solo 10 minutos (atencion10) + 🪞 Práctica reflexiva (reflexiva)

## EXISTENTE: cooperativo = 🤝 Aprendizaje cooperativo [Metodologías]
Texto actual (no reescribir): La pedagogía convierte un grupo en un equipo cuando estructura la tarea. Johnson y Johnson identifican cinco elementos: interdependencia positiva, responsabilidad individual, interacción que promueve el aprendizaje del otro, habilidades sociales y procesamiento grupal. Con ellos, la cooperación supera de forma consistente al trabajo competitivo e individual en logro.
Recetas (escribe una nota para cada una, con esta clave):
- "grupo+pedagogia": 👥 Grupo (grupo) + 🧭 Pedagogía (pedagogia)

## EXISTENTE: problema = ❓ Problema auténtico [Metodologías]
Texto actual (no reescribir): Cuando el contenido aparece dentro de un contexto real, se presenta como un problema auténtico: algo que la disciplina realmente enfrenta, sin respuesta única ni datos perfectos. Es la materia prima de las metodologías basadas en problemas y en casos.
Recetas (escribe una nota para cada una, con esta clave):
- "contenido+situado": 🌍 Aprendizaje situado (situado) + 📚 Contenido (contenido)

## EXISTENTE: abp = 🧗 Aprendizaje basado en problemas [Metodologías]
Texto actual (no reescribir): Un problema auténtico trabajado en grupos pequeños antes de recibir la teoría: así nació el ABP en la Facultad de Medicina de la Universidad McMaster, a fines de los años sesenta. El problema activa lo que el grupo sabe, revela lo que necesita aprender y orienta el estudio autodirigido; el docente actúa como tutor.
Recetas (escribe una nota para cada una, con esta clave):
- "grupo+problema": ❓ Problema auténtico (problema) + 👥 Grupo (grupo)
- "cooperativo+problema": 🤝 Aprendizaje cooperativo (cooperativo) + ❓ Problema auténtico (problema)

## EXISTENTE: proyectos = 📦 Aprendizaje basado en proyectos [Metodologías]
Texto actual (no reescribir): Si el trabajo sobre un problema se extiende en el tiempo y termina en un producto concreto, pasas al aprendizaje basado en proyectos. Thomas lo caracteriza con cinco criterios: el proyecto es central y no un anexo, gira en torno a una pregunta motriz, implica investigación constructiva, lo conducen los estudiantes y es realista.
Recetas (escribe una nota para cada una, con esta clave):
- "abp+tiempo": 🧗 Aprendizaje basado en problemas (abp) + ⏰ Tiempo (tiempo)

## EXISTENTE: expositiva = 🎤 Clase expositiva [Metodologías]
Texto actual (no reescribir): Contenido entregado en un espacio y un tiempo compartidos: la clase magistral. Es eficiente para presentar mucha información a mucha gente, pero por sí sola deja al estudiante en el rol de oyente. En el metaanálisis de Freeman y colaboradores fue la condición de comparación frente al aprendizaje activo, y quedó en desventaja.
Recetas (escribe una nota para cada una, con esta clave):
- "contenido+presencial": 🏫 Presencialidad (presencial) + 📚 Contenido (contenido)
- "contenido+grupo": 📚 Contenido (contenido) + 👥 Grupo (grupo)

## EXISTENTE: peer = 🗳️ Instrucción entre pares [Metodologías]
Texto actual (no reescribir): La clase expositiva no desaparece: se interrumpe con preguntas conceptuales. En el método de Eric Mazur, el docente plantea una pregunta, cada estudiante vota, luego discute con quien tiene al lado y vuelve a votar. Crouch y Mazur reportaron diez años de mejoras en la comprensión conceptual en cursos de física de Harvard.
Recetas (escribe una nota para cada una, con esta clave):
- "activo+expositiva": 🎤 Clase expositiva (expositiva) + 🏃 Aprendizaje activo (activo)
- "grupo+respuesta_audiencia": 🙋 Sistemas de respuesta en el aula (respuesta_audiencia) + 👥 Grupo (grupo)

## EXISTENTE: invertida = 🔄 Aula invertida [Metodologías]
Texto actual (no reescribir): Si el contenido expositivo pasa a cápsulas que se ven antes de clase, el tiempo presencial queda libre para el trabajo activo, justo cuando el estudiante más necesita al docente. Lage, Platt y Treglia lo describieron como invertir el aula (2000), y Bergmann y Sams lo popularizaron como flipped classroom (2012).
Recetas (escribe una nota para cada una, con esta clave):
- "activo+capsula": 🎬 Cápsula de video (capsula) + 🏃 Aprendizaje activo (activo)
- "capsula+presencial": 🎬 Cápsula de video (capsula) + 🏫 Presencialidad (presencial)

## NUEVA: casos = 📂 Método de casos [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "pensamiento_critico+problema": ❓ Problema auténtico (problema) + 🧐 Pensamiento crítico (pensamiento_critico)

## NUEVA: retos = 🏔️ Aprendizaje basado en retos [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "problema+proyectos": 📦 Aprendizaje basado en proyectos (proyectos) + ❓ Problema auténtico (problema)

## NUEVA: servicio = 🤲 Aprendizaje-servicio [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "proyectos+situado": 📦 Aprendizaje basado en proyectos (proyectos) + 🌍 Aprendizaje situado (situado)
- "experiencial+proyectos": 🌀 Aprendizaje experiencial (experiencial) + 📦 Aprendizaje basado en proyectos (proyectos)

## NUEVA: jigsaw = 🧷 Rompecabezas de Aronson [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "contenido+cooperativo": 🤝 Aprendizaje cooperativo (cooperativo) + 📚 Contenido (contenido)
- "cooperativo+segmentacion": 🤝 Aprendizaje cooperativo (cooperativo) + ✂️ Segmentación (segmentacion)

## NUEVA: tps = 👫 Piensa, discute, comparte [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "activo+grupo": 🏃 Aprendizaje activo (activo) + 👥 Grupo (grupo)

## NUEVA: gamificacion = 🎮 Gamificación [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "motivacion+tecnologia": 🔥 Motivación intrínseca (motivacion) + 💻 Tecnología (tecnologia)

## NUEVA: abj = 🎲 Aprendizaje basado en juegos [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "contenido+gamificacion": 🎮 Gamificación (gamificacion) + 📚 Contenido (contenido)

## NUEVA: simulacion = 🩺 Simulación [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "situado+tecnologia": 🌍 Aprendizaje situado (situado) + 💻 Tecnología (tecnologia)
- "problema+tecnologia": ❓ Problema auténtico (problema) + 💻 Tecnología (tecnologia)

## NUEVA: indagacion = 🔦 Indagación guiada [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "andamiaje+problema": ❓ Problema auténtico (problema) + 🏗️ Andamiaje (andamiaje)
- "descubrimiento+reflexiva": 🗝️ Descubrimiento puro sin guía (descubrimiento) + 🪞 Práctica reflexiva (reflexiva)

## NUEVA: tutoria_pares = 🧑‍🤝‍🧑 Tutoría entre pares [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "grupo+zdp": 🌉 Zona de desarrollo próximo (zdp) + 👥 Grupo (grupo)

## NUEVA: practicas = 🧰 Prácticas profesionales [Metodologías]
Recetas (escribe una nota para cada una, con esta clave):
- "situado+tiempo": 🌍 Aprendizaje situado (situado) + ⏰ Tiempo (tiempo)
- "comunidad_practica+situado": 🌍 Aprendizaje situado (situado) + 🏘️ Comunidad de práctica (comunidad_practica)

## EXISTENTE: presencial = 🏫 Presencialidad [Modalidades]
Texto actual (no reescribir): Mismo lugar y mismo momento: la combinación más antigua. Johansen ordenó las formas de trabajo colaborativo en una matriz de tiempo y espacio; la presencialidad ocupa la celda donde ambos coinciden. Su fortaleza es la interacción inmediata; su límite, que exige a todos estar ahí a la vez.
Recetas (escribe una nota para cada una, con esta clave):
- "espacio+tiempo": ⏰ Tiempo (tiempo) + 📍 Espacio (espacio)

## EXISTENTE: virtual = 🌐 Entorno virtual [Modalidades]
Texto actual (no reescribir): La tecnología crea un espacio que no depende del lugar físico: el aula virtual. Moore distinguió tres interacciones que la educación a distancia debe diseñar a propósito: estudiante con contenido, estudiante con docente y estudiante con estudiante.
Recetas (escribe una nota para cada una, con esta clave):
- "espacio+tecnologia": 💻 Tecnología (tecnologia) + 📍 Espacio (espacio)

## EXISTENTE: sincronico = 📡 Sesión sincrónica [Modalidades]
Texto actual (no reescribir): Espacio virtual y tiempo compartido: la videoconferencia. Hrastinski encontró que lo sincrónico favorece la participación personal (motivación, sentido de comunidad, respuesta rápida), mientras que lo asincrónico favorece la participación cognitiva, porque da tiempo para reflexionar.
Recetas (escribe una nota para cada una, con esta clave):
- "tiempo+virtual": 🌐 Entorno virtual (virtual) + ⏰ Tiempo (tiempo)

## EXISTENTE: asincronico = 🗂️ Modalidad asincrónica [Modalidades]
Texto actual (no reescribir): Cuando el entorno virtual se combina con el ritmo propio, cada estudiante participa en su momento. Hrastinski mostró que esta modalidad favorece la participación cognitiva: con tiempo para pensar, los aportes suelen ser más elaborados.
Recetas (escribe una nota para cada una, con esta clave):
- "ritmo+virtual": 🌐 Entorno virtual (virtual) + 🐢 Ritmo propio (ritmo)

## EXISTENTE: blended = 🔀 Aprendizaje combinado [Modalidades]
Texto actual (no reescribir): Combinar presencialidad y entorno virtual no es sumar horas de cada uno. Garrison y Kanuka definen el blended learning como la integración reflexiva de experiencias presenciales y en línea, rediseñando qué conviene hacer en cada espacio.
Recetas (escribe una nota para cada una, con esta clave):
- "presencial+virtual": 🏫 Presencialidad (presencial) + 🌐 Entorno virtual (virtual)

## EXISTENTE: hyflex = 🎛️ HyFlex [Modalidades]
Texto actual (no reescribir): Si al curso combinado le sumas el ritmo propio, aparece el modelo híbrido flexible de Beatty: en cada sesión, el estudiante elige participar en la sala, en línea de forma sincrónica o de forma asincrónica, y todas las rutas deben llevar a los mismos resultados de aprendizaje.
Recetas (escribe una nota para cada una, con esta clave):
- "blended+ritmo": 🔀 Aprendizaje combinado (blended) + 🐢 Ritmo propio (ritmo)

## EXISTENTE: coi = 🗣️ Comunidad de indagación [Modalidades]
Texto actual (no reescribir): Un grupo en un entorno virtual no forma comunidad por sí solo. Garrison, Anderson y Archer proponen que el aprendizaje en línea profundo requiere tres presencias: cognitiva (construir significado), social (sentirse parte) y docente (diseñar, facilitar y guiar).
Recetas (escribe una nota para cada una, con esta clave):
- "grupo+virtual": 🌐 Entorno virtual (virtual) + 👥 Grupo (grupo)

## NUEVA: aula_activa = 🪑 Aula de aprendizaje activo [Modalidades]
Recetas (escribe una nota para cada una, con esta clave):
- "espacio+pedagogia": 🧭 Pedagogía (pedagogia) + 📍 Espacio (espacio)
- "activo+presencial": 🏫 Presencialidad (presencial) + 🏃 Aprendizaje activo (activo)

## NUEVA: ubicuo = 🗺️ Aprendizaje ubicuo [Modalidades]
Recetas (escribe una nota para cada una, con esta clave):
- "espacio+espacio": 📍 Espacio (espacio) + 📍 Espacio (espacio)

## NUEVA: movil = 📲 Aprendizaje móvil [Modalidades]
Recetas (escribe una nota para cada una, con esta clave):
- "tecnologia+ubicuo": 🗺️ Aprendizaje ubicuo (ubicuo) + 💻 Tecnología (tecnologia)
- "situado+virtual": 🌐 Entorno virtual (virtual) + 🌍 Aprendizaje situado (situado)

## NUEVA: distancia = 🛤️ Distancia transaccional [Modalidades]
Recetas (escribe una nota para cada una, con esta clave):
- "pedagogia+virtual": 🌐 Entorno virtual (virtual) + 🧭 Pedagogía (pedagogia)

## NUEVA: remota_emergencia = 🚨 Enseñanza remota de emergencia [Modalidades]
Recetas (escribe una nota para cada una, con esta clave):
- "expositiva+sincronico": 📡 Sesión sincrónica (sincronico) + 🎤 Clase expositiva (expositiva)

## NUEVA: emoderacion = 🪜 Modelo de cinco etapas de Salmon [Modalidades]
Recetas (escribe una nota para cada una, con esta clave):
- "andamiaje+coi": 🗣️ Comunidad de indagación (coi) + 🏗️ Andamiaje (andamiaje)
- "andamiaje+asincronico": 🗂️ Modalidad asincrónica (asincronico) + 🏗️ Andamiaje (andamiaje)

