import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Emphasis } from "@/shared/components/atoms/emphasis"
import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { MonthCalendar } from "@/shared/components/organisms/month-calendar"

type MonthModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selected: Date
  today: Date
  loads: Record<number, 1 | 2 | 3>
  onSelect: (date: Date) => void
  onToday: () => void
}

export function MonthModal({ open, onOpenChange, selected, today, loads, onSelect, onToday }: MonthModalProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} label="Vistazo al mes" className="gap-2 pb-7">
      <div className="flex items-center justify-between pb-1">
        <span className="font-display text-[22px] font-semibold text-foreground">
          {format(selected, "MMMM", { locale: es }).replace(/^./, (c) => c.toUpperCase())} <Emphasis>{format(selected, "yyyy")}</Emphasis>
        </span>
        <button type="button" className="text-sm font-semibold text-foreground" onClick={onToday}>Ir a hoy</button>
      </div>
      <MonthCalendar month={selected} today={today} selected={selected} loads={loads} onSelect={onSelect} />
    </BottomSheet>
  )
}
