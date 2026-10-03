# Expansión E: misiones nuevas con sus fichas

Alquimia Docente es un juego de combinación para docentes de educación superior (lee REGLAS.md). Hoy tiene 200 fichas, 1083 recetas y 8 misiones. El usuario quiere más misiones y muchas más fichas, porque las misiones son lo que más le gustó. Cada docente juega en su notebook, sin conexión y sin IA, así que todo lo que se puede descubrir en una misión tiene que estar escrito de antemano.

Tu tarea: diseñar y escribir **dos misiones completas** con las **fichas nuevas** que necesitan (unas 45 a 55 fichas nuevas entre las dos) y sus recetas. Tu tarea particular (al final de este archivo) te dice los temas y tu archivo de salida.

## Lee primero (carpeta datos/v2/tareas)
- REGLAS.md: voz, filtro obligatorio de patrones LLM, veracidad y largo de cada campo. Es obligatorio.
- CATALOGO-ACTUAL.md: las 200 fichas actuales (id, emoji, nombre, familia, nivel, pista). Reutiliza las que sirvan como ingredientes.
- RECETAS-ACTUALES.txt: las parejas que ya tienen receta. Ninguna de tus recetas puede usar una pareja de esa lista.
- REFS-ACTUALES.md: referencias existentes. Reutilízalas por su clave.
- EMOJIS-E?.txt (el de tu número): tu reserva de emojis. Usa solo emojis de esa lista, uno distinto por ficha, que se relacione con el concepto.
- Como ejemplo de textos, mira en datos/v2/parte-N2.json la ficha "clase_interactiva" (síntesis con principios y prueba) y la misión "activa" (encargo, objetivo, reflexiones y cierre).

## Misiones que ya existen (no las repitas)
- 🌱 Primeros pasos (tutorial, meta aprendizaje)
- 🌅 La clase que despierta: clase activa e instrucción entre pares (hitos activo, cooperativo, clase_interactiva)
- 🎖️ Evaluar para aprender: retroalimentación, rúbricas, juicio evaluativo
- 🏺 Memoria que dura: práctica de recuperación, intercalada, dificultades deseables
- 🌟 IA con sentido: IA generativa, tutoría, privacidad, evaluación con IA
- 🪐 Más allá del aula: virtual, híbrido, comunidad de indagación
- 🧹 Claustro sin mitos: pirámide del aprendizaje, el 10 % del cerebro, evidencia
- 🎼 Diseñar un curso: diseño inverso, alineamiento constructivo, DUA

## Cómo se arma una misión
- **Meta:** una ficha nueva de familia "sint" (síntesis), con id "cap_algo". La misión usa el mismo nombre y emoji que su meta. La meta se obtiene con una receta de dos piezas avanzadas, normalmente otra síntesis intermedia y un concepto clave.
- **Camino:** desde los cuatro primigenios hasta la meta debe haber un recorrido de **12 a 28 mezclas mínimas**. El validador lo calcula. Para que el recorrido sea largo, la meta y sus piezas previas deben salir de recetas entre fichas de nivel alto, no de atajos con fichas de nivel 0 a 2.
- **Hitos:** exactamente 3 fichas del camino, que sean pasos obligados (el validador avisa si un hito no queda en el camino mínimo). Al lograr un hito el juego pide una reflexión.
- **Síntesis intermedias:** 1 o 2 por misión, también de familia "sint", que integran dos ideas. Llevan "principios" (3 a 5, cada uno termina con su cita entre paréntesis, por ejemplo "(Johnson y Johnson, 2009)") y "prueba" (algo concreto para probar la próxima semana), además de pista y why.
- **Textos de la misión:**
  - "encargo": 80 a 120 palabras, en segunda persona hacia quien juega. Un caso realista de docencia universitaria en América Latina ("Te escribe Nombre Apellido, que enseña X en Y..."). Usa otra ciudad y otra disciplina que las misiones existentes (ya están Montevideo, Asunción, Medellín, San José, Valparaíso, Cusco y Santiago).
  - "objetivo": una oración, "Llega a EMOJI Nombre de la meta para ...".
  - "reflexiones": una pregunta por cada hito (y si quieres una para la meta). Cada pregunta aterriza la idea en el curso de quien juega, con un ejemplo del caso.
  - "cierre": 50 a 80 palabras que conectan la síntesis con el caso del encargo.

