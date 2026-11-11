import { NavLink } from "react-router";
import { RiLayoutLeftLine, RiLayoutRightLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav, type NavItem } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

function AsideLink({ to, label, Icon, ActiveIcon, collapsed }: NavItem & { collapsed: boolean }) {
  return (
    <NavLink to={to} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} className={cn("nav-link", collapsed && "justify-center")}>
      {({ isActive }) => (
        <>
          {isActive ? <ActiveIcon className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
          {!collapsed && label}
        </>
      )}
    </NavLink>
  );
}

function AsideList({ items, collapsed, className }: { items: NavItem[]; collapsed: boolean; className?: string }) {
  return (
    <ul className={cn("space-y-1", className)}>
      {items.map((item) => (
        <li key={item.to}>
          <AsideLink {...item} collapsed={collapsed} />
        </li>
      ))}
    </ul>
  );
}

export function NavAside({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const ToggleIcon = collapsed ? RiLayoutRightLine : RiLayoutLeftLine;
  return (
    <aside className={cn("hidden shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] lg:flex", collapsed ? "w-18" : "w-64")}>
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
        <AsideList items={primaryNav} collapsed={collapsed} />
        <AsideList items={secondaryNav} collapsed={collapsed} className="border-t border-sidebar-border pt-3" />
      </nav>
    </aside>
  );
}
