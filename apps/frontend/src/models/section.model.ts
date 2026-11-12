export interface Section {
  id: string
  projectId: string
  name: string
  position: number
  createdAt: string
  updatedAt: string
}

export type SectionInput = Pick<Section, "projectId" | "name"> &
  Partial<Pick<Section, "position">>

/** Una sección no cambia de proyecto. */
export type SectionChanges = Partial<Omit<SectionInput, "projectId">>
