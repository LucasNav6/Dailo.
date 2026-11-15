import type { Preferences } from "@/models/setting.model";
import { settingService } from "@/services/setting.service";
import { useAutoSave } from "./use-auto-save.hook";

export function useUpdatePreferences() {
  const { state, errors, run } = useAutoSave();
  const update = (next: Preferences) => void run(() => settingService.savePreferences(next));
  return { update, state, errors };
}
