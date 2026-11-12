import { useCallback, useRef, useState } from "react"
import { taskService } from "@/services/task.service"

type CaptureStatus = "idle" | "saving" | "error"

/** Estado de la captura rápida: una captura = un elemento de Inbox. */
export function useQuickCapture() {
  const [text, setText] = useState("")
  const [status, setStatus] = useState<CaptureStatus>("idle")
  const saving = useRef(false)

  const canSubmit = text.trim().length > 0 && status !== "saving"
  const hasDraft = text.trim().length > 0

  const change = useCallback((value: string) => {
    setText(value)
    setStatus((current) => (current === "error" ? "idle" : current))
  }, [])

  const reset = useCallback(() => {
    setText("")
    setStatus("idle")
  }, [])

  /** Devuelve true si se guardó; ante un error conserva el texto. */
  const submit = useCallback(async () => {
    const title = text.trim()
    if (!title || saving.current) return false
    saving.current = true
    setStatus("saving")
    try {
      await taskService.create({ title })
      setText("")
      setStatus("idle")
      return true
    } catch {
      setStatus("error")
      return false
    } finally {
      saving.current = false
    }
  }, [text])

  return { text, setText: change, status, canSubmit, hasDraft, submit, reset }
}
