import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react"

function CollapseHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle?: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className="mt-4 flex w-full items-center justify-between border-t border-border pt-3 text-sm font-semibold text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {label}
      <span className="inline-flex [&_svg]:size-[22px]">{open ? <RiArrowUpSLine aria-hidden /> : <RiArrowDownSLine aria-hidden />}</span>
    </button>
  )
}

export { CollapseHeader }
