import { create } from "zustand"

export type Toast = {
  id: number
  message: string
  actionLabel?: string
  onAction?: () => void
}

type ToastInput = Omit<Toast, "id">

type ToastState = {
  toast: Toast | null
  show: (input: ToastInput, duration?: number) => void
  dismiss: () => void
}

let timer: ReturnType<typeof setTimeout> | undefined
let sequence = 0

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (input, duration = 3000) => {
    clearTimeout(timer)
    sequence += 1
    const id = sequence
    set({ toast: { ...input, id } })
    timer = setTimeout(() => set((state) => (state.toast?.id === id ? { toast: null } : state)), duration)
  },
  dismiss: () => {
    clearTimeout(timer)
    set({ toast: null })
  },
}))
