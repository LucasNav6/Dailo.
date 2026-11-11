import { NavLink } from "react-router";
import { RiLayoutLeftLine, RiLayoutRightLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav, type NavItem } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

function AsideLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const { to, label, Icon, ActiveIcon } = item;
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring motion-reduce:transition-none",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? <ActiveIcon className="size-5 shrink-0" aria-hidden /> : <Icon className="size-5 shrink-0" aria-hidden />}
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
}

export function NavAside({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const ToggleIcon = collapsed ? RiLayoutRightLine : RiLayoutLeftLine;
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 motion-reduce:transition-none lg:flex",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && <span className="text-xl font-semibold">Dailo</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
        >
          <ToggleIcon aria-hidden />
        </Button>
      </div>
      <nav aria-label="Navegación principal" className="flex flex-1 flex-col justify-between p-3">
        <ul className="space-y-1">
          {primaryNav.map((item) => (
            <li key={item.to}>
              <AsideLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
        <ul className="space-y-1 border-t border-sidebar-border pt-3">
          {secondaryNav.map((item) => (
            <li key={item.to}>
              <AsideLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
