import type { ReactNode } from "react"
import { NavDock } from "@/components/organisms/nav-dock"

/** Pestaña de la barra inferior marcada como activa en el mockup. "none" muestra la barra sin ninguna activa; `false` la oculta. */
export type MockupNav = "today" | "inbox" | "projects" | "someday" | "none" | false

const NAV_PATH: Partial<Record<MockupNav & string, string>> = {
  today: "/today",
  inbox: "/inbox",
  projects: "/projects",
  someday: "/someday",
}

/**
 * Marco de teléfono (390 px de ancho) para mostrar una vista estática: área principal con 24px de
 * padding, barra inferior opcional y espacio para overlays (hojas, diálogos, banners) posicionados
 * de forma absoluta dentro del marco. No usa router: la pestaña activa se fija con `nav`.
 */
function MockupFrame({ children, nav = "none", height = 844 }: { children: ReactNode; nav?: MockupNav; height?: number }) {
  return (
    <div className="relative flex w-[390px] flex-col overflow-hidden bg-background font-sans text-foreground" style={{ height }}>
      <main className="box-border flex min-h-0 flex-1 flex-col overflow-hidden p-6">{children}</main>
      {nav !== false && <NavDock embedded activeTo={NAV_PATH[nav]} onNew={() => {}} />}
    </div>
  )
}

export { MockupFrame }
