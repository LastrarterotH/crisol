# Crisol

Antes se llamaba Alquimia Docente.

Juego de mezclas (al estilo de Infinite Craft) para docentes de educación superior. Se parte de cuatro elementos primigenios (🧠 Mente, 🌍 Mundo, 🤝 Otros, ⏰ Tiempo) y, mezclando de a dos, se llega a ideas sobre cómo se aprende y cómo se enseña en la universidad. Cada ficha nueva abre una ficha de estudio con la explicación, un ejemplo de aula y las fuentes.

Las misiones son el centro del juego. Cada una trae un encargo (un caso realista de docencia), un plano con las piezas que hay que reunir hasta la meta, con estrellas en las piezas clave del caso. Al cumplirla se descarga un plan de acción en Markdown. Dentro de una misión solo valen las mezclas que llevan a piezas de su plano; las demás avisan que por esa línea investigativa no se avanza.

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

- `public/`: el juego (HTML, CSS y módulos JS sin framework). `public/datos.json` se genera, no se edita a mano. `public/estilos.css` da la estructura y `public/temas/esencial.css` el aspecto (blanco, grises y negro, sin bordes ni degradados). `public/fuentes/` trae Atkinson Hyperlegible Next (licencia SIL OFL).
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
  - `ajustes.json`: correcciones manuales que se aplican al final.
  - `tareas/`: reglas, catálogos e instrucciones con que se generó el contenido, y `validar-E.js` para revisar una expansión.
- `datos/` (raíz): contenido de la versión 1, que la versión actual reutiliza como base.
- `DISENO.md`: el diseño.
- `legacy/`, `src/`, `build.js`, `index.html`: la versión artifact anterior, solo como archivo.
