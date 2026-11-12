import { useState } from "react"
import { RiComputerLine, RiMoonLine, RiSunLine, type RemixiconComponentType } from "@remixicon/react"
import { usePreferences } from "@/hooks/use-settings"
import { useTheme, type Theme } from "@/lib/theme"
import type { Preferences, TimeRange } from "@/models/setting.model"
import {
  MAX_ESSENTIAL_TASKS,
  MIN_ESSENTIAL_TASKS,
  PERIODS,
} from "@/services/setting.service"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SaveStatus, Section, TimeRangeField, useAutoSave } from "./settings-ui"

const THEMES: { id: Theme; label: string; Icon: RemixiconComponentType }[] = [
  { id: "light", label: "Claro", Icon: RiSunLine },
  { id: "dark", label: "Oscuro", Icon: RiMoonLine },
  { id: "system", label: "Sistema", Icon: RiComputerLine },
]

const ESSENTIAL_OPTIONS = Array.from(
  { length: MAX_ESSENTIAL_TASKS - MIN_ESSENTIAL_TASKS + 1 },
  (_, index) => MIN_ESSENTIAL_TASKS + index
)

function PreferencesForm({ initial }: { initial: Preferences }) {
  const { savePreferences } = usePreferences()
  const { theme, setTheme } = useTheme()
  const [draft, setDraft] = useState(initial)
  const { state, errors, run } = useAutoSave()

  const update = (next: Preferences) => {
    setDraft(next)
    void run(() => savePreferences(next))
  }
  const setPeriod = (id: keyof Preferences["periods"], range: TimeRange) =>
    update({ ...draft, periods: { ...draft.periods, [id]: range } })

  return (
    <div>
      <Section title="Rutina diaria" description="Define tu jornada y las franjas del día. Cada franja es independiente de la jornada.">
        <TimeRangeField
          label="Jornada"
          start={draft.workday.start}
          end={draft.workday.end}
          error={errors.workday}
          onChange={(range) => update({ ...draft, workday: range })}
        />
        {PERIODS.map(({ id, label }) => (
          <TimeRangeField
            key={id}
            label={label}
            start={draft.periods[id].start}
            end={draft.periods[id].end}
            error={errors[id]}
            onChange={(range) => setPeriod(id, range)}
          />
        ))}
        <SaveStatus state={state} />
      </Section>

      <Section title="Planificación">
        <div className="space-y-1.5">
          <label id="essential-label" className="text-sm font-medium">
            Tareas esenciales por día
          </label>
          <Select
            value={String(draft.maxEssentialTasks)}
            onValueChange={(value) => update({ ...draft, maxEssentialTasks: Number(value) })}
          >
            <SelectTrigger aria-labelledby="essential-label" className="h-11 w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ESSENTIAL_OPTIONS.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Máximo de {MIN_ESSENTIAL_TASKS} a {MAX_ESSENTIAL_TASKS}.</p>
        </div>
      </Section>

      <Section title="Apariencia">
        <div role="group" aria-label="Tema" className="grid max-w-md grid-cols-3 gap-2">
          {THEMES.map(({ id, label, Icon }) => (
            <Button
              key={id}
              type="button"
              variant={theme === id ? "default" : "outline"}
              aria-pressed={theme === id}
              onClick={() => setTheme(id)}
              className="h-11"
            >
              <Icon aria-hidden />
              {label}
            </Button>
          ))}
        </div>
      </Section>
    </div>
  )
}

export function PreferencesPage() {
  const { preferences } = usePreferences()
  if (!preferences) return null
  return <PreferencesForm initial={preferences} />
}
