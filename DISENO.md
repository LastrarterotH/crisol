# Alquimia Docente: diseño de la versión local

## Qué tiene que lograr
Un juego de combinación que se entienda solo, que dé ganas de seguir mezclando y que deje algo concreto a quien enseña en la universidad. Se juega solo o en un taller, de forma cooperativa.

## Pilares
1. **Natural.** Se parte de cuatro elementos primigenios y las primeras mezclas se adivinan: Mente + Mundo = Experiencia. Cada receta debe poder leerse como una frase con sentido para un docente de cualquier disciplina.
2. **Con rumbo.** Las misiones son encargos realistas con un plano. El plano muestra las piezas que faltan, desde los primigenios hasta la meta. Llegar a la meta de una misión exige entre 15 y 35 mezclas.
3. **Generoso.** Casi toda mezcla entre fichas comunes produce algo. Las parejas comunes están preanalizadas; las raras las resuelve Claude en unos segundos y quedan guardadas para todos.
4. **Bello y táctil.** Pizarra verde con marco de madera, fichas de papel, polvo de tiza al fusionar, diagramas a tiza (rough.js) y sonido sintetizado.
5. **Aporte docente.** Cada ficha es una ficha de estudio con fundamento y fuentes. Cada misión termina en un plan de acción con las reflexiones de quien juega. En el taller, las reflexiones se ven en un muro común.

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
- **Mezclas fallidas:** si una pareja no forma nada, la respuesta explica por qué y, cuando se puede, orienta hacia otra combinación.

## Taller
El facilitador crea un taller desde su computador. Elige la misión y comparte un código QR, y los participantes entran desde la misma red con su nombre. El banco del grupo es opcional: deja tomar piezas que descubrió otra persona, con su crédito. La proyección muestra el plano con el avance del grupo, el registro de descubrimientos y el muro de reflexiones. Al cerrar, se exporta un resumen.

## Técnica
- Servidor Node sin framework (`servidor.js`): archivos estáticos, API, eventos en vivo (SSE) y persistencia en archivos JSON (`servidor-datos/`).
- IA: `claude -p` en modo mínimo (system prompt propio, sin herramientas, modelo haiku por defecto), con caché compartida. Si existe `ANTHROPIC_API_KEY`, puede usar la API directamente.
- Cliente: HTML, CSS y módulos JS sin bundler. Librerías: rough.js (tiza) y qrcode (en el servidor).
- Contenido: `datos/` y luego `node construir.js`, que genera `public/datos.json` validado.

## Textos
Todo texto pasa por el filtro del detector de patrones LLM (prohibiciones A1 a A13, patrones B, vocabulario C, tono D). Español latinoamericano neutro, tuteo y sin raya larga. Se busca humor amable, precisión y utilidad.
