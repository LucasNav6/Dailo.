import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { RiMore2Fill } from "@remixicon/react";
import { allNav, secondaryNav } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavAside } from "@/components/nav-aside";
import { NavDock } from "@/components/nav-dock";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const title = allNav.find((item) => pathname.startsWith(item.to))?.label ?? "Dailo";

  return (
    <div className="flex min-h-svh">
      <NavAside collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between px-4 sm:px-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Más opciones">
                  <RiMore2Fill aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {secondaryNav.map(({ to, label, Icon }) => (
                  <DropdownMenuItem key={to} asChild>
                    <Link to={to}>
                      <Icon aria-hidden />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 px-4 pb-32 sm:px-6 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <NavDock />
    </div>
  );
}
