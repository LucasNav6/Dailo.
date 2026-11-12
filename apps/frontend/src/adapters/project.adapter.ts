import type { Project } from "@/models/project.model"
import { db } from "./database"

export const projectAdapter = {
  create: (project: Project) => db.projects.add(project),
  findById: (id: string) => db.projects.get(id),
  findAll: () => db.projects.toArray(),
  update: (id: string, changes: Partial<Project>) =>
    db.projects.update(id, changes),
  remove: (id: string) => db.projects.delete(id),
}
