import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import { deleteAllDataService } from "../services/delete-all-data.service"

export async function deleteAllDataAdapter(): Promise<Result<void>> {
  return guard(async () => {
    await deleteAllDataService()
  }, "No se pudieron borrar los datos.")
}
