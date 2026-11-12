import { useState } from "react"
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiComputerLine,
  RiFlagLine,
  RiMoonLine,
  RiPaletteLine,
  RiSunLine,
  RiTimeLine,
  RiCalendarScheduleLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import { usePreferences } from "@/hooks/use-settings"
import { useTheme, type Theme } from "@/lib/theme"
import type { Preferences, TimeRange } from "@/models/setting.model"
import {
  MAX_ESSENTIAL_TASKS,
  MIN_ESSENTIAL_TASKS,
  PERIODS,
} from "@/services/setting.service"
import { Button } from "@/components/ui/button"
import { Panel, SaveStatus, Section, TimeRangeField, useAutoSave } from "./settings-ui"

const THEMES: { id: Theme; label: string; Icon: RemixiconComponentType }[] = [
  { id: "system", label: "Sistema", Icon: RiComputerLine },
  { id: "light", label: "Claro", Icon: RiSunLine },
  { id: "dark", label: "Oscuro", Icon: RiMoonLine },
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
      <Section title="Rutina diaria" Icon={RiCalendarScheduleLine} description="Define tu jornada. Es independiente de las franjas del día.">
        <Panel>
          <TimeRangeField
            label="Jornada"
            start={draft.workday.start}
            end={draft.workday.end}
            error={errors.workday}
            onChange={(range) => update({ ...draft, workday: range })}
          />
        </Panel>
      </Section>

      <Section title="Franjas horarias" Icon={RiTimeLine}>
        <Panel>
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
        </Panel>
        <SaveStatus state={state} />
      </Section>

      <Section title="Planificación esencial" Icon={RiFlagLine}>
        <Panel>
          <div role="group" aria-labelledby="essential-label" className="space-y-3">
            <p id="essential-label" className="text-sm font-medium">
              Tareas esenciales por día
            </p>
            <div className="grid grid-cols-5 gap-2">
              {ESSENTIAL_OPTIONS.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={draft.maxEssentialTasks === value ? "default" : "outline"}
                  aria-pressed={draft.maxEssentialTasks === value}
                  onClick={() => update({ ...draft, maxEssentialTasks: value })}
                  className="h-12 text-base"
                >
                  {value}
                </Button>
              ))}
            </div>
            <p className="rounded-lg bg-muted p-3 text-sm">
              <strong>Recomendado:</strong> 3 tareas para reducir la sobrecarga y cumplir tu día sin estrés.
            </p>
          </div>
        </Panel>
      </Section>

      <Section title="Apariencia" Icon={RiPaletteLine}>
        <div role="radiogroup" aria-label="Tema" className="space-y-2">
          {THEMES.map(({ id, label, Icon }) => {
            const selected = theme === id
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(id)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
                  selected ? "border-primary bg-accent text-accent-foreground" : "border-border/20 bg-card hover:bg-accent/50"
                }`}
              >
                <Icon className="size-5" aria-hidden />
                <span className="flex-1">{label}</span>
                {selected ? (
                  <RiCheckboxCircleFill className="size-6 text-primary" aria-hidden />
                ) : (
                  <RiCheckboxBlankCircleLine className="size-6 text-muted-foreground" aria-hidden />
                )}
              </button>
            )
          })}
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
