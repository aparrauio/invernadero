---
name: siguiente-spec
description: Toma de Trello (vía MCP) la siguiente spec de la lista "Por hacer" del tablero Invernadero Encantado, la mueve a "En curso" y la implementa con tests en una rama propia. Úsala para empezar la siguiente tarea.
disable-model-invocation: true
---

# Siguiente spec

## Antes de empezar

1. Ejecuta `git status`. Si hay cambios sin commit, detente y avisa al usuario.
2. Cámbiate a `main` y actualízala con `git pull`.

## Elegir la spec

3. En el tablero **Invernadero Encantado**, toma la **primera tarjeta de la lista «Por hacer»**. No consideres tarjetas de otras listas: las de «En curso» o «En revisión» ya están en marcha. Si «Por hacer» está vacía, avisa y detente.
4. La descripción de la tarjeta es la spec. Resume en pocas líneas su objetivo y sus criterios de aceptación.
5. Propón un plan: qué archivos vas a crear o cambiar, qué tests escribirás para cada criterio y qué queda fuera. **Espera a que el usuario apruebe el plan** antes de seguir.

## Cuando el usuario apruebe el plan

6. Guarda la descripción de la tarjeta, sin cambios, en `docs/specs/<número>-<slug>.md` (por ejemplo, «Spec 04 · Validar la planta en el dominio» → `docs/specs/04-validar-planta-dominio.md`).
7. Crea la rama `spec/<número>-<slug>` desde `main`.
8. Crea `.claude/estado/spec-en-curso.json` con este contenido:
   ```json
   { "titulo": "<título de la tarjeta>", "tarjeta": "<enlace a la tarjeta>", "spec": "docs/specs/<archivo>.md", "base": "main", "intentos": 0 }
   ```
9. En Trello, mueve la tarjeta a **«En curso»** y agrega un comentario: «En curso en la rama `spec/<número>-<slug>`».

## Implementar

10. Para cada criterio: escribe primero el test, comprueba que falla, escribe el código y comprueba que pasa. Al final, `npm test` debe pasar completo.
11. **Si la spec tiene una sección «Pantallas» con wireframes:** con la API y el cliente corriendo, saca una captura de cada estado con `npm run captura` (a 390 px y, si hay wireframe de escritorio, a 1280 px) en `docs/specs/<número>-<slug>/capturas/`. Compara cada captura con su wireframe: la estructura, el orden y los textos deben coincidir; los colores y las fuentes salen de DESIGN.md. Corrige las diferencias de estructura y lista las que queden.
12. No cambies nada que la spec no pida. Si encuentras algo fuera de alcance, anótalo en una sección «Pendientes» al final de la spec.
13. Haz el commit tú mismo siguiendo las reglas de `.claude/skills/commit/SKILL.md`: agrega solo los archivos de la spec y `docs/specs/` (incluidas las capturas), y usa el número de spec en el mensaje (por ejemplo, `feat(spec-04): validar la planta en el dominio`).
14. Termina con un resumen de dos líneas. **No hagas push ni abras el PR:** al terminar, el hook de revisión adversarial revisa el cambio y, si lo aprueba, abre el PR.

## Cuando el hook responda

- **Si rechaza:** corrige solo los hallazgos de severidad alta, vuelve a ejecutar `npm test`, haz commit y termina otra vez.
- **Si aprueba:** mueve la tarjeta a **«En revisión»**, comenta en ella el enlace del PR, borra la carpeta `.claude/estado` y responde solo con la URL del PR.

**Nunca muevas una tarjeta a «Hecho».** Eso lo decide una persona después de revisar el PR.
