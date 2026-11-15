import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { allNav } from "@/lib/navigation";
import { NavAside } from "@/components/organisms/nav-aside";
import { NavDock } from "@/components/organisms/nav-dock";
import { AppHeader } from "@/components/organisms/app-header";
import { QuickCapture } from "@/components/organisms/quick-capture";
import { Snackbar } from "@/components/molecules/snackbar";

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
    <div className="flex min-h-svh bg-background">
      <NavAside collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onNew={() => setCaptureOpen(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col px-6 pt-6 pb-32 lg:pb-6">
          <AppHeader title={title} />
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
        </div>
      </div>
      <NavDock onNew={() => setCaptureOpen(true)} />
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} onCaptured={() => setNotice(true)} />
      <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-4 lg:bottom-6">
        {notice && <Snackbar message="Guardado en Inbox" />}
      </div>
    </div>
  );
}
