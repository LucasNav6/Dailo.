# Feature: tasks

Tareas: crear, editar, completar, planificar, marcar esencial, subtareas, adjuntos y reordenar.

Carpetas:

- `pages/`
- `views/`
- `modals/`
- `hooks/`
- `store/`
- `adapters/`
- `services/`
- `libs/`

Flujo de datos: `hook → adapter → service → adapter → hook`.

Reglas:

- `pages/`, `views/` y `modals/` son solo visual: sin lógica.
- La lógica vive en `hooks/`.
- Esta feature solo se comunica con otras a través de su `index.ts` (API pública: hooks, vistas, modales y libs). Las pages no se exportan: las importa el router desde `App.tsx`.
