import { NavLink } from "react-router";
import { RiAddLine, RiLayoutLeftLine, RiLayoutRightLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav, type NavItem } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function AsideLink({ to, label, Icon, ActiveIcon, collapsed }: NavItem & { collapsed: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink to={to} aria-label={collapsed ? label : undefined} className={cn("nav-link", collapsed && "justify-center")}>
          {({ isActive }) => (
            <>
              {isActive ? <ActiveIcon className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
              {!collapsed && label}
            </>
          )}
        </NavLink>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
}

function AsideList({ items, collapsed, className }: { items: NavItem[]; collapsed: boolean; className?: string }) {
  return (
    <ul className={cn("space-y-0.5", className)}>
      {items.map((item) => (
        <li key={item.to}>
          <AsideLink {...item} collapsed={collapsed} />
        </li>
      ))}
    </ul>
  );
}

export function NavAside({ collapsed, onToggle, onNew }: { collapsed: boolean; onToggle: () => void; onNew: () => void }) {
  const ToggleIcon = collapsed ? RiLayoutRightLine : RiLayoutLeftLine;
  const toggleLabel = collapsed ? "Expandir menú" : "Contraer menú";
  return (
    <aside className={cn("hidden shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] lg:flex", collapsed ? "w-18" : "w-64")}>
      <div className={cn("flex h-16 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && <span className="font-serif text-xl font-semibold tracking-tight">Dailo</span>}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onToggle} aria-expanded={!collapsed} aria-label={toggleLabel}>
              <ToggleIcon aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={collapsed ? "right" : "bottom"}>{toggleLabel}</TooltipContent>
        </Tooltip>
      </div>
      <nav aria-label="Navegación principal" className="flex flex-1 flex-col justify-between p-3">
        <div className="space-y-3">
          <Button onClick={onNew} aria-label={collapsed ? "Nuevo" : undefined} className={cn("w-full", collapsed && "px-0")}>
            <RiAddLine aria-hidden />
            {!collapsed && "Nuevo"}
          </Button>
          <AsideList items={primaryNav} collapsed={collapsed} />
        </div>
        <AsideList items={secondaryNav} collapsed={collapsed} className="border-t border-sidebar-border pt-3" />
      </nav>
    </aside>
  );
}
