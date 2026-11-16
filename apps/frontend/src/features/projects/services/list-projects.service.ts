import { db } from "@/shared/services/database"

export const listProjectsService = () => db.projects.toArray()
