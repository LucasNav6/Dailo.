import { DragHandle } from "@/shared/components/atoms/drag-handle"
import type { ProjectDetailPageState } from "../hooks/project-detail-page.hook"
import { DropIndicatorView } from "./drop-indicator.view"
import { ProjectSectionHeaderView } from "./project-section-header.view"
import { ProjectTaskGroupView } from "./project-task-group.view"
import { EmptySectionNoteView, SectionAddTaskView } from "./section-actions.view"

export function ProjectSectionsView({ page }: { page: ProjectDetailPageState }) {
  const { sectionDrag, taskDrag, sectionDragging, taskDragging } = page
  return (
    <div>
      {page.sectionLayout().map((item) => {
        if (item.kind === "indicator") {
          return (
            <ul key={item.key} className="m-0 p-0">
              <DropIndicatorView />
            </ul>
          )
        }
        const { section } = item
        const dragged = sectionDrag.drag?.id === section.id
        const count = page.countInGroup(section.id)
        const open = !page.isCollapsed(section.id) && !sectionDragging
        const bindRef = (element: HTMLElement | null) => {
          sectionDrag.rowRef(section.id, "sections")(element)
          taskDrag.groupRef(section.id)(element)
        }
        return (
          <div
            key={section.id}
            ref={bindRef}
            style={dragged ? { transform: `translateY(${sectionDrag.drag?.offset ?? 0}px)`, position: "relative", zIndex: 20 } : undefined}
          >
            <ProjectSectionHeaderView
              name={section.name}
              count={count}
              open={!page.isCollapsed(section.id)}
              dragging={dragged}
              dimmed={(sectionDragging && !dragged) || taskDragging}
              onToggle={() => page.toggleCollapsed(section.id)}
              onMore={() => page.setSectionMenu(section)}
              handle={
                <DragHandle
                  aria-label={`Reordenar sección ${section.name}`}
                  active={dragged}
                  onPointerDown={(event) => sectionDrag.start(section.id, "sections", event)}
                  onKeyDown={(event) => page.nudgeSection(section, event)}
                />
              }
            />
            {open && (
              <>
                {count === 0 && taskDrag.target?.group !== section.id ? (
                  <EmptySectionNoteView />
                ) : (
                  <ul className="m-0 flex flex-col p-0">
                    <ProjectTaskGroupView page={page} group={section.id} />
                  </ul>
                )}
                <SectionAddTaskView onClick={() => page.openAdding(section.id)} />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
