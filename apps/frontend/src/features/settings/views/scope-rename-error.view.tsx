import { Button } from "@/components/atoms/button";
import { DialogOverlay } from "@/components/layouts/overlay-layout";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { DialogField } from "@/components/molecules/dialog-field";
import { InlineError } from "@/components/molecules/inline-error";
import { ScopeList } from "../components/scope-list";
import { SCOPES } from "../data";

export function SettingsScopeRenameErrorView() {
  return (
    <>
      <SettingsScreen title="Ámbitos de la vida">
        <p className="text-sm leading-normal text-muted-foreground">Agrupan tus proyectos. Elegís uno al crear cada proyecto.</p>
        <ScopeList scopes={SCOPES.slice(0, 3)} />
      </SettingsScreen>
      <DialogOverlay>
        <h2 className="font-display text-2xl leading-[1.15] font-semibold text-foreground">Renombrar ámbito</h2>
        <p className="text-[15px] leading-normal text-muted-foreground">Los nombres de ámbitos no se pueden repetir.</p>
        <DialogField invalid>Personal</DialogField>
        <InlineError>Ya existe un ámbito con ese nombre.</InlineError>
        <Button>Guardar</Button>
        <Button variant="ghost" className="h-11 px-2">Cancelar</Button>
      </DialogOverlay>
    </>
  );
}
