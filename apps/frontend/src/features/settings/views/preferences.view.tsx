import {
  RiCheckLine,
  RiComputerLine,
  RiMoonLine,
  RiSunCloudyLine,
  RiSunFoggyLine,
  RiSunLine,
  RiVolumeUpLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import { Switch } from "@/shared/components/atoms/switch"
import { SettingsScreen } from "@/shared/components/layouts/settings-screen"
import { NumberPicker } from "@/shared/components/molecules/number-picker"
import { SettingRow } from "@/shared/components/molecules/setting-row"
import { SettingsSection } from "@/shared/components/organisms/settings-section"
import type { Theme } from "@/shared/libs/theme"
import type { DayPeriod } from "@/shared/models/setting.model"
import type { PreferencesScreen } from "../hooks/preferences-screen.hook"
import { MAX_ESSENTIAL_TASKS, MIN_ESSENTIAL_TASKS, PERIODS } from "../libs/preferences"
import { SaveStatusView } from "./save-status.view"
import { LabeledView, TimeRowView } from "./time-row.view"
import { TimeSelectView } from "./time-select.view"

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

const ESSENTIAL_OPTIONS = Array.from(
  { length: MAX_ESSENTIAL_TASKS - MIN_ESSENTIAL_TASKS + 1 },
  (_, index) => MIN_ESSENTIAL_TASKS + index
)

export function PreferencesView({ screen }: { screen: PreferencesScreen }) {
  const { points, periods, state, theme, soundOn } = screen
  return (
    <SettingsScreen title="Preferencias" backTo="/settings">
      <SettingsSection title="Rutina diaria">
        <TimeRowView Icon={RiSunLine} label="Inicio del día" summary={points[0]}>
          <TimeSelectView label="Inicio del día" model={screen.timeField(0)} />
        </TimeRowView>
        <TimeRowView Icon={RiMoonLine} label="Cierre del día" summary={points[4]}>
          <TimeSelectView label="Cierre del día" model={screen.timeField(4)} />
        </TimeRowView>
      </SettingsSection>

      <SettingsSection title="Franjas horarias" hint="Una a continuación de otra. Al mover un límite se ajusta la contigua.">
        {PERIODS.map(({ id, label }, index) => (
          <TimeRowView key={id} Icon={PERIOD_ICONS[id]} label={label} summary={`${periods[id].start} – ${periods[id].end}`}>
            <LabeledView label="Inicio">
              <TimeSelectView label={`${label}, inicio`} model={screen.timeField(index)} />
            </LabeledView>
            <LabeledView label="Fin">
              <TimeSelectView label={`${label}, fin`} model={screen.timeField(index + 1)} />
            </LabeledView>
          </TimeRowView>
        ))}
        <SaveStatusView state={state} />
      </SettingsSection>

      <SettingsSection title="Planificación esencial">
        <div className="flex min-h-11 items-center justify-between">
          <span className="text-[15px]">Tareas esenciales</span>
          <NumberPicker
            label="Tareas esenciales por día"
            options={ESSENTIAL_OPTIONS}
            value={screen.maxEssentialTasks}
            onChange={screen.changeMaxEssential}
          />
        </div>
        <p className="ml-[38px] text-[13px] leading-[1.45] text-muted-foreground">Recomendado: 3</p>
      </SettingsSection>

      <SettingsSection title="Sonido">
        <SettingRow icon={<RiVolumeUpLine aria-hidden />} label="Sonido al completar" comfortable>
          <Switch aria-label="Sonido al completar" checked={soundOn} onCheckedChange={screen.toggleSound} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Apariencia">
        <div role="radiogroup" aria-label="Tema" className="flex flex-col">
          {THEMES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={theme === id}
              onClick={() => screen.changeTheme(id)}
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
