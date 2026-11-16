import { create } from "zustand"
import { registerReset } from "@/shared/libs/reset"
import type { Project } from "@/shared/models/project.model"

type Status = "idle" | "loading" | "ready" | "error"

type ProjectsState = {
  projects: Project[]
  status: Status
  start: () => void
  ready: (projects: Project[]) => void
  fail: () => void
  upsert: (project: Project) => void
  remove: (id: string) => void
  reset: () => void
}

const initial = { projects: [] as Project[], status: "idle" as Status }

export const useProjectsStore = create<ProjectsState>((set) => ({
  ...initial,
  start: () => set({ status: "loading" }),
  ready: (projects) => set({ projects, status: "ready" }),
  fail: () => set({ status: "error" }),
  upsert: (project) =>
    set((state) => ({
      projects: state.projects.some((item) => item.id === project.id)
        ? state.projects.map((item) => (item.id === project.id ? project : item))
        : [...state.projects, project],
    })),
  remove: (id) => set((state) => ({ projects: state.projects.filter((project) => project.id !== id) })),
  reset: () => set(initial),
}))

registerReset(() => useProjectsStore.getState().reset())
