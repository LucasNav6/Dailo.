# Guía de contribución

Esta guía es para quien contribuye al proyecto. Léela completa antes de crear una rama o tocar código.

## 1. Reglas generales

1. **Nunca se programa directamente en `main`.** Todo cambio entra por una rama propia.
2. **Toda rama se crea desde `main`.** Está prohibido crear una rama a partir de otra rama.
3. **Una rama = una historia de usuario atómica.** Si una historia tiene varias partes que
   pueden entregarse por separado, son varias ramas y varios Pull Requests. El proyecto usa
   *screaming architecture* (el código se organiza por feature), así que cada historia toca
   su propia carpeta y no deberían aparecer conflictos entre ramas.
4. **No se agregan tests dentro de una `feature/` ni de una `hotfix/`.** Los tests tienen su
   propia rama `test/` (ver sección 5).

## 2. Configuración inicial (una vez por clon)

El proyecto usa [git-flow-next](https://github.com/gittower/git-flow-next) para no escribir
los comandos a mano. La configuración se guarda en `.gitflow`, que se versiona con el repo.

```bash
git flow init --defaults --shared

# main es la rama base de producción; todas las ramas nacen de main
git config gitflow.branch.main.type base
git config gitflow.branch.feature.parent main
git config gitflow.branch.feature.startPoint main

# Tipo "test": tests aislados en su propia rama
git config gitflow.branch.test.type topic
git config gitflow.branch.test.parent main
git config gitflow.branch.test.startPoint main
git config gitflow.branch.test.prefix test/
git config gitflow.branch.test.tag false
```

> Los comandos de configuración se tomaron de la documentación de git-flow-next y todavía
> no se han probado en este repositorio.

## 3. Flujo de trabajo

Cada tipo de rama tiene su par de comandos `start` y `finish`:

| Rama     | Convención                          | Ejemplo               | Comandos                                              |
|----------|-------------------------------------|-----------------------|-------------------------------------------------------|
| Test     | `test/<nombre-descriptivo>`         | `test/add-task-visible` | `git flow test start` / `git flow test finish`      |
| Feature  | `feature/<nombre-descriptivo>`      | `feature/auth-oauth`  | `git flow feature start` / `git flow feature finish`  |
| Release  | `release/v<mayor>.<menor>.<patch>`  | `release/v0.1.0`      | `git flow release start` / `git flow release finish`  |
| Hotfix   | `hotfix/v<mayor>.<menor>.<patch>`   | `hotfix/v0.1.1`       | `git flow hotfix start` / `git flow hotfix finish`    |

Ejemplo de ciclo completo:

```bash
# 1. Test primero: se escribe el test que describe la función core
git flow test start add-task-visible
# ... commits de test: test: It expect ... when ... ...
git flow test finish add-task-visible        # se fusiona en main

# 2. Feature: se implementa lo necesario para que el test pase
git flow feature start auth-oauth
# ... commits de feature ...
git flow feature finish auth-oauth           # se fusiona en main, la rama se elimina

# 3. Release: cuando hay suficiente para una versión
git flow release start v0.1.0
# ... solo ajustes finales, sin features nuevas ...
git flow release finish v0.1.0               # se fusiona en main, tag v0.1.0

# 4. Hotfix: corrección urgente sobre una versión publicada
git flow hotfix start v0.1.1
# ... commits de hotfix ...
git flow hotfix finish v0.1.1                # se fusiona en main, tag v0.1.1
```

Reglas del flujo:

- Las ramas `feature/` no llevan versión; la versión la pone el `release/`.
- Los `release/` y `hotfix/` llevan versión semántica con prefijo `v`.
- No abras un Pull Request salvo que se pida explícitamente. Si se pide, usa la plantilla
  `.github/pull_request_template.md`.

## 4. Commits

| Rama               | Formato                                                             |
|--------------------|---------------------------------------------------------------------|
| `feature/`         | `feat(scope): mensaje como historia de usuario`                     |
| `hotfix/`          | `hotfix(scope): mensaje del comportamiento correcto del sistema`    |
| `test/`            | `test: It expect ... when ...`                                      |

Ejemplos:

- `feat(hook): The user can list the available calendars`
- `hotfix(hook): The system return a list and the done status.`
- `test: It expect the task to be visible when the user adds it`

Reglas:

- `scope` es el área afectada del código (`hook`, `tasks`, `today`…).
- Un commit representa un cambio lógico completo.
- Los commits de `feat` y `hotfix` describen el resultado para el usuario, no los detalles de
  implementación.

## 5. Tests

Los tests **no viven en las ramas de feature ni de hotfix**. Se crean aparte, en una rama
`test/`, y se fusionan en `main` antes de implementar la funcionalidad.

Qué es código core: una función sin la cual el usuario no puede operar. Ejemplo: agregar una
tarea y verla. Si el cambio no es core, no se agregan tests.

Flujo obligatorio (test-first):

1. Se crea la rama `test/` y se escribe primero el test que describe la necesidad.
2. Se fusiona en `main`.
3. Se crea la `feature/` o `hotfix/` y se implementa el código que hace pasar el test.

Reglas sobre los specs:

- Una `feature/` o `hotfix/` **no puede crear, modificar ni borrar specs**.
- Un spec nunca se "corrige" para que pase. Si el test falla, el problema está en el código.
- Los specs garantizan la calidad al modificar el código: que un test pase no garantiza que el
  código esté bien; garantiza que sigue cumpliendo lo que el test describe.
- No se sobrecarga el proyecto: un test por comportamiento core, no por cada variante trivial.
- Los specs viven en `src/specs/` y se nombran `archivo-a-testear.spec.ts`.

## 6. Estructura de carpetas

Estructura objetivo (los archivos nuevos deben crearse ya en estas rutas):

```
src/
├── specs/
│   └── archivo-a-testear.spec.ts     # tests core (ver sección 5)
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

## 7. Checklist antes de abrir o fusionar una rama

- [ ] La rama fue creada desde `main` con `git flow <tipo> start`.
- [ ] Ninguna rama fue creada desde otra rama.
- [ ] La rama corresponde a una sola historia de usuario atómica.
- [ ] Los commits siguen el formato de la sección 4.
- [ ] Si hay test, nació en su propia rama `test/` y fue fusionado antes.
- [ ] La `feature/` o `hotfix/` no toca specs.
- [ ] Los archivos nuevos están en la estructura de la sección 6.
