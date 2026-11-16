import { RiCheckLine } from "@remixicon/react"

type EssentialsDoneProps = { count: number; total: number; lead: string; emphasis: string }

function EssentialsDone({ count, total, lead, emphasis }: EssentialsDoneProps) {
  return (
    <section aria-label="Esenciales listos" className="mt-3 mb-1 rounded-2xl bg-primary px-4 py-1">
      <div className="flex min-h-14 items-center gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
          <RiCheckLine className="size-4" aria-hidden />
        </span>
        <span className="flex min-w-0 flex-col gap-px">
          <span className="text-[11px] font-bold tracking-[0.06em] whitespace-nowrap text-border uppercase">
            Esenciales listos · {count} de {total}
          </span>
          <span className="truncate font-display text-[19px] leading-[1.15] font-semibold whitespace-nowrap text-card">
            {lead} <em className="font-medium italic">{emphasis}</em>
          </span>
        </span>
      </div>
    </section>
  )
}

export { EssentialsDone }
