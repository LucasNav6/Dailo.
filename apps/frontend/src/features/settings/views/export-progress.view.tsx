import { Progress } from "@/components/atoms/progress";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { DataActions } from "../components/data-actions";

/** Exportando: la copia se está preparando y se muestra su progreso. */
export function SettingsExportProgressView() {
  return (
    <SettingsScreen title="Seguridad y datos" gap={0}>
      <DataActions
        used="38 MB"
        percent={12}
        exportSubtitle="Preparando copia…"
        exportTrailing={<Progress value={60} className="h-1 w-20" aria-label="Preparando copia" />}
      />
    </SettingsScreen>
  );
}
