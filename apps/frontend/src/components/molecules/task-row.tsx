import { TaskCheck } from "@/components/atoms/task-check"
import { cn } from "@/lib/utils"

type TaskRowProps = {
  title: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Hora o etiqueta corta alineada a la derecha ("13:30", "Vie"). */
  time?: string
  id?: string
};

/** Fila de tarea: círculo, título (tachado si está hecha) y hora opcional. */
function TaskRow({ title, checked = false, onCheckedChange, time, id }: TaskRowProps) {
  const checkId = id ?? `task-${title}`
  return (
    <li className="flex list-none items-center gap-[15px] py-[9px] pl-[5px] text-[17px] leading-[1.35] text-foreground">
      <TaskCheck id={checkId} checked={checked} onCheckedChange={(value) => onCheckedChange?.(value === true)} aria-label={`Completar ${title}`} />
      <label
        htmlFor={checkId}
        className={cn("min-w-0 flex-1 truncate", checked && "text-muted-foreground line-through decoration-wavy decoration-1")}
      >
        {title}
      </label>
      {time && <span className="ml-auto shrink-0 text-[13px] whitespace-nowrap text-muted-foreground">{time}</span>}
    </li>
  )
}

export { TaskRow }
