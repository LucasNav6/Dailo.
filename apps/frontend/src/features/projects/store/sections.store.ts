import { create } from "zustand"
import { registerReset } from "@/shared/libs/reset"
import type { Section } from "@/shared/models/section.model"

type Status = "idle" | "loading" | "ready" | "error"

type SectionsState = {
  sections: Section[]
  status: Status
  start: () => void
  ready: (sections: Section[]) => void
  fail: () => void
  upsert: (section: Section) => void
  removeMany: (ids: string[]) => void
  reset: () => void
}

const initial = { sections: [] as Section[], status: "idle" as Status }

export const useSectionsStore = create<SectionsState>((set) => ({
  ...initial,
  start: () => set({ status: "loading" }),
  ready: (sections) => set({ sections, status: "ready" }),
  fail: () => set({ status: "error" }),
  upsert: (section) =>
    set((state) => ({
      sections: state.sections.some((item) => item.id === section.id)
        ? state.sections.map((item) => (item.id === section.id ? section : item))
        : [...state.sections, section],
    })),
  removeMany: (ids) => set((state) => ({ sections: state.sections.filter((section) => !ids.includes(section.id)) })),
  reset: () => set(initial),
}))

registerReset(() => useSectionsStore.getState().reset())
