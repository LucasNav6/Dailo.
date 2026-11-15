import { useState } from "react";
import { useOutletContext } from "react-router";
import { useInbox } from "@/hooks/use-inbox";
import { formatAge } from "@/lib/age";
import type { AppOutletContext } from "@/components/layouts/app-shell";
import { PageColumn } from "@/components/layouts/page-column";
import { EmptyInbox } from "@/features/inbox/components/empty-inbox";
import { InboxHeader } from "@/features/inbox/components/inbox-header";
import { InboxItemDetail } from "@/features/inbox/components/inbox-item-detail";
import { InboxList } from "@/features/inbox/components/inbox-list";
import { InboxLoadingView } from "@/features/inbox/views/loading.view";

/** Inbox real: las mismas piezas que las vistas del diseño, alimentadas por IndexedDB. */
export function InboxPage() {
  const { tasks, isLoading } = useInbox();
  const { openCapture } = useOutletContext<AppOutletContext>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Si el elemento sale de Inbox, el detalle se cierra solo.
  const selected = tasks.find((task) => task.id === selectedId) ?? null;

  if (isLoading) return <PageColumn><InboxLoadingView /></PageColumn>;

  return (
    <PageColumn>
      <InboxHeader count={tasks.length} />
      {tasks.length === 0 ? (
        <EmptyInbox onCapture={openCapture} />
      ) : (
        <InboxList
          entries={tasks.map((task) => ({ id: task.id, title: task.title, age: formatAge(task.createdAt) }))}
          onOpen={(index) => setSelectedId(tasks[index].id)}
          onProcess={() => setSelectedId(tasks[0].id)}
        />
      )}
      <InboxItemDetail task={selected} onClose={() => setSelectedId(null)} />
    </PageColumn>
  );
}
