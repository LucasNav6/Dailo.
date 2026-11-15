# Features (vistas por sección del diseño)

Una carpeta por sección del artifact de diseño, al mismo nivel que `components/`:

| Feature      | Contenido                                                          |
|--------------|--------------------------------------------------------------------|
| `today/`     | Hoy: esenciales, franjas, atrasadas, mes, otro día                 |
| `inbox/`     | Capturar, lista, opciones, planificar, mover, procesar             |
| `projects/`  | Proyectos y tareas: crear, lista, detalle, subtareas, adjuntos     |
| `someday/`   | Tal vez: ideas sin compromiso                                      |
| `settings/`  | Configuración: preferencias, ámbitos, archivados, exportar/importar |
| `general/`   | Errores y avisos transversales                                     |

Estructura de cada feature:

```
features/<feature>/
  views/          una vista por pantalla del diseño: <nombre>.view.tsx
  components/     piezas propias de la feature (no reutilizables fuera de ella)
  hooks/          lógica de negocio: un hook por acción, <acción>.hook.tsx (add-task, plan-idea…)
  data.ts         datos de ejemplo del diseño
  index.ts        registra las vistas (id, título, código del diseño, pestaña activa)
```

Reglas:

- Las vistas son **mockups estáticos**: componen `components/` (atoms → molecules → organisms →
  layouts) con el texto y datos del diseño; no leen IndexedDB ni dependen de rutas.
- Los hooks de `hooks/` son las acciones básicas de negocio (crear, completar, planificar, borrar…):
  llaman a `services/`, validan y devuelven errores legibles; las páginas solo los invocan.
- Lo que se repite entre features sube a `components/` en su nivel (molecule/organism).
- Cada vista exporta un componente `<Feature><Nombre>View` y se registra en el `index.ts` de su feature.
- La galería en `/mockups` renderiza todas las vistas en un marco de 390 px para revisarlas.
