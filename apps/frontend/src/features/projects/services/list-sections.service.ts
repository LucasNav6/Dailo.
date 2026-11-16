import { db } from "@/shared/services/database"

export const listSectionsService = () => db.sections.toArray()
