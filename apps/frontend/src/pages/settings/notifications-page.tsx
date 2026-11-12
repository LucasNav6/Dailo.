import { useState } from "react"
import { RiInformationLine } from "@remixicon/react"
import { useNotificationSettings } from "@/hooks/use-settings"
import type { NotificationSettings } from "@/models/setting.model"
import { Switch } from "@/components/ui/switch"
import { SaveStatus, Section, TimeField, useAutoSave } from "./settings-ui"

function NotificationsForm({ initial }: { initial: NotificationSettings }) {
  const { saveSettings } = useNotificationSettings()
  const [draft, setDraft] = useState(initial)
  const { state, errors, run } = useAutoSave()

  const update = (next: NotificationSettings) => {
    setDraft(next)
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

      <Section title="Recordatorio de Inbox">
        <div className="flex min-h-11 items-center justify-between gap-4">
          <label htmlFor="reminder-enabled" className="text-sm font-medium">
            Activar recordatorio
          </label>
          <Switch
            id="reminder-enabled"
            checked={draft.inboxReminderEnabled}
            onCheckedChange={(checked) => update({ ...draft, inboxReminderEnabled: checked })}
          />
        </div>
        <div>
          <TimeField
            label="Hora del recordatorio"
            value={draft.inboxReminderTime}
            disabled={!draft.inboxReminderEnabled}
            invalid={!!errors.inboxReminderTime}
            describedBy={errors.inboxReminderTime ? "reminder-time-error" : undefined}
            onChange={(value) => update({ ...draft, inboxReminderTime: value })}
          />
          {errors.inboxReminderTime && (
            <p id="reminder-time-error" className="mt-1.5 text-sm text-destructive">
              {errors.inboxReminderTime}
            </p>
          )}
        </div>
        <div className="flex min-h-11 items-center justify-between gap-4">
          <label htmlFor="reminder-only-pending" className="text-sm font-medium">
            Recordar solo cuando Inbox tenga elementos pendientes
          </label>
          <Switch
            id="reminder-only-pending"
            checked={draft.onlyWhenInboxHasItems}
            disabled={!draft.inboxReminderEnabled}
            onCheckedChange={(checked) => update({ ...draft, onlyWhenInboxHasItems: checked })}
          />
        </div>
        <SaveStatus state={state} />
      </Section>
    </div>
  )
}

export function NotificationsPage() {
  const { settings } = useNotificationSettings()
  if (!settings) return null
  return <NotificationsForm initial={settings} />
}
