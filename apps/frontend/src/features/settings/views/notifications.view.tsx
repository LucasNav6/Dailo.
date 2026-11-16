import { RiInformationLine } from "@remixicon/react"
import { Switch } from "@/shared/components/atoms/switch"
import { SettingsScreen } from "@/shared/components/layouts/settings-screen"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/molecules/popover"
import { SettingRow, SettingValue } from "@/shared/components/molecules/setting-row"
import { SettingsSection } from "@/shared/components/organisms/settings-section"
import type { NotificationsScreen } from "../hooks/notifications-screen.hook"
import { SaveStatusView } from "./save-status.view"
import { TimeSelectView } from "./time-select.view"

export function NotificationsView({ screen }: { screen: NotificationsScreen }) {
  const { settings, errors, state } = screen
  return (
    <SettingsScreen title="Notificaciones" gap={6} backTo="/settings">
      <div role="note" className="flex items-start gap-3 text-sm leading-normal text-muted-foreground">
        <span className="inline-flex pt-px text-subtle [&_svg]:size-5">
          <RiInformationLine aria-hidden />
        </span>
        <span>La entrega de notificaciones todavía no está disponible. Tus preferencias se guardan, pero el recordatorio aún no funciona.</span>
      </div>
      <SettingsSection title="Recordatorio de Inbox" hint="Hábito de cierre diario: te recuerda procesar tu Inbox al final de la jornada.">
        <SettingRow label="Activar recordatorio" comfortable>
          <Switch aria-label="Activar recordatorio" checked={settings.inboxReminderEnabled} onCheckedChange={screen.toggleReminder} />
        </SettingRow>
        <Popover>
          <PopoverTrigger asChild disabled={!settings.inboxReminderEnabled}>
            <button
              type="button"
              aria-label={`Hora, ${settings.inboxReminderTime}. Editar`}
              className="w-full rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
            >
              <SettingRow label="Hora" comfortable>
                <SettingValue>{settings.inboxReminderTime}</SettingValue>
              </SettingRow>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto">
            <TimeSelectView label="Hora del recordatorio" model={screen.timeField} invalid={!!errors.inboxReminderTime} />
            {errors.inboxReminderTime && <p role="alert" className="mt-1.5 text-sm text-danger-foreground">{errors.inboxReminderTime}</p>}
          </PopoverContent>
        </Popover>
        <SettingRow label="Solo si el Inbox tiene pendientes" comfortable>
          <Switch
            aria-label="Solo si el Inbox tiene pendientes"
            checked={settings.onlyWhenInboxHasItems}
            disabled={!settings.inboxReminderEnabled}
            onCheckedChange={screen.toggleOnlyWithItems}
          />
        </SettingRow>
        <SaveStatusView state={state} />
      </SettingsSection>
    </SettingsScreen>
  )
}
