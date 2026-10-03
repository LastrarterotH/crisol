# Tarea F2

Lee primero /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/REGLAS.md (incluye el filtro obligatorio), REFS.md y CATALOGO.md.
Escribe tu resultado en /Users/lastraroth/Code/alquimia-docente/datos/v2/filtro-F2.json

Pasas por el FILTRO OBLIGATORIO los textos ya escritos de estas fichas y sus notas de receta. No cambies hechos, cifras ni referencias. Corrige solo lo que el filtro detecta. Aprovecha para dar más vida a las pistas y las notas (ingenio, ejemplos concretos) sin perder precisión. Si un texto ya está bien, no lo incluyas.

Campos a revisar: pista, why, uni, belief, evidence y las notas. No toques "q" (citas) ni "refs".

Formato: { "fichas": { id: { campo: "texto corregido" } }, "notas": { "a+b": "nota corregida" }, "informe": [ { "id": "...", "campo": "...", "patrones": ["A10", ...] } ] }

## Fichas
### activo (Aprendizaje activo)
- pista: El estudiante deja de solo escuchar y pasa a hacer, resolver y pensar sobre lo que hace.
- why: Cuando la pedagogía pone al estudiante a hacer y a pensar sobre lo que hace, aprende más. Freeman y colaboradores analizaron 225 estudios en carreras de ciencias, ingeniería y matemáticas: con clase expositiva tradicional, los estudiantes tenían 1,5 veces más probabilidad de reprobar que con aprendizaje activo, y los puntajes en exámenes subieron en promedio 0,47 desviaciones estándar.
- uni: No exige eliminar la exposición: bastan pausas con preguntas, problemas en parejas o un minuto de escritura.
### cooperativo (Aprendizaje cooperativo)
- pista: Trabajo en equipo estructurado, donde cada integrante depende de los demás y responde por su propia parte.
- why: La pedagogía convierte un grupo en un equipo cuando estructura la tarea. Johnson y Johnson identifican cinco elementos: interdependencia positiva, responsabilidad individual, interacción que promueve el aprendizaje del otro, habilidades sociales y procesamiento grupal. Con ellos, la cooperación supera de forma consistente al trabajo competitivo e individual en logro.
- uni: Asignar roles con responsabilidades propias y evaluar también una parte individual evita que una sola persona cargue con el grupo.
### abp (Aprendizaje basado en problemas)
- pista: Nació en una facultad de medicina canadiense: primero llega la situación clínica por resolver y después la teoría.
- why: Un problema auténtico trabajado en grupos pequeños antes de recibir la teoría: así nació el ABP en la Facultad de Medicina de la Universidad McMaster, a fines de los años sesenta. El problema activa lo que el grupo sabe, revela lo que necesita aprender y orienta el estudio autodirigido; el docente actúa como tutor.
- uni: En el ABP el problema llega primero y la teoría después, al revés que en un ejercicio de aplicación.
### proyectos (Aprendizaje basado en proyectos)
- pista: Trabajo extendido durante semanas, guiado por una pregunta motriz, que termina en un producto concreto.
- why: Si el trabajo sobre un problema se extiende en el tiempo y termina en un producto concreto, pasas al aprendizaje basado en proyectos. Thomas lo caracteriza con cinco criterios: el proyecto es central y no un anexo, gira en torno a una pregunta motriz, implica investigación constructiva, lo conducen los estudiantes y es realista.
- uni: ABP y ABPy suelen confundirse: el primero se centra en resolver un problema; el segundo, en producir algo a lo largo de semanas.
### expositiva (Clase expositiva)
- pista: El docente habla y los estudiantes escuchan y toman apuntes: el formato universitario más antiguo.
- why: Contenido entregado en un espacio y un tiempo compartidos: la clase magistral. Es eficiente para presentar mucha información a mucha gente, pero por sí sola deja al estudiante en el rol de oyente. En el metaanálisis de Freeman y colaboradores fue la condición de comparación frente al aprendizaje activo, y quedó en desventaja.
- uni: Sigue siendo útil para dar una visión de conjunto o mostrar cómo razona una persona experta frente a un problema.
### peer (Instrucción entre pares)
- pista: Pregunta conceptual, voto individual, conversación con el compañero de al lado y nueva votación.
- why: La clase expositiva no desaparece: se interrumpe con preguntas conceptuales. En el método de Eric Mazur, el docente plantea una pregunta, cada estudiante vota, luego discute con quien tiene al lado y vuelve a votar. Crouch y Mazur reportaron diez años de mejoras en la comprensión conceptual en cursos de física de Harvard.
- uni: Funciona mejor con preguntas que dividan al curso: si casi todos aciertan o casi todos fallan, la discusión aporta poco.
### invertida (Aula invertida)
- pista: Lo que antes se explicaba en la sala se ve en casa, y la sesión se usa para trabajar.
- why: Si el contenido expositivo pasa a cápsulas que se ven antes de clase, el tiempo presencial queda libre para el trabajo activo, justo cuando el estudiante más necesita al docente. Lage, Platt y Treglia lo describieron como invertir el aula (2000), y Bergmann y Sams lo popularizaron como flipped classroom (2012).
- uni: La sesión parte de las dudas que dejó la cápsula y pasa rápido a problemas, casos o discusión.
### tck (Conocimiento tecnológico del contenido)
- pista: Saber qué herramienta representa mejor las ideas de tu disciplina, como un simulador para la física.
- why: La tecnología y el contenido se transforman mutuamente: una simulación cambia lo que se puede mostrar de la física y un sistema de información geográfica cambia cómo se estudia el territorio. Mishra y Koehler lo llaman TCK: saber qué tecnologías representan mejor tu disciplina.
- uni: Un software de geometría dinámica donde el estudiante arrastra un vértice y observa qué propiedades se conservan.
### tpk (Conocimiento tecnopedagógico)
- pista: Saber qué cambia en la forma de enseñar cuando una herramienta entra a la sala.
- why: Saber cómo cambian la enseñanza y el aprendizaje cuando se usa cierta herramienta: qué permite un foro que no permite la sala de clases, qué le hace un muro colaborativo a la participación. Es la intersección TPK del modelo TPACK.
- uni: Elegir un foro asincrónico para que participen quienes no hablan en clase, sabiendo que les da tiempo para pensar la respuesta.
### ia (IA generativa)
- pista: Máquina que redacta, dibuja o programa a partir de lo que le pides por escrito.
- why: Tecnología que produce texto, imágenes o código a partir de instrucciones. La guía de UNESCO para educación e investigación pide un enfoque centrado en las personas: proteger los datos, validar las herramientas antes de usarlas con estudiantes y no delegar en ellas el juicio pedagógico.
- uni: Su efecto depende de con qué la combines: sin diseño, puede ahorrarle al estudiante justo el esfuerzo que lo hace aprender.
### sustitucion (Sustitución (SAMR))
- pista: Primer peldaño de la escalera de Puentedura: cambias la herramienta, pero la tarea queda idéntica.
- why: Agregar tecnología a una clase expositiva sin cambiar la tarea es sustitución, el primer peldaño del modelo SAMR de Puentedura: la herramienta reemplaza a otra sin mejora funcional. Proyectar diapositivas en lugar de escribir en la pizarra es el ejemplo típico.
### aumento (Aumento (SAMR))
- pista: Segundo peldaño de Puentedura: la misma tarea, pero la herramienta le suma una mejora funcional.
- why: Con intención pedagógica, la misma tarea gana una mejora funcional: segundo peldaño de SAMR. La tarea sigue siendo la misma, pero la herramienta aporta algo que antes no estaba.
- uni: Un cuestionario en línea que entrega retroalimentación al instante en lugar de corregirse una semana después.
### modificacion (Modificación (SAMR))
- pista: Tercer peldaño de Puentedura: la herramienta permite rediseñar buena parte de la tarea.
- why: Tercer peldaño de SAMR: la tecnología permite rediseñar una parte importante de la tarea. Aquí se cruza la línea que Puentedura traza entre mejorar (sustitución y aumento) y transformar (modificación y redefinición).
- uni: El ensayo individual pasa a ser un documento compartido donde el curso comenta y mejora los borradores de otros.
### redefinicion (Redefinición (SAMR))
- pista: Peldaño más alto de Puentedura: tareas que sin la herramienta serían inconcebibles.
- why: Último peldaño de SAMR: la tecnología permite tareas que antes eran inconcebibles. Fíjate en cómo llegaste aquí: no sumando más tecnología, sino rediseñando la tarea con pedagogía. Un dato importante: SAMR no proviene de investigación con revisión de pares, y Hamilton, Rosenberg y Akcaoglu advierten que ignora el contexto, impone una jerarquía rígida y puede llevar a valorar el producto por sobre el proceso de aprendizaje.
- uni: Estudiantes de dos universidades analizan juntos datos abiertos y publican sus hallazgos para una audiencia externa.
### video (Clase grabada)
- pista: La exposición del profesor, disponible para verla cuando quieras y cuantas veces quieras.
- why: La clase expositiva liberada del horario: se puede ver cuando y cuantas veces se quiera. Pero grabar una clase larga tal cual desperdicia esa ventaja. En 6,9 millones de sesiones de video de edX, Guo, Kim y Rubin encontraron que la duración era el factor que más pesaba en el compromiso: el tiempo de visualización mediano no superaba los 6 minutos, sin importar cuánto durara el video.
### capsula (Cápsula de video)
- pista: Pieza audiovisual de pocos minutos que explica una sola idea.
- why: Una clase grabada dividida en segmentos breves, cada uno con una sola idea, aplica el principio de segmentación de Mayer y se ajusta a lo que Guo, Kim y Rubin observaron en video educativo: los videos cortos sostienen más la atención.
- uni: Una cápsula por concepto, de pocos minutos, con una pregunta al final para comprobar la comprensión.
### tutoria (Tutor con IA)
- pista: Un chatbot configurado para guiarte con pistas y preguntas, sin entregarte la solución.
- why: La IA con andamiaje da pistas en lugar de respuestas. Un experimento de campo en matemática escolar en Turquía lo mostró con claridad: quienes practicaron con ChatGPT sin restricciones resolvieron un 48% mejor los ejercicios de práctica, pero rindieron un 17% peor en el examen posterior sin IA. Con una versión configurada como tutor, que guiaba sin entregar la solución, ese efecto negativo prácticamente desapareció.
- uni: El estudio fue en enseñanza secundaria. Para la universidad, la lección de diseño es configurar la IA para que pida razonamiento y entregue pistas.
### competencia (Competencia digital)
- pista: Buscar, evaluar, crear y comunicar con tecnología: se aprende, no viene con el año de nacimiento.
- why: La competencia digital no viene con el año de nacimiento: se aprende y se enseña. El marco europeo DigComp 2.2 la organiza en cinco áreas: información y datos, comunicación y colaboración, creación de contenido digital, seguridad y resolución de problemas.
- uni: Enseñar a evaluar fuentes, citar y usar la IA con criterio es parte del curso, no algo que el estudiante ya trae.
### presencial (Presencialidad)
- pista: Todos en la misma sala y a la misma hora, como en la universidad de siempre.
- why: Mismo lugar y mismo momento: la combinación más antigua. Johansen ordenó las formas de trabajo colaborativo en una matriz de tiempo y espacio; la presencialidad ocupa la celda donde ambos coinciden. Su fortaleza es la interacción inmediata; su límite, que exige a todos estar ahí a la vez.
### virtual (Entorno virtual)
- pista: Un espacio de estudio que vive en internet: plataforma, foros y materiales sin edificio.
- why: La tecnología crea un espacio que no depende del lugar físico: el aula virtual. Moore distinguió tres interacciones que la educación a distancia debe diseñar a propósito: estudiante con contenido, estudiante con docente y estudiante con estudiante.
- uni: Un curso en la plataforma que solo aloja archivos PDF cubre una de las tres interacciones; faltan las otras dos.
### sincronico (Sesión sincrónica)
- pista: Todos conectados a la vez desde lugares distintos, viéndose por cámara.
- why: Espacio virtual y tiempo compartido: la videoconferencia. Hrastinski encontró que lo sincrónico favorece la participación personal (motivación, sentido de comunidad, respuesta rápida), mientras que lo asincrónico favorece la participación cognitiva, porque da tiempo para reflexionar.
- uni: Úsala para lo que necesita respuesta inmediata: dudas, debate y acompañamiento.
### asincronico (Modalidad asincrónica)
- pista: Cada uno entra cuando puede: foros, lecturas y tareas sin horario compartido.
- why: Cuando el entorno virtual se combina con el ritmo propio, cada estudiante participa en su momento. Hrastinski mostró que esta modalidad favorece la participación cognitiva: con tiempo para pensar, los aportes suelen ser más elaborados.
- uni: Un foro con una pregunta abierta y una semana de plazo produce respuestas más pensadas que una pregunta lanzada en vivo.
### blended (Aprendizaje combinado)
- pista: Parte del curso ocurre en la sala y parte en línea, rediseñando qué conviene en cada lugar.
- why: Combinar presencialidad y entorno virtual no es sumar horas de cada uno. Garrison y Kanuka definen el blended learning como la integración reflexiva de experiencias presenciales y en línea, rediseñando qué conviene hacer en cada espacio.
- uni: La exposición y la práctica individual van al entorno virtual; la discusión y el trabajo guiado, a la sala.
### hyflex (HyFlex)
- pista: En cada sesión el estudiante elige si asiste a la sala, se conecta en vivo o avanza después.
- why: Si al curso combinado le sumas el ritmo propio, aparece el modelo híbrido flexible de Beatty: en cada sesión, el estudiante elige participar en la sala, en línea de forma sincrónica o de forma asincrónica, y todas las rutas deben llevar a los mismos resultados de aprendizaje.
- uni: Exige diseñar tres rutas equivalentes; poner una cámara en la sala no basta.
### coi (Comunidad de indagación)
- pista: Tres presencias, cognitiva, social y docente, para que un curso en línea piense en conjunto.
- why: Un grupo en un entorno virtual no forma comunidad por sí solo. Garrison, Anderson y Archer proponen que el aprendizaje en línea profundo requiere tres presencias: cognitiva (construir significado), social (sentirse parte) y docente (diseñar, facilitar y guiar).
- uni: La presencia docente en un foro incluye diseñar la pregunta, moderar la discusión y ayudar a cerrarla con conclusiones.
### casos (Método de casos)
- pista: Una historia real con un dilema, que el curso analiza y discute para decidir qué haría.
- why: Un problema auténtico, contado como una situación concreta con un dilema y examinado con pensamiento crítico: eso es un caso. El método nació en la Escuela de Derecho de Harvard hacia 1870 y en los años veinte pasó a su Escuela de Negocios. Christensen, Garvin y Sweet muestran que su valor depende de cómo el docente conduce la discusión, y Herreid lo llevó a las ciencias para entrenar el análisis de evidencia y la toma de decisiones.
- uni: En un curso de gestión, los estudiantes leen la situación real de una empresa que debe decidir si exporta, defienden posturas con los datos del caso y acuerdan una recomendación.
### retos (Aprendizaje basado en retos)
- pista: Equipos que abordan un desafío social abierto junto a actores externos y llegan a implementar una solución.
- why: Cuando un proyecto se abre a un problema auténtico amplio, definido junto a actores externos, surge el aprendizaje basado en retos. Nichols y Cator lo formularon para Apple en 2008: de una gran idea se pasa a una pregunta esencial, a un reto concreto y a una solución que se implementa. Hoy lo usan universidades como el Tecnológico de Monterrey, pero la revisión de Leijon y colaboradores encontró pocos estudios (36 en once años) y escasa fundamentación teórica.
- uni: En Ingeniería Civil, los equipos trabajan un semestre con el municipio en el reto de reducir las inundaciones de un barrio y presentan un prototipo de drenaje a vecinos y autoridades.
### servicio (Aprendizaje-servicio)
- pista: Estudiantes que atienden una necesidad real de la comunidad como parte del curso y reflexionan sobre ello.
- why: Un proyecto situado en una necesidad real de la comunidad, y no en un encargo ficticio, da el aprendizaje-servicio. Bringle y Hatcher lo definen como una experiencia con créditos académicos en la que un servicio organizado responde a necesidades de la comunidad y se acompaña de reflexión para comprender mejor el curso. El metaanálisis de Celio, Durlak y Dymnicki (62 estudios) encontró mejoras en actitudes, compromiso cívico, habilidades sociales y rendimiento académico, mayores con reflexión y vínculo curricular.
- uni: Estudiantes de Contabilidad asesoran a microemprendedores del barrio en sus declaraciones de impuestos y luego escriben una reflexión que conecta lo vivido con las normas tributarias del curso.
### jigsaw (Rompecabezas de Aronson)
- pista: Cada integrante recibe solo una pieza del tema, y el equipo necesita a todos para armar el todo.
- why: Una estructura cooperativa que reparte el contenido en partes: cada integrante estudia una, la profundiza con quienes tienen la misma en un grupo de expertos y vuelve a enseñarla a su equipo. Aronson y colaboradores la crearon en los años setenta en escuelas recién desegregadas de Austin, Texas, para reducir la competencia y los prejuicios. La revisión sistemática de Vives y colaboradores (69 estudios) encontró efectos en general positivos, pero variables según la disciplina y el resultado medido.
- uni: En Farmacología, cada integrante estudia una familia de fármacos, la discute con quienes estudiaron la misma en otros equipos y luego la explica a su equipo antes de resolver un caso integrador.
### tps (Piensa, discute, comparte)
- pista: Un minuto en silencio para cada uno, luego conversación en parejas y, al final, puesta en común.
- why: Es la forma más simple de unir aprendizaje activo y trabajo en grupo: una pregunta, un tiempo individual para pensar, una conversación en parejas y una puesta en común con todo el curso. Frank Lyman la propuso en 1981 para que participaran todos, no solo quienes responden más rápido. Smith y colaboradores mostraron, en un curso universitario de ciencias, que conversar con un compañero mejora la comprensión incluso cuando nadie en la pareja sabía antes la respuesta.
- uni: En Cálculo, el docente proyecta una gráfica, da un minuto para escribir qué representa la derivada en ese punto, luego dos minutos en parejas, y elige tres respuestas para comentar.
### gamificacion (Gamificación)
- pista: Puntos, insignias, niveles y narrativa añadidos a un curso que, en sí mismo, no es un pasatiempo.
- why: Si la tecnología se usa para encender la motivación con puntos, insignias, niveles o narrativas, aparece la gamificación: Deterding y colaboradores la definen como el uso de elementos de diseño de juegos en contextos que no son juegos. El metaanálisis de Sailer y Homner encontró efectos positivos pequeños en resultados cognitivos, motivacionales y conductuales, que dependen del diseño. Ojo: puntos e insignias son recompensas externas y no garantizan, por sí solos, la motivación intrínseca.
- uni: En un curso de Programación, los estudiantes suben de nivel al resolver ejercicios en la plataforma y desbloquean desafíos opcionales, mientras el docente cuida que el ranking no desaliente a quienes van atrás.
### abj (Aprendizaje basado en juegos)
- pista: El contenido vive dentro de la partida: avanzar en ella exige entender la materia.
- why: Cuando los elementos de juego dejan de ser una capa sobre el curso y el contenido pasa a estar dentro del juego, hablamos de aprendizaje basado en juegos: avanzar exige comprender. Gee sostuvo que los buenos videojuegos aplican principios de aprendizaje sólidos. El metaanálisis de Wouters y colaboradores encontró que los juegos serios enseñan más que la instrucción convencional, aunque no resultaron más motivadores, y que rinden mejor combinados con otras actividades y en varias sesiones.
- uni: En Economía, el curso juega varias rondas de un juego de mercado donde los equipos fijan precios, y luego analiza los resultados con los modelos de oferta y demanda vistos en clase.
### simulacion (Simulación)
- pista: Practicar decisiones de alto riesgo en un escenario controlado, donde equivocarse no daña a nadie.
- why: La simulación recrea con tecnología una situación profesional para practicar donde equivocarse no tiene costo real: un maniquí clínico, un simulador de vuelo o un laboratorio virtual. Cook y colaboradores, con 609 estudios en ciencias de la salud, hallaron efectos grandes en conocimientos y habilidades frente a no recibir esa formación. Chernikova y colaboradores, en varias disciplinas universitarias, encontraron efectos grandes en habilidades complejas, potenciados por el andamiaje.
- uni: En Enfermería, el equipo atiende a un maniquí que entra en paro cardíaco y después el docente conduce un análisis guiado (debriefing) de cada decisión tomada.
### indagacion (Indagación guiada)
- pista: Los estudiantes investigan una pregunta como científicos, con apoyos que el docente ajusta y va retirando.
- why: Investigar un problema auténtico como lo haría la disciplina, pero con andamiaje: preguntas orientadoras, plantillas, pistas y retroalimentación. Es la respuesta de la investigación al descubrimiento puro: el metaanálisis de Alfieri y colaboradores mostró que el descubrimiento sin ayuda rinde menos que la instrucción explícita, mientras que el descubrimiento asistido rinde más. Lazonder y Harmsen confirmaron que la guía mejora las actividades, el desempeño y el aprendizaje en la indagación.
- uni: En Química, en vez de seguir una receta, los equipos diseñan cómo medir la velocidad de una reacción, apoyados por preguntas escalonadas y una revisión del docente antes de ejecutar.
### tutoria_pares (Tutoría entre pares)
- pista: Un estudiante algo más avanzado acompaña a otro, y ambos terminan entendiendo mejor la materia.
- why: Un compañero algo más avanzado puede trabajar justo en la zona de desarrollo próximo de otro, con un lenguaje cercano y sin la distancia de la jerarquía. Topping revisó la tutoría entre pares en educación superior y encontró evidencia en general favorable, con variaciones según el formato. Roscoe y Chi mostraron que el tutor también aprende, sobre todo cuando construye explicaciones y reflexiona, en lugar de solo repetir lo que sabe.
- uni: Estudiantes de tercer año que aprobaron Anatomía guían sesiones semanales para los de primer año, con formación previa y supervisión del equipo docente.
### practicas (Prácticas profesionales)
- pista: Un periodo prolongado trabajando en una organización real, acompañado por alguien del oficio y un docente.
- why: Las prácticas profesionales llevan el aprendizaje situado a un tiempo prolongado dentro de una organización real. Schön propuso el practicum reflexivo: aprender una profesión haciéndola, con la orientación de alguien con experiencia que ayuda a reflexionar sobre la acción. Lave y Wenger describen ese tránsito como participación periférica legítima: quien recién llega empieza con tareas acotadas y, con el tiempo, se integra plenamente a la comunidad de práctica.
- uni: Una estudiante de Trabajo Social pasa un semestre en un centro comunitario, lleva una bitácora reflexiva y se reúne cada dos semanas con su supervisora de terreno y su docente.
### analitica (Analítica del aprendizaje)
- pista: Las huellas que deja cada clic en la plataforma del curso, convertidas en información para decidir.
- why: Cuando la tecnología registra lo que hacen los estudiantes a lo largo del tiempo, esas huellas se pueden medir, analizar y devolver como información. Siemens y Long describen la analítica del aprendizaje como la medición, el análisis y el reporte de datos sobre los estudiantes y sus contextos para comprender y mejorar el aprendizaje. La promesa es grande, pero la evidencia aún es modesta: la revisión de Viberg y colaboradores en educación superior encontró pocos estudios que muestren mejoras en los resultados de aprendizaje.
- uni: El panel del aula virtual muestra que un tercio del curso no abrió la guía de la semana 4, y el docente escribe a esos estudiantes antes del examen parcial.
### privacidad (Privacidad y ética de los datos)
- pista: Preguntarse quién ve la información de tus estudiantes, para qué se usa y con qué consentimiento.
- why: Toda herramienta que registra o procesa lo que hacen los estudiantes plantea preguntas de poder: quién accede a esa información, con qué fin y si la persona lo sabe y lo acepta. Slade y Prinsloo proponen tratar la analítica como una práctica moral, ser transparentes y ver a los estudiantes como agentes que colaboran en la interpretación de sus datos, no como simples fuentes. La guía de UNESCO sobre IA generativa también pide proteger la privacidad de los datos.
- uni: Antes de pedir que el curso use un chatbot externo, el docente explica qué datos guarda la empresa y ofrece una alternativa a quien no quiera crear una cuenta.
### adaptativo (Aprendizaje adaptativo)
- pista: Un sistema que elige el siguiente ejercicio según lo que cada estudiante ya demostró dominar.
- why: Une los datos de desempeño con el ritmo de cada estudiante: el sistema ajusta la dificultad, la secuencia o las pistas según lo que cada uno demuestra. Su antecedente más estudiado son los tutores inteligentes. VanLehn encontró que los que corrigen paso a paso se acercan a la eficacia de un tutor humano, y Kulik y Fletcher, en 50 evaluaciones controladas, hallaron mejoras en la mayoría, aunque mucho mayores en pruebas hechas a medida que en pruebas estandarizadas.
- uni: En Cálculo I, una plataforma de ejercicios detecta que un estudiante falla en la regla de la cadena y le propone más práctica de ese tema antes de pasar a integrales.
### rea (Recursos educativos abiertos)
- pista: Materiales con licencia libre que puedes usar, adaptar y volver a compartir sin pagar.
- why: Materiales de enseñanza, aprendizaje o investigación que están en el dominio público o tienen una licencia abierta que permite usarlos, adaptarlos y redistribuirlos sin costo. Así los define la Recomendación de UNESCO de 2019; la red es lo que permite compartirlos a gran escala. Sobre el aprendizaje, la revisión de Hilton en educación superior encontró que, en general, los estudiantes logran resultados similares a los obtenidos con libros comerciales, con un ahorro importante.
- uni: En vez de exigir un manual de química caro, el docente adapta un libro abierto, agrega ejercicios de su contexto y publica su versión con la misma licencia.
### mooc (MOOC)
- pista: Miles de inscritos de todo el mundo en una propuesta gratuita por internet; pocos la terminan.
- why: Recursos abiertos, video y entorno virtual a gran escala: un curso gratuito y sin límite de inscritos. El término nació en 2008 con un curso sobre conectivismo y se popularizó en 2012 con plataformas como Coursera y edX. Reich y Ruipérez-Valiente analizaron los cursos de MIT y Harvard en edX entre 2012 y 2018: la mayoría de los participantes no volvió después de su primer año, el crecimiento se concentró en los países más ricos y las bajas tasas de finalización no mejoraron.
- uni: Una facultad abre su curso de introducción a la programación en una plataforma internacional y lo usa también como material de nivelación para sus estudiantes de primer año.
### rv (Realidad virtual inmersiva)
- pista: Con un visor puesto, el estudiante entra a un quirófano, una mina o el interior de una célula.
- why: Una simulación que envuelve al estudiante: con un visor, el espacio deja de ser la sala y pasa a ser el laboratorio, la planta o el quirófano. Más inmersión no significa más aprendizaje: Makransky, Terkildsen y Mayer compararon la misma simulación de laboratorio en pantalla y con visor, y con visor los estudiantes se sintieron más presentes, pero aprendieron menos y tuvieron mayor carga cognitiva. Radianti y colaboradores observaron que pocas aplicaciones en educación superior se basan en teorías del aprendizaje.
- uni: Estudiantes de Geología recorren con visor un afloramiento rocoso de otro continente y luego discuten en clase lo observado, porque ahí estar en el lugar sí importa.
### respuesta_audiencia (Sistemas de respuesta en el aula)
- pista: Toda la sala vota desde su teléfono y el resultado aparece al instante en la pantalla.
- why: La tecnología al servicio del aprendizaje activo: cada estudiante responde con un control o con su teléfono y el docente ve al instante qué entendió el grupo. El metaanálisis de Hunsu, Adesope y Bayly encontró un efecto pequeño sobre el aprendizaje y uno mayor sobre aspectos afectivos, que varía según factores como el tamaño del curso y el tipo de pregunta. Caldwell propone pautas para escribir buenas preguntas: el beneficio depende de cómo se usa, no del aparato.
- uni: En un curso de Fisiología con 200 estudiantes, el docente lanza una pregunta conceptual, ve que la mitad se equivoca y pide discutir en parejas antes de volver a votar.
### alfabetizacion_ia (Alfabetización en IA)
- pista: Saber cómo funcionan los chatbots, dónde fallan y cuándo conviene usarlos o no usarlos.
- why: Usar la IA no basta: hay que entender qué hace, en qué se equivoca y cuándo conviene usarla. Long y Magerko definen esta alfabetización como un conjunto de competencias que permite evaluar críticamente las tecnologías de IA, comunicarse y colaborar con ellas y usarlas como herramienta. Por eso surge de la competencia digital y del pensamiento crítico: DigComp 2.2 ya incluye ejemplos de interacción con sistemas de IA, y evaluar sus respuestas exige contrastar fuentes y detectar errores o sesgos.
- uni: En un seminario de Derecho, los estudiantes piden a un chatbot jurisprudencia sobre un caso, verifican cada fallo citado en bases oficiales y descubren referencias inventadas.
### brecha (Brecha digital)
- pista: Desigualdad de conexión, equipos y habilidades que deja atrás a parte del curso cuando la clase pasa a internet.
- why: Llevar la enseñanza a un entorno virtual supone que todos los estudiantes pueden entrar, y no siempre es así. La desigualdad tiene niveles: primero el acceso a conexión y dispositivos; luego las habilidades y los usos, lo que Hargittai llamó brecha de segundo nivel; y finalmente quién obtiene beneficios reales. Van Dijk sostiene que estas diferencias se entrelazan con las desigualdades sociales existentes y pueden reforzarlas.
- uni: Antes de exigir trabajo en línea, el docente aplica una encuesta breve sobre conexión y equipos, y descubre que varios estudiantes solo tienen un celular con datos limitados.
### competencia_digital_docente (Competencia digital docente)
- pista: Lo que un profesor necesita saber para enseñar, evaluar y crecer en su profesión usando tecnología.
- why: No basta con dominar herramientas: el profesor necesita usarlas con un propósito pedagógico. El marco europeo DigCompEdu, de Redecker, describe 22 competencias en seis áreas, desde el compromiso profesional y los recursos digitales hasta la evaluación y el desarrollo de la competencia digital de los estudiantes, con seis niveles que van de principiante a pionero. Se diferencia de la competencia digital general porque se centra en lo que la tecnología cambia de la enseñanza.
- uni: Una profesora de Contabilidad no solo sabe usar la hoja de cálculo: diseña con ella un ejercicio de análisis de casos y la usa para dar retroalimentación a cada grupo.
### accesibilidad (Accesibilidad digital)
- pista: Que un lector de pantalla, los subtítulos o el teclado basten para usar tus materiales en línea.
- why: El DUA pide ofrecer múltiples formas de acceder al aprendizaje; con tecnología, eso exige materiales que funcionen para todas las personas, incluidas quienes usan lector de pantalla, subtítulos o solo el teclado. Las pautas WCAG del W3C lo ordenan en cuatro principios: el contenido debe ser perceptible, operable, comprensible y robusto. Y beneficia a muchos más: Gernsbacher reunió más de cien estudios que muestran que los subtítulos mejoran la comprensión y la memoria de cualquier espectador.
- uni: Un docente de Historia sube sus cápsulas con subtítulos revisados, describe en texto alternativo cada mapa y entrega las lecturas en PDF accesible en lugar de fotocopias escaneadas.
### aula_activa (Aula de aprendizaje activo)
- pista: Mesas redondas, pizarras en todas las paredes y sin un frente fijo: el espacio invita a trabajar juntos.
- why: Cuando la pedagogía rediseña el espacio, la sala deja de mirar a un frente: mesas para equipos, pizarras en las paredes y pantallas compartidas. Beichner y colaboradores lo hicieron con el proyecto SCALE-UP para cursos introductorios masivos de física. Brooks comparó el mismo curso, con el mismo docente, en una sala tradicional y en una de aprendizaje activo, y en la segunda los estudiantes rindieron más. El espacio facilita, pero no reemplaza el diseño de la actividad.
- uni: En un curso de Física de 90 estudiantes, una sala con mesas redondas para nueve permite alternar explicaciones breves con problemas en equipos de tres mientras el docente circula entre las mesas.
### ubicuo (Aprendizaje ubicuo)
- pista: Cualquier lugar y momento sirve para estudiar: la calle, el trabajo, el bus o la biblioteca.
- why: Si se suman un espacio y otro y otro más, el aprendizaje deja de tener un solo lugar. Burbules analiza el aprendizaje ubicuo, la posibilidad de aprender en cualquier lugar y momento, y lo que implica para enseñar: un aprendizaje más continuo, integrado a las actividades diarias, más situado y que mezcla lo formal con lo informal. Más que un método, es una condición del contexto actual que el docente puede aprovechar.
- uni: Estudiantes de Arquitectura fotografían edificios de su ciudad durante la semana, los suben a un muro colaborativo con un comentario técnico y el curso los analiza en la siguiente sesión.
### movil (Aprendizaje móvil)
- pista: El celular en el bolsillo convertido en herramienta de estudio, que acompaña al estudiante de un lugar a otro.
- why: Cuando el aprendizaje ubicuo se apoya en dispositivos que caben en el bolsillo, se vuelve aprendizaje móvil. Sharples, Taylor y Vavoula insisten en que lo móvil no es solo el aparato sino el estudiante, que aprende a través de conversaciones en múltiples contextos. El metaanálisis de Sung, Chang y Liu (110 estudios) encontró un efecto moderado a favor de integrar dispositivos móviles en la enseñanza, aunque el efecto varía según la actividad y el contexto.
- uni: En Geología, durante una salida a terreno, los estudiantes registran afloramientos con el celular, los georreferencian y responden preguntas breves que el docente revisa esa misma tarde.
### distancia (Distancia transaccional)
- pista: La lejanía psicológica entre docente y estudiante, que depende del diseño del curso y no de los kilómetros.
- why: Pensar la educación en línea desde la pedagogía revela que la distancia que importa no es geográfica. Moore la llamó distancia transaccional: un espacio psicológico y de comunicación entre docente y estudiante, ligado a tres elementos, el diálogo, la estructura del curso y la autonomía del estudiante. Un curso muy estructurado y con poco diálogo se siente lejano aunque el docente esté en la misma ciudad; más diálogo la acorta.
- uni: Un curso en línea con módulos cerrados y sin foros se siente lejano; agregar retroalimentación semanal y un espacio para negociar el tema del trabajo final reduce esa distancia.
### remota_emergencia (Enseñanza remota de emergencia)
- pista: Lo que hicieron muchas universidades en marzo de 2020: trasladar de golpe todo a la videollamada.
- why: Llevar la clase expositiva tal cual a la sesión sincrónica, de un día para otro y por fuerza mayor, no es educación en línea. Hodges y colaboradores propusieron en 2020 el término enseñanza remota de emergencia para distinguir esa respuesta de crisis, pensada para dar acceso rápido y temporal, de un curso en línea bien diseñado, que requiere meses de planificación. Por eso advierten que no conviene juzgar la educación en línea por lo vivido en la pandemia.
- uni: Un curso de Historia que en 2020 pasó a dos horas diarias de videollamada con cámaras apagadas fue enseñanza remota de emergencia; rediseñarlo con lecturas, foros y encuentros breves ya es otra cosa.
### emoderacion (Modelo de cinco etapas de Salmon)
- pista: Una escalera para cursos en línea: primero entrar y sentirse parte, al final construir conocimiento juntos.
- why: Una comunidad en línea no nace madura: necesita andamiaje por fases. Gilly Salmon, a partir de su experiencia en la Open University, propuso cinco etapas como una escalera: acceso y motivación, socialización en línea, intercambio de información, construcción de conocimiento y desarrollo. En cada peldaño cambia el rol del moderador, que diseña actividades adecuadas a ese momento. Moule advierte que no debe usarse como plantilla única para todo diseño en línea.
- uni: En un diplomado en línea, la primera semana solo pide entrar al aula virtual y presentarse con una foto del lugar de trabajo; el análisis de casos en foros llega en la cuarta.

