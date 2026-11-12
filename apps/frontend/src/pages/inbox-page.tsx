import { useState } from "react";
import { RiInboxArchiveLine } from "@remixicon/react";
import { useInbox } from "@/hooks/use-inbox";
import { InboxItemDetail } from "@/components/inbox-item-detail";

export function InboxPage() {
  const { tasks, isLoading } = useInbox();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Si el elemento sale de Inbox, el detalle se cierra solo.
  const selected = tasks.find((task) => task.id === selectedId) ?? null;

  if (isLoading) return null;

  return (
    <>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <RiInboxArchiveLine className="size-8" aria-hidden />
          <p className="font-medium text-foreground">Tu Inbox está vacío</p>
          <p className="text-sm">Lo que captures con + aparece acá para procesarlo después.</p>
        </div>
      ) : (
        <ul className="flex max-w-2xl flex-col divide-y rounded-xl border">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => setSelectedId(task.id)}
                className="w-full px-4 py-3 text-left text-sm outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
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
