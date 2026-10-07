# Revisión metodológica y pedagógica de Crisol (antes Alquimia Docente)

Fecha: 3 de octubre de 2026. Alcance: las 16 misiones y las 180 fichas que se pueden descubrir en ellas (los cuatro primigenios aparte).

## Cómo se revisó

1. **Revisión experta con una rúbrica común** (`datos/v2/revision/RUBRICA.md`). Cuatro revisores, con el papel de especialistas en pedagogía universitaria y ciencias del aprendizaje, se repartieron las misiones. Cada ficha la revisó en detalle un solo revisor. La rúbrica pide revisar:
   - la veracidad de definiciones, atribuciones y cifras;
   - que cada fuente exista y respalde lo que se le atribuye;
   - que cada receta "A + B = C" sea una relación conceptual defendible;
   - la calidad del ejemplo de aula;
   - el alineamiento de cada misión: encargo, meta, hitos, reflexiones y cierre;
   - el lenguaje.
2. **Verificación de fuentes.** La búsqueda web general no estaba disponible, así que los revisores verificaron con las API de Crossref, OpenAlex, PubMed, Europe PMC, ERIC, Open Library y LeyChile. Leyeron el texto completo cuando estaba en acceso abierto.
3. **Curaduría.** Revisé los hallazgos, decidí qué se aplicaba y comprobé de forma automática:
   - que cada texto nuevo respetara los largos y el filtro de patrones de escritura;
   - que todas las misiones siguieran completas y con su profundidad.
4. **Prueba de juego.** Las 16 misiones se jugaron completas en el archivo empaquetado, con mouse real, después de aplicar los cambios.

Los informes completos están en `datos/v2/revision/`: R1.json a R4.json e `informe-revision.md`.

## Resultado

- **Veredicto:** 15 misiones quedaron en "ajustar" y 1 en "sólida" (Pensar como la disciplina). Ninguna necesitó reformularse. La base es buena: casi todas las referencias existen y respaldan lo que se les atribuye, las cifras centrales son exactas y los encargos son verosímiles.
- **Fichas corregidas:** 82 (2 de gravedad alta, 39 media y 41 baja). Se reescribieron:
  - 52 explicaciones;
  - 36 ejemplos de aula;
  - 16 listas de principios;
  - 12 pruebas para la próxima semana;
  - 20 listas de fuentes.
- **Notas de recetas corregidas:** 36.
- **Referencias:** 35 corregidas o nuevas.
- **Textos de misión:** 14 misiones con cambios de encargo, objetivo, cierre o reflexiones.
- **Recetas:**
  - Se quitaron 9 que enseñaban una relación falsa o forzada; por ejemplo, Mundo + Curva del olvido = Escritura es anacrónica.
  - Se reemplazaron 5 del camino diseñado.
- **Planos:** 4 hitos nuevos y dos caminos corregidos (Diseñar un curso y Más allá del aula).

## Los hallazgos más importantes (todos corregidos)

1. **Evaluación en tiempos de IA** se apoyaba en una premisa falsa: que agregar datos del contexto impide que un chatbot resuelva la tarea. El estudiante puede pegarle esos datos. Ahora el resguardo es estructural, con defensa oral o un tramo resuelto en clase (Corbin, Dawson y Liu, 2025). También se aclara que declarar qué uso de IA se permite no asegura la validez.
2. **Evidencia inflada sobre tutores de IA.** El tutor con resguardos de Bastani y colaboradores evitó el daño, pero no superó al grupo sin IA, y quienes lo usaron creyeron rendir mejor sin que fuera así. Los dos tutores exitosos tenían la solución escrita en sus instrucciones. La misión de IA ahora lo dice. Además, su cierre propone un piloto con grupo de comparación.
3. **Cifra mal citada en Retroalimentación sabia.** Decía que los estudiantes "pasaron de 17 % a 72 %". En el estudio de Yeager y colaboradores (44 escolares) los porcentajes comparan grupos: 64 % frente a 27 %. Ahora la ficha da la cifra correcta y aclara la muestra.
4. **Cierre de la misión inclusiva.** Asociaba hablar zapoteco con no dominar el género académico, cuando la causa que construye la misión son convenciones que nadie enseñó. En una capacitación en México podía leerse como estereotipo.
5. **Diseñar un curso** llegaba a "Curso alineado" sin pasar por Resultados de aprendizaje ni por Evaluación, que son la base del alineamiento de Biggs. El camino ahora es: Resultados de aprendizaje, luego Evaluación, luego Diseño inverso, luego Alineamiento. El cierre también nombra los ajustes razonables para la estudiante sorda (intérprete y subtítulos), que el DUA no reemplaza.
6. **HyFlex** se enseñaba como "curso combinado a ritmo propio". En HyFlex, el estudiante elige en cada sesión cómo participar (Beatty, 2019). Ahora llega por Modalidad asincrónica, que además es la ruta real de los estudiantes del caso, que trabajan por turnos.
7. **Simulación** se definía como algo "con tecnología", lo que contradice la definición de Gaba (2004). Además, la síntesis presentaba como grandes unos efectos que solo lo son frente a no recibir formación; frente a otros métodos son pequeños a moderados.
8. **Confusiones conceptuales recurrentes,** ahora corregidas:
   - Hacer propia una meta (regulación identificada) se trataba como motivación intrínseca.
   - Formativa y sumativa se atribuían solo a Scriven; fueron Bloom, Hastings y Madaus quienes las llevaron al aprendizaje.
   - La pedagogía se reducía al conocimiento pedagógico de TPACK, sin la distinción con la didáctica que se usa en la región.
   - La memoria dependiente del contexto se presentaba como aprendizaje situado.
   - La amenaza del estereotipo se presentaba como si exigiera dudas de pertenencia.
