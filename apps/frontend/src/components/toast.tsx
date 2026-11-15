import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Toast = { id: number; message: string; actionLabel?: string; onAction?: () => void };
type Notify = (toast: Omit<Toast, "id">) => void;

const ToastContext = createContext<Notify | null>(null);

/** Aviso discreto con acción opcional (por ejemplo, Deshacer). */
export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast requiere ToastProvider");
  return notify;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback<Notify>((next) => {
    clearTimeout(timer.current);
    setToast({ ...next, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-28 z-[70] flex justify-center px-6 lg:bottom-6">
        {toast && (
          <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-lg bg-foreground px-4 py-3.5 text-sm text-background">
            <span>{toast.message}</span>
            {toast.actionLabel && (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  setToast(null);
                }}
                className="shrink-0 rounded-sm font-semibold underline decoration-brand decoration-2 underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
              >
                {toast.actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
