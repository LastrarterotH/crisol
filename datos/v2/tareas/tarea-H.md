# Expansión H: misiones con herramientas que rescatan fichas sin misión

Crisol (antes Alquimia Docente) es un juego de combinación para docentes de educación superior en América Latina; lee REGLAS.md. Se parte de cuatro primigenios (Mente, Mundo, Otros, Tiempo) y se mezclan fichas de a dos. El juego solo tiene **misiones**: cada una trae un encargo realista, un plano de piezas y una meta (una síntesis). Dentro de una misión solo se pueden descubrir las piezas de su plano. Por eso una ficha que no está en ningún plano no se puede descubrir.

Hoy hay 390 fichas, pero solo 184 están en algún plano. El usuario quiere **duplicar las ideas descubribles** y sumar **herramientas concretas** (PowerPoint, Moodle, Gmail, ChatGPT...) en una familia nueva, "her" (Herramientas). Cada docente juega en su notebook, sin conexión y sin IA, así que todo lo descubrible se escribe de antemano.

## Tu tarea
Diseñar y escribir **dos misiones completas**. Tu tarea particular, al final de este archivo, te da los temas, las ciudades y la ruta de salida. Cada misión debe cumplir tres cosas:
1. **Llevar a su meta por un camino que pase por tus herramientas.** Al menos 3 herramientas en el camino de cada misión.
2. **Rescatar fichas SIN MISIÓN.** Tu archivo `ASIGNACION-Hn.json` trae la lista de fichas ya escritas que te tocan. Haz que la mayor parte quede en el camino de una de tus dos misiones: apunta a 70 % o más. Una ficha queda en el camino cuando la meta la necesita, directa o indirectamente, como ingrediente.
3. **Sumar 16 o más piezas descubribles nuevas** en el camino de cada misión, entre fichas rescatadas y fichas nuevas tuyas.

## Lee solo esto (carpeta /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas)
Para ahorrar recursos, tu contexto viene recortado. Lee completos únicamente estos archivos:
- **REGLAS.md:** voz, filtro obligatorio de patrones LLM, veracidad y largo de cada campo. Es obligatorio.
- **HERRAMIENTAS.md:** cómo se escribe una ficha de herramienta.
- **paquetes/PAQUETE-Hn.md:** el de tu número. Trae:
  - tus dos misiones con tema y ciudad;
  - tus herramientas;
  - tu reserva de emojis;
  - tus fichas SIN MISIÓN en detalle, con las recetas que hoy las producen;
  - las referencias que ya usan esas fichas;
  - el catálogo completo en una línea por ficha.

**No leas completos** CATALOGO-ACTUAL.md, RECETAS-ACTUALES.txt ni REFS-ACTUALES.md, porque son grandes. Para consultas puntuales usa grep:
- `grep '^- ID ·' CATALOGO-ACTUAL.md` para la pista de una ficha;
- `grep -i 'palabra' REFS-ACTUALES.md` para buscar una referencia existente;
- `grep 'ID' RECETAS-ACTUALES.txt` para ver las recetas de una ficha.

El validador ya avisa si una pareja está ocupada, así que no necesitas revisar las recetas a mano.

**Ejemplo de textos:** `grep -A3 '"clase_interactiva"' /Users/lastraroth/Code/alquimia-docente/datos/v2/parte-N2.json` muestra una síntesis con principios y prueba.

## Misiones que ya existen (no las repitas)
- Primeros pasos (tutorial)
- La clase que despierta (clase activa)
- Evaluar para aprender
- Memoria que dura
- IA con sentido (decisión institucional sobre un tutor de IA)
- Más allá del aula (virtual e híbrido)
- Claustro sin mitos
- Diseñar un curso
- Escribir para pensar
- Pensar como la disciplina
- Equipos que funcionan
- Simular antes de la práctica
- Todas y todos aprenden
- Primer año que sostiene
- Motivación que dura
- Investigar tu propia docencia

