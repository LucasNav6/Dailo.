import { useEffect, useState } from "react";
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
import { QuickCapture } from "@/components/quick-capture";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const { pathname } = useLocation();
  const title = allNav.find((item) => pathname.startsWith(item.to))?.label ?? "Dailo";

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(false), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <div className="flex min-h-svh">
      <NavAside collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onNew={() => setCaptureOpen(true)} />
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
              <DropdownMenuContent align="end" sideOffset={8} collisionPadding={16}>
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
      <NavDock onNew={() => setCaptureOpen(true)} />
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} onCaptured={() => setNotice(true)} />
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-4 lg:bottom-6">
        {notice && (
          <p className="rounded-full border bg-popover px-4 py-2 text-sm text-popover-foreground shadow-md">Guardado en Inbox</p>
        )}
      </div>
    </div>
  );
}
