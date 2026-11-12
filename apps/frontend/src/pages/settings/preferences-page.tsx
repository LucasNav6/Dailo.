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
  RiCloudyLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import { usePreferences } from "@/hooks/use-settings"
import { useTheme, type Theme } from "@/lib/theme"
import type { DayPeriod, Preferences, TimeRange } from "@/models/setting.model"
import {
  MAX_ESSENTIAL_TASKS,
  MIN_ESSENTIAL_TASKS,
  PERIODS,
} from "@/services/setting.service"
import { Button } from "@/components/ui/button"
import { Labeled, Panel, SaveStatus, Section, TimeRow, TimeSelect, useAutoSave } from "./settings-ui"

const THEMES: { id: Theme; label: string; Icon: RemixiconComponentType }[] = [
  { id: "system", label: "Sistema", Icon: RiComputerLine },
  { id: "light", label: "Claro", Icon: RiSunLine },
  { id: "dark", label: "Oscuro", Icon: RiMoonLine },
]

const PERIOD_ICONS: Record<DayPeriod, RemixiconComponentType> = {
  morning: RiSunLine,
  noon: RiCloudyLine,
  afternoon: RiTimeLine,
  night: RiMoonLine,
}

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
      <Section title="Rutina diaria" Icon={RiCalendarScheduleLine}>
        <Panel className="space-y-2 p-2">
          <TimeRow Icon={RiSunLine} label="Inicio del día" summary={draft.workday.start} error={errors.workday}>
            <TimeSelect label="Inicio del día" value={draft.workday.start} onChange={(start) => update({ ...draft, workday: { ...draft.workday, start } })} />
          </TimeRow>
          <TimeRow Icon={RiMoonLine} label="Cierre del día" summary={draft.workday.end} error={errors.workday}>
            <TimeSelect label="Cierre del día" value={draft.workday.end} onChange={(end) => update({ ...draft, workday: { ...draft.workday, end } })} />
          </TimeRow>
        </Panel>
      </Section>

      <Section title="Franjas horarias" Icon={RiTimeLine} description="Cada franja es independiente de la jornada.">
        <Panel className="space-y-2 p-2">
          {PERIODS.map(({ id, label }) => (
            <TimeRow
              key={id}
              Icon={PERIOD_ICONS[id]}
              label={label}
              summary={`${draft.periods[id].start} – ${draft.periods[id].end}`}
              error={errors[id]}
            >
              <Labeled label="Inicio">
                <TimeSelect label={`${label}, inicio`} value={draft.periods[id].start} onChange={(start) => setPeriod(id, { ...draft.periods[id], start })} />
              </Labeled>
              <Labeled label="Fin">
                <TimeSelect label={`${label}, fin`} value={draft.periods[id].end} onChange={(end) => setPeriod(id, { ...draft.periods[id], end })} />
              </Labeled>
            </TimeRow>
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
