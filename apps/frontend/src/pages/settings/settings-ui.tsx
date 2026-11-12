import { useId, useRef, useState } from "react"
import { RiCheckLine, type RemixiconComponentType } from "@remixicon/react"
import type { FieldErrors } from "@/models/setting.model"
import { Input } from "@/components/ui/input"

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
  return <div className={`space-y-4 rounded-2xl border border-border/20 bg-card p-4 ${className ?? ""}`}>{children}</div>
}

export function TimeField({
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
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type="time"
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 min-w-28"
      />
    </div>
  )
}

export function TimeRangeField({
  label,
  start,
  end,
  onChange,
  error,
}: {
  label: string
  start: string
  end: string
  onChange: (range: { start: string; end: string }) => void
  error?: string
}) {
  const errorId = useId()
  return (
    <fieldset className="space-y-1.5">
      <legend className="mb-1.5 text-sm font-semibold">{label}</legend>
      <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
        <TimeField label="Inicio" value={start} invalid={!!error} describedBy={error ? errorId : undefined} onChange={(value) => onChange({ start: value, end })} />
        <TimeField label="Fin" value={end} invalid={!!error} describedBy={error ? errorId : undefined} onChange={(value) => onChange({ start, end: value })} />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}
