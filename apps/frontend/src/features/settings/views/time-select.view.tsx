import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/molecules/select"
import { pad, type TimeSelectModel } from "../libs/time-slots"

type TimeSelectViewProps = {
  label: string
  model: TimeSelectModel
  invalid?: boolean
  disabled?: boolean
}

export function TimeSelectView({ label, model, invalid, disabled }: TimeSelectViewProps) {
  const common = { disabled, "aria-invalid": invalid || undefined }
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <Select value={String(model.hour)} onValueChange={(next) => model.onHour(Number(next))} disabled={disabled}>
        <SelectTrigger {...common} aria-label={`${label}: hora`} className="h-11 w-20 tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {model.hours.map((item) => (
            <SelectItem key={item} value={String(item)} className="tabular-nums">
              {pad(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span aria-hidden>:</span>
      <Select value={String(model.minute)} onValueChange={(next) => model.onMinute(Number(next))} disabled={disabled}>
        <SelectTrigger {...common} aria-label={`${label}: minutos`} className="h-11 w-20 tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {model.minutes.map((item) => (
            <SelectItem key={item} value={String(item)} className="tabular-nums">
              {pad(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
