# Reglas de escritura de Alquimia Docente (versión 2)

Alquimia Docente es un juego de combinación para docentes de educación superior. Se parte de cuatro elementos primigenios (🧠 Mente, 🌍 Mundo, 🤝 Otros, ⏰ Tiempo) y, mezclando de a dos, se llega a conceptos de docencia universitaria. Cada ficha descubierta se lee como una ficha de estudio. El usuario pidió tres cosas: que sea divertido, que sea hermoso y que aporte de verdad a la formación docente. Todo debe ser verídico.

## Voz
- Español latinoamericano neutro, con tuteo (puedes, tienes, mira). Nunca voseo ni giros argentinos.
- Cercana, concreta y con humor amable donde cabe: en las pistas y las notas se permite el ingenio; en el "por qué funciona", precisión ante todo.
- Ejemplos de educación superior, variados en disciplinas (medicina, derecho, ingeniería, artes, contabilidad, enfermería, historia...).
- Frases que avanzan una idea por oración. Evita la jerga cuando una palabra común sirve.

## FILTRO OBLIGATORIO: patrones LLM prohibidos
Revisa cada texto contra esta lista antes de entregarlo. Si aparece un patrón, reescribe.

### Bloque A (prohibición absoluta)
- A1: fórmula "No es X, sino Y" y variantes partidas ("No se trata de X. Se trata de Y.", "Lo importante no es X. Es Y.").
- A2: regla de tres retórica (tres elementos paralelos para dar ritmo: "claro, breve y potente"). Si de verdad son tres cosas, cámbiales la forma o el orden para que no suene a fórmula.
- A3: cierre con pregunta genérica de engagement.
- A4: párrafos o frases puente ("Esto nos lleva a...", "Y aquí es donde entra...").
- A5: enumeración disfrazada de prosa (oraciones que son ítems de lista).
- A6: remate sentencioso fabricado al final ("Al final, enseñar es aprender dos veces.").
- A7: escalada de tres oraciones cortas en crescendo.
- A8: falso dilema que propone el término medio como solución retórica.
- A9: raya larga (—) en cualquier posición. Usa coma, punto, paréntesis o dos puntos explicativos.
- A10: colon-remate (frase + dos puntos + remate sentencioso, o al revés). Los dos puntos se permiten solo para enumerar o para definir de forma técnica, nunca para "rematar".
- A11: autorreferencia de dos tiempos (anunciar lo que se va a decir y luego decirlo).
- A12: quiebre artificial de una idea en dos oraciones para dramatizar.
- A13: falsa revelación ("Hay algo que nadie dice:", "La verdad incómoda es...").

### Bloque B
B1 vocabulario de notabilidad ("revolucionario", "transformador", "pionero"); B2 participio final de significancia vaga ("...destacando la importancia de X"); B3 tono promocional; B4 muletillas de transición ("Además,", "En este sentido,", "Cabe destacar que"); B5 resumen compulsivo ("En resumen"); B7 impacto vago sin explicar; B8 falso rango "desde X hasta Y"; B10 simetría sintáctica artificial.

### Bloque C (vocabulario a evitar como relleno)
adentrarse, tejido (como metáfora), subrayar (como énfasis), fomentar, "es un testimonio de", potenciar o enriquecer sin objeto claro, crucial, fundamental, esencial (de relleno), panorama o ecosistema (como metáfora espacial), punto de inflexión, de manera fluida, robusto, matizado, sinergia, clave (como adjetivo comodín).

### Bloque D
Adjetivos acumulados sin argumento, "los expertos señalan" sin citar a nadie, universalizaciones ("todos los docentes"), urgencia retórica ("en un mundo que cambia a una velocidad sin precedentes"), cierres motivacionales vacíos.

## Veracidad
- Solo afirmaciones que un especialista aceptaría. Si la evidencia es mixta o el efecto pequeño, dilo.
- Referencias en APA 7, solo obras cuya existencia y datos conozcas con certeza o hayas verificado en la web. Si no tienes seguro el volumen o las páginas, omítelos. Nunca inventes DOI ni títulos. Marca la cursiva APA con _guiones bajos_.
- Las cifras van solo si están verificadas. Las citas textuales van solo si son exactas; si las tradujiste tú, el autor va como "Autor (año), traducción propia".
- Reutiliza referencias existentes por su clave (lista en REFS.md). Las nuevas llevan una clave tipo apellido+año; si choca, agrega una letra.

## Campos de una ficha
- "pista": máximo 18 palabras. Adivinanza que describe el concepto sin nombrarlo ni usar palabras de su nombre. Puede tener ingenio.
- "why": 2 a 4 oraciones, máximo ~85 palabras. Qué es, por qué surge de combinar sus ingredientes y qué dice la investigación.
- "uni": una oración, máximo ~35 palabras, con un ejemplo concreto en una clase universitaria, que un docente podría probar la próxima semana.
- "refs": claves de referencias (1 a 3).
- Las fichas de mito usan "belief" (lo que se cree) y "evidence" (lo que dice la investigación) en vez de "why".
- "nota" de receta: máximo ~28 palabras. Explica por qué ESA pareja lleva a ese resultado, como una pequeña historia que se entiende sin saber jerga. La clave es "idA+idB", con los ids ordenados alfabéticamente.

## Formato
Escribe JSON válido (UTF-8) en la ruta que indica tu tarea y valídalo con node antes de terminar (`node -e "JSON.parse(require('fs').readFileSync('RUTA','utf8'))"`). Revisa con grep que no quede ningún "—". Al terminar, responde con un resumen breve: qué escribiste, cuántos patrones del filtro corregiste y las dudas de veracidad que te queden.
