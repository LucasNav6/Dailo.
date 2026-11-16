import { useEffect } from "react"
import { listSectionsAdapter } from "../adapters/list-sections.adapter"
import { useSectionsStore } from "../store/sections.store"

export async function loadSections() {
  const store = useSectionsStore.getState()
  if (store.status === "loading") return
  store.start()
  const result = await listSectionsAdapter()
  if (result.ok) useSectionsStore.getState().ready(result.data)
  else useSectionsStore.getState().fail()
}

export const getSections = () => useSectionsStore.getState().sections

export function useSections(projectId: string) {
  const all = useSectionsStore((state) => state.sections)
  const status = useSectionsStore((state) => state.status)

  useEffect(() => {
    if (status === "idle") void loadSections()
  }, [status])

  return {
    sections: all.filter((section) => section.projectId === projectId).sort((a, b) => a.position - b.position),
    isLoading: status === "idle" || status === "loading",
  }
}
