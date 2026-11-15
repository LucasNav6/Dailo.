import { RiAlertLine } from "@remixicon/react";
import { Alert } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { FileCard } from "@/components/molecules/file-card";

/** Importar un archivo que no es una copia de Dailo o está dañado. */
export function SettingsImportInvalidView() {
  return (
    <SettingsScreen title="Importar copia" gap={0}>
      <Alert variant="destructive" className="mb-3 gap-3 px-3.5 text-sm leading-[1.45]">
        <RiAlertLine aria-hidden />
        <span className="flex-1">Este archivo no es una copia de Dailo o está dañado. No se cambió nada.</span>
      </Alert>
      <FileCard name="notas.txt" detail="2 KB" className="py-4" />
      <Button className="self-start">Elegir otro archivo</Button>
      <p className="mt-4 text-sm leading-normal text-muted-foreground">Si el archivo es de una versión más nueva de Dailo, actualizá la app e intentá de nuevo.</p>
    </SettingsScreen>
  );
}
