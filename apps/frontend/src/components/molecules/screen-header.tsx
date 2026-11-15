import type { ReactNode } from "react"

/** Cabecera de pantalla: eyebrow en mayúsculas, título en Fraunces y acciones a la derecha. */
function ScreenHeader({ eyebrow, title, actions }: { eyebrow?: ReactNode; title: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-2 pb-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        {eyebrow && <span className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">{eyebrow}</span>}
        <h1 className="font-display text-[32px] leading-[1.08] font-semibold tracking-[-0.02em] text-foreground">{title}</h1>
      </div>
      {actions && <div className="-mr-1.5 flex shrink-0 items-center">{actions}</div>}
    </header>
  )
}

export { ScreenHeader }
