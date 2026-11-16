# settings/adapters

Traductores entre el frontend y los servicios externos.

- **Archivos:** `<acción>.adapter.ts`, con un service del mismo nombre.
- **Qué hace:** Si la respuesta está cacheada la devuelve. Si no, convierte el input al formato del service, lo llama y traduce la respuesta (o el error) al lenguaje del frontend. Invalida la caché al escribir.
- **Qué NO va:** Reglas de negocio o validaciones, ni estado de UI.
