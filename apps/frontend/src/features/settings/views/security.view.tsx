import { RiComputerLine, RiDeleteBinLine, RiInformationLine, RiSunCloudyLine } from "@remixicon/react";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { SettingsSection } from "@/components/organisms/settings-section";

function Fact({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5 py-1.5 text-sm leading-normal">
      <span className="inline-flex text-subtle [&_svg]:size-5">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export function SettingsSecurityView() {
  return (
    <SettingsScreen title="Seguridad y datos" gap={7}>
        <SettingsSection title="Tus datos">
          <Fact icon={<RiComputerLine aria-hidden />}>Se guardan en este dispositivo, en IndexedDB.</Fact>
          <Fact icon={<RiSunCloudyLine aria-hidden />}>Por ahora no hay sincronización entre dispositivos.</Fact>
          <Fact icon={<RiInformationLine aria-hidden />}>Borrar los datos del navegador puede eliminar lo guardado.</Fact>
        </SettingsSection>
        <SettingsSection title="Eliminar datos locales" hint="Borra de forma permanente tareas, proyectos, secciones y ajustes de este dispositivo.">
          <button type="button" className="flex min-h-12 items-center gap-3.5 text-left text-[15px] font-semibold text-danger-foreground">
            <span className="inline-flex w-6 justify-center text-danger [&_svg]:size-[22px]">
              <RiDeleteBinLine aria-hidden />
            </span>
            Eliminar todos los datos
          </button>
        </SettingsSection>
    </SettingsScreen>
  );
}
