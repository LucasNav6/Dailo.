# shared/components

UI reutilizable con Atomic Design. Los primitivos vienen de shadcn/ui (`components.json`, alias `ui` → `@/shared/components/atoms`). Cada nivel solo importa de los niveles de abajo:

| Nivel | Qué es | Puede importar de |
|-------|--------|-------------------|
| `atoms/` | Primitivo único: botón, input, check, alerta | nada del proyecto |
| `molecules/` | Composición de átomos: diálogos, selects, filas | `atoms/` |
| `organisms/` | Sección completa: barras, cabeceras, formularios | `atoms/`, `molecules/` |
| `layouts/` | Estructura de una pantalla: shell, loader, error | todos los anteriores |

Reglas:

- Son solo visuales: reciben datos y callbacks por props. Sin lógica de negocio ni llamadas a servicios.
- Los tokens visuales (colores, radios, alturas) salen de `src/index.css`; no se hardcodean hex.
- Un componente nuevo de shadcn entra en `atoms/` o `molecules/` según lo que componga.
