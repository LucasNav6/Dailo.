import { useEffect, useRef, useState } from "react";
import { RiArrowRightSLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { InboxItemDetail } from "@/components/inbox-item-detail";

export function InboxPage() {
  const { tasks, isLoading } = useInbox();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Distingue "nunca hubo nada" de "ya procesaste todo" en esta sesión.
  const processedAny = useRef(false);
  // Si el elemento sale de Inbox, el detalle se cierra solo.
  const selected = tasks.find((task) => task.id === selectedId) ?? null;

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  if (isLoading) return <p className="sr-only" role="status">Cargando Inbox…</p>;

  return (
    <>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
          <RiCheckboxCircleLine className="size-10 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold">Todo en orden.</h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            {processedAny.current
              ? "Ya procesaste todo lo que tenías pendiente."
              : "Tu Inbox está vacío. Capturá lo que tengas en mente cuando lo necesites."}
          </p>
        </div>
      ) : (
        <>
          <p className="-mt-2 mb-3 text-sm text-muted-foreground">
            {tasks.length === 1 ? "1 pendiente" : `${tasks.length} pendientes`}
          </p>
          <ul className="flex max-w-2xl flex-col divide-y">
            {tasks.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(task.id)}
                  aria-label={`Procesar: ${task.title}`}
                  className="-mx-2 flex min-h-14 w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 py-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-base whitespace-pre-line">{task.title}</span>
                    {task.description && (
                      <span className="mt-0.5 line-clamp-1 block text-sm text-muted-foreground">{task.description}</span>
                    )}
                  </span>
                  <RiArrowRightSLine className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <InboxItemDetail
        task={selected}
        onClose={() => setSelectedId(null)}
        onProcessed={(message) => {
          processedAny.current = true;
          setNotice(message);
        }}
      />
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-4 lg:bottom-6">
        {notice && <p className="rounded-full border bg-popover px-4 py-2 text-sm text-popover-foreground shadow-md">{notice}</p>}
      </div>
    </>
  );
}
