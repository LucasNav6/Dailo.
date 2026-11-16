import { db } from "@/shared/services/database"

export const deleteAllDataService = () =>
  db.transaction("rw", db.tables, () => Promise.all(db.tables.map((table) => table.clear())))
