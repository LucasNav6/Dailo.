import { useRef, type ReactNode } from "react"
import { LinkifiedText } from "@/components/atoms/linkified-text"
import { TaskCheck } from "@/components/atoms/task-check"
import { useCompletionEffect } from "@/lib/use-completion-effect"
import { cn } from "@/lib/utils"

type TaskRowProps = {
  title: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Hora o etiqueta corta alineada a la derecha ("13:30", "Vie"). */
  time?: ReactNode
  /** Icono pequeño antes de la etiqueta de la derecha (p. ej. marca de esencial). */
  timeIcon?: ReactNode
  /** Contenido libre a la derecha (p. ej. "2/4" + chevron); reemplaza a time/timeIcon. */
  meta?: ReactNode
  className?: string
  id?: string
  /** Si se define, tocar el título abre la tarea en vez de completarla. */
  onOpen?: () => void
};

/** Fila de tarea: círculo, título (máx. 2 líneas, tachado si está hecha) y etiqueta opcional a la derecha. */
function TaskRow({ title, checked = false, onCheckedChange, time, timeIcon, meta, className, id, onOpen }: TaskRowProps) {
  const checkId = id ?? `task-${title}`
  const checkRef = useRef<HTMLSpanElement>(null)
  const animating = useCompletionEffect(checked, checkRef)
  const doneClass = cn(checked && "text-muted-foreground line-through decoration-wavy decoration-1", animating && "anim-strike")
  return (
    <li className={cn("flex list-none items-start gap-[15px] py-[9px] pl-[5px] text-[17px] leading-[1.35] text-foreground", className)}>
      <span ref={checkRef} className={cn("mt-px inline-flex", animating && "anim-pop")}>
        <TaskCheck id={checkId} checked={checked} onCheckedChange={(value) => onCheckedChange?.(value === true)} aria-label={`Completar ${title}`} />
      </span>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className={cn("line-clamp-2 min-w-0 flex-1 rounded-lg text-left transition-colors duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", doneClass)}
        >
          <LinkifiedText text={title} />
        </button>
      ) : (
        <label
          htmlFor={checkId}
          className={cn("line-clamp-2 min-w-0 flex-1 transition-colors duration-300", doneClass)}
        >
          <LinkifiedText text={title} />
        </label>
      )}
      {meta && <span className="shrink-0 self-center whitespace-nowrap">{meta}</span>}
      {!meta && (time || timeIcon) && (
        <span className="inline-flex shrink-0 items-center gap-1.5 pt-[3px] text-[13px] whitespace-nowrap text-muted-foreground [&>svg]:size-4">
          {timeIcon}
          {time}
        </span>
      )}
    </li>
  )
}

export { TaskRow }
