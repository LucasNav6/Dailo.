import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { allNav } from "@/lib/navigation";
import { NavAside } from "@/components/nav-aside";
import { NavDock } from "@/components/nav-dock";
import { QuickCapture } from "@/components/quick-capture";
import { useToast } from "@/components/toast";
import type { ShellContext } from "@/lib/shell-context";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const notify = useToast();
  const { pathname } = useLocation();
  // Configuración no tiene encabezado propio: usa el título de su sección.
  const settingsTitle = pathname.startsWith("/settings") ? allNav.find((item) => item.to === "/settings")?.label : undefined;

  return (
    <div className="flex min-h-svh">
      <NavAside collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onNew={() => setCaptureOpen(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        {settingsTitle && (
          <header className="flex h-16 items-center px-6">
            <h1 className="font-serif text-2xl font-semibold tracking-tight">{settingsTitle}</h1>
          </header>
        )}
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 pt-6 pb-32 lg:pb-10">
          <Outlet context={{ openCapture: () => setCaptureOpen(true) } satisfies ShellContext} />
        </main>
      </div>
      <NavDock onNew={() => setCaptureOpen(true)} />
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} onCaptured={() => notify({ message: "Guardado en Inbox" })} />
    </div>
  );
}
