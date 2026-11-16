import type { ReactNode } from "react"

function PropertyRow({ icon, label, children }: { icon: ReactNode; label: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex min-h-[52px] items-center gap-[15px] text-[17px] text-foreground">
      <span className="inline-flex text-subtle [&_svg]:size-[22px]">{icon}</span>
      <span className="flex-1">{label}</span>
      {children}
    </div>
  )
}

export { PropertyRow }
