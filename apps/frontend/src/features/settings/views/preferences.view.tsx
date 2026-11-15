import { RiCheckLine, RiComputerLine, RiMoonLine, RiSunCloudyLine, RiSunFoggyLine, RiSunLine } from "@remixicon/react";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { NumberPicker } from "@/components/molecules/number-picker";
import { SettingRow, SettingValue } from "@/components/molecules/setting-row";
import { SettingsSection } from "@/components/organisms/settings-section";

export function SettingsPreferencesView() {
  return (
    <SettingsScreen title="Preferencias">
      <SettingsSection title="Rutina diaria">
        <SettingRow icon={<RiSunLine aria-hidden />} label="Inicio del día">
          <SettingValue>07:00</SettingValue>
        </SettingRow>
        <SettingRow icon={<RiMoonLine aria-hidden />} label="Cierre del día">
          <SettingValue>22:00</SettingValue>
        </SettingRow>
      </SettingsSection>
      <SettingsSection title="Franjas horarias" hint="Una a continuación de otra. Al mover un límite se ajusta la contigua.">
        <SettingRow icon={<RiSunFoggyLine aria-hidden />} label="Mañana">
          <SettingValue>07:00 – 12:00</SettingValue>
        </SettingRow>
        <SettingRow icon={<RiSunLine aria-hidden />} label="Mediodía">
          <SettingValue>12:00 – 15:00</SettingValue>
        </SettingRow>
        <SettingRow icon={<RiSunCloudyLine aria-hidden />} label="Tarde">
          <SettingValue>15:00 – 19:00</SettingValue>
        </SettingRow>
        <SettingRow icon={<RiMoonLine aria-hidden />} label="Noche">
          <SettingValue>19:00 – 22:00</SettingValue>
        </SettingRow>
      </SettingsSection>
      <SettingsSection title="Planificación esencial">
        <div className="flex min-h-11 items-center justify-between">
          <span className="text-[15px]">Tareas esenciales</span>
          <NumberPicker options={[1, 2, 3, 4, 5]} value={3} />
        </div>
        <p className="ml-[38px] text-[13px] leading-[1.45] text-muted-foreground">Recomendado: 3</p>
      </SettingsSection>
      <SettingsSection title="Apariencia">
        <SettingRow icon={<RiComputerLine aria-hidden />} label="Sistema">
          <span className="inline-flex text-foreground [&_svg]:size-[22px]">
            <RiCheckLine aria-hidden />
          </span>
        </SettingRow>
        <SettingRow icon={<RiSunLine aria-hidden />} label="Claro" />
        <SettingRow icon={<RiMoonLine aria-hidden />} label="Oscuro" />
      </SettingsSection>
    </SettingsScreen>
  );
}
