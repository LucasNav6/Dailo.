# features

Una carpeta por funcionalidad del modelo de negocio. Hoy: `tasks/`, `projects/`, `agenda/`, `inbox/`, `maybe/`, `settings/`.

Estructura de cada feature:

```
<feature>/
  pages/      pantallas (solo visual y sus estados)
  views/      piezas visuales
  modals/     diálogos y hojas
  hooks/      toda la lógica
  store/      estado (zustand)
  adapters/   traductores hacia servicios externos, con caché
  services/   llamadas externas, un service por adapter con el mismo nombre
  libs/       funciones puras de la feature
  README.md
  index.ts    API pública
```

Reglas:

- `pages/`, `views/` y `modals/` no tienen lógica bajo ningún contexto.
- Flujo de datos: `hook → adapter → service → adapter → hook`.
- Si algo lo usan dos o más features, va en `shared/`.
- Una feature importa de otra solo desde su `index.ts`.
- Una feature nueva se crea con todas las carpetas que necesite, cada una con su `README.md`.
