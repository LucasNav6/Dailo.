import { NavLink } from "react-router"
import { NavCard } from "@/shared/components/molecules/nav-card"
import { settingsGroups } from "../libs/settings-menu"

export function SettingsMenuView() {
  return (
    <div className="flex flex-col gap-6 lg:hidden">
      {settingsGroups.map((group) => (
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
  )
}

export function SettingsNavView() {
  return (
    <nav aria-label="Configuración" className="hidden space-y-6 lg:block">
      {settingsGroups.map((group) => (
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
  )
}