## Notas
- "estudiante+pedagogia" (Estudiante + Pedagogía = Aprendizaje activo): Cuando la pedagogía se pone al servicio de quien aprende, el estudiante deja de escuchar en silencio y pasa a hacer y a pensar sobre lo que hace.
- "contenido+tecnologia" (Contenido + Tecnología = Conocimiento tecnológico del contenido): Cada disciplina tiene herramientas que cambian lo que se puede mostrar de ella: un software de geometría dinámica, un SIG o un simulador representan el contenido de otra manera.
- "pedagogia+tecnologia" (Pedagogía + Tecnología = Conocimiento tecnopedagógico): Cuando cruzas cómo enseñas con lo que una herramienta permite, surgen preguntas nuevas: qué participación facilita un foro y qué se gana o se pierde frente a la sala.
- "espacio+pedagogia" (Pedagogía + Aula = Aula de aprendizaje activo): Cuando la pedagogía diseña el espacio, la sala deja de mirar a un frente: mesas para equipos, pizarras en las paredes y un docente que circula.
- "espacio+tecnologia" (Tecnología + Aula = Entorno virtual): La tecnología crea un espacio que no depende de un edificio: plataforma, foros y materiales a los que se entra desde cualquier lugar.
- "proposito+tecnologia" (Tecnología + Propósito = Competencia digital docente): La tecnología con propósito no depende de la herramienta, sino de quien la elige: saber para qué usarla en tu curso es una competencia profesional del docente.
- "espacio+tiempo" (Tiempo + Aula = Presencialidad): Mismo lugar y mismo momento: cuando espacio y tiempo coinciden para todos, tienes la presencialidad, con su interacción inmediata y su exigencia de estar ahí.
- "grupo+pedagogia" (Grupo + Pedagogía = Aprendizaje cooperativo): Un grupo se vuelve equipo cuando la pedagogía diseña la tarea: metas compartidas, roles, responsabilidad individual y tiempo para revisar cómo trabajaron.
- "grupo+problema" (Problema real + Grupo = Aprendizaje basado en problemas): Un problema abierto entregado a un grupo pequeño, antes de la teoría, obliga a poner en común lo que saben y a definir qué necesitan estudiar.
- "cooperativo+problema" (Aprendizaje cooperativo + Problema real = Aprendizaje basado en problemas): Si el equipo ya trabaja de forma cooperativa, el problema auténtico le da el motor: cada integrante investiga una parte de lo que falta saber y la trae de vuelta.
- "abp+tiempo" (Aprendizaje basado en problemas + Tiempo = Aprendizaje basado en proyectos): Dale semanas a un problema y deja de resolverse en una sesión de tutoría: se convierte en un proyecto que termina en un producto concreto.
- "contenido+presencial" (Presencialidad + Contenido = Clase expositiva): Contenido y presencialidad, sin más ingredientes, dan la forma más antigua de enseñar en la universidad: alguien explica en la sala y el resto escucha.
- "contenido+grupo" (Contenido + Grupo = Clase expositiva): Entregar el mismo contenido a muchas personas a la vez es la razón de ser de la exposición: eficiente para cubrir materia, pero el grupo queda como audiencia.
- "activo+expositiva" (Clase expositiva + Aprendizaje activo = Instrucción entre pares): La exposición no se elimina: se interrumpe con preguntas conceptuales que cada estudiante vota, discute con su compañero y vuelve a votar.
- "grupo+respuesta_audiencia" (Sistemas de respuesta en el aula + Grupo = Instrucción entre pares): Los clickers o encuestas en vivo muestran al instante cómo se divide el curso; con eso, la conversación entre compañeros tiene un punto de partida concreto.
- "activo+capsula" (Cápsula de video + Aprendizaje activo = Aula invertida): Si la explicación queda en una cápsula para ver antes, el tiempo de la sesión se libera para lo activo: problemas, casos y discusión con el docente cerca.
- "capsula+presencial" (Cápsula de video + Presencialidad = Aula invertida): La cápsula se lleva la parte expositiva fuera de la sala, y la presencialidad queda para lo que solo se puede hacer juntos y con el docente presente.
- "pensamiento_critico+problema" (Problema real + Pensamiento crítico = Método de casos): Un problema auténtico narrado como situación concreta, más el hábito de evaluar evidencia y argumentos, da el caso: analizar, discutir y decidir con datos incompletos.
- "problema+proyectos" (Aprendizaje basado en proyectos + Problema real = Aprendizaje basado en retos): Un proyecto que se abre a un problema real amplio, definido junto a actores externos, se vuelve un reto: la solución se pone a prueba fuera de la sala.
- "proyectos+situado" (Aprendizaje basado en proyectos + Aprendizaje situado = Aprendizaje-servicio): Un proyecto situado en una necesidad real de la comunidad, con créditos y reflexión, es aprendizaje-servicio: se aprende la disciplina mientras se aporta algo concreto.
- "experiencial+proyectos" (Aprendizaje experiencial + Aprendizaje basado en proyectos = Aprendizaje-servicio): El ciclo de vivir, reflexionar y conceptualizar, aplicado a un proyecto con la comunidad, es el núcleo del aprendizaje-servicio: sin reflexión sería solo voluntariado.
- "contenido+cooperativo" (Aprendizaje cooperativo + Contenido = Rompecabezas de Aronson): Divide el contenido en piezas y entrega una a cada integrante del equipo cooperativo: nadie puede armar el tema completo sin lo que aportan los demás.
- "cooperativo+segmentacion" (Aprendizaje cooperativo + Segmentación = Rompecabezas de Aronson): Segmentar el material crea la interdependencia: cada segmento pasa por un grupo de expertos y vuelve al equipo base, donde se ensambla el todo.
- "activo+grupo" (Aprendizaje activo + Grupo = Piensa, discute, comparte): La forma más breve de juntar actividad y grupo: pensar a solas, conversar en parejas y compartir con el curso, todo en pocos minutos.
- "motivacion+tecnologia" (Motivación intrínseca + Tecnología = Gamificación): Usar la tecnología para alimentar la motivación con puntos, niveles y narrativa da la gamificación; el riesgo es reemplazar el interés propio por premios externos.
- "contenido+gamificacion" (Gamificación + Contenido = Aprendizaje basado en juegos): Cuando el contenido deja de estar debajo de los puntos y pasa a estar dentro del juego, ya no es gamificación: avanzar en la partida exige entender la materia.
- "situado+tecnologia" (Aprendizaje situado + Tecnología = Simulación): La tecnología recrea el contexto profesional sin sus riesgos: el estudiante actúa en una situación realista que puede repetir cuantas veces necesite.
- "problema+tecnologia" (Problema real + Tecnología = Simulación): Un problema auténtico montado en un simulador deja de ser un enunciado: el estudiante toma decisiones, ve sus consecuencias y luego las analiza.
- "andamiaje+problema" (Problema real + Andamiaje = Indagación guiada): Un problema auténtico sin apoyo abruma; con andamiaje (preguntas guía, plantillas y retroalimentación), el estudiante investiga como en la disciplina sin perderse.
- "descubrimiento+reflexiva" (Descubrimiento puro sin guía + Práctica reflexiva = Indagación guiada): Examinar el mito del descubrimiento sin guía no lleva a descartar que el estudiante investigue: lleva a darle estructura, porque el descubrimiento asistido sí funciona.
- "grupo+zdp" (Zona de desarrollo próximo + Grupo = Tutoría entre pares): Dentro de un grupo hay quienes ya dominan lo que otros todavía no; un compañero algo más avanzado puede trabajar justo en la zona de desarrollo próximo del otro.
- "situado+tiempo" (Aprendizaje situado + Tiempo = Prácticas profesionales): El aprendizaje situado sostenido en el tiempo, semanas o meses dentro de una organización real, se convierte en prácticas profesionales.
- "comunidad_practica+situado" (Aprendizaje situado + Comunidad de práctica = Prácticas profesionales): Entrar a una comunidad de práctica real es empezar en la periferia con tareas acotadas y avanzar hacia la participación plena: eso ocurre en una pasantía bien acompañada.
- "atencion10+reflexiva" (La atención dura solo 10 minutos + Práctica reflexiva = Aprendizaje activo): Desarmar el mito de los diez minutos no lleva a hablar más rato, sino a otra conclusión: intercalar momentos en que el estudiante resuelve y discute sostiene mejor el compromiso.
- "expositiva+tecnologia" (Clase expositiva + Tecnología = Sustitución (SAMR)): Si a la misma clase expositiva solo le sumas un proyector, la tarea del estudiante no cambia: escuchar y copiar. La herramienta reemplaza a la pizarra sin mejora funcional.
- "pedagogia+sustitucion" (Sustitución (SAMR) + Pedagogía = Aumento (SAMR)): Al darle intención pedagógica a la sustitución, la herramienta empieza a aportar algo: por ejemplo, un cuestionario en línea que da retroalimentación inmediata en lugar de la prueba en papel.
- "aumento+pedagogia" (Aumento (SAMR) + Pedagogía = Modificación (SAMR)): Con más diseño pedagógico, la mejora deja de ser un agregado y cambia la tarea: el ensayo individual se vuelve un documento que el grupo escribe y comenta en línea.
- "modificacion+pedagogia" (Modificación (SAMR) + Pedagogía = Redefinición (SAMR)): Otra vuelta de pedagogía y la tarea ya no tendría sentido sin la herramienta: estudiantes que publican un análisis para una audiencia real o colaboran con otra universidad.
- "asincronico+expositiva" (Clase expositiva + Modalidad asincrónica = Clase grabada): Llevar la exposición a la modalidad asincrónica la libera del horario: cada estudiante puede pausar, retroceder y volver a ver lo que no entendió.
- "segmentacion+video" (Clase grabada + Segmentación = Cápsula de video): Cortar la clase grabada en piezas breves, de una idea cada una, alivia la carga y respeta un dato: los videos largos suelen abandonarse antes del final.
- "andamiaje+ia" (IA generativa + Andamiaje = Tutor con IA): La IA sola entrega respuestas; con andamiaje, se configura para dar pistas graduales y pedir razonamiento, de modo que el esfuerzo de pensar siga siendo del estudiante.
- "nativos+reflexiva" (Nativos digitales + Práctica reflexiva = Competencia digital): Al reflexionar sobre el mito queda claro que usar el teléfono con soltura no es lo mismo que buscar o evaluar información académica: eso hay que enseñarlo.
- "analitica+reflexiva" (Analítica del aprendizaje + Práctica reflexiva = Privacidad y ética de los datos): Reflexionar sobre la analítica obliga a hacerse preguntas incómodas: si los estudiantes saben que sus datos se registran, quién los ve y si una alerta puede etiquetarlos injustamente.
- "estudiante+ia" (IA generativa + Estudiante = Privacidad y ética de los datos): Cuando un estudiante escribe en un chatbot, sus textos y datos pueden quedar en manos de una empresa: antes de exigir su uso, averigua qué se guarda y para qué.
- "analitica+ritmo" (Analítica del aprendizaje + Ritmo propio = Aprendizaje adaptativo): Si los datos muestran qué domina cada estudiante, el sistema puede decidir qué practicar después: quien tropieza recibe refuerzo y quien domina avanza sin esperar al resto.
- "ia+ritmo" (IA generativa + Ritmo propio = Aprendizaje adaptativo): La IA generativa promete ajustar explicaciones a cada estudiante sobre la marcha, pero la evidencia sólida viene de tutores inteligentes clásicos; la de la IA generativa recién se acumula.
- "contenido+virtual" (Contenido + Entorno virtual = Recursos educativos abiertos): Publicar contenido en la red no basta para que otros lo reutilicen: con una licencia abierta, cualquier docente puede adaptarlo a su curso y volver a compartirlo.
- "asincronico+rea" (Recursos educativos abiertos + Modalidad asincrónica = MOOC): Junta recursos abiertos con una modalidad asincrónica y llévalo a miles de personas: así nacieron los MOOC, aunque hoy muchos cobran por el certificado.
- "video+virtual" (Clase grabada + Entorno virtual = MOOC): Las clases grabadas fueron la columna vertebral de los MOOC; de hecho, Guo, Kim y Rubin estudiaron el compromiso justamente con videos de cursos de edX.
- "espacio+simulacion" (Simulación + Aula = Realidad virtual inmersiva): Cuando la simulación no se mira en una pantalla, sino que te rodea, el espacio mismo pasa a ser parte de lo que se aprende: moverse, orientarse, ver a escala.
- "activo+tecnologia" (Aprendizaje activo + Tecnología = Sistemas de respuesta en el aula): La tecnología lleva el aprendizaje activo a salas grandes: en segundos todos responden y ves qué piensa el grupo completo, no solo quienes levantan la mano.
- "competencia+ia" (IA generativa + Competencia digital = Alfabetización en IA): La competencia digital se queda corta ante la IA: además de buscar y crear, hay que entender cómo genera sus respuestas y por qué puede inventar datos.
- "ia+pensamiento_critico" (IA generativa + Pensamiento crítico = Alfabetización en IA): Aplicar pensamiento crítico a la IA es tratar cada respuesta como una afirmación por verificar: contrastar fuentes, detectar sesgos y decidir cuándo no conviene usarla.
- "estudiante+virtual" (Entorno virtual + Estudiante = Brecha digital): Pasar un curso al entorno virtual supone que cada estudiante tiene conexión, equipo y habilidades; cuando no es así, la modalidad misma deja a algunos afuera.
- "competencia+pedagogia" (Competencia digital + Pedagogía = Competencia digital docente): La competencia digital general se vuelve docente cuando se cruza con la pedagogía: ya no basta con usar herramientas, hay que enseñar, evaluar y diseñar con ellas.
- "dua+tecnologia" (Diseño Universal para el Aprendizaje + Tecnología = Accesibilidad digital): El DUA pide múltiples formas de representación; la tecnología las hace posibles solo si es accesible: subtítulos, texto alternativo y documentos que un lector de pantalla pueda leer.
- "dua+virtual" (Entorno virtual + Diseño Universal para el Aprendizaje = Accesibilidad digital): En un entorno virtual, el diseño universal choca con barreras técnicas: un botón sin etiqueta o un video sin subtítulos bloquean a alguien aunque la actividad esté bien pensada.
- "tiempo+virtual" (Entorno virtual + Tiempo = Sesión sincrónica): Un entorno virtual con hora compartida da la sesión sincrónica: todos conectados a la vez, con respuesta inmediata, aunque cada uno esté en un lugar distinto.
- "ritmo+virtual" (Entorno virtual + Ritmo propio = Modalidad asincrónica): Cuando el entorno virtual respeta el ritmo de cada estudiante, nadie necesita estar conectado a la misma hora: cada uno participa en su momento.
- "presencial+virtual" (Presencialidad + Entorno virtual = Aprendizaje combinado): Sumar presencialidad y entorno virtual no es duplicar el curso: es decidir qué rinde más en la sala y qué rinde más en línea.
- "blended+ritmo" (Aprendizaje combinado + Ritmo propio = HyFlex): Si en un curso combinado el estudiante además elige su ritmo, cada sesión ofrece tres rutas equivalentes: en la sala, en línea en vivo o en diferido.
- "grupo+virtual" (Entorno virtual + Grupo = Comunidad de indagación): Un grupo en línea se vuelve comunidad de indagación cuando hay presencia cognitiva, social y docente; sin ellas, el foro es solo un tablón de anuncios.
- "activo+presencial" (Presencialidad + Aprendizaje activo = Aula de aprendizaje activo): El aprendizaje activo en la sala choca con bancos fijos mirando al frente; una sala pensada para equipos hace que trabajar juntos sea lo natural.
- "tecnologia+ubicuo" (Aprendizaje ubicuo + Tecnología = Aprendizaje móvil): El aprendizaje ubicuo necesita un medio que acompañe al estudiante; el teléfono en el bolsillo lo hace posible en terreno, en el transporte o en el trabajo.
- "situado+virtual" (Entorno virtual + Aprendizaje situado = Aprendizaje móvil): Llevar el entorno virtual al lugar donde ocurre el fenómeno, una obra, un hospital o un río, permite aprender situado con el dispositivo en la mano.
- "pedagogia+virtual" (Entorno virtual + Pedagogía = Distancia transaccional): Mirar el entorno virtual con ojos pedagógicos muestra que la lejanía no es de kilómetros: depende de cuánto diálogo y cuánta estructura tenga el curso.
- "expositiva+sincronico" (Sesión sincrónica + Clase expositiva = Enseñanza remota de emergencia): Trasladar la exposición tal cual a la videollamada, de un día para otro, fue la respuesta de 2020: útil en la crisis, pero no es un curso en línea diseñado.
- "andamiaje+coi" (Comunidad de indagación + Andamiaje = Modelo de cinco etapas de Salmon): Para que una comunidad de indagación madure en línea necesita andamiaje por fases: primero acceso y confianza, después intercambio y, al final, construcción de conocimiento.
- "andamiaje+asincronico" (Modalidad asincrónica + Andamiaje = Modelo de cinco etapas de Salmon): En foros asincrónicos, el andamiaje toma forma de escalera: actividades breves y estructuradas para cada fase, con un moderador que cambia su rol a medida que el grupo avanza.
- "andamiaje+descubrimiento" (Andamiaje + Descubrimiento puro sin guía = Indagación guiada): Explorar con preguntas guía y pistas que se retiran gradualmente es indagación guiada; Alfieri y colaboradores hallaron que el descubrimiento con apoyo rinde más que el descubrimiento sin guía.
- "multimedia+video" (Aprendizaje multimedia + Clase grabada = Cápsula de video): Aplicar a una clase grabada los principios de Mayer (señalizar lo clave, quitar lo accesorio, dividir en segmentos) produce un video breve y enfocado: una cápsula.
- "expositiva+ritmo" (Ritmo propio + Clase expositiva = Clase grabada): Una clase expositiva que cada estudiante puede pausar, retroceder y repasar cuando lo necesita deja de imponer un solo ritmo al curso: se convierte en clase grabada.
- "grupo+proposito" (Propósito + Grupo = Aprendizaje cooperativo): Un grupo con una meta compartida que nadie alcanza solo genera interdependencia positiva, el rasgo central del aprendizaje cooperativo según Johnson y Johnson.
- "evidencia+nativos" (Docencia informada por evidencia + Nativos digitales = Competencia digital): La investigación no muestra una generación con habilidades digitales innatas (Kirschner y De Bruyckere); si no vienen con la fecha de nacimiento, la competencia digital hay que enseñarla.
- "gamificacion+simulacion" (Simulación + Gamificación = Aprendizaje basado en juegos): Si a una simulación le agregas metas, reglas, desafío y puntaje, deja de ser solo un modelo de la realidad y se vuelve un juego serio: aprendizaje basado en juegos.
- "pensamiento_critico+virtual" (Entorno virtual + Pensamiento crítico = Comunidad de indagación): Garrison, Anderson y Archer crearon el modelo de comunidad de indagación para explicar cómo la discusión en línea puede sostener pensamiento crítico, gracias a la presencia cognitiva, social y docente.
- "competencia+nativos" (Competencia digital + Nativos digitales = Brecha digital): Hargittai mostró que entre jóvenes de la misma generación las habilidades digitales varían según el origen socioeconómico: detrás del mito del nativo digital hay una brecha de competencias.
- "sustitucion+tpk" (Conocimiento tecnopedagógico + Sustitución (SAMR) = Aumento (SAMR)): Si solo reemplazas el papel por la pantalla, sustituyes; cuando sabes qué agrega la herramienta (comentarios en línea, corrección inmediata) y lo aprovechas, subes al nivel de aumento del modelo SAMR.
- "competencia+tpk" (Conocimiento tecnopedagógico + Competencia digital = Competencia digital docente): Manejar bien la tecnología como usuario no basta para enseñar con ella; sumar el saber tecnopedagógico convierte la competencia digital personal en competencia digital docente.
- "autorregulado+virtual" (Aprendizaje autorregulado + Entorno virtual = Distancia transaccional): Moore explica la distancia transaccional con tres variables: diálogo, estructura y autonomía del estudiante. En un entorno virtual con poco diálogo, el curso exige más autorregulación.
- "conectivismo+rea" (Conectivismo + Recursos educativos abiertos = MOOC): El primer curso llamado MOOC (2008) lo dictaron Siemens y Downes sobre conectivismo: abierto, masivo y armado con recursos libres que cada participante conectaba en su propia red.
- "formativa+tecnologia" (Tecnología + Evaluación formativa = Sistemas de respuesta en el aula): Para saber en segundos qué entendió todo el curso, la tecnología permite que cada estudiante responda de forma anónima y que veas la distribución de respuestas en pantalla.
- "dominio+tecnologia" (Tecnología + Aprendizaje para el dominio = Aprendizaje adaptativo): Los sistemas adaptativos automatizan el aprendizaje para el dominio: estiman si cada estudiante ya domina una habilidad y solo entonces le proponen la siguiente.
- "blended+dua" (Diseño Universal para el Aprendizaje + Aprendizaje combinado = HyFlex): Llevar al curso combinado la idea del DUA de ofrecer opciones lleva al HyFlex: cada estudiante elige sala, sesión en línea o ruta asincrónica. Beatty incluye la accesibilidad entre sus principios.
- "respuesta_audiencia+tps" (Piensa, discute, comparte + Sistemas de respuesta en el aula = Instrucción entre pares): Cada estudiante vota su respuesta, la discute con quien tiene al lado y vuelve a votar: es la instrucción entre pares de Mazur, un piensa, discute, comparte con sistema de respuesta.
- "blended+expositiva" (Aprendizaje combinado + Clase expositiva = Aula invertida): Si en el curso combinado la exposición pasa al entorno virtual, la sala queda libre para practicar y discutir: eso es el aula invertida, uno de los modelos combinados más usados.
- "asincronico+presencial" (Presencialidad + Modalidad asincrónica = Aprendizaje combinado): Sesiones en sala más trabajo en línea que cada estudiante hace a su ritmo: es la forma más común de curso combinado, siempre que ambas partes se diseñen integradas.
- "expositiva+presencial" (Presencialidad + Clase expositiva = Distancia transaccional): Moore aclara que la distancia transaccional es pedagógica, no geográfica: una clase expositiva con mucha estructura y poco diálogo puede generarla aunque todos estén en la misma sala.
- "carga_cognitiva+video" (Clase grabada + Teoría de la carga cognitiva = Cápsula de video): Aplicar la teoría de la carga cognitiva a una clase grabada lleva a cortarla en segmentos breves, quitar lo accesorio y señalar lo clave: así se diseña una cápsula de video.
- "cambio_conceptual+expositiva" (Cambio conceptual + Clase expositiva = Instrucción entre pares): Mazur comprobó que sus clases expositivas no cambiaban las concepciones erróneas de sus estudiantes de física; para provocar ese cambio interrumpió la exposición con preguntas conceptuales y discusión entre pares.
- "andamiaje+constructivismo" (Constructivismo + Andamiaje = Indagación guiada): Ante la crítica de Kirschner, Sweller y Clark a la enseñanza con poca guía, Hmelo-Silver y colaboradores respondieron que la indagación constructivista funciona cuando está bien andamiada.
- "cooperativo+espacio" (Aula + Aprendizaje cooperativo = Aula de aprendizaje activo): Las aulas de aprendizaje activo, como las del proyecto SCALE-UP, reemplazan las filas por mesas compartidas para que los equipos cooperen durante la clase.
- "tiempo+video" (Tiempo + Clase grabada = Cápsula de video): Guo, Kim y Rubin vieron que la mediana de visualización no pasa de unos seis minutos; recortar la clase grabada en piezas breves, de una idea cada una, da la cápsula.
- "cooperativo+expositiva" (Aprendizaje cooperativo + Clase expositiva = Piensa, discute, comparte): Insertar en la exposición pausas cooperativas breves, como los grupos informales que proponen Johnson, Johnson y Smith, lleva al formato piensa, discute, comparte.
- "coi+presencial" (Comunidad de indagación + Presencialidad = Aprendizaje combinado): Garrison y Vaughan usan las tres presencias de la comunidad de indagación como marco para diseñar cursos que integran sesiones presenciales y trabajo en línea.
- "nativos+remota_emergencia" (Enseñanza remota de emergencia + Nativos digitales = Brecha digital): La emergencia de 2020 desmintió que todos los jóvenes fueran nativos digitales: muchos no tenían conexión, equipo ni habilidades para estudiar en línea. Eso es la brecha digital.
- "presencial+remota_emergencia" (Enseñanza remota de emergencia + Presencialidad = HyFlex): Al volver a las aulas tras la emergencia, muchas universidades combinaron sala, transmisión en vivo y grabación: así se difundió el modelo HyFlex de Beatty, que exige rutas equivalentes.
- "ia+tutoria_pares" (IA generativa + Tutoría entre pares = Tutor con IA): La tutoría uno a uno está entre las ayudas más eficaces, pero no alcanza para todos; la IA intenta ofrecer ese acompañamiento personal a escala, sin reemplazar al tutor humano.
- "dificultades_deseables+ia" (IA generativa + Dificultades deseables = Tutor con IA): Sin diseño, la IA le ahorra al estudiante justo el esfuerzo que lo hace aprender; configurada para dar pistas en vez de soluciones, conserva esas dificultades deseables y funciona como tutor.
- "experiencial+tecnologia" (Aprendizaje experiencial + Tecnología = Simulación): Si la experiencia concreta que pide el ciclo de Kolb es cara o riesgosa, la tecnología la recrea; la reflexión posterior sigue siendo lo que la convierte en aprendizaje.
- "competencias+tecnologia" (Enfoque por competencias + Tecnología = Competencia digital): La Unión Europea incluye la competencia digital entre las ocho competencias clave para el aprendizaje permanente: conocimientos, habilidades y actitudes que se desarrollan, no una destreza innata con aparatos.
- "diagnostica+tecnologia" (Evaluación diagnóstica + Tecnología = Aprendizaje adaptativo): Si la tecnología diagnostica de forma continua lo que cada estudiante domina, puede ajustar qué contenido o ejercicio le muestra después: esa es la lógica del aprendizaje adaptativo.
- "expositiva+respuesta_audiencia" (Clase expositiva + Sistemas de respuesta en el aula = Instrucción entre pares): Interrumpir la exposición con una pregunta conceptual que todos responden con su dispositivo, discutir luego con el compañero y volver a votar: así funciona el método de Mazur.
- "analitica+video" (Analítica del aprendizaje + Clase grabada = Cápsula de video): Guo, Kim y Rubin analizaron millones de sesiones de video en edX: el compromiso caía con la duración. Los datos de uso respaldan dividir la clase grabada en cápsulas breves.
- "estudiante+mooc" (MOOC + Estudiante = Brecha digital): Los MOOC prometían abrir la universidad a todos, pero Hansen y Reich encontraron que los aprovechan más quienes ya tienen ventajas socioeconómicas: lo abierto no cierra la brecha por sí solo.
- "retro+sustitucion" (Sustitución (SAMR) + Retroalimentación = Aumento (SAMR)): La misma prueba, ahora digital, que corrige al instante y explica cada error: la tarea no cambia, pero gana una mejora funcional. Eso separa el aumento de la simple sustitución.
- "ia+pedagogia" (Pedagogía + IA generativa = Tutor con IA): Por sí sola, la IA generativa entrega respuestas; configurada con intención pedagógica, pregunta, da pistas graduadas y deja que el estudiante haga el trabajo de pensar. Eso la convierte en tutor.
- "pedagogia+video" (Pedagogía + Clase grabada = Cápsula de video): Mirar la clase grabada con criterio pedagógico lleva a recortarla: piezas breves, una idea por video y una pregunta o tarea que obligue al estudiante a procesar lo que vio.
- "problema+tiempo" (Problema real + Tiempo = Aprendizaje basado en proyectos): Cuando un problema auténtico se trabaja durante semanas y desemboca en un producto concreto, deja de ser un ejercicio de clase y se convierte en un proyecto.
- "asincronico+grupo" (Modalidad asincrónica + Grupo = Comunidad de indagación): Un grupo que discute por escrito en un foro asincrónico tiene tiempo para pensar antes de aportar; ese fue el escenario en que Garrison, Anderson y Archer propusieron la comunidad de indagación.
- "asincronico+blended" (Modalidad asincrónica + Aprendizaje combinado = HyFlex): Si el curso combinado ofrece además una ruta asincrónica equivalente y cada estudiante elige, sesión a sesión, cómo participar, llegas al modelo HyFlex de Beatty.
