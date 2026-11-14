import { NavLink } from "react-router";
import { RiAddLine } from "@remixicon/react";
import { primaryNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function DockLink({ to, label, Icon, ActiveIcon }: NavItem) {
  return (
    <li>
      <NavLink to={to} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        {({ isActive }) => (
          <>
            <span className={cn("grid h-8 w-14 place-items-center rounded-full border-2 border-transparent text-muted-foreground transition-colors", isActive && "border-sidebar-border bg-secondary text-foreground")}>
              {isActive ? <ActiveIcon className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
            </span>
            <span className={cn("text-xs", isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}

/** Cuatro destinos y, al centro, la acción Nueva tarea (captura rápida; no es ruta). */
export function NavDock({ onNew }: { onNew: () => void }) {
  const [start, end] = [primaryNav.slice(0, 2), primaryNav.slice(2)];
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-card px-2 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <ul className="grid grid-cols-5 items-center">
        {start.map((item) => <DockLink key={item.to} {...item} />)}
        <li className="flex justify-center">
          <button
            type="button"
            onClick={onNew}
            aria-label="Nueva tarea"
            className="flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground outline-none transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <RiAddLine className="size-7" aria-hidden />
          </button>
        </li>
        {end.map((item) => <DockLink key={item.to} {...item} />)}
      </ul>
    </nav>
  );
}
