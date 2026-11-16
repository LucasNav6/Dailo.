# projects/services

Llamadas a servicios externos (base de datos local, backend).

- **Archivos:** `<acción>.service.ts`, con un adapter del mismo nombre.
- **Qué hace:** Hace solo la llamada y devuelve la respuesta tal cual.
- **Qué NO va:** Validar, transformar, cachear o capturar errores.
