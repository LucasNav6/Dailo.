import { useCallback, useRef, useState } from "react"

export function useRecentlyCompleted(delay = 900) {
  const [recent, setRecent] = useState<string[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const markCompleted = useCallback(
    (id: string) => {
      setRecent((current) => (current.includes(id) ? current : [...current, id]))
      clearTimeout(timers.current[id])
      timers.current[id] = setTimeout(() => setRecent((current) => current.filter((value) => value !== id)), delay)
    },
    [delay]
  )

  return { isRecent: (id: string) => recent.includes(id), markCompleted }
}
