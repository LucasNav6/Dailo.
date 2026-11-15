import { Button } from "@/components/atoms/button";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { FileCard } from "@/components/molecules/file-card";
import { SummaryRow } from "@/components/molecules/summary-row";

export function SettingsImportSummaryView() {
  return (
    <SettingsScreen title="Importar copia" gap={0}>
      <FileCard name="dailo-2026-11-10.json" detail="84 KB · versión 3" />
      <div className="mt-5 mb-1 text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">Qué vamos a hacer</div>
      <SummaryRow label="Se agregan" value="12 tareas · 2 proyectos" />
      <SummaryRow label="Sin cambios" value="40 elementos" />
      <SummaryRow label="En conflicto" value="3 elementos" />
      <p className="mt-4 text-sm leading-normal text-muted-foreground">No se cambia nada hasta que lo confirmes. En los conflictos decidís vos.</p>
      <div className="mt-auto flex flex-col items-stretch gap-1">
        <Button>Revisar conflictos (3)</Button>
        <Button variant="ghost" className="h-11 px-2">Cancelar</Button>
      </div>
    </SettingsScreen>
  );
}
