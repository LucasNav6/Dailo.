import { useState, type FormEvent, type KeyboardEvent } from "react"
import { useMediaQuery } from "@/shared/hooks/use-media-query.hook"
import { useCaptureItem } from "./capture-item.hook"

type Options = { onOpenChange: (open: boolean) => void; onCaptured: () => void }

export function useQuickCapture({ onOpenChange, onCaptured }: Options) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const capture = useCaptureItem()
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  const close = () => {
    capture.reset()
    setConfirmDiscard(false)
    onOpenChange(false)
  }

  const submit = async () => {
    if (await capture.submit()) {
      onOpenChange(false)
      onCaptured()
    }
  }

  return {
    isDesktop,
    capture,
    confirmDiscard,
    setConfirmDiscard,
    close,
    requestClose: (next: boolean) => {
      if (next) return onOpenChange(true)
      if (capture.status === "saving") return
      if (capture.hasDraft) setConfirmDiscard(true)
      else close()
    },
    onSubmit: (event: FormEvent) => {
      event.preventDefault()
      void submit()
    },
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault()
        void submit()
      }
    },
  }
}
