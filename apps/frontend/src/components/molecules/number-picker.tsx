import { cn } from "@/lib/utils"

type NumberPickerProps = { options: number[]; value: number; onChange?: (value: number) => void; label?: string }

/** Selector numérico en círculos de 36px (p. ej. 1–5 tareas esenciales); `value` va en tinta sobre superficie. */
function NumberPicker({ options, value, onChange, label }: NumberPickerProps) {
  return (
    <div role="radiogroup" aria-label={label} className="flex">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          disabled={!onChange}
          onClick={() => onChange?.(option)}
          className={cn(
            "grid size-9 place-items-center rounded-full text-[15px] font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default",
            option === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export { NumberPicker }
