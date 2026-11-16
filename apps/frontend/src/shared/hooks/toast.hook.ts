import { useCallback } from "react"
import { useToastStore } from "@/shared/store/toast.store"

export function useToast() {
  const toast = useToastStore((state) => state.toast)
  const show = useToastStore((state) => state.show)
  const dismiss = useToastStore((state) => state.dismiss)
  return { toast, show, dismiss }
}

export function useNotify() {
  const show = useToastStore((state) => state.show)
  return useCallback((message: string) => show({ message }), [show])
}
