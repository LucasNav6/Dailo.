import { RiAddLine } from "@remixicon/react";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { InlineAction } from "@/components/molecules/inline-action";
import { ScopeList } from "../components/scope-list";
import { SCOPES } from "../data";

export function SettingsScopesView() {
  return (
    <SettingsScreen title="Ámbitos de la vida">
      <p className="text-sm leading-normal text-muted-foreground">
        Agrupan tus proyectos. Elegís uno al crear cada proyecto. Si borrás un ámbito, sus proyectos quedan sin ámbito.
      </p>
      <div className="flex flex-col">
        <ScopeList scopes={SCOPES} />
        <InlineAction icon={<RiAddLine aria-hidden />} className="mt-0 h-[52px] gap-3.5 pl-[11px] [&_svg]:size-[18px]">Añadir ámbito</InlineAction>
      </div>
    </SettingsScreen>
  );
}
