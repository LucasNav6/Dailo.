import { useState, type FormEvent } from "react";
import { RiAddLine } from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { TaskCircle } from "@/components/task-circle";
import { TriageSheet } from "@/components/triage-sheet";
import { ErrorView } from "@/components/wrappers/error-view";
import { EmptyState } from "@/components/wrappers/empty-state";
import { LoadingView } from "@/components/wrappers/loading-view";

export function InboxPage() {
  const { tasks, isLoading, capture } = useInbox();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [failed, setFailed] = useState(false);
  // Si el elemento sale de Inbox, el triage se cierra solo.
  const selected = tasks.find((task) => task.id === selectedId) ?? null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      await capture(text);
      setText("");
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };

  if (isLoading) return <LoadingView label="Cargando Inbox…" />;

  return (
    <>
      <PageHeader eyebrow={`Inbox · ${tasks.length === 1 ? "1 pendiente" : `${tasks.length} pendientes`}`} title="Vaciá tu" em="mente." />

      <form onSubmit={submit} className="relative mb-6">
        <RiAddLine className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFailed(false);
          }}
          aria-label="Capturar una tarea"
          aria-invalid={failed}
          placeholder="Capturá lo que tengas en la cabeza"
          enterKeyHint="done"
          className="h-[52px] pl-11"
        />
        <ErrorView message={failed ? "No se pudo guardar. Tu texto sigue acá, probá de nuevo." : null} className="mt-2" />
      </form>

      {tasks.length === 0 ? (
        <EmptyState title="Inbox en" em="cero." description="Vaciaste tu mente. Mañana empezás liviano." />
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
