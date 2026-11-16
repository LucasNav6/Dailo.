const normalize = (value: string) => value.trim().toLocaleLowerCase("es")

export function isDuplicateName(names: { id: string; name: string }[], name: string, exceptId?: string) {
  return names.some((item) => item.id !== exceptId && normalize(item.name) === normalize(name))
}

export const DUPLICATE_PROJECT = "Ya tenés un proyecto con ese nombre."
export const DUPLICATE_SECTION = "Ya hay una sección con ese nombre en este proyecto."
export const NO_SECTION = "none"
