import { RiInformationLine } from "@remixicon/react"
import { useNotificationSettings } from "@/hooks/use-settings"
import type { NotificationSettings } from "@/models/setting.model"
import { Switch } from "@/components/atoms/switch"
import { SettingsScreen } from "@/components/layouts/settings-screen"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/popover"
import { SettingRow, SettingValue } from "@/components/molecules/setting-row"
import { SettingsSection } from "@/components/organisms/settings-section"
import { useUpdateNotificationSettings } from "@/features/settings/hooks/update-notification-settings.hook"
import { SaveStatus, TimeSelect } from "./settings-ui"

function NotificationsForm({ settings }: { settings: NotificationSettings }) {
  const { update, state, errors } = useUpdateNotificationSettings()

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
          <Switch aria-label="Activar recordatorio" checked={settings.inboxReminderEnabled} onCheckedChange={(checked) => update({ ...settings, inboxReminderEnabled: checked })} />
        </SettingRow>
        <Popover>
          <PopoverTrigger asChild disabled={!settings.inboxReminderEnabled}>
            <button type="button" aria-label={`Hora, ${settings.inboxReminderTime}. Editar`} className="w-full rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50">
              <SettingRow label="Hora" comfortable>
                <SettingValue>{settings.inboxReminderTime}</SettingValue>
              </SettingRow>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto">
            <TimeSelect label="Hora del recordatorio" value={settings.inboxReminderTime} invalid={!!errors.inboxReminderTime} onChange={(value) => update({ ...settings, inboxReminderTime: value })} />
            {errors.inboxReminderTime && <p role="alert" className="mt-1.5 text-sm text-danger-foreground">{errors.inboxReminderTime}</p>}
          </PopoverContent>
        </Popover>
        <SettingRow label="Solo si el Inbox tiene pendientes" comfortable>
          <Switch aria-label="Solo si el Inbox tiene pendientes" checked={settings.onlyWhenInboxHasItems} disabled={!settings.inboxReminderEnabled} onCheckedChange={(checked) => update({ ...settings, onlyWhenInboxHasItems: checked })} />
        </SettingRow>
        <SaveStatus state={state} />
      </SettingsSection>
    </SettingsScreen>
  )
}

export function NotificationsPage() {
  const { settings } = useNotificationSettings()
  if (!settings) return null
  return <NotificationsForm settings={settings} />
}
