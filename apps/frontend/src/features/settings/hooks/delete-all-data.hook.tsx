import { useCallback, useState } from "react";
import { useTheme } from "@/lib/theme";
import { settingService } from "@/services/setting.service";

export type DeleteAllStatus = "idle" | "deleted" | "error";

/** Borra todos los datos locales y restaura el tema; expone el resultado para mostrarlo. */
export function useDeleteAllData() {
  const { setTheme } = useTheme();
  const [status, setStatus] = useState<DeleteAllStatus>("idle");

  const deleteAll = useCallback(async () => {
    try {
      await settingService.deleteAllData();
      setTheme("system");
      setStatus("deleted");
    } catch {
      setStatus("error");
    }
  }, [setTheme]);

  return { deleteAll, status };
}
