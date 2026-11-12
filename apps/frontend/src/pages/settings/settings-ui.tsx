import { useRef, useState } from "react"
import { RiCheckLine, type RemixiconComponentType } from "@remixicon/react"
import type { FieldErrors } from "@/models/setting.model"
import { cn } from "@/lib/utils"
import { LAST_MINUTE_OF_DAY, TIME_STEP, toMinutes } from "@/services/setting.service"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SaveState = "idle" | "saved" | "error"

/** Guardado automático: ejecuta `save` y expone un estado discreto para mostrar. */
export function useAutoSave() {
  const [state, setState] = useState<SaveState>("idle")
  const [errors, setErrors] = useState<FieldErrors>({})
  const latest = useRef(0)

  const run = async (save: () => Promise<FieldErrors>) => {
    const id = ++latest.current
    try {
      const result = await save()
      if (id !== latest.current) return
      setErrors(result)
      setState(Object.keys(result).length === 0 ? "saved" : "idle")
    } catch {
      if (id !== latest.current) return
      setState("error")
    }
  }
  return { state, errors, run }
}

export function SaveStatus({ state }: { state: SaveState }) {
  return (
    <p
      role="status"
      className={state === "error" ? "min-h-5 text-sm text-destructive" : "min-h-5 text-sm text-muted-foreground"}
    >
      {state === "saved" && (
        <span className="inline-flex items-center gap-1">
          <RiCheckLine className="size-4" aria-hidden /> Cambios guardados
        </span>
      )}
      {state === "error" && "No se pudo guardar. Inténtalo de nuevo."}
    </p>
  )
}

export function Section({
  title,
  description,
  Icon,
  children,
}: {
  title: string
  description?: string
  Icon?: RemixiconComponentType
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 py-4 first:pt-0">
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          {Icon && <Icon className="size-5 text-primary" aria-hidden />}
          {title}
        </h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border/20 bg-card", className ?? "space-y-4 p-4")}>{children}</div>
}

const FULL_DAY = { min: 0, max: LAST_MINUTE_OF_DAY }
const pad = (value: number) => String(value).padStart(2, "0")

/** Horas disponibles (minutos desde medianoche) dentro de [min, max], cada TIME_STEP. */
function slotsBetween(min: number, max: number, current: number) {
  const slots = new Set<number>([current])
  for (let time = Math.ceil(min / TIME_STEP) * TIME_STEP; time <= max; time += TIME_STEP) slots.add(time)
  return [...slots].sort((a, b) => a - b)
}

/**
 * Selector de hora en 24 h. Solo ofrece horas dentro de [min, max], de modo que
 * no se puede elegir un valor que invada a las franjas vecinas.
 */
export function TimeSelect({
  label,
  value,
  onChange,
  min = FULL_DAY.min,
  max = FULL_DAY.max,
  disabled,
  invalid,
  describedBy,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  min?: number
  max?: number
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
}) {
  const current = toMinutes(value)
  const slots = slotsBetween(min, max, current)
  const hours = [...new Set(slots.map((slot) => Math.floor(slot / 60)))]
  const hour = Math.floor(current / 60)
  const minutes = slots.filter((slot) => Math.floor(slot / 60) === hour).map((slot) => slot % 60)
  const format = (time: number) => `${pad(Math.floor(time / 60))}:${pad(time % 60)}`

  const changeHour = (nextHour: number) => {
    const options = slots.filter((slot) => Math.floor(slot / 60) === nextHour)
    // Si el minuto actual no existe en esa hora, se usa el más cercano permitido.
    const nearest = options.reduce((best, slot) =>
      Math.abs(slot - (nextHour * 60 + (current % 60))) < Math.abs(best - (nextHour * 60 + (current % 60))) ? slot : best
    )
    onChange(format(nearest))
  }
  const common = { disabled, "aria-invalid": invalid || undefined, "aria-describedby": describedBy }

  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <Select value={String(hour)} onValueChange={(next) => changeHour(Number(next))} disabled={disabled}>
        <SelectTrigger {...common} aria-label={`${label}: hora`} className="h-11 w-20 tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {hours.map((item) => (
            <SelectItem key={item} value={String(item)} className="tabular-nums">
              {pad(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span aria-hidden>:</span>
      <Select value={String(current % 60)} onValueChange={(next) => onChange(`${pad(hour)}:${pad(Number(next))}`)} disabled={disabled}>
        <SelectTrigger {...common} aria-label={`${label}: minutos`} className="h-11 w-20 tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {minutes.map((item) => (
            <SelectItem key={item} value={String(item)} className="tabular-nums">
              {pad(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/** Fila compacta: icono, nombre y valor como chip. Al tocarla abre el editor. */
export function TimeRow({
  Icon,
  label,
  summary,
  children,
}: {
  Icon: RemixiconComponentType
  label: string
  summary: string
  children: React.ReactNode
}) {
  return (
    <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`${label}, ${summary}. Editar`}
            className="flex min-h-14 w-full items-center gap-3 rounded-xl bg-background px-3 text-left outline-none transition-colors hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex-1 text-sm font-medium">{label}</span>
            <span className="rounded-lg border border-border/20 bg-card px-2.5 py-1 text-sm tabular-nums">{summary}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto space-y-3">
          {children}
        </PopoverContent>
    </Popover>
  )
}

export function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>
  )
}
