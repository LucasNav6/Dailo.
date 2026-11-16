import { create } from "zustand"
import { registerReset } from "@/shared/libs/reset"
import type { Attachment } from "@/shared/models/attachment.model"

type AttachmentsState = {
  byTask: Record<string, Attachment[]>
  set: (taskId: string, attachments: Attachment[]) => void
  reset: () => void
}

export const useAttachmentsStore = create<AttachmentsState>((set) => ({
  byTask: {},
  set: (taskId, attachments) => set((state) => ({ byTask: { ...state.byTask, [taskId]: attachments } })),
  reset: () => set({ byTask: {} }),
}))

registerReset(() => useAttachmentsStore.getState().reset())