Las ciudades ya usadas son Montevideo, Asunción, Medellín, San José, Valparaíso, Cusco, Guadalajara, Quito, Ciudad de Panamá, La Paz, Barranquilla, Cochabamba, Oaxaca, Tegucigalpa, Arequipa y Santo Domingo. Usa la ciudad que te asigna tu tarea.

## Cómo se arma una misión
- **Meta:** una ficha nueva de familia "sint" (síntesis), con id "cap_algo". La misión usa el mismo nombre y emoji que su meta. La meta sale de una receta entre dos piezas avanzadas, normalmente una síntesis intermedia y un concepto o herramienta clave.
- **Camino:**
  - Desde los primigenios hasta la meta debe haber un recorrido de **14 a 34 mezclas mínimas**. El validador lo calcula.
  - Para que el recorrido pase por tus fichas, encadena recetas en las que tus fichas rescatadas y tus herramientas sean ingredientes de las piezas siguientes.
  - Evita atajos: la meta y sus piezas previas salen de fichas de nivel alto.
- **Hitos:** exactamente 3 fichas del camino, que sean pasos obligados. El plano las marca con una estrella como piezas clave del caso. Conviene que al menos una sea herramienta o una idea sobre su uso.
- **Síntesis intermedias:** 1 o 2 por misión, de familia "sint", que integran dos ideas. Llevan "principios" (3 a 5, cada uno con su cita entre paréntesis al final) y "prueba" (algo concreto para probar la próxima semana), además de pista y why.
- **Textos de la misión:**
  - **encargo:** 80 a 120 palabras, en segunda persona hacia quien juega. Un caso realista de docencia universitaria en tu ciudad, con nombre, disciplina, curso y un problema verosímil en el que la herramienta importa. Varía la apertura: no todas las misiones empiezan con "Te escribe...".
  - **objetivo:** una oración: "Llega a EMOJI Nombre de la meta para ...".
  - **Institución:** no nombres universidades reales. Escribe "una universidad de CIUDAD" o "una universidad pública de CIUDAD".
  - **Nombre de la docente o el docente:** no repitas nombres de pila ya usados: Patricia, Gabriel, Rocío, Lorena, Wilmer, Ximena, Verónica, Rodrigo, Daniela, Andrea, Mariela, Citlali, Marco, Marcelo, Rafael, Valentina y Martín.
  - **cierre:** 50 a 80 palabras que conectan la síntesis con el caso del encargo.

## Fichas nuevas
- **Tus herramientas:** créalas todas (ver HERRAMIENTAS.md). Si alguna no tiene sentido en tus misiones o dejó de existir, explícalo en tu resumen.
- **Síntesis:** las dos metas y sus intermedias.
- **Conceptos nuevos:** solo los que de verdad falten (máximo unos 8 entre las dos misiones). Antes de crear uno, busca en CATALOGO-ACTUAL.md si ya existe con otro nombre. Si una idea base hace falta para llegar a una herramienta (por ejemplo "Correo electrónico" o "Diapositivas"), créala en familia cot o tec, con nivel bajo.
- **Veracidad:** conceptos reales y reconocibles, con respaldo en la investigación. No inventes conceptos, modelos, cifras ni funciones de una herramienta.
- **Familias:**
  - cot: lo esencial, solo conceptos cotidianos de base.
  - fund: conocimiento docente.
  - apr: cómo se aprende.
  - met: metodologías.
  - eva: evaluación.
  - dis: diseño de la enseñanza.
  - tec: tecnología como concepto.
  - her: herramientas concretas.
  - mod: modalidades.
  - mito.
  - sint.
- **Mitos:** puedes crear uno si es pertinente y la evidencia en su contra es sólida. Lleva "belief" y "evidence" en vez de "why", y una receta "reflexiva + id_del_mito = concepto con respaldo".
- **Recetas:** cada ficha nueva sale de al menos una receta.

