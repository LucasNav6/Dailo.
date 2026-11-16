export function createCache<T>() {
  const entries = new Map<string, T>()
  return {
    get: (key: string) => entries.get(key),
    set: (key: string, value: T) => {
      entries.set(key, value)
    },
    clear: () => entries.clear(),
  }
}
