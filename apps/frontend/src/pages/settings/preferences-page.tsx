import {
  RiCheckLine,
  RiComputerLine,
  RiMoonLine,
  RiSunCloudyLine,
  RiSunFoggyLine,
  RiSunLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import { usePreferences } from "@/hooks/use-settings"
import { useTheme, type Theme } from "@/lib/theme"
import type { DayPeriod, Preferences } from "@/models/setting.model"
import { getPeriods, getPoints, pointBounds, withPoint, MAX_ESSENTIAL_TASKS, MIN_ESSENTIAL_TASKS, PERIODS } from "@/services/setting.service"
import { SettingsScreen } from "@/components/layouts/settings-screen"
import { NumberPicker } from "@/components/molecules/number-picker"
import { SettingRow } from "@/components/molecules/setting-row"
import { SettingsSection } from "@/components/organisms/settings-section"
import { Labeled, SaveStatus, TimeRow, TimeSelect, useAutoSave } from "./settings-ui"

const THEMES: { id: Theme; label: string; Icon: RemixiconComponentType }[] = [
  { id: "system", label: "Sistema", Icon: RiComputerLine },
  { id: "light", label: "Claro", Icon: RiSunLine },
  { id: "dark", label: "Oscuro", Icon: RiMoonLine },
]

const PERIOD_ICONS: Record<DayPeriod, RemixiconComponentType> = {
  morning: RiSunFoggyLine,
  noon: RiSunLine,
  afternoon: RiSunCloudyLine,
  night: RiMoonLine,
}

const ESSENTIAL_OPTIONS = Array.from({ length: MAX_ESSENTIAL_TASKS - MIN_ESSENTIAL_TASKS + 1 }, (_, index) => MIN_ESSENTIAL_TASKS + index)

function PreferencesForm({ preferences }: { preferences: Preferences }) {
  const { savePreferences } = usePreferences()
  const { theme, setTheme } = useTheme()
  const { state, run } = useAutoSave()

  const update = (next: Preferences) => void run(() => savePreferences(next))
  const points = getPoints(preferences)
  const periods = getPeriods(preferences)
  // Cada selector solo ofrece horas que no invaden a los puntos vecinos.
  const pointField = (index: number, label: string) => (
    <TimeSelect label={label} value={points[index]} onChange={(value) => update(withPoint(preferences, index, value))} {...pointBounds(preferences, index)} />
  )

  return (
    <SettingsScreen title="Preferencias" backTo="/settings">
      <SettingsSection title="Rutina diaria">
        <TimeRow Icon={RiSunLine} label="Inicio del día" summary={points[0]}>
          {pointField(0, "Inicio del día")}
        </TimeRow>
        <TimeRow Icon={RiMoonLine} label="Cierre del día" summary={points[4]}>
          {pointField(4, "Cierre del día")}
        </TimeRow>
      </SettingsSection>

      <SettingsSection title="Franjas horarias" hint="Una a continuación de otra. Al mover un límite se ajusta la contigua.">
        {PERIODS.map(({ id, label }, index) => (
          <TimeRow key={id} Icon={PERIOD_ICONS[id]} label={label} summary={`${periods[id].start} – ${periods[id].end}`}>
            <Labeled label="Inicio">{pointField(index, `${label}, inicio`)}</Labeled>
            <Labeled label="Fin">{pointField(index + 1, `${label}, fin`)}</Labeled>
          </TimeRow>
        ))}
        <SaveStatus state={state} />
      </SettingsSection>

      <SettingsSection title="Planificación esencial">
        <div className="flex min-h-11 items-center justify-between">
          <span className="text-[15px]">Tareas esenciales</span>
          <NumberPicker label="Tareas esenciales por día" options={ESSENTIAL_OPTIONS} value={preferences.maxEssentialTasks} onChange={(value) => update({ ...preferences, maxEssentialTasks: value })} />
        </div>
        <p className="ml-[38px] text-[13px] leading-[1.45] text-muted-foreground">Recomendado: 3</p>
      </SettingsSection>

      <SettingsSection title="Apariencia">
        <div role="radiogroup" aria-label="Tema" className="flex flex-col">
          {THEMES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={theme === id}
              onClick={() => setTheme(id)}
              className="rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <SettingRow icon={<Icon aria-hidden />} label={label}>
                {theme === id && (
                  <span className="inline-flex text-foreground [&_svg]:size-[22px]">
                    <RiCheckLine aria-hidden />
                  </span>
                )}
              </SettingRow>
            </button>
          ))}
        </div>
      </SettingsSection>
    </SettingsScreen>
  )
}

export function PreferencesPage() {
  const { preferences } = usePreferences()
  if (!preferences) return null
  return <PreferencesForm preferences={preferences} />
}
