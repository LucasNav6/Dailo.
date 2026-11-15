import { useOutletContext } from "react-router";
import { RiAddLine, RiLightbulbFill } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { EmptyState } from "@/components/molecules/empty-state";
import type { AppOutletContext } from "@/components/layouts/app-shell";
import { PageColumn } from "@/components/layouts/page-column";
import { IdeaList } from "@/features/someday/components/idea-list";
import { SomedayHeader } from "@/features/someday/components/someday-header";
import { SomedayLoadingView } from "@/features/someday/views/loading.view";
import { useTasks } from "@/hooks/use-tasks";
import { formatAge } from "@/lib/age";
import { toISODate } from "@/lib/dates";

/** Tal vez real: ideas guardadas que se planifican (pasan a Hoy) o se descartan. */
export function SomedayPage() {
  const { tasks, isLoading, updateTask } = useTasks("someday");
  const { openCapture } = useOutletContext<AppOutletContext>();
  if (isLoading) return <PageColumn><SomedayLoadingView /></PageColumn>;

  const ideas = [...tasks]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((task) => ({ id: task.id, title: task.title, note: task.description ?? "", age: formatAge(task.createdAt) }));

  return (
    <PageColumn>
      <SomedayHeader eyebrow={`Tal vez · ${ideas.length === 1 ? "1 idea" : ideas.length === 0 ? "0" : `${ideas.length} ideas`}`} />
      {ideas.length === 0 ? (
        <EmptyState
          icon={<RiLightbulbFill aria-hidden />}
          title={<>Sin ideas <Emphasis>por ahora.</Emphasis></>}
          description="Lo que no querés hacer ahora, pero tampoco olvidar, va acá."
          descriptionClassName="max-w-[310px]"
          action={<Button className="[&_svg]:size-5" onClick={openCapture}><RiAddLine aria-hidden />Anotar una idea</Button>}
        />
      ) : (
        <IdeaList
          ideas={ideas}
          onPlan={(id) => void updateTask(id, { status: "active", plannedDate: toISODate(new Date()) })}
          onDiscard={(id) => void updateTask(id, { status: "discarded" })}
        />
      )}
    </PageColumn>
  );
}
