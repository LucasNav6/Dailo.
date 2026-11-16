import { useCallback, useRef, useState } from "react"
import { useCreateTask } from "@/features/tasks"

type CaptureStatus = "idle" | "saving" | "error"

export function useCaptureItem() {
  const createTask = useCreateTask()
  const [text, setText] = useState("")
  const [status, setStatus] = useState<CaptureStatus>("idle")
  const saving = useRef(false)

  const hasDraft = text.trim().length > 0
  const canSubmit = hasDraft && status !== "saving"

  const change = useCallback((value: string) => {
    setText(value)
    setStatus((current) => (current === "error" ? "idle" : current))
  }, [])

  const reset = useCallback(() => {
    setText("")
    setStatus("idle")
  }, [])

  const submit = useCallback(async () => {
    const title = text.trim()
    if (!title || saving.current) return false
    saving.current = true
    setStatus("saving")
    const result = await createTask({ title })
    saving.current = false
    if (!result.ok) {
      setStatus("error")
      return false
    }
    setText("")
    setStatus("idle")
    return true
  }, [createTask, text])

  return { text, setText: change, status, canSubmit, hasDraft, submit, reset }
}
