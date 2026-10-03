# Alquimia Docente

Juego de mezclas (al estilo de Infinite Craft) para docentes de educación superior. Se parte de cuatro elementos primigenios (🧠 Mente, 🌍 Mundo, 🤝 Otros, ⏰ Tiempo) y, mezclando de a dos, se llega a unas doscientas ideas sobre cómo se aprende y cómo se enseña en la universidad. Cada ficha nueva abre una ficha de estudio con la explicación, la evidencia y las fuentes.

Las misiones le dan rumbo al juego. Cada una tiene un encargo, un plano con las piezas que hay que reunir (de 9 a 41, más una de bienvenida de 3) e hitos que piden una reflexión breve. Al terminar se descarga un plan de acción en Markdown.

El contenido suma 200 fichas y 1083 recetas. El 82 % de las parejas entre fichas de los niveles 0 y 1 produce algo, y las recetas que acortaban demasiado el camino a las metas quedaron fuera.

## Cómo se ejecuta

Requiere Node 18 o superior.

```sh
npm install
npm start
```

`npm start` arma `public/datos.json` y levanta el servidor en http://localhost:5480 (en macOS se abre solo en el navegador).

- `npm run construir`: solo arma los datos y muestra el informe de validación.
- `npm run servidor`: solo levanta el servidor.

Variables de entorno opcionales:

| Variable | Para qué |
|---|---|
| `PUERTO` | Puerto del servidor (5480 por defecto). |
| `ALQUIMIA_MODELO` | Modelo que usa Claude para las mezclas nuevas (`claude-opus-5-5` por defecto). |
| `ALQUIMIA_ESFUERZO` | Esfuerzo de razonamiento para esas mezclas (`low` por defecto). |
| `ALQUIMIA_SIN_ABRIR` | Si tiene valor, no abre el navegador al arrancar. |

## Mezclas con Claude

La mayoría de las parejas ya vienen analizadas: o forman una ficha del núcleo verificado o se sabe que no forman nada. Para el resto, el servidor consulta a Claude Code en modo no interactivo (`claude -p`), así que basta con tener la CLI instalada y con sesión iniciada en el equipo que corre el servidor. Cada consulta tarda unos segundos y queda guardada en `servidor-datos/ia.json`, de modo que una misma pareja se consulta una sola vez.

Cuando una pareja analizada no forma nada, el aviso ofrece "Que Claude lo piense igual" para explorar fuera del núcleo.

Las fichas que propone Claude aparecen marcadas como "Por revisar". Desde el equipo del servidor (localhost) se pueden aprobar o descartar en la misma ficha.

## Modo taller

Pensado para capacitaciones presenciales:

1. Quien facilita abre el juego en el equipo del servidor y elige "Crear taller": misión, título y si el grupo comparte un banco de fichas.
2. Aparece un código y un QR. Los participantes, conectados a la misma red, entran desde su teléfono o computador con su nombre y un avatar.
3. La vista de proyección (`/proyeccion?taller=CÓDIGO`) muestra el plano del grupo, quién descubre qué y el muro de reflexiones, todo en vivo.
4. Al cerrar, se descarga un resumen del taller en Markdown.

Los talleres se guardan en `servidor-datos/talleres/`.

## Estructura

- `public/`: el juego (HTML, CSS y módulos JS sin framework). `public/datos.json` se genera, no se edita a mano.
- `servidor.js`: servidor HTTP, API de mezclas con Claude, curaduría y talleres (SSE).
- `construir.js` + `grafo2.js`: unen el contenido, validan (colisiones, alcanzabilidad, emojis únicos, rayas largas, referencias, patrones de escritura) y escriben `public/datos.json`. El informe de patrones queda en `datos/v2/informe-patrones.txt`.
- `datos/v2/`: contenido de la versión local.
  - `catalogo.json`: familias, primigenios, fichas nuevas, cambios y misiones.
  - `recetas-nuevas.txt` y `quitar.txt`: el grafo diseñado.
  - `parte-N*.json`, `filtro-F*.json`: textos de fichas y misiones.
  - `pre-P*.json`, `pre-D*.json`: parejas preanalizadas. `quitar-D.txt` excluye las recetas de densificación que abrían atajos hacia hitos y metas.
  - `ajustes.json`: correcciones manuales que se aplican al final.
  - `tareas/`: reglas e instrucciones con que se generó el contenido.
- `datos/` (raíz): contenido de la versión 1, que la versión local reutiliza como base.
- `DISENO.md`: el diseño de la versión local.
- `legacy/`, `src/`, `build.js`, `index.html`: la versión artifact anterior, solo como archivo.
