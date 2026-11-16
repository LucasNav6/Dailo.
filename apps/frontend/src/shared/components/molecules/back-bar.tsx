import type { ReactNode } from "react"
import { Link } from "react-router"
import { RiArrowLeftLine } from "@remixicon/react"
import { IconButton } from "@/shared/components/atoms/icon-button"

type BackBarProps = { title: ReactNode; backLabel: string; actions?: ReactNode; backTo?: string }

function BackBar({ title, backLabel, actions, backTo }: BackBarProps) {
  return (
    <div className="flex items-center gap-3">
      {backTo ? (
        <IconButton asChild aria-label={backLabel} className="lg:hidden">
          <Link to={backTo}>
            <RiArrowLeftLine aria-hidden />
          </Link>
        </IconButton>
      ) : (
        <IconButton aria-label={backLabel} tabIndex={-1}>
          <RiArrowLeftLine aria-hidden />
        </IconButton>
      )}
      <h2 className="flex-1 text-xl font-semibold lg:ml-0">{title}</h2>
      {actions}
    </div>
  )
}

export { BackBar }
