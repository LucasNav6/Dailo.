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

type Category = { to: string; label: string; Icon: RemixiconComponentType }

const groups: { title: string; items: Category[] }[] = [
  {
    title: "Personalización",
    items: [
      { to: "/settings/preferences", label: "Preferencias", Icon: RiEqualizerLine },
      { to: "/settings/notifications", label: "Notificaciones", Icon: RiNotification3Line },
    ],
  },
  { title: "Seguridad", items: [{ to: "/settings/security", label: "Seguridad y datos", Icon: RiShieldLine }] },
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
          <div key={group.title} className="space-y-1">
            <h2 className="px-3 text-sm font-semibold text-muted-foreground">{group.title}</h2>
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, Icon }) => (
                <li key={to}>
                  <NavLink to={to} className="nav-link min-h-12 lg:min-h-10">
                    <Icon className="size-5" aria-hidden />
                    <span className="flex-1">{label}</span>
                    <RiArrowRightSLine className="size-5 lg:hidden" aria-hidden />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="px-3 text-sm text-muted-foreground">Dailo v{__APP_VERSION__}</p>
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
