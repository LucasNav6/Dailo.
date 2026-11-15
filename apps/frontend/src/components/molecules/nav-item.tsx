import { NavLink } from "react-router"
import type { RemixiconComponentType } from "@remixicon/react"
import { cn } from "@/lib/utils"

type NavItemProps = {
  to: string;
  label: string;
  Icon: RemixiconComponentType;
  ActiveIcon: RemixiconComponentType;
};

/** Destino de la barra inferior: icono dentro de una píldora 56×32 que se marca al estar activo. */
function NavItem({ to, label, Icon, ActiveIcon }: NavItemProps) {
  return (
    <NavLink to={to} className="group flex flex-col items-center gap-1 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "grid h-8 w-14 place-items-center rounded-full border-2 transition-colors",
              isActive ? "border-selected-border bg-selected text-foreground" : "border-transparent bg-transparent text-muted-foreground group-hover:text-foreground"
            )}
          >
            {isActive ? <ActiveIcon className="size-[22px]" aria-hidden /> : <Icon className="size-[22px]" aria-hidden />}
          </span>
          <span className={cn("text-xs", isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export { NavItem }
