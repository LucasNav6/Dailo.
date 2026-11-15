import type { ReactNode } from "react"
import { RiArrowRightSLine } from "@remixicon/react"

/** Tarjeta de navegación de Configuración: baldosa de icono, título, subtítulo y chevron. */
function NavCard({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <li className="flex min-h-16 list-none items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <span className="grid size-10 place-items-center rounded-xl bg-selected text-foreground [&_svg]:size-5">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-base font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </span>
      <span className="inline-flex text-muted-foreground [&_svg]:size-5">
        <RiArrowRightSLine aria-hidden />
      </span>
    </li>
  )
}

export { NavCard }
