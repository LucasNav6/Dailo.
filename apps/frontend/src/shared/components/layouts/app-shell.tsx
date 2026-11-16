import { useState, type ComponentType } from "react";
import { Outlet } from "react-router";
import { NavAside } from "@/shared/components/organisms/nav-aside";
import { NavDock } from "@/shared/components/organisms/nav-dock";
import { useNotify } from "@/shared/hooks/toast.hook";

export type AppOutletContext = { openCapture: () => void };

export type CaptureComponent = ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void; onCaptured: () => void }>;

export function AppShell({ capture: Capture }: { capture: CaptureComponent }) {
  const [collapsed, setCollapsed] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const notify = useNotify();
  const openCapture = () => setCaptureOpen(true);

  return (
    <div className="flex h-svh bg-background">
      <NavAside collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onNew={openCapture} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col p-6">
            <Outlet context={{ openCapture } satisfies AppOutletContext} />
          </div>
        </main>
        <NavDock onNew={openCapture} />
      </div>
      <Capture open={captureOpen} onOpenChange={setCaptureOpen} onCaptured={() => notify("Guardado en Inbox")} />
    </div>
  );
}
