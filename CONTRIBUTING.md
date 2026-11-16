# Guía de contribución

Este documento está escrito para que un agente (o una persona) pueda contribuir al proyecto
siguiendo las mismas reglas. Léelo completo antes de tocar código.

## 1. Reglas generales

1. **Nunca se programa directamente en `main`.** Todo cambio entra por una rama propia.
2. **Toda rama se crea desde `main`.** Está prohibido crear una rama a partir de otra rama
   (de otra `feature/`, de otra `hotfix/` o de cualquier otra).
3. **Una rama = una historia de usuario o un error.** No mezcles trabajo de varias historias.
4. **No se agregan tests**, salvo que el código sea core (ver sección 5).

## 2. Flujo de trabajo

```bash
git checkout main
git pull origin main
git checkout -b feature/user-can-integrate-a-calendar
# ... cambios y commits ...
git push -u origin feature/user-can-integrate-a-calendar
```

1. Actualiza `main` desde `origin`.
2. Crea la rama **desde `main`**.
3. Implementa solo lo que describe la historia o el error.
4. Haz los commits siguiendo la sección 4.
5. Sube la rama con `git push -u origin <rama>`.
6. No abras un Pull Request salvo que se pida explícitamente. Si se pide, usa la plantilla
   `.github/pull_request_template.md`.

## 3. Nombres de rama

Formato:

- `feature/nombre-descriptivo-del-feature`
- `hotfix/nombre-descriptivo-del-error`

Reglas:

- Solo minúsculas, palabras separadas por guiones.
- El nombre de un **feature** es una historia de usuario: describe lo que **el usuario puede
  hacer**, empezando por `user-can-...`.
- El nombre de un **hotfix** describe lo que **el usuario espera** y hoy no se cumple,
  empezando por `user-expect-...`.

Ejemplos:

- `feature/user-can-integrate-a-calendar`
- `hotfix/user-expect-view-all-task-done-when-completed`

El segundo ejemplo nació porque la funcionalidad se definió de una manera, pero no funcionaba
como el usuario lo esperaba. Por eso el nombre del hotfix recoge esa expectativa incumplida.

## 4. Commits

Formatos:

| Tipo     | Formato                                            |
|----------|----------------------------------------------------|
| feature  | `feat(scope): mensaje como historia de usuario`    |
| hotfix   | `hotfix(scope): mensaje del comportamiento correcto del sistema` |
| test     | `test: It expect ... when ...` (solo código core)  |

Ejemplos:

- `feat(hook): The user can list the available calendars`
- `hotfix(hook): The system return a list and the done status.`
- `test: It expect the calendar list to be empty when the user has no calendars`

Reglas:

- `scope` es el área afectada del código (`hook`, `tasks`, `today`…).
- Un commit representa un cambio lógico completo.
- Los commits de `feat` y `hotfix` describen el resultado para el usuario, no los detalles de
  implementación.
- Un test va en su propio commit con formato `test:`; nunca se mezcla con un commit de feature
  o hotfix.

## 5. Tests

- Por defecto **no se agregan tests**.
- Solo se agregan tests para código **core**, es decir, la lógica central cuyo fallo rompe el
  flujo principal de la aplicación. Si el cambio no es core, no añadas tests.
- No se sobrecarga el proyecto: un test por comportamiento importante, no por cada línea ni por
  cada variante trivial.
- Los tests viven en `src/specs/` y se nombran `archivo-a-testear.spec.ts`.

## 6. Estructura de carpetas

Estructura objetivo (los archivos nuevos deben crearse ya en estas rutas):

```
src/
├── specs/
│   └── archivo-a-testear.spec.ts     # tests (solo core, ver sección 5)
├── feature/
│   └── nombre-de-la-feature/         # código propio de una feature
└── shared/
    ├── hooks/
    ├── components/
    │   ├── atoms/
    │   ├── molecules/
    │   ├── organisms/
    │   └── layouts/
    ├── libs/
    ├── models/
    └── ...
```

Reglas:

- Lo que solo usa una feature vive en `src/feature/<nombre-de-la-feature>/`.
- Lo que usan dos o más features vive en `src/shared/`.
- Los componentes siguen Atomic Design y solo importan de niveles inferiores:
  - `atoms/`: primitivos sin dependencias del proyecto.
  - `molecules/`: composición de atoms.
  - `organisms/`: secciones completas, usan atoms y molecules.
  - `layouts/`: estructura de vistas, puede usar todos los anteriores.
- Los tests reflejan el archivo que prueban: `src/specs/<archivo>.spec.ts`.

## 7. Checklist antes de terminar

- [ ] La rama es `feature/...` o `hotfix/...` y fue creada desde `main`.
- [ ] Ningún commit se hizo directamente en `main`.
- [ ] Los commits siguen el formato de la sección 4.
- [ ] No hay tests, salvo que el código sea core.
- [ ] Los archivos nuevos están en la estructura de la sección 6.
