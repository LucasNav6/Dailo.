import type { ReactNode } from "react"

/** Sección de ajustes: título de 17px, texto de ayuda opcional de 13px y sus filas. */
function SettingsSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <div className="pb-1">
        <h3 className="text-[17px] font-semibold">{title}</h3>
        {hint && <p className="mt-1 text-[13px] leading-[1.45] text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

export { SettingsSection }
