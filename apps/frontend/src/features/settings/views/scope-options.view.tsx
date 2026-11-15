import { RiAlignLeft, RiDeleteBinLine, RiPencilLine } from "@remixicon/react";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { ActionRow } from "@/components/molecules/action-row";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { ScopeList } from "../components/scope-list";
import { SCOPES } from "../data";

/** Menú de opciones de un ámbito: renombrar, ordenar o eliminar. */
export function SettingsScopeOptionsView() {
  return (
    <>
      <SettingsScreen title="Ámbitos de la vida">
        <p className="text-sm leading-normal text-muted-foreground">Agrupan tus proyectos. Elegís uno al crear cada proyecto.</p>
        <ScopeList scopes={SCOPES.slice(0, 3)} />
      </SettingsScreen>
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Trabajo" subtitle="4 proyectos" />
        <ActionRow icon={<RiPencilLine aria-hidden />}>Renombrar</ActionRow>
        <ActionRow icon={<RiAlignLeft aria-hidden />}>Ordenar</ActionRow>
        <div className="my-1 h-px bg-border" />
        <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger-soft">Eliminar ámbito</ActionRow>
        <span className="pb-1 pl-10 text-[13px] text-muted-foreground">Sus 4 proyectos quedan sin ámbito.</span>
      </SheetOverlay>
    </>
  );
}
