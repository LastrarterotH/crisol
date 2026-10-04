# Revisión metodológica y pedagógica de Crisol

Crisol es un juego para formar docentes de educación superior en América Latina. Se parte de cuatro primigenios (Mente, Mundo, Otros, Tiempo) y se mezclan fichas de a dos. Cada misión es un caso realista: un plano de piezas lleva hasta una meta (una síntesis), con hitos que marcan las piezas clave del caso. Cada ficha descubierta se lee como ficha de estudio:
- **pista:** adivinanza;
- **why:** qué es y por qué funciona;
- **uni:** ejemplo en una clase universitaria;
- **fuentes.**

Las síntesis traen además principios de diseño y una "prueba" para la próxima semana. Se usará en capacitaciones docentes reales, así que todo debe ser verídico, útil y defendible ante especialistas.

Tu rol es el de un especialista en pedagogía universitaria y ciencias del aprendizaje que revisa con ojo crítico. No reescribas por gusto: cambia solo lo que tenga un problema concreto.

## Qué revisar

### A. Cada ficha marcada [REVISAR]
1. **Veracidad:**
   - ¿La definición coincide con la literatura?
   - ¿Las atribuciones (autor, año, idea) son correctas?
   - ¿Las cifras son exactas?
   - ¿Se presenta como sólido algo con evidencia mixta o débil?
   - ¿Hay mitos colados como hechos?
2. **Precisión conceptual:** ¿confunde el concepto con otro cercano (por ejemplo, evaluación formativa con retroalimentación, o andamiaje con ZDP)?
3. **Fuentes:**
   - ¿La referencia existe y respalda lo que se afirma?
   - ¿El formato es APA 7 correcto?
   - Verifica en la web lo que puedas (Crossref, OpenAlex, Google Scholar, sitios de editoriales).
4. **Ejemplo de aula (uni):**
   - ¿Es concreto, realista en educación superior y aplicable la próxima semana?
   - ¿Ilustra de verdad el concepto?
5. **Pista:** ¿se puede resolver?, ¿describe bien el concepto sin nombrarlo?
6. **Síntesis:**
   - ¿Los principios se derivan de la evidencia citada y son accionables?
   - ¿La prueba se puede hacer en una semana?

### B. Cada receta del camino diseñado (y las alternativas que veas dudosas)
- ¿"A + B = C" se puede leer como una relación conceptual defendible, en que C surge o se entiende al combinar A y B?
- Marca las recetas arbitrarias o forzadas, y las que enseñarían una relación falsa.
- ¿La nota explica la relación sin errores?

### C. Cada misión
1. **Encargo:** ¿es un problema realista de docencia universitaria latinoamericana, con datos verosímiles?
2. **Alineamiento:**
   - ¿La meta resuelve de verdad el problema del encargo?
   - ¿El objetivo lo dice?
   - ¿Los hitos son los conceptos clave del camino?
   - ¿El cierre conecta la síntesis con el caso de forma concreta?
3. **Camino:**
   - ¿El plano construye hacia la meta con sentido?
   - ¿Hay desvíos que no aportan, o piezas clave ausentes?
4. **Progresión y carga:** ¿el recorrido es razonable para un docente que no es especialista en educación?

### D. Lenguaje
- Español latinoamericano neutro, con tuteo (nunca voseo) y sin raya larga (—).
- Sin patrones de texto generado: "no es X, sino Y", tríadas de ritmo, remates sentenciosos, dos puntos de remate, muletillas ("Además", "En este sentido"), ni vocabulario de relleno ("fomentar", "crucial", "fundamental", "potenciar", "ecosistema").
- Todo texto nuevo que propongas debe pasar este filtro.
- Respeta los largos:
  - pista ≤ 18 palabras;
  - why ≤ 85;
  - uni ≤ 35;
  - nota ≤ 28.

## Formato de salida
Escribe un JSON válido en la ruta que indica tu tarea:

```json
{
  "misiones": {
    "id_mision": {
      "veredicto": "sólida | ajustar | reformular",
      "hallazgos": [ { "gravedad": "alta | media | baja", "tipo": "alineamiento | camino | encargo | cierre | progresión", "detalle": "...", "propuesta": "..." } ],
      "cambios": { "encargo": "texto nuevo completo (solo si cambia)", "objetivo": "...", "cierre": "..." }
    }
  },
  "fichas": {
    "id_ficha": { "gravedad": "alta | media | baja", "problema": "qué está mal y por qué", "cambios": { "why": "texto nuevo completo", "uni": "...", "pista": "...", "prueba": "...", "principios": ["..."], "belief": "...", "evidence": "...", "refs": ["claves"] } }
  },
  "notas": { "idA+idB": { "problema": "...", "nota": "texto nuevo" } },
  "recetas_dudosas": [ { "a": "", "b": "", "r": "", "gravedad": "alta | media | baja", "problema": "...", "propuesta": "quitarla, o cambiar por A + B = otra, y por qué" } ],
  "refs": { "clave": { "problema": "...", "apa": "referencia corregida completa" } },
  "refs_nuevas": { "clave": "referencia APA 7 completa (si propones una fuente nueva)" },
  "resumen": "Tres a seis oraciones: calidad general, problemas más serios, qué verificaste en la web y qué no pudiste verificar."
}
```

Reglas del formato:
- Las claves de notas van con los ids en orden alfabético unidos por "+".
- Incluye en "fichas" solo las que necesitan cambios, y en "cambios" solo los campos que cambian.
- Gravedad alta significa que es falso, engañoso o que rompe la misión. Media, que es impreciso o débil. Baja, que es de redacción o estilo.
- Valida el JSON con node antes de terminar y revisa con grep que no haya "—".

Termina con un resumen breve:
- cuántas fichas, notas y misiones necesitan cambios, y de qué gravedad;
- los tres problemas más importantes;
- qué verificaste en la web y qué quedó sin verificar.
