# inbox/hooks

Toda la lógica de la feature: reglas, validaciones y orquestación.

- **Archivos:** `<acción>.hook.ts` (`add-task.hook.ts`, `remove-task.hook.ts`, `edit-task.hook.ts`).
- **Qué hace:** Un hook decide si necesita el backend y llama al adapter. Si falla, avisa con un toast y corta la ejecución (degradación elegante).
- **Qué NO va:** JSX, ni llamar a `services/` directamente.