## Recetas
- Cada receta es {"a": id, "b": id, "r": id, "nota": "..."}.
- Debe leerse como una frase con sentido para un docente de cualquier disciplina, y la nota explica la relación en 28 palabras o menos.
- Ninguna pareja puede estar en RECETAS-ACTUALES.txt ni repetirse dentro de tu archivo.
- Las recetas con herramientas deben enseñar algo: para qué sirve la herramienta o qué idea pedagógica la sostiene. Nada de asociaciones arbitrarias.
- Agrega además unas 15 a 30 **recetas de conexión**: parejas entre tus fichas nuevas y fichas existentes de nivel 2 a 5 que den una ficha tuya o una existente. Sirven para que tus fichas se mezclen con el resto del juego. No las uses para llegar por atajo a tus hitos o tus metas.

## Fuentes (sin navegar)
- **No uses WebFetch ni búsqueda web.** Las referencias nuevas se verifican después con un script contra Crossref y OpenAlex (verificar-refs.js), sin gastar recursos.
- **Prefiere referencias existentes:** búscalas con grep en REFS-ACTUALES.md y úsalas por su clave.
- **Las nuevas:** escribe solo referencias que conozcas con seguridad (autores, año, título exacto, revista o editorial, volumen y páginas), en APA 7, con la _cursiva_ marcada con guiones bajos y clave apellido+año (por ejemplo "wang20"). Agrega el DOI al final (https://doi.org/...) cuando lo sepas.
- **Si dudas de una referencia, no la inventes.** Usa una referencia segura más general, o una existente, y anótalo en tu resumen.
- **Herramientas:** puedes citar el software en APA 7, por ejemplo "Moodle Pty Ltd. (2026). _Moodle_ [Software]. https://moodle.org". Esa cita no reemplaza a la referencia de investigación.

## Formato de salida
Un único JSON en tu ruta de salida, con el mismo formato que las expansiones E:

```json
{
  "fichas": {
    "id_nuevo": { "n": "Nombre", "e": "emoji", "f": "familia", "pista": "...", "why": "...", "uni": "...", "refs": ["clave"] },
    "id_herramienta": { "n": "Moodle", "e": "emoji", "f": "her", "pista": "...", "why": "...", "uni": "...", "refs": ["..."] },
    "cap_algo": { "n": "...", "e": "...", "f": "sint", "pista": "...", "why": "...", "principios": ["... (Autor, año)."], "prueba": "...", "refs": ["..."] }
  },
  "recetas": [ { "a": "id", "b": "id", "r": "id", "nota": "..." } ],
  "refs": { "clave_nueva": "Referencia APA 7." },
  "misiones": [
    { "id": "algo", "n": "Nombre de la meta", "e": "emoji de la meta", "meta": "cap_algo", "hitos": ["id1", "id2", "id3"],
      "encargo": "...", "objetivo": "...", "cierre": "..." }
  ]
}
```

Los ids van en minúsculas, sin tildes, con guion bajo. Los ids de misión deben ser nuevos.

## Validación (obligatoria)
- Escribe el archivo completo de una vez y después corre `node /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/validar-E.js RUTA_DE_TU_ARCHIVO`. Corrige con ediciones puntuales hasta que diga SIN ERRORES. Para ahorrar, no valides después de cada cambio pequeño: agrupa las correcciones.
- Revisa sus avisos y su informe:
  - mezclas mínimas;
  - piezas descubribles nuevas por misión;
  - herramientas en el camino;
  - fichas SIN MISIÓN asignadas que quedaron fuera;
  - textos largos;
  - emojis fuera de tu reserva.
- Revisa también con grep que no quede ninguna raya larga (—).
- Corre también `node /Users/lastraroth/Code/alquimia-docente/datos/v2/tareas/citas.js RUTA_DE_TU_ARCHIVO`. Cada autor que cites en el texto, como "(Mayer, 2009)", debe estar en las refs de esa ficha, y la misión no debe nombrar instituciones reales.
- No modifiques ningún archivo fuera de tu ruta de salida.

Al terminar, responde con un resumen breve:
- las dos misiones, con mezclas mínimas y piezas descubribles nuevas de cada una;
- cuántas fichas SIN MISIÓN rescataste de las asignadas;
- cuántas fichas, herramientas y recetas escribiste;
- cuántos patrones del filtro corregiste;
- las referencias nuevas de las que no estés del todo seguro, y cualquier otra duda de veracidad.
