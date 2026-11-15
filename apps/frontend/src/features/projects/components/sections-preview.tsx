import { DragHandle } from "@/components/atoms/drag-handle";
import { DetailBar } from "@/components/molecules/detail-bar";
import { TaskRow } from "@/components/molecules/task-row";
import { cn } from "@/lib/utils";
import { DATED_ROW, DRAGGED_ROW, PROJECT_ROW } from "../lib/drag-styles";
import { DropIndicator } from "./drop-indicator";
import { ProjectHeading } from "./project-heading";
import { TaskDates, type TaskDatesProps } from "./task-dates";
import { ProjectSectionHeader } from "./project-section-header";
import { EmptySectionNote, NewSection, SectionAddTask } from "./section-actions";

export type PreviewItem =
  | { kind: "task"; title: string; dim?: boolean; dragging?: boolean; dates?: TaskDatesProps }
  | { kind: "header"; name: string; count: number; open: boolean; dim?: boolean; dragging?: boolean }
  | { kind: "indicator" }
  | { kind: "add" }
  | { kind: "new" }
  | { kind: "note" };

export function SectionsPreview({ items }: { items: PreviewItem[] }) {
  return (
    <>
      <DetailBar />
      <ProjectHeading done={3} total={8} name="Rediseño del sitio" description="" />
      {items.map((item, index) => {
        switch (item.kind) {
          case "task":
            return (
              <ul key={index} className="m-0 p-0">
                <TaskRow
                  title={item.title}
                  subtitle={item.dates ? <TaskDates {...item.dates} /> : undefined}
                  className={cn(item.dates ? DATED_ROW : PROJECT_ROW, item.dragging && DRAGGED_ROW, item.dim && "opacity-55")}
                  handle={<DragHandle aria-label={`Reordenar ${item.title}`} active={item.dragging} />}
                />
              </ul>
            );
          case "header":
            return <ProjectSectionHeader key={index} name={item.name} count={item.count} open={item.open} dragging={item.dragging} dimmed={item.dim} handle={<DragHandle aria-label={`Reordenar sección ${item.name}`} active={item.dragging} />} />;
          case "indicator":
            return (
              <ul key={index} className="m-0 p-0">
                <DropIndicator />
              </ul>
            );
          case "add":
            return <SectionAddTask key={index} />;
          case "new":
            return <NewSection key={index} />;
          case "note":
            return <EmptySectionNote key={index} />;
        }
      })}
    </>
  );
}

const task = (title: string, extra?: { dim?: boolean; dragging?: boolean; dates?: TaskDatesProps }): PreviewItem => ({ kind: "task", title, ...extra });
const header = (name: string, count: number, open: boolean, extra?: { dim?: boolean; dragging?: boolean }): PreviewItem => ({ kind: "header", name, count, open, ...extra });

export const SCOPE = { task, header };

export const DATES = {
  today: { planned: "Hoy · 10:00" },
  tomorrow: { planned: "Mañana", deadline: { label: "Límite vie 20", urgent: false } },
  overdue: { planned: "Lun 16", deadline: { label: "Venció el jue 12", urgent: true } },
  wed: { planned: "Mié 18" },
  far: { deadline: { label: "Límite 30 nov", urgent: false } },
} satisfies Record<string, TaskDatesProps>;
