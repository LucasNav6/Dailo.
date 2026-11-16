import { create } from "zustand"
import { registerReset } from "@/shared/libs/reset"
import type { Task } from "@/shared/models/task.model"

type Status = "idle" | "loading" | "ready" | "error"

type TasksState = {
  tasks: Task[]
  status: Status
  start: () => void
  ready: (tasks: Task[]) => void
  fail: () => void
  upsert: (task: Task) => void
  removeMany: (ids: string[]) => void
  reset: () => void
}

const initial = { tasks: [] as Task[], status: "idle" as Status }

export const useTasksStore = create<TasksState>((set) => ({
  ...initial,
  start: () => set({ status: "loading" }),
  ready: (tasks) => set({ tasks, status: "ready" }),
  fail: () => set({ status: "error" }),
  upsert: (task) =>
    set((state) => ({
      tasks: state.tasks.some((item) => item.id === task.id)
        ? state.tasks.map((item) => (item.id === task.id ? task : item))
        : [...state.tasks, task],
    })),
  removeMany: (ids) => set((state) => ({ tasks: state.tasks.filter((task) => !ids.includes(task.id)) })),
  reset: () => set(initial),
}))

registerReset(() => useTasksStore.getState().reset())
