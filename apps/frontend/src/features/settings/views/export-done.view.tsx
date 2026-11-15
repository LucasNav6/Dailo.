import { Snackbar } from "@/components/molecules/snackbar";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { DataActions } from "../components/data-actions";

export function SettingsExportDoneView() {
  return (
    <>
      <SettingsScreen title="Seguridad y datos" gap={0}>
        <DataActions used="38 MB" percent={12} />
      </SettingsScreen>
      <div className="absolute inset-x-4 bottom-[100px]">
        <Snackbar message="dailo-2026-11-15.json · 92 KB" actionLabel="Guardar" />
      </div>
    </>
  );
}
