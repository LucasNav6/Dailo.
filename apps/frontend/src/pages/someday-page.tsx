import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useSomeday } from "@/hooks/use-someday";
import { PageHeader } from "@/components/page-header";
import { TaskCircle } from "@/components/task-circle";
import { TriageSheet } from "@/components/triage-sheet";
import { EmptyState } from "@/components/wrappers/empty-state";
import { LoadingView } from "@/components/wrappers/loading-view";

const ago = (iso: string) => {
  const text = formatDistanceToNow(new Date(iso), { locale: es, addSuffix: true });
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function SomedayPage() {
  const { tasks, isLoading } = useSomeday();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tasks.find((task) => task.id === selectedId) ?? null;

  if (isLoading) return <LoadingView label="Cargando Tal vez…" />;

  return (
    <>
      <PageHeader eyebrow={`Tal vez · ${tasks.length === 1 ? "1 idea" : `${tasks.length} ideas`}`} title="Para" em="después." />
      <p className="mb-4 text-[15px] leading-normal text-muted-foreground">Lo que tiene sentido pero no es para ahora. Revisalo una vez por semana.</p>

      {tasks.length === 0 ? (
        <EmptyState title="Sin ideas" em="guardadas." description="Desde el Inbox, mové acá lo que no aporta ahora." />
      ) : (
        <ul className="flex flex-col">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => setSelectedId(task.id)}
                aria-label={`Revisar: ${task.title}`}
                className="flex min-h-11 w-full items-start gap-4 rounded-lg py-2.5 pl-1.5 text-left outline-none hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <TaskCircle />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[17px] leading-snug whitespace-pre-line">{task.title}</span>
                  {task.description && <span className="text-sm leading-snug text-muted-foreground">{task.description}</span>}
                  <span className="text-[13px] text-muted-foreground">{ago(task.updatedAt)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <TriageSheet task={selected} source="someday" onClose={() => setSelectedId(null)} />
    </>
  );
}
