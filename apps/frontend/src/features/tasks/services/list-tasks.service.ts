import { db } from "@/shared/services/database"

export const listTasksService = () => db.tasks.toArray()
