import type { Section } from "@/models/section.model"
import { db } from "./database"

export const sectionAdapter = {
  create: (section: Section) => db.sections.add(section),
  findById: (id: string) => db.sections.get(id),
  findByProjectId: (projectId: string) =>
    db.sections.where("projectId").equals(projectId).toArray(),
  update: (id: string, changes: Partial<Section>) =>
    db.sections.update(id, changes),
  remove: (id: string) => db.sections.delete(id),
  removeByProjectId: (projectId: string) =>
    db.sections.where("projectId").equals(projectId).delete(),
}