## Fichas nuevas
- Conceptos reales y reconocibles de docencia universitaria, con respaldo en la investigación. No inventes conceptos ni nombres de modelos.
- Familias: cot (lo esencial, solo para conceptos cotidianos de base), fund (conocimiento docente), apr (cómo se aprende), met (metodologías), eva (evaluación), dis (diseño de la enseñanza), tec (tecnología), mod (modalidades), mito, sint.
- Puedes crear 1 o 2 mitos si son pertinentes a tus temas y la evidencia en su contra es sólida. Un mito lleva "belief" y "evidence" en vez de "why". Además necesita una receta "reflexiva + id_del_mito = concepto con respaldo", porque el juego invita a combinar todo mito con 📓 Práctica reflexiva para desarmarlo.
- Antes de crear una ficha, revisa que no exista ya con otro nombre en CATALOGO-ACTUAL.md. Si existe, úsala como ingrediente.
- Cada ficha nueva debe salir de al menos una receta. Las fichas que sirvan a varios temas pueden tener 2 o 3 recetas.
- Nivel esperado: casi todas entre 3 y 7. Calcula que el nivel de una ficha es el máximo nivel de sus ingredientes más uno.

## Recetas
- Cada receta es {"a": id, "b": id, "r": id, "nota": "..."}. Los ingredientes pueden ser fichas existentes o nuevas tuyas.
- Cada receta debe poder leerse como una frase con sentido para un docente de cualquier disciplina ("Error + Retroalimentación = ...").
- Ninguna pareja puede estar en RECETAS-ACTUALES.txt, ni repetirse dentro de tu archivo.
- Agrega además unas 30 a 50 **recetas de conexión**: parejas que combinen tus fichas nuevas con fichas existentes de nivel 2 a 5 y den una ficha tuya o una ficha existente. Sirven para que tus fichas se mezclen con el resto del juego. No uses recetas de conexión para llegar a tus hitos o a tus metas por atajos.

## Formato de salida
Un único JSON en tu ruta de salida:

```json
{
  "fichas": {
    "id_nuevo": { "n": "Nombre", "e": "emoji", "f": "familia", "pista": "...", "why": "...", "uni": "...", "refs": ["clave"] },
    "id_mito": { "n": "...", "e": "...", "f": "mito", "pista": "...", "belief": "...", "evidence": "...", "refs": ["..."] },
    "cap_algo": { "n": "...", "e": "...", "f": "sint", "pista": "...", "why": "...", "principios": ["... (Autor, año)."], "prueba": "...", "refs": ["..."] }
  },
  "recetas": [ { "a": "id", "b": "id", "r": "id", "nota": "..." } ],
  "refs": { "clave_nueva": "Referencia APA 7 con _cursiva_ marcada con guiones bajos." },
  "misiones": [
    { "id": "algo", "n": "Nombre de la meta", "e": "emoji de la meta", "meta": "cap_algo", "hitos": ["id1", "id2", "id3"],
      "encargo": "...", "objetivo": "...", "reflexiones": { "id1": "...", "id2": "...", "id3": "..." }, "cierre": "..." }
  ]
}
```

Los ids van en minúsculas, sin tildes, con guion bajo. Las claves de referencia nuevas siguen el estilo apellido+año (por ejemplo "bean11").

## Validación (obligatoria)
Corre `node /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/validar-E.js RUTA_DE_TU_ARCHIVO` hasta que diga SIN ERRORES y revisa sus avisos: mezclas mínimas de cada misión, hitos fuera del camino, textos largos, emojis fuera de tu reserva. Revisa también con grep que no quede ninguna raya larga.

Al terminar, responde con un resumen breve:
- las dos misiones, con su número de mezclas mínimas;
- cuántas fichas y recetas escribiste;
- cuántos patrones del filtro corregiste;
- las dudas de veracidad que te queden. Separa lo que verificaste en la web de lo que escribiste de memoria.
