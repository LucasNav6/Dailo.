# src

- `features/`: una carpeta por funcionalidad del modelo de negocio (tareas, proyectos, agenda, inbox, tal vez, configuración).
- `shared/`: lo reutilizable por dos o más features (componentes de UI, hooks, libs, modelos).
- `specs/`: tests de código core. Solo se tocan desde ramas `test/`. Hoy está vacío.
- `App.tsx`: rutas y composición de la aplicación.
- `main.tsx`: punto de entrada.

Regla de dependencias: `features/*` puede importar de `shared/`. `shared/` nunca importa de `features/`. Una feature solo importa de otra a través de su `index.ts`.
