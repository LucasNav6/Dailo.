import type { NotificationSettings } from "@/models/setting.model";
import { settingService } from "@/services/setting.service";
import { useAutoSave } from "./use-auto-save.hook";

/** Guarda los ajustes de notificaciones en cuanto cambian; expone estado y errores por campo. */
export function useUpdateNotificationSettings() {
  const { state, errors, run } = useAutoSave();
  const update = (next: NotificationSettings) => void run(() => settingService.saveNotificationSettings(next));
  return { update, state, errors };
}
