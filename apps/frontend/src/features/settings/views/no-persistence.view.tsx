import { RiAlertLine } from "@remixicon/react";
import { Alert } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { DataActions } from "../components/data-actions";

export function SettingsNoPersistenceView() {
  return (
    <SettingsScreen title="Seguridad y datos" gap={0}>
      <Alert variant="destructive" className="mb-3 gap-3 px-3.5 text-sm leading-[1.45]">
        <RiAlertLine aria-hidden />
        <span className="flex-1">El navegador puede borrar tus datos si necesita espacio. Exportá una copia para no perderlos.</span>
        <Button variant="ghost" className="h-8 px-2 text-danger-foreground">Exportar</Button>
      </Alert>
      <DataActions used="38 MB" percent={12} />
    </SettingsScreen>
  );
}
