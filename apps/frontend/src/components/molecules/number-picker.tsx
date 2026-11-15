import { cn } from "@/lib/utils"

/** Selector numérico en círculos de 36px (p. ej. 1–5 tareas esenciales); `value` va en tinta sobre superficie. */
function NumberPicker({ options, value }: { options: number[]; value: number }) {
  return (
    <div role="radiogroup" className="flex">
      {options.map((option) => (
        <span
          key={option}
          role="radio"
          aria-checked={option === value}
          className={cn(
            "grid size-9 place-items-center rounded-full text-[15px] font-semibold",
            option === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {option}
        </span>
      ))}
    </div>
  )
}

export { NumberPicker }
