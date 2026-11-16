import type { ReactNode } from "react"
import type { RemixiconComponentType } from "@remixicon/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/molecules/popover"
import { SettingRow, SettingValue } from "@/shared/components/molecules/setting-row"

type TimeRowViewProps = {
  Icon: RemixiconComponentType
  label: string
  summary: string
  children: ReactNode
}

export function TimeRowView({ Icon, label, summary, children }: TimeRowViewProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${label}, ${summary}. Editar`}
          className="w-full rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <SettingRow icon={<Icon aria-hidden />} label={label}>
            <SettingValue>{summary}</SettingValue>
          </SettingRow>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto space-y-3">
        {children}
      </PopoverContent>
    </Popover>
  )
}

export function LabeledView({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>
  )
}
