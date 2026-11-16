import { SkeletonEssentials, SkeletonSection } from "@/shared/components/molecules/skeleton-section"
import { WeekStrip, type WeekDay } from "@/shared/components/molecules/week-strip"
import { AgendaHeaderView } from "./agenda-header.view"
import type { ReactNode } from "react"

type AgendaLoadingViewProps = { eyebrow: string; title: ReactNode; days: WeekDay[] }

export function AgendaLoadingView({ eyebrow, title, days }: AgendaLoadingViewProps) {
  return (
    <div aria-busy="true" className="contents">
      <AgendaHeaderView eyebrow={eyebrow} title={title} />
      <WeekStrip days={days} />
      <SkeletonEssentials widths={[70, 55, 62]} />
      <SkeletonSection widths={[48, 66]} />
      <SkeletonSection widths={[58]} label={60} />
    </div>
  )
}
