import { useEffect, useRef, useState, type RefObject } from "react"
import { confetti } from "./confetti"
import { playComplete } from "./sound"

export function useCompletionEffect(checked: boolean, origin: RefObject<Element | null>) {
  const previous = useRef(checked)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (!previous.current && checked) {
      playComplete()
      if (origin.current) confetti(origin.current)
      setAnimating(true)
      const timer = setTimeout(() => setAnimating(false), 600)
      previous.current = checked
      return () => clearTimeout(timer)
    }
    previous.current = checked
  }, [checked, origin])

  return animating
}
