# Feature: inbox

Inbox: capturar rápido y procesar cada elemento (activar, planificar, tal vez, completar, descartar).

Carpetas:

- `pages/`
- `views/`
- `modals/`
- `hooks/`
- `libs/`

Reglas:

- `pages/`, `views/` y `modals/` son solo visual: sin lógica.
- La lógica vive en `hooks/`.
- Esta feature solo se comunica con otras a través de su `index.ts` (API pública: hooks, vistas, modales y libs). Las pages no se exportan: las importa el router desde `App.tsx`.
