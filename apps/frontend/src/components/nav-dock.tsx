import { NavLink } from "react-router";
import { primaryNav } from "@/lib/navigation";

export function NavDock() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-sm rounded-dock border border-sidebar-border bg-card p-2 shadow-lg lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {primaryNav.map(({ to, label, Icon, ActiveIcon }) => (
          <li key={to}>
            <NavLink to={to} className="nav-link min-h-16 flex-col justify-center gap-0.5 rounded-xl px-1 text-xs aria-[current=page]:text-primary">
              {({ isActive }) => (
                <>
                  {isActive ? <ActiveIcon className="size-6" aria-hidden /> : <Icon className="size-6" aria-hidden />}
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
