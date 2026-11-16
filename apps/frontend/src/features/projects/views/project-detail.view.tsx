import { RiAddLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { CollapseHeader } from "@/shared/components/molecules/collapse-header"
import { DetailBar } from "@/shared/components/molecules/detail-bar"
import { InlineAction } from "@/shared/components/molecules/inline-action"
import { TaskRow } from "@/shared/components/molecules/task-row"
import { shortDay } from "@/shared/libs/dates"
import { cn } from "@/shared/libs/utils"
import type { Project } from "@/shared/models/project.model"
import type { ProjectDetailPageState } from "../hooks/project-detail-page.hook"
import { NO_SECTION } from "../libs/name-rules"
import { ProjectHeadingView } from "./project-heading.view"
import { ProjectSectionsView } from "./project-sections.view"
import { ProjectTaskGroupView } from "./project-task-group.view"
import { NewSectionView } from "./section-actions.view"

type ProjectDetailViewProps = { page: ProjectDetailPageState; project: Project }

export function ProjectDetailView({ page, project }: ProjectDetailViewProps) {
  const { roots, sections, completed, taskDrag, taskDragging, sectionDragging } = page
  return (
    <>
      <DetailBar onBack={page.goProjects} onMore={() => page.setMenu(true)} />
      <ProjectHeadingView done={completed.length} total={roots.length} name={project.name} description={project.description} />

      {roots.length === 0 && sections.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-3">
          <p className="text-base leading-normal text-muted-foreground">Este proyecto todavía no tiene tareas. Añadí la primera para empezar.</p>
          <Button className="[&_svg]:size-5" onClick={() => page.openAdding()}>
            <RiAddLine aria-hidden />
            Añadir tarea
          </Button>
          <NewSectionView onClick={() => page.setSectionSheet("new")} />
        </div>
      ) : (
        <>
          <ul ref={taskDrag.groupRef(NO_SECTION)} className={cn("m-0 flex flex-col p-0", taskDragging && "min-h-3")}>
            <ProjectTaskGroupView page={page} group={NO_SECTION} />
          </ul>
          {sections.length === 0 && (
            <InlineAction icon={<RiAddLine aria-hidden />} onClick={() => page.openAdding()}>Añadir tarea</InlineAction>
          )}
          <ProjectSectionsView page={page} />
          {!sectionDragging && <NewSectionView onClick={() => page.setSectionSheet("new")} />}
          {completed.length > 0 && (
            <>
              <CollapseHeader label={`Completadas · ${completed.length}`} open={page.showDone} onToggle={page.setShowDone} />
              {page.showDone && (
                <ul className="flex flex-col">
                  {completed.map((task) => (
                    <TaskRow
                      key={task.id}
                      onOpen={() => page.openTask(task.id)}
                      id={`task-${task.id}`}
                      title={task.title}
                      checked
                      onCheckedChange={(done) => page.toggleDone(task, done)}
                      className="py-2.5"
                      time={task.completedAt ? shortDay(task.completedAt.slice(0, 10)) : undefined}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
