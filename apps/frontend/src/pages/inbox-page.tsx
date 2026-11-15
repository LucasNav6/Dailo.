import { useState } from "react";
import { RiInboxArchiveLine } from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { LoadingLayout } from "@/components/layouts/loading-layout";
import { EmptyState } from "@/components/molecules/empty-state";
import { InboxItemDetail } from "@/components/organisms/inbox-item-detail";

export function InboxPage() {
  const { tasks, isLoading } = useInbox();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Si el elemento sale de Inbox, el detalle se cierra solo.
  const selected = tasks.find((task) => task.id === selectedId) ?? null;

  if (isLoading) return <LoadingLayout label="Cargando Inbox" rows={3} />;

  return (
    <>
      {tasks.length === 0 ? (
        <EmptyState
          icon={<RiInboxArchiveLine aria-hidden />}
          title={
            <>
              Tu Inbox <em className="font-medium italic">está vacío.</em>
            </>
          }
          description="Lo que captures con + aparece acá para procesarlo después."
        />
      ) : (
        <ul className="flex max-w-2xl flex-col divide-y divide-border overflow-hidden rounded-2xl border-2 border-border bg-surface">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => setSelectedId(task.id)}
                className="w-full px-4 py-3 text-left text-[17px] leading-snug outline-none hover:bg-selected focus-visible:bg-selected focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
              >
                <span className="line-clamp-2 whitespace-pre-line">{task.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <InboxItemDetail task={selected} onClose={() => setSelectedId(null)} />
    </>
  );
}
