# Alquimia Docente: diseño de la versión local

## Qué tiene que lograr
Un juego de combinación que se entienda solo, que dé ganas de seguir mezclando y que deje algo concreto a quien enseña en la universidad. Cada docente juega en su notebook, sin conexión ni servidor. En una capacitación, el grupo juega la misma misión en paralelo y conversa sobre cómo llegar a la meta mirando el plano.

## Pilares
1. **Natural.** Se parte de cuatro elementos primigenios y las primeras mezclas se adivinan: Mente + Mundo = Experiencia. Cada receta debe poder leerse como una frase con sentido para un docente de cualquier disciplina.
2. **Con rumbo.** Las misiones son encargos realistas con un plano. El plano muestra las piezas que faltan, desde los primigenios hasta la meta. Llegar a la meta de una misión exige entre 9 y 29 mezclas como mínimo, según la misión.
3. **Cerrado y claro.** Solo hay misiones (no hay laboratorio libre). Dentro de una misión valen las mezclas que llevan a piezas de su plano, por el camino diseñado o por caminos alternativos. Si una mezcla lleva fuera del plano, o si una ficha ya no lleva a ninguna pieza pendiente, el aviso dice que en esta misión no se puede seguir avanzando por esa línea investigativa. Las fichas agotadas se ven apagadas y la caja muestra solo lo que sirve para la misión. Todo está escrito de antemano y el juego no genera fichas en vivo; más adelante se evaluará si Claude entra, y en qué momento.
4. **Bello y legible.** Un laboratorio luminoso: mesa marfil con grilla de puntos, fichas blancas con una moneda del color de su familia, títulos en Fraunces y lectura en Figtree. Al mezclar hay una onda y destellos del color de la familia, y el sonido es sintetizado. Se eligió una paleta clara porque se proyecta bien en una sala.
5. **Aporte docente.** Cada ficha es una ficha de estudio con fundamento y fuentes. Cada misión termina en un plan de acción con las reflexiones de quien juega.

## Elementos primigenios
- 🧠 Mente: lo que ocurre dentro de quien aprende (Piaget).
- 🌍 Mundo: la realidad, los problemas, el contexto (Dewey).
- 🤝 Otros: las demás personas (Vygotsky).
- ⏰ Tiempo: lo que se gana y se pierde con los días (Ebbinghaus).

## Capas
- **Nivel 1 (10 fichas):** Reflexión, Experiencia, Diálogo, Memoria, Problema real, Comunidad, Cambio, Grupo, Saber y Práctica.
- **Nivel 2 (conceptos cotidianos de la enseñanza):** Pregunta, Error, Emoción, Lenguaje, Escritura, Herramienta, Juego, Docente, Estudiante, Aprendizaje, Universidad, Investigación, entre otros.
- **Niveles 3 a 6:** conceptos pedagógicos (retroalimentación, andamiaje, ABP, práctica espaciada...) y la cadena tecnológica (Tecnología, Datos, Algoritmo, Computador, Internet, Aprendizaje automático, IA generativa).
- **Niveles 7 a 10:** síntesis de misión y metas.

## Misiones
Cada misión tiene un encargo (un caso realista de docencia universitaria), una meta (ficha síntesis) y un plano que se deriva del grafo. Algunas piezas son **hitos**: al lograrlas, la misión pide una reflexión breve ("¿cómo se vería esto en tu curso?"). La meta abre un plan de acción con las reflexiones, principios de diseño y lecturas.

## Ayuda
- **Chispas ✨:** se gana una por cada ficha nueva. Sirven para comprar pistas de una pieza del plano: ver uno de sus ingredientes cuesta 1 chispa y ver los dos cuesta 3.
- **Mezclas fallidas:** basta con que las fichas se toquen de forma visible para intentar la mezcla. Si no forman una pieza del plano, el aviso explica por qué y, cuando se puede, orienta hacia otra combinación.
- **Tutorial:** un letrero arriba de la mesa indica el paso, y las fichas que hay que usar laten en dorado.
- **Plano:** al empezar una misión se muestra su plano completo. Tocar una pieza lograda abre su ficha; tocar una pieza pendiente muestra su pista y permite comprar ingredientes con chispas.

## Densidad sin atajos
Las recetas de densificación (`pre-D1.json`, `pre-D2.json`) cubren las parejas de los niveles 0 a 2. Las que llevaban a un hito, a una meta o a un ingrediente directo de una meta, o que acortaban mucho el camino a una pieza de un plano, quedan fuera en `quitar-D.txt`. Así el inicio es fértil y las misiones conservan su recorrido.

## En una capacitación
Cada participante abre el archivo del juego en su notebook y elige la misma misión. Quien facilita proyecta su propio plano y abre la conversación con preguntas como "¿por dónde empezarían?" o "¿qué pieza les costó más?". Las reflexiones de los hitos quedan en Mi plan de cada docente, que puede descargarlas. No hay conexión entre equipos: la puesta en común es conversada.

## Técnica
- Cliente: HTML, CSS y módulos JS sin framework ni librerías. El plano es SVG propio. Tipografías locales (Fraunces y Figtree).
- Contenido: `datos/v2/` y luego `node construir.js`, que genera `public/datos.json` validado.
- Distribución: `node empaquetar.js` (con esbuild) junta todo en `dist/Alquimia-Docente.html`, que funciona con doble clic y sin conexión. El progreso se guarda en el almacenamiento local del navegador.
- `servidor.js` es solo para desarrollo.

## Textos
Todo texto pasa por el filtro del detector de patrones LLM (prohibiciones A1 a A13, patrones B, vocabulario C, tono D). Español latinoamericano neutro, tuteo y sin raya larga. Se busca humor amable, precisión y utilidad.
