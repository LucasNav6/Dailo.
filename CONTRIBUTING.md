# Guía de contribución

Esta guía es para quien contribuye al proyecto, sea una persona o un agente. Las reglas marcadas
como **obligatorio** se hacen cumplir con hooks de git: si un commit no las cumple, se rechaza.

## 0. Configuración inicial (una vez por clon)

1. Instala [git-flow-next](https://github.com/gittower/git-flow-next) y deja el binario en el
   `PATH` con el nombre `git-flow`. Comprueba con `git flow version`.
2. Ejecuta:

   ```bash
   pnpm install
   ```

   El script `prepare` de `package.json` hace dos cosas: carga la configuración de git-flow desde
   `.gitflow` y activa los hooks de `.githooks/`.

## 1. Reglas obligatorias

| #  | Regla | Cómo se aplica |
|----|-------|----------------|
| R1 | **Nunca** se hace commit directamente en `main`. | Hook `pre-commit` |
| R2 | **Toda** rama se crea desde `main` con `git flow <tipo> start`. Nunca desde otra rama. | Procedimiento |
| R3 | Una rama = **una** historia de usuario atómica, o un error. | Revisión del PR |
| R4 | Solo existen cuatro tipos de rama: `test/`, `feature/`, `release/`, `hotfix/`. | Hook `pre-commit` |
| R5 | Las ramas `feature/` y `hotfix/` **no pueden crear, modificar ni borrar specs**. | Hook `pre-commit` |
| R6 | Los tests se escriben **solo** para código core (ver sección 6). | Revisión del PR |
| R7 | Los commits siguen el formato de la sección 5. | Hook `commit-msg` |
| R8 | No se abre Pull Request salvo que se pida explícitamente. | Procedimiento |

Si un hook rechaza un commit, corrige el mensaje o la rama. **No uses `--no-verify`.**

## 2. Qué rama crear

Usa el primer caso que aplique:

| Situación | Rama | Orden |
|-----------|------|-------|
| Una función core nueva necesita un test | `test/<nombre>` | Primero. Se fusiona en `main` antes de implementar. |
| Una historia de usuario nueva o un cambio de comportamiento | `feature/<nombre>` | Después del test, si lo hay. |
| Un error en una versión publicada que el usuario espera que funcione | `hotfix/vX.Y.Z` | `Z` es el siguiente patch al último tag publicado. |
| Preparar una versión con ajustes finales | `release/vX.Y.Z` | Sin features nuevas. |

## 3. Flujo de trabajo

Cada tipo de rama tiene `start` y `finish`. `start` siempre crea la rama desde `main`; `finish`
la fusiona en `main` (y crea tag en `release` y `hotfix`) y elimina la rama.

```bash
# 1. Test (solo para core): describe la necesidad antes de implementarla
git flow test start add-task-visible
#    commits: test: It expect ... when ...
git flow test finish add-task-visible

# 2. Feature: implementa lo necesario para que el test pase
git flow feature start auth-oauth
#    commits: feat(scope): ...
git flow feature finish auth-oauth

# 3. Release: cuando hay suficiente para una versión
git flow release start v0.1.0
#    commits: chore(release): ...
git flow release finish v0.1.0

# 4. Hotfix: corrección urgente sobre una versión publicada
git flow hotfix start v0.1.1
#    commits: hotfix(scope): ...
git flow hotfix finish v0.1.1
```

Después de `finish`, sube `main` y los tags al remoto. No abras un PR salvo que se pida.

## 4. Nombres de rama

| Tipo     | Patrón                                       | Ejemplo                   |
|----------|----------------------------------------------|---------------------------|
| test     | `test/<nombre-kebab>`                        | `test/add-task-visible`   |
| feature  | `feature/<nombre-kebab>`                     | `feature/auth-oauth`      |
| release  | `release/vX.Y.Z`                             | `release/v0.1.0`          |
| hotfix   | `hotfix/vX.Y.Z`                              | `hotfix/v0.1.1`           |

- `<nombre-kebab>`: solo minúsculas, números y guiones. Describe la historia de usuario.
- Las versiones usan tres números y prefijo `v`. Nada más.
- El nombre de la feature no lleva versión: la versión la asigna el `release`.

## 5. Commits

| Rama       | Formato                                              | Ejemplo |
|------------|------------------------------------------------------|---------|
| `feature/` | `feat(scope): <historia de usuario>`                 | `feat(hook): The user can list the available calendars` |
| `hotfix/`  | `hotfix(scope): <comportamiento correcto del sistema>` | `hotfix(hook): The system returns a list and the done status.` |
| `test/`    | `test: It expect <resultado> when <condición>`       | `test: It expect the task to be visible when the user adds it` |
| `release/` | `chore(release): <mensaje>`                          | `chore(release): prepare v0.1.0` |

Reglas:

- `scope` es el área afectada del código, en minúsculas (`hook`, `tasks`, `today`…).
- Un commit es un cambio lógico completo que compila.
- Los commits de `feat` y `hotfix` describen el resultado para el usuario, no la implementación.
- Los merges y reverts que genera git no se validan.

## 6. Tests

**Código core** es la función sin la cual el usuario no puede operar. Ejemplo: agregar una tarea
y verla. Si el cambio no es core, no se agregan tests.

Flujo obligatorio (test-first):

1. `git flow test start <nombre>`: se escribe el test que describe la necesidad.
2. `git flow test finish <nombre>`: el test se fusiona en `main`.
3. `git flow feature start` o `git flow hotfix start`: se implementa el código que hace pasar el test.

Reglas de los specs:

- Un spec se crea solo en una rama `test/`.
- `feature/` y `hotfix/` **no pueden crear, modificar ni borrar specs**.
- Un spec nunca se corrige para que el código pase. Si falla, el problema está en el código.
- Que un test pase no garantiza que el código sea correcto; solo garantiza que cumple lo que el
  test describe. Por eso se escriben pocos tests, sobre comportamiento core, y no por cada caso
  trivial.
- Los specs viven en `src/specs/` y se nombran `archivo-a-testear.spec.ts`.

## 7. Estructura de carpetas

Estructura objetivo. Los archivos nuevos se crean ya en estas rutas.

```
src/
├── specs/
│   └── archivo-a-testear.spec.ts     # solo en test/ (sección 6)
├── feature/
│   └── nombre-de-la-feature/         # código de una sola feature
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

- Lo que usa una sola feature va en `src/feature/<nombre-de-la-feature>/`.
- Lo que usan dos o más features va en `src/shared/`.
- Componentes en Atomic Design; cada nivel solo importa de niveles inferiores:
  - `atoms/`: primitivos, sin dependencias del proyecto.
  - `molecules/`: composición de atoms.
  - `organisms/`: secciones completas; usan atoms y molecules.
  - `layouts/`: estructura de vistas; pueden usar todos los anteriores.

## 8. Qué valida el repo y qué valida la revisión

Validado automáticamente por los hooks:

- `pre-commit`: bloquea commits en `main`, nombres de rama fuera de la convención, y cambios de
  specs en `feature/` o `hotfix/`.
- `commit-msg`: bloquea mensajes que no cumplen la sección 5 para el tipo de rama.

Validado en revisión (no lo detecta ningún hook):

- Que la historia sea atómica (R3).
- Que el código sea core cuando hay test (R6).
- Que los archivos estén en la estructura de la sección 7.
- Que el test describa el comportamiento real y no un detalle de implementación.

## 9. Checklist antes de terminar

- [ ] La rama fue creada con `git flow <tipo> start` desde `main`.
- [ ] La rama corresponde a una sola historia de usuario atómica.
- [ ] Los commits cumplen la sección 5 y no se usó `--no-verify`.
- [ ] Si hay test, nació en `test/` y se fusionó antes de la implementación.
- [ ] La `feature/` o `hotfix/` no toca specs.
- [ ] Los archivos nuevos están en la estructura de la sección 7.
- [ ] `git flow <tipo> finish` se ejecutó y los tags, si aplican, se subieron.
