import { RiInformationLine } from "@remixicon/react";
import { Switch } from "@/components/atoms/switch";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { SettingRow, SettingValue } from "@/components/molecules/setting-row";
import { SettingsSection } from "@/components/organisms/settings-section";

/** Notificaciones: recordatorio de Inbox, con aviso de que la entrega aún no está disponible. */
export function SettingsNotificationsView() {
  return (
    <SettingsScreen title="Notificaciones" gap={6}>
      <div role="note" className="flex items-start gap-3 text-sm leading-normal text-muted-foreground">
        <span className="inline-flex pt-px text-subtle [&_svg]:size-5">
          <RiInformationLine aria-hidden />
        </span>
        <span>La entrega de notificaciones todavía no está disponible. Tus preferencias se guardan, pero el recordatorio aún no funciona.</span>
      </div>
      <SettingsSection title="Recordatorio de Inbox" hint="Hábito de cierre diario: te recuerda procesar tu Inbox al final de la jornada.">
        <SettingRow label="Activar recordatorio" comfortable>
          <Switch checked aria-label="Activar recordatorio" />
        </SettingRow>
        <SettingRow label="Hora" comfortable>
          <SettingValue>21:00</SettingValue>
        </SettingRow>
        <SettingRow label="Solo si el Inbox tiene pendientes" comfortable>
          <Switch checked aria-label="Solo si el Inbox tiene pendientes" />
        </SettingRow>
      </SettingsSection>
    </SettingsScreen>
  );
}
