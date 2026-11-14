import { useTrash } from "@/hooks/use-trash";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/wrappers/empty-state";
import { LoadingView } from "@/components/wrappers/loading-view";

export function TrashPage() {
  const { tasks, isLoading, restore } = useTrash();
  const notify = useToast();

  if (isLoading) return <LoadingView label="Cargando descartados…" />;

  const restoreTask = async (id: string, title: string) => {
    try {
      await restore(id, "inbox");
      notify({ message: `Devuelta al Inbox: ${title}` });
    } catch {
      notify({ message: "No se pudo restaurar. Probá de nuevo." });
    }
  };

  return (
    <>
      <PageHeader eyebrow={`Descartados · ${tasks.length}`} title="Lo que" em="soltaste." />
      {tasks.length === 0 ? (
        <EmptyState title="Nada" em="descartado." description="Lo que descartes se guarda acá por si querés recuperarlo." />
      ) : (
        <ul className="flex flex-col divide-y">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 py-2.5">
              <span className="min-w-0 flex-1 text-[17px] leading-snug text-muted-foreground line-through whitespace-pre-line">{task.title}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => void restoreTask(task.id, task.title)}>
                Restaurar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
