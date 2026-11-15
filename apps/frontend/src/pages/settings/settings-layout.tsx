import { Navigate, NavLink, Outlet, useLocation } from "react-router"
import {
  RiNotification3Line,
  RiShieldLine,
  RiEqualizerLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { NavCard } from "@/components/molecules/nav-card"

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
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  if (isIndex && isDesktop) return <Navigate to={categories[0].to} replace />

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
      <h1 className={cn("mb-6 font-display text-[32px] leading-[1.08] font-semibold tracking-[-0.02em]", !isIndex && "hidden lg:block")}>Configuración</h1>
      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-10">
        {/* Móvil: índice con tarjetas del diseño. */}
        {isIndex && (
          <div className="flex flex-col gap-6 lg:hidden">
            {groups.map((group) => (
              <section key={group.title} className="flex flex-col gap-2.5">
                <h2 className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">{group.title}</h2>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map(({ to, label, description, Icon }) => (
                    <NavCard key={to} to={to} icon={<Icon aria-hidden />} title={label} subtitle={description} />
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-center text-sm text-muted-foreground">Dailo v{__APP_VERSION__}</p>
          </div>
        )}

        {/* Escritorio: menú lateral. */}
        <nav aria-label="Configuración" className="hidden space-y-6 lg:block">
          {groups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h2 className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{group.title}</h2>
              <ul className="space-y-0.5">
                {group.items.map(({ to, label, Icon }) => (
                  <li key={to}>
                    <NavLink to={to} className="nav-link min-h-10">
                      <Icon className="size-5" aria-hidden />
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="px-3 pt-4 text-sm text-muted-foreground">Dailo v{__APP_VERSION__}</p>
        </nav>

        {!isIndex && current && (
          <div className="flex min-h-0 min-w-0 max-w-xl flex-1 flex-col">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  )
}
