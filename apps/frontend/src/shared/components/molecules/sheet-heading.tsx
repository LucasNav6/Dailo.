import type { ReactNode } from "react"

function SheetHeading({ eyebrow, title, subtitle }: { eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 pb-2">
      {eyebrow && <span className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">{eyebrow}</span>}
      <span className="font-display text-[22px] leading-[1.2] font-semibold text-foreground">{title}</span>
      {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
    </div>
  )
}

export { SheetHeading }
