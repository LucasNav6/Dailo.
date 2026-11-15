import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "react-day-picker/locale";
import { RiCalendarLine, RiCloseLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

type Props = {
  /** YYYY-MM-DD o vacío. */
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label: string;
  placeholder?: string;
  /** Versión compacta (chip) para filas de subtareas. */
  compact?: boolean;
  className?: string;
};

/** Selector de fecha con el Calendar de shadcn; guarda YYYY-MM-DD sin zona horaria. */
export function DateField({ value, onChange, label, placeholder = "Sin fecha", compact, className }: Props) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;
  const text = selected ? format(selected, compact ? "EEE d" : "EEE d MMM", { locale: es }) : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("flex items-center gap-1", className)}>
        <PopoverAnchor asChild>
          <Button
            type="button"
            variant="outline"
            size={compact ? "sm" : "default"}
            className={cn("justify-start font-medium", compact ? "h-9 rounded-full px-3 text-[13px]" : "flex-1 px-4", !selected && "text-muted-foreground")}
            aria-label={selected ? `${label}: ${text}` : `${label}: sin fecha`}
            onClick={() => setOpen(true)}
          >
            <RiCalendarLine aria-hidden />
            {text}
          </Button>
        </PopoverAnchor>
        {selected && (
          <Button type="button" variant="ghost" size={compact ? "icon-xs" : "icon-sm"} aria-label={`Quitar ${label.toLowerCase()}`} onClick={() => onChange(undefined)}>
            <RiCloseLine aria-hidden />
          </Button>
        )}
      </div>
      <PopoverContent align="start" className="z-[80] w-auto p-0">
        <Calendar
          mode="single"
          navLayout="after"
          locale={es}
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (!date) return;
            onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
