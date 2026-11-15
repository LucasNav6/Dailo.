import type { ReactNode } from "react"

function SummaryRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between border-b border-border text-base">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export { SummaryRow }
