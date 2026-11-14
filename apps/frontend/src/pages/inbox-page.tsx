import { useState } from "react";
import { useOutletContext } from "react-router";
import { useInbox } from "@/hooks/use-inbox";
import { useToast } from "@/components/toast";
import { PageHeader } from "@/components/page-header";
import { InboxRow } from "@/components/inbox-row";
import { TriageSheet, type TriageIntent } from "@/components/triage-sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/wrappers/empty-state";
import { LoadingView } from "@/components/wrappers/loading-view";
import { RiAddLine } from "@remixicon/react";
import type { ShellContext } from "@/lib/shell-context";

type Target = { id: string; intent?: TriageIntent };

export function InboxPage() {
  const { tasks, isLoading, toggle, discard, restore } = useInbox();
  const { openCapture } = useOutletContext<ShellContext>();
  const notify = useToast();
  const [target, setTarget] = useState<Target | null>(null);
  // Si el elemento deja de estar pendiente, el triage se cierra solo.
  const selected = tasks.find((task) => task.id === target?.id && task.status === "inbox") ?? null;
  const pending = tasks.filter((task) => task.status === "inbox").length;

  if (isLoading) return <LoadingView label="Cargando Inbox…" />;

  const act = async (action: () => Promise<unknown>, message: string, undo?: () => Promise<unknown>) => {
    try {
      await action();
      notify({ message, actionLabel: undo ? "Deshacer" : undefined, onAction: () => void undo?.() });
    } catch {
      notify({ message: "No se pudo guardar. Probá de nuevo." });
    }
  };

  return (
    <>
      <PageHeader eyebrow={`Inbox · ${pending === 1 ? "1 pendiente" : `${pending} pendientes`}`} title="Vaciá tu" em="mente." />

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
            <InboxRow
              key={task.id}
              task={task}
              onOpen={() => setTarget({ id: task.id })}
              onToggle={() =>
                void act(() => toggle(task.id), `Tachada: ${task.title}`, () => toggle(task.id))
              }
              onPlan={() => setTarget({ id: task.id, intent: "plan" })}
              onSomeday={() => setTarget({ id: task.id, intent: "someday" })}
              onDiscard={() => void act(() => discard(task.id), `Descartada: ${task.title}`, () => restore(task.id, "inbox"))}
            />
          ))}
        </ul>
      )}

      <TriageSheet task={selected} source="inbox" intent={target?.intent} onClose={() => setTarget(null)} />
    </>
  );
}
