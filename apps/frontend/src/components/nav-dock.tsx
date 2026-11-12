import { NavLink } from "react-router";
import { RiAddLine } from "@remixicon/react";
import { primaryNav, type NavItem } from "@/lib/navigation";

function DockLink({ to, label, Icon, ActiveIcon }: NavItem) {
  return (
    <li>
      <NavLink to={to} className="nav-link min-h-16 flex-col justify-center gap-0.5 rounded-xl px-1 text-xs aria-[current=page]:text-primary">
        {({ isActive }) => (
          <>
            {isActive ? <ActiveIcon className="size-6" aria-hidden /> : <Icon className="size-6" aria-hidden />}
            {label}
          </>
        )}
      </NavLink>
    </li>
  );
}

/** Cuatro destinos y, al centro, la acción Nuevo (no es ruta ni pestaña). */
export function NavDock({ onNew }: { onNew: () => void }) {
  const [start, end] = [primaryNav.slice(0, 2), primaryNav.slice(2)];
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-sm rounded-dock border border-sidebar-border bg-card p-2 shadow-lg lg:hidden"
    >
      <ul className="grid grid-cols-5 items-center">
        {start.map((item) => <DockLink key={item.to} {...item} />)}
        <li className="flex justify-center">
          <button
            type="button"
            onClick={onNew}
            aria-label="Nuevo"
            className="-mt-8 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background outline-none transition-transform focus-visible:ring-ring active:scale-95"
          >
            <RiAddLine className="size-7" aria-hidden />
          </button>
        </li>
        {end.map((item) => <DockLink key={item.to} {...item} />)}
      </ul>
    </nav>
  );
}
