import { useEffect, useState, type ComponentType } from "react";
import { Outlet } from "react-router";
import { NavAside } from "@/components/organisms/nav-aside";
import { NavDock } from "@/components/organisms/nav-dock";
import { Snackbar } from "@/components/molecules/snackbar";

/** Contexto que el shell ofrece a las pantallas (p. ej. para abrir la captura desde un estado vacío). */
export type AppOutletContext = { openCapture: () => void };

/**
 * Estructura de la app: columna con el contenido desplazable y la barra inferior de 88px en flujo
 * (móvil), o aside + contenido (escritorio). Cada pantalla pinta su propia cabecera.
 */
/** Hoja de captura que el shell abre desde "Nuevo"; la aporta la feature de Inbox. */
export type CaptureComponent = ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void; onCaptured: () => void }>;

export function AppShell({ capture: Capture }: { capture: CaptureComponent }) {
  const [collapsed, setCollapsed] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const openCapture = () => setCaptureOpen(true);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(false), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

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
      <Capture open={captureOpen} onOpenChange={setCaptureOpen} onCaptured={() => setNotice(true)} />
      <div className="pointer-events-none fixed inset-x-4 bottom-[100px] z-[60] lg:bottom-6 lg:left-auto lg:right-6 lg:inset-x-auto">
        {notice && <Snackbar message="Guardado en Inbox" />}
      </div>
    </div>
  );
}