9. **Recetas que enseñaban relaciones falsas.** Por ejemplo, Taxonomía de Bloom + Aprendizaje activo = Pirámide del aprendizaje asociaba a Bloom con un mito que no tiene nada que ver con él.
10. **Prudencia con marcos sin evidencia sólida.** El DUA ahora menciona que la evidencia sobre su efecto en el aprendizaje es todavía débil (Boysen, 2024). Al desarmar un mito, el juego ya no dice "esto es lo que la evidencia sí respalda", sino "qué conviene hacer en su lugar".

## Cambios en el juego por razones pedagógicas

- **Se quitó la pausa de reflexión (actualización posterior a la revisión).** Al lograr un hito, el juego abría el panel "Llévalo a tu curso" con una pregunta para escribir. Se eliminó por decisión del equipo, junto con todo lo que dependía de ella: las reflexiones pendientes en la hoja de la misión, su lugar en Mi plan y en el plan descargable. Los hitos siguen como piezas clave marcadas con una estrella en el plano. Las preguntas escritas siguen en los archivos de datos por si se retoman, pero el juego ya no las usa.
- **El plano pasa por los hitos.** El camino de cada misión prefiere las recetas que atraviesan sus hitos, para que las piezas clave del caso estén siempre en el recorrido.

## Evaluación del diseño pedagógico del juego

**Lo que el diseño hace bien:**
- Mezclar de a dos obliga a pensar en relaciones entre conceptos y no en definiciones sueltas, lo que favorece un conocimiento organizado.
- Las pistas son adivinanzas: hay que generar la respuesta antes de verla.
- Cada misión ancla los conceptos en un caso de docencia latinoamericana, con una persona, una disciplina y un problema verosímil.
- La secuencia completa avanza de entender a aplicar: ficha de estudio, ejemplo de aula, síntesis con principios y una prueba para la semana siguiente, y por último un plan descargable.
- El error tiene una explicación. Una mezcla fallida dice por qué no avanza y orienta hacia otra.

**Riesgos que conviene vigilar en el uso real:**
- **Mezclar al azar.** Un docente puede llegar a la meta probando parejas sin leer las fichas. El plano y las pistas lo frenan, pero no lo impiden. En un taller, quien facilita puede contrarrestarlo con preguntas como "¿por qué creen que esas dos ideas forman esta?".
- **Carga de lectura.** Las síntesis son densas (85 a 110 palabras más 4 a 6 principios). Conviene leerlas en el taller y no dejarlas solo para después.
- **Las recetas son metáforas.** "A + B = C" sugiere composición, y algunas relaciones son de uso o de contexto más que de origen. La nota de cada receta lo aclara, pero vale la pena decirlo al presentar el juego.
- **No mide el aprendizaje.** El juego registra lo descubierto y lo que cada docente marca para probar, pero no comprueba comprensión. Si se usa para certificar, hace falta otra evidencia; por ejemplo, el plan descargado revisado por quien facilita.

**Recomendaciones antes de usarlo en una capacitación:**
1. Que un especialista humano revise las referencias que los revisores dejaron sin verificar (ver abajo), sobre todo libros y cifras sin acceso abierto.
2. Pilotear una o dos misiones con un grupo pequeño de docentes y medir cuánto tardan, qué fichas leen y qué marcan para probar.
3. Preparar una guía breve de facilitación por misión: preguntas para la puesta en común, tiempos y cómo usar el plano proyectado.

## Lo que quedó sin verificar

Los revisores lo declararon en sus informes. Lo principal:
- **Libros sin acceso abierto:**
  - el contenido de Snyder (1970);
  - los capítulos de Bourdieu, Kift y Hutchings;
  - Denzin (1978);
  - el libro de Beatty sobre HyFlex, que se usó por su definición conocida.
