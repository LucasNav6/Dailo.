import type { ReactNode } from "react"
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react"
import { cn } from "@/shared/libs/utils"

type SectionHeaderProps = {
  title: ReactNode
  meta?: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  open?: boolean
  onToggle?: () => void
  className?: string
}

function SectionHeader({ title, meta, icon, badge, open, onToggle, className }: SectionHeaderProps) {
  const content = (
    <>
      {icon && <span className="grid size-7 shrink-0 place-items-center rounded-full bg-selected text-subtle">{icon}</span>}
      <span>{title}</span>
      {badge && <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-primary-foreground uppercase">{badge}</span>}
      <span className="flex-1" />
      {meta && <span className="font-medium tracking-normal text-muted-foreground normal-case">{meta}</span>}
      {open !== undefined && <span className="inline-flex text-muted-foreground [&_svg]:size-[18px]">{open ? <RiArrowDownSLine aria-hidden /> : <RiArrowRightSLine aria-hidden />}</span>}
    </>
  )
  const base = cn("mt-4 mb-0.5 flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase", className)
  return onToggle ? (
    <button type="button" aria-expanded={open} onClick={onToggle} className={cn(base, "w-full rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50")}>
      {content}
    </button>
  ) : (
    <div className={base}>{content}</div>
  )
}

export { SectionHeader }
