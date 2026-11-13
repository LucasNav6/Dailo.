import { useState } from "react";
import { useOutletContext } from "react-router";
import { RiAddLine } from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { PageHeader } from "@/components/page-header";
import { TaskCircle } from "@/components/task-circle";
import { Button } from "@/components/ui/button";
import type { ShellContext } from "@/lib/shell-context";
import { TriageSheet } from "@/components/triage-sheet";
import { EmptyState } from "@/components/wrappers/empty-state";
import { LoadingView } from "@/components/wrappers/loading-view";

export function InboxPage() {
  const { tasks, isLoading } = useInbox();
  const { openCapture } = useOutletContext<ShellContext>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Si el elemento sale de Inbox, el triage se cierra solo.
  const selected = tasks.find((task) => task.id === selectedId) ?? null;

  if (isLoading) return <LoadingView label="Cargando Inbox…" />;

  return (
    <>
      <PageHeader eyebrow={`Inbox · ${tasks.length === 1 ? "1 pendiente" : `${tasks.length} pendientes`}`} title="Vaciá tu" em="mente." />


      {tasks.length === 0 ? (
        <EmptyState
          title="Inbox en"
          em="cero."
          description="Vaciaste tu mente. Mañana empezás liviano."
          action={
            <Button type="button" onClick={openCapture}>
              <RiAddLine aria-hidden />
              Capturar algo
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => setSelectedId(task.id)}
                aria-label={`Procesar: ${task.title}`}
                className="flex min-h-11 w-full items-start gap-4 rounded-lg py-2.5 pl-1.5 text-left text-[17px] leading-snug outline-none hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <TaskCircle />
                <span className="min-w-0 flex-1 whitespace-pre-line">{task.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <TriageSheet task={selected} source="inbox" onClose={() => setSelectedId(null)} />
    </>
  );
}
