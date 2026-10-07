# Revisión de referencias sin enlace

Crisol es un juego para docentes universitarios. Cada ficha cita fuentes en APA 7, y queremos que cada ficha tenga **al menos una fuente que el docente pueda abrir y compartir**: con DOI, con una versión de acceso abierto o con una página oficial estable.

Un script ya revisó las 598 referencias contra Crossref, OpenAlex y Open Library. Tu lote trae lo que no pudo resolver solo. Trabaja **solo con tu lote y tu conocimiento**: no navegues, no uses WebFetch ni búsqueda web, y no leas otros archivos del proyecto. Lo que propongas lo vuelve a verificar un script contra Crossref, así que no inventes DOI: si no lo sabes con seguridad, no lo pongas.

## Parte A: cada referencia sin enlace
Elige una acción por referencia:
- **"confirmar"**: el candidato es la misma obra (mismo trabajo, no una reseña ni otra edición sin relación). Copia su DOI en "doi".
- **"corregir"**: la referencia tiene un error (año, título, revista, autores, páginas) que conoces con seguridad. Escribe la referencia completa corregida en "apa" (APA 7, con la cursiva marcada con guiones bajos), con DOI al final solo si lo sabes.
- **"sin_enlace"**: la obra existe y la referencia está bien, pero no tiene DOI. Suelen ser libros clásicos, informes o capítulos. Si conoces con certeza una URL oficial estable (por ejemplo el documento en el sitio de un organismo o en ERIC), ponla en "url". Si no, deja solo "motivo".
- **"dudosa"**: no estás seguro de que exista tal como está citada. Explica en "motivo" qué te hace dudar.

## Parte B: fichas sin ninguna fuente para compartir
Para cada ficha, propone **una** referencia adicional que respalde lo que dice su "why" y que tenga DOI o versión abierta. Prefiere artículos de revisión o metaanálisis conocidos, de acceso abierto si es posible. Escríbela en "nuevas", con una clave apellido+año que no exista, y asígnala a la ficha en "fichas". Si no conoces una con seguridad, no la propongas y dilo en "notas".

## Salida
Un único JSON válido en la ruta que te indican, con esta forma:

```json
{
  "refs": {
    "clave": { "accion": "confirmar", "doi": "10.xxxx/yyyy" },
    "clave2": { "accion": "corregir", "apa": "Autor, A. (2010). Título. _Revista, 1_(2), 3–4. https://doi.org/..." },
    "clave3": { "accion": "sin_enlace", "motivo": "libro de 1938 sin edición digital", "url": "opcional" },
    "clave4": { "accion": "dudosa", "motivo": "..." }
  },
  "nuevas": { "clave_nueva": "Referencia APA 7 completa con DOI." },
  "fichas": { "id_ficha": ["clave_nueva"] },
  "notas": "Lo que no pudiste resolver y por qué, en pocas líneas."
}
```

Valida el JSON con `node -e 'JSON.parse(require("fs").readFileSync("RUTA","utf8"))'`. Escribe en español latinoamericano neutro y sin raya larga (—). Termina con un resumen de una a tres líneas: cuántas confirmaste, corregiste, dejaste sin enlace y marcaste dudosas, y cuántas fuentes nuevas propusiste.
