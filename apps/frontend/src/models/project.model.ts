export interface Project {
  id: string
  name: string
  description?: string
  position: number
  createdAt: string
  updatedAt: string
}

export type ProjectInput = Pick<Project, "name"> &
  Partial<Pick<Project, "description" | "position">>

export type ProjectChanges = Partial<ProjectInput>
