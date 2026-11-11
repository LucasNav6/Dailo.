import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { primaryNav } from "@/lib/navigation";

export function NavDock() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-2xl border border-border bg-card p-1 shadow-lg lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {primaryNav.map(({ to, label, Icon, ActiveIcon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex min-h-14 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <ActiveIcon className="size-6" aria-hidden /> : <Icon className="size-6" aria-hidden />}
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
