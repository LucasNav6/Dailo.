import { useState } from "react"
import { es } from "date-fns/locale"
import { Button } from "@/shared/components/atoms/button"
import { Chip } from "@/shared/components/atoms/chip"
import { Calendar } from "@/shared/components/molecules/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/molecules/popover"
import { dateLabel, fromISODate, toISODate } from "@/shared/libs/dates"

type DatePopoverViewProps = {
  label: string
  value?: string
  onChange: (value: string | undefined) => void
}

export function DatePopoverView({ label, value, onChange }: DatePopoverViewProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Chip aria-pressed={undefined} aria-label={`${label}: ${value ? dateLabel(value) : "sin fecha"}`}>
          {value ? dateLabel(value) : "Elegir"}
        </Chip>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto space-y-2 p-2">
        <Calendar
          mode="single"
          locale={es}
          weekStartsOn={1}
          selected={value ? fromISODate(value) : undefined}
          defaultMonth={value ? fromISODate(value) : undefined}
          onSelect={(day) => {
            if (day) onChange(toISODate(day))
            setOpen(false)
          }}
        />
        {value && (
          <Button variant="ghost" className="h-10 w-full" onClick={() => { onChange(undefined); setOpen(false) }}>
            Quitar fecha
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}
