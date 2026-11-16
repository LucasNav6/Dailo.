import { db } from "@/shared/services/database"

export const removeSectionsService = (ids: string[]) => db.sections.bulkDelete(ids)
