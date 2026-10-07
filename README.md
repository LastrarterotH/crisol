# Crisol

Antes se llamaba Alquimia Docente.

Herramienta para la formación docente universitaria, con forma de juego de mezclas (al estilo de Infinite Craft). Se parte de cuatro elementos primigenios (🧠 Mente, 🌍 Mundo, 🤝 Otros, ⏰ Tiempo) y, mezclando de a dos, se llega a ideas sobre cómo se aprende y cómo se enseña en la universidad. Cada ficha nueva abre una ficha de estudio con la explicación, un ejemplo de aula y las fuentes.

Las misiones son el centro del juego. Cada una trae un encargo (un caso realista de docencia), un plano con las piezas que hay que reunir hasta la meta, con estrellas en las piezas clave del caso. Al cumplirla se descarga un plan de acción en Markdown. Dentro de una misión solo valen las mezclas que llevan a piezas de su plano; las demás avisan que por esa línea investigativa no se avanza.

Las 30 misiones siguen un hilo conductor. La parte 1 (16 misiones de ideas) va de menos a más, y la parte 2 (14 misiones de herramientas) lleva cada una a una herramienta concreta, como Moodle con «Diseñar un curso» o Anki con «Memoria que dura». Cada misión dice de dónde viene, qué te llevas y qué conviene saber antes si empiezas por ella. La guía para facilitar, en el panel de Misiones, junta todo eso para armar un taller que parta donde quieras y se descarga en Markdown.

Las recetas proponen una forma de relacionar dos ideas. Cada una se revisó para que se entienda sin leer su nota, pero varias admiten otra lectura, y eso sirve en un taller. Discutir por qué A + B da R, o qué otra mezcla daría lo mismo, lleva a negociar el contenido y, sobre todo, lo que cada docente entiende por esa idea. La portada lo dice para que quien juega lo sepa desde el inicio.

## Para repartirlo

```sh
npm install
npm run empaquetar
```

Genera `dist/Crisol.html`: un único archivo con el código, los estilos, las tipografías y los datos adentro. Se abre con doble clic en cualquier navegador moderno y funciona sin conexión ni servidor. Cada docente juega en su notebook y su avance queda guardado en su navegador.

## Para trabajar en el código

```sh
npm start
```

Arma `public/datos.json` y abre un servidor de desarrollo en http://localhost:5480, que solo sirve los archivos de `public/`. `npm run construir` arma los datos y muestra el informe de validación.

## Estructura

- `public/`: el juego (HTML, CSS y módulos JS sin framework). `public/datos.json` se genera, no se edita a mano. `public/estilos.css` da la estructura y `public/temas/esencial.css` el aspecto (blanco, grises y negro con un color plano por familia de ideas, sin bordes ni degradados). `public/fuentes/` trae Atkinson Hyperlegible Next (licencia SIL OFL).
- `construir.js` + `grafo2.js`: unen el contenido, validan (colisiones, alcanzabilidad, emojis únicos, rayas largas, referencias, patrones de escritura) y escriben `public/datos.json`. El informe de patrones queda en `datos/v2/informe-patrones.txt`.
- `empaquetar.js`: arma el archivo único de `dist/`.
- `servidor.js`: servidor de desarrollo, solo archivos estáticos.
- `datos/v2/`: contenido.
  - `catalogo.json`: familias, primigenios, fichas nuevas, cambios y misiones originales.
  - `recetas-nuevas.txt` y `quitar.txt`: el grafo diseñado.
  - `parte-N*.json`, `filtro-F*.json`: textos de fichas y misiones.
  - `expansion-E*.json`: misiones nuevas con sus fichas, recetas, textos y referencias.
  - `expansion-H*.json`: 14 misiones con herramientas concretas (familia "her": PowerPoint, Moodle, Gmail, ChatGPT, Kahoot!, Zoom, Excel y otras 42), que además rescatan fichas que estaban escritas pero fuera de todo plano. Se escriben con `tareas/tarea-H.md`, un paquete de contexto recortado por agente (`tareas/paquete.js`) y se revisan con `tareas/validar-E.js`, `tareas/citas.js`, `tareas/verificar-refs.js` (Crossref y OpenAlex) y `tareas/pulir.js`.
  - `pre-P*.json`, `pre-D*.json`: recetas para que casi toda pareja del inicio produzca algo. `quitar-D.txt` excluye las que abrían atajos hacia hitos y metas.
  - `hilo.json`: el orden de las misiones, sus dos partes y, para cada una, de dónde viene, qué te llevas y qué conviene saber antes. Las referencias a otras misiones se escriben `{id}` o `{#id}` y `construir.js` las convierte en «Nombre» (misión N); además revisa que en «viene de» y «si empiezas aquí» solo se nombren misiones anteriores, y en «te llevas» solo posteriores.
  - `ajustes.json`: correcciones manuales que se aplican al final. Además de textos y referencias, quita recetas (`quitarRecetas`), suma recetas al camino diseñado (`recetasPlano`) o alternativas (`recetasExtra`), y fija la receta de una pieza en una misión (`misiones[id].ruta`). La revisión de validez de las recetas se escribe en `revision/recetas-decision.json` y se aplica con `tareas/aplicar-recetas.js`; `tareas/comparar-planos.js` muestra cómo cambia cada plano y `tareas/receta.js` dice si un par está libre.
  - `tareas/`: reglas, catálogos e instrucciones con que se generó el contenido, y `validar-E.js` para revisar una expansión.
- `datos/` (raíz): contenido de la versión 1, que la versión actual reutiliza como base.
- `DISENO.md`: el diseño.
- `legacy/`, `src/`, `build.js`, `index.html`: la versión artifact anterior, solo como archivo.
