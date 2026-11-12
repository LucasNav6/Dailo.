import { useId, useRef, useState } from "react"
import { RiCheckLine, type RemixiconComponentType } from "@remixicon/react"
import type { FieldErrors } from "@/models/setting.model"
import { cn } from "@/lib/utils"
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

const HOURS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0"))
const MINUTES = Array.from({ length: 12 }, (_, step) => String(step * 5).padStart(2, "0"))

/** Selector de hora en formato 24 h (minutos de 5 en 5). */
export function TimeSelect({
  label,
  value,
  onChange,
  disabled,
  invalid,
  describedBy,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
}) {
  const [hour, minute] = value.split(":")
  const minutes = MINUTES.includes(minute) ? MINUTES : [...MINUTES, minute].sort()
  const common = { disabled, "aria-invalid": invalid || undefined, "aria-describedby": describedBy }
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <Select value={hour} onValueChange={(next) => onChange(`${next}:${minute}`)} disabled={disabled}>
        <SelectTrigger {...common} aria-label={`${label}: hora`} className="h-11 w-20 tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {HOURS.map((item) => (
            <SelectItem key={item} value={item} className="tabular-nums">
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span aria-hidden>:</span>
      <Select value={minute} onValueChange={(next) => onChange(`${hour}:${next}`)} disabled={disabled}>
        <SelectTrigger {...common} aria-label={`${label}: minutos`} className="h-11 w-20 tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {minutes.map((item) => (
            <SelectItem key={item} value={item} className="tabular-nums">
              {item}
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
  error,
  children,
}: {
  Icon: RemixiconComponentType
  label: string
  summary: string
  error?: string
  children: React.ReactNode
}) {
  const errorId = useId()
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-describedby={error ? errorId : undefined}
            aria-label={`${label}, ${summary}. Editar`}
            className="flex min-h-14 w-full items-center gap-3 rounded-xl bg-background px-3 text-left outline-none transition-colors hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex-1 text-sm font-medium">{label}</span>
            <span
              className={cn(
                "rounded-lg border px-2.5 py-1 text-sm tabular-nums",
                error ? "border-destructive text-destructive" : "border-border/20 bg-card"
              )}
            >
              {summary}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto space-y-3">
          {children}
        </PopoverContent>
      </Popover>
      {error && (
        <p id={errorId} className="px-3 pt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
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
