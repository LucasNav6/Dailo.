# Componentes (Atomic Design + shadcn/ui)

Los primitivos vienen de shadcn/ui (`components.json`, alias `ui` → `@/components/atoms`) y se
organizan por niveles de Atomic Design. Cada nivel solo importa de los niveles de abajo:

| Nivel        | Qué es                                                                  | Puede importar de      |
|--------------|-------------------------------------------------------------------------|------------------------|
| `atoms/`     | Primitivo único: botón, input, check de tarea, alerta, progreso…        | (nada del proyecto)    |
| `molecules/` | Composición de 2+ átomos: diálogos, selects, fila de tarea, banner…     | `atoms/`               |
| `organisms/` | Sección completa: barra inferior, cabecera, sidebar, captura rápida…    | `atoms/`, `molecules/` |
| `layouts/`   | Estructura de una vista: shell, loader, error, hojas y diálogos, marco  | todos los anteriores   |

Reglas:

- Lo que es reutilizable por dos o más vistas vive en su nivel; lo específico de una pantalla
  se queda en `pages/`.
- Un componente nuevo de shadcn entra en `atoms/` o `molecules/` según lo que componga.
- Los tokens visuales (colores, radios, alturas) salen de `src/index.css`; no se hardcodean hex
  en los componentes.
