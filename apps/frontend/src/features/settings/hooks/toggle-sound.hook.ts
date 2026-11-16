import { useState } from "react"
import { isSoundEnabled, playComplete, setSoundEnabled } from "@/shared/libs/sound"

export function useToggleSound() {
  const [enabled, setEnabled] = useState(isSoundEnabled)

  const toggle = (next: boolean) => {
    setSoundEnabled(next)
    setEnabled(next)
    if (next) playComplete()
  }

  return { enabled, toggle }
}
