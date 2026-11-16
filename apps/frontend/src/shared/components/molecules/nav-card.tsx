import type { ReactNode } from "react"
import { Link } from "react-router"
import { RiArrowRightSLine } from "@remixicon/react"

type NavCardProps = { icon: ReactNode; title: string; subtitle: string; to?: string }

function NavCard({ icon, title, subtitle, to }: NavCardProps) {
  const body = (
    <>
      <span className="grid size-10 place-items-center rounded-xl bg-selected text-foreground [&_svg]:size-5">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-base font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </span>
      <span className="inline-flex text-muted-foreground [&_svg]:size-5">
        <RiArrowRightSLine aria-hidden />
      </span>
    </>
  )
  const className = "flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
  return (
    <li className="list-none">
      {to ? (
        <Link to={to} className={`${className} outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </li>
  )
}

export { NavCard }
