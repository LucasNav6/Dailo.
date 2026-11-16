import { db } from "@/shared/services/database"

export const removeProjectService = (id: string) => db.projects.delete(id)
