# shared

Lo que usan dos o más features.

- `components/`: UI con Atomic Design (`atoms/`, `molecules/`, `organisms/`, `layouts/`).
- `hooks/`: hooks reutilizables (`<nombre>.hook.ts`).
- `libs/`: funciones puras y utilidades (`dates.ts`, `utils.ts`, `result.ts`, `cache.ts`).
- `models/`: tipos del dominio compartidos (`task.model.ts`).
- `services/`: clientes externos sin dominio propio (`database.ts`).
- `store/`: stores globales (`toast.store.ts`).

Regla: `shared/` nunca importa de `features/`.
