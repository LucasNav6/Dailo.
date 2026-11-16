# settings/pages

Pantallas completas de la feature, una por ruta. Solo visual y sus estados.

- **Archivos:** `page.tsx` o `<nombre>.page.tsx` (principal), `loading.page.tsx`, `error.page.tsx`.
- **Qué hace:** Llama a un hook para obtener los datos y las acciones y los pasa a `views/` y `modals/`.
- **Qué NO va:** Lógica, reglas de negocio, llamadas a adapters o services.