- **Cifras por confirmar:**
  - las páginas de Winkelmes y colaboradores (2016);
  - las cifras por país de Howard-Jones (2014);
  - el intervalo de retención de Rawson, Dunlosky y Sciartelli (2013);
  - el 47 % de Issenberg y los 177 estudios de Cheng, que son plausibles pero no se leyeron en la fuente;
  - el origen del TBL en 1979 con un curso de 40 a 120 estudiantes.
- **Referencias sin DOI** que no se pudieron confirmar en línea: Herreid (1994), Thomas (2000) y Facione (1990).
- **Sin DOI en general:** casi ninguna referencia trae el DOI que pide APA 7.

## Expansión H: herramientas y fichas rescatadas (4 de octubre de 2026)

Se sumaron 14 misiones (30 en total) y las ideas descubribles pasaron de 184 a 415. Incluye 49 herramientas concretas, elegidas a partir del Top 100 Tools for Learning 2026, y 99 fichas que ya estaban escritas pero no aparecían en ningún plano.

**Cómo se revisó.** Esta revisión fue más económica que la anterior.
1. **Escritura.** Siete agentes escribieron con un contexto recortado y sin navegar.
2. **Referencias.** Todas las nuevas se verificaron con un script contra Crossref y OpenAlex. Las de investigación coincidieron todas; solo quedaron fuera de esas bases las citas de software y de sitios web, y una norma W3C.
3. **Citas.** Otro script comprobó que cada autor citado en un texto tenga su referencia en la ficha.
4. **Lectura completa.** Se leyeron a mano todas las fichas de herramientas y todas las síntesis.
5. **Muestra.** Se revisaron al azar las fichas rescatadas.

**Corregido en la revisión:**
- recetas forzadas (por ejemplo, "Abandono + Mentoría = Outlook" se reemplazó por la asesoría proactiva);
- textos que describían la receta en vez de la idea ("Surge de unir...");
- una afirmación falsa sobre Claude;
- universidades reales nombradas en los encargos;
- nombres de docentes repetidos;
- emojis sin relación con la idea;
- herramientas que no quedaban en ningún camino (Copilot y Perplexity).

NotebookLM figura con su nombre actual, Gemini Notebook.

**Pendiente:** las 99 fichas rescatadas tuvieron revisión por muestra y no ficha por ficha, como las de la primera revisión. Conviene una pasada completa antes de usarlas en una capacitación.

## Fuentes para compartir (7 de octubre de 2026)

**Meta:** que cada ficha tenga al menos una fuente que un docente pueda abrir con un clic. Hoy la tienen **las 415 fichas descubribles**.

**Cómo se hizo.** Casi todo el trabajo lo hicieron scripts, sin modelo de lenguaje.
1. **Crossref y OpenAlex** (`tareas/enlazar-refs.js`): confirman cada obra por título, subtítulo, año y primer autor, traen el DOI y buscan una versión de acceso abierto. Un libro nunca se confirma con el DOI de un artículo, porque así se colaban reseñas de otros autores.
2. **Open Library** (`tareas/libros-refs.js`): da la página pública de libros y capítulos.
3. **Dos agentes con lotes chicos** (unos 22 KB y 63.000 tokens cada uno, sin navegar) decidieron sobre las 90 referencias que quedaban: confirmar, corregir, dejar sin enlace o proponer una fuente abierta para las fichas que no tenían ninguna.
4. **Script final** (`tareas/aplicar-refs.js`): solo acepta lo que Crossref confirma. Las correcciones y las fuentes nuevas quedan en `ajustes.json`, y los enlaces en `refs-enlaces.json`.

**Resultado:**
- 570 de 605 referencias tienen algo para compartir:
  - 439 con DOI (antes eran 44);
  - 31 con versión de lectura gratuita;
  - 83 libros con su página en Open Library;
  - 7 con su documento oficial.
- Se corrigieron 6 referencias con errores de datos: Roediger y Karpicke (2006), Tamim y colaboradores (2011), Bradbury (2016), Dawson y colaboradores (2014), Kornell y Bjork (2008) y Bravata y colaboradores (2020).
- Se sumaron fuentes abiertas a las fichas que no tenían ninguna, por ejemplo:
  - Ashford-Rowe y colaboradores (2014) en Evaluación auténtica;
  - Raes y colaboradores (2020) en HyFlex;
  - Mann y colaboradores (2009) en Práctica reflexiva.

**En el juego:** los DOI y las URL de la sección "Fuentes" se abren en otra pestaña, y aparecen los botones "Leer gratis", "Ver el libro" y "Ver el documento".

**Quedan sin enlace 35 referencias:**
- citas de software o sitios web;
- libros que no aparecen en Open Library;
- cuatro DOI propuestos que Crossref no confirmó (Stephens et al., 2014; Su et al., 2011; Fives y DiDonato-Barnes, 2013; Wiggins, 1990).

Ninguna ficha descubrible depende solo de ellas. El detalle está en `datos/v2/revision/refs-aplicadas.md`.
