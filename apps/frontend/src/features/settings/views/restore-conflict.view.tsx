import { Button } from "@/components/atoms/button";
import { DialogOverlay } from "@/components/layouts/overlay-layout";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { DialogField } from "@/components/molecules/dialog-field";
import { InlineError } from "@/components/molecules/inline-error";
import { ArchivedList } from "../components/archived-list";
import { ARCHIVED } from "../data";

/** Al restaurar un archivado cuyo nombre ya está en uso: proponer otro nombre. */
export function SettingsRestoreConflictView() {
  return (
    <>
      <SettingsScreen title="Archivados">
        <p className="text-sm leading-normal text-muted-foreground">Los proyectos archivados no aparecen en Hoy ni en Proyectos.</p>
        <ArchivedList projects={ARCHIVED.slice(0, 1)} />
      </SettingsScreen>
      <DialogOverlay role="dialog">
        <h2 className="font-display text-2xl leading-[1.15] font-semibold">Ya existe “Landing de verano”</h2>
        <p className="text-[15px] leading-normal text-muted-foreground">Hay un proyecto activo con ese nombre. Elegí otro para restaurar este.</p>
        <DialogField invalid>Landing de verano (2)</DialogField>
        <InlineError tone="muted">Podés usar este nombre o escribir otro.</InlineError>
        <Button>Restaurar</Button>
        <Button variant="ghost" className="h-11 px-2">Cancelar</Button>
      </DialogOverlay>
    </>
  );
}
