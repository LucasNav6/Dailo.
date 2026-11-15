import { RiAlertLine } from "@remixicon/react";
import { Alert } from "@/components/atoms/alert";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { DataActions } from "../components/data-actions";

/** Espacio local casi lleno: aviso, medidor en rojo y acciones para liberar. */
export function SettingsStorageAlmostFullView() {
  return (
    <SettingsScreen title="Seguridad y datos" gap={0}>
      <Alert variant="destructive" className="mb-3 gap-3 px-3.5 text-sm leading-[1.45]">
        <RiAlertLine aria-hidden />
        <span className="flex-1">Te queda poco espacio. Exportá una copia y eliminá archivos adjuntos que ya no uses.</span>
      </Alert>
      <DataActions used="264 MB" percent={88} critical />
    </SettingsScreen>
  );
}
