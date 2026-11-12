import { RiInformationLine } from "@remixicon/react"
import { useNotificationSettings } from "@/hooks/use-settings"
import type { NotificationSettings } from "@/models/setting.model"
import { Switch } from "@/components/ui/switch"
import { Labeled, Panel, SaveStatus, Section, TimeSelect, useAutoSave } from "./settings-ui"

function NotificationsForm({ settings }: { settings: NotificationSettings }) {
  const { saveSettings } = useNotificationSettings()
  const { state, errors, run } = useAutoSave()

  const update = (next: NotificationSettings) => {
    void run(() => saveSettings(next))
  }

  return (
    <div>
      <p className="mb-6 flex gap-3 rounded-lg bg-muted p-3 text-sm" role="note">
        <RiInformationLine className="mt-0.5 size-5 shrink-0" aria-hidden />
        <span>
          La entrega de notificaciones todavía no está disponible. Tus preferencias se guardan, pero el recordatorio aún no funciona.
        </span>
      </p>

      <Section title="Recordatorio de Inbox" description="Hábito de cierre diario: te recuerda procesar tu Inbox al final de la jornada.">
        <Panel>
        <div className="flex min-h-11 items-center justify-between gap-4">
          <label htmlFor="reminder-enabled" className="text-sm font-medium">
            Activar recordatorio
          </label>
          <Switch
            id="reminder-enabled"
            checked={settings.inboxReminderEnabled}
            onCheckedChange={(checked) => update({ ...settings, inboxReminderEnabled: checked })}
          />
        </div>
        <div className="border-t border-border/20 pt-4">
          <Labeled label="Hora del recordatorio">
            <TimeSelect
              label="Hora del recordatorio"
              value={settings.inboxReminderTime}
              disabled={!settings.inboxReminderEnabled}
              invalid={!!errors.inboxReminderTime}
              describedBy={errors.inboxReminderTime ? "reminder-time-error" : undefined}
              onChange={(value) => update({ ...settings, inboxReminderTime: value })}
            />
          </Labeled>
          {errors.inboxReminderTime && (
            <p id="reminder-time-error" className="mt-1.5 text-sm text-destructive">
              {errors.inboxReminderTime}
            </p>
          )}
        </div>
        <div className="flex min-h-11 items-center justify-between gap-4 border-t border-border/20 pt-4">
          <label htmlFor="reminder-only-pending" className="text-sm font-medium">
            Recordar solo cuando Inbox tenga elementos pendientes
          </label>
          <Switch
            id="reminder-only-pending"
            checked={settings.onlyWhenInboxHasItems}
            disabled={!settings.inboxReminderEnabled}
            onCheckedChange={(checked) => update({ ...settings, onlyWhenInboxHasItems: checked })}
          />
        </div>
        </Panel>
        <SaveStatus state={state} />
      </Section>
    </div>
  )
}

export function NotificationsPage() {
  const { settings } = useNotificationSettings()
  if (!settings) return null
  return <NotificationsForm settings={settings} />
}
