import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router"
import {
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiNotification3Line,
  RiShieldLine,
  RiEqualizerLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Category = { to: string; label: string; description: string; Icon: RemixiconComponentType }

const groups: { title: string; items: Category[] }[] = [
  {
    title: "Personalización",
    items: [
      { to: "/settings/preferences", label: "Preferencias", description: "Rutina, planificación y apariencia", Icon: RiEqualizerLine },
      { to: "/settings/notifications", label: "Notificaciones", description: "Recordatorios y avisos", Icon: RiNotification3Line },
    ],
  },
  { title: "Seguridad", items: [{ to: "/settings/security", label: "Seguridad y datos", description: "Almacenamiento local en este dispositivo", Icon: RiShieldLine }] },
]

const categories = groups.flatMap((group) => group.items)

/** `/settings`: en escritorio abre la primera categoría; en móvil solo muestra el menú. */
export function SettingsIndex() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  return isDesktop ? <Navigate to={categories[0].to} replace /> : null
}

export function SettingsLayout() {
  const { pathname } = useLocation()
  const isIndex = pathname.replace(/\/$/, "") === "/settings"
  const current = categories.find((category) => pathname.startsWith(category.to))

  return (
    <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
      <nav aria-label="Configuración" className={cn("space-y-6", isIndex ? "block" : "hidden lg:block")}>
        {groups.map((group) => (
          <div key={group.title} className="space-y-2">
            <h2 className="px-1 text-xs font-semibold lg:px-3 uppercase tracking-wide text-muted-foreground">{group.title}</h2>
            <ul className="space-y-2 lg:space-y-0.5">
              {group.items.map(({ to, label, description, Icon }) => (
                <li key={to}>
                  <NavLink to={to} className="nav-link min-h-16 !rounded-2xl border border-border/20 bg-card lg:min-h-10 lg:border-transparent lg:bg-transparent">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted lg:size-auto lg:bg-transparent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-base font-medium text-foreground lg:text-sm">{label}</span>
                      <span className="text-sm text-muted-foreground lg:hidden">{description}</span>
                    </span>
                    <RiArrowRightSLine className="size-5 lg:hidden" aria-hidden />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="px-3 pt-4 text-center text-sm text-muted-foreground lg:text-left">Dailo v{__APP_VERSION__}</p>
      </nav>

      {isIndex && <Outlet />}
      {!isIndex && current && (
        <div className="min-w-0 max-w-xl">
          <div className="mb-4 flex items-center gap-2 lg:hidden">
            <Button asChild variant="ghost" size="icon" aria-label="Volver a Configuración">
              <Link to="/settings">
                <RiArrowLeftLine aria-hidden />
              </Link>
            </Button>
            <h2 className="text-xl font-semibold">{current.label}</h2>
          </div>
          <h2 className="mb-4 hidden text-xl font-semibold lg:block">{current.label}</h2>
          <Outlet />
        </div>
      )}
    </div>
  )
}
