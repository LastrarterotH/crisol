# Preanálisis de combinaciones

Lee primero /Users/lastraroth/Code/alquimia-docente/datos/tareas/REGLAS.md (estilo y veracidad), CATALOGO.md y RECETAS_EXISTENTES.md (misma carpeta).

## Objetivo
El juego quiere que casi todas las combinaciones entre fichas comunes estén analizadas de antemano. Las parejas sin receta se mostrarán como "no forman un concepto establecido". Tu trabajo es encontrar las parejas que SÍ deberían dar un resultado y que todavía no tienen receta.

## Conjunto analizado (127 fichas)
estudiante, contenido, pedagogia, tecnologia, tiempo, espacio, proposito, cpc, tpack, reflexiva, evidencia, mapa, previos, significativo, constructivismo, zdp, andamiaje, metacognicion, autorregulado, espaciada, ritmo, segmentacion, situado, grupo, activo, cooperativo, problema, abp, expositiva, peer, tck, tpk, ia, sustitucion, video, competencia, presencial, virtual, sincronico, asincronico, blended, hyflex, coi, evaluacion, diagnostica, sumativa, retro, formativa, recuperacion, dominio, autentica, resultados, bloom, inverso, alineamiento, dua, nativos, estilos, piramide, detectores, investigacion_accion, enfoques_ensenanza, comunidad_practica, carga_cognitiva, ejemplos_resueltos, intercalada, dificultades_deseables, olvido, multimedia, profundo, motivacion, mentalidad, emociones, modelado, conectivismo, experiencial, transferencia, cambio_conceptual, pensamiento_critico, escribir, ciencia_aprendizaje, jigsaw, tps, gamificacion, abj, simulacion, tutoria_pares, practicas, analitica, privacidad, adaptativo, rea, mooc, rv, respuesta_audiencia, alfabetizacion_ia, brecha, competencia_digital_docente, aula_activa, ubicuo, movil, distancia, remota_emergencia, autoevaluacion, coevaluacion, integridad, portafolio, tabla, perfil_egreso, competencias, curriculo, curriculo_oculto, transposicion, addie, gagne, merrill, syllabus, espiral, carga_trabajo, arcs, cerebro10, hemisferios, atencion10, multitarea, descubrimiento, inteligencias, releer

## Tu tarea
Para cada ficha X de TU LISTA (abajo), recorre mentalmente todas las fichas Y del conjunto analizado (incluida X consigo misma) y pregúntate: ¿la combinación X + Y lleva de forma directa y defendible ante un especialista a alguna ficha R del CATÁLOGO COMPLETO (las 160)?
- R debe ser distinta de X y de Y, y no puede ser un elemento base.
- R debe ser más elaborada que sus ingredientes: la receta tiene que tener sentido como "estas dos ideas juntas producen esta otra".
- No repitas parejas que ya tienen receta (RECETAS_EXISTENTES.md), aunque sea con otro resultado.
- Prioriza dar caminos nuevos a fichas que hoy tienen UNA sola receta: reflexiva, mapa, previos, constructivismo, zdp, ritmo, segmentacion, grupo, cooperativo, problema, proyectos, tck, tpk, ia, sustitucion, aumento, modificacion, redefinicion, video, capsula, tutoria, competencia, presencial, virtual, sincronico, asincronico, blended, hyflex, coi, evaluacion, diagnostica, sumativa, retro, rubrica, dominio, resultados, bloom, nativos, estilos, piramide, detectores, portafolio_docente, reaprendizaje, olvido, motivacion, autoeficacia, mentalidad, emociones, modelado, conectivismo, cambio_conceptual, escribir, casos, retos, tps, gamificacion, abj, tutoria_pares, analitica, rea, rv, respuesta_audiencia, brecha, ubicuo, distancia, remota_emergencia, integridad, alf_retro, tabla, perfil_egreso, addie, espiral, arcs, cerebro10, hemisferios, atencion10, multitarea, descubrimiento, inteligencias, mas_tecnologia, releer, encuestas.
- Calidad antes que cantidad: entre 1 y 4 recetas nuevas por ficha X es lo esperable; cero también es válido. No fuerces relaciones.
- Para cada receta escribe una "nota" (máximo ~30 palabras, español latinoamericano neutro, tuteo, sin "—") que explique por qué esa pareja lleva a ese resultado.
- Si una pareja produce un concepto reconocido que NO está en el catálogo, anótalo aparte como sugerencia (no como receta).

## Formato de salida
Archivo JSON válido en la ruta indicada:
{
  "recetas": [ { "a": "idX", "b": "idY", "r": "idResultado", "nota": "..." } ],
  "sugerencias": [ { "a": "idX", "b": "idY", "concepto": "Nombre", "por_que": "..." } ]
}
Valida el JSON antes de terminar. Responde con un resumen breve: cuántas recetas y sugerencias, y las 3 que te parezcan más valiosas.
