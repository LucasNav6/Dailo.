import type { ProjectDetailPageState } from "../hooks/project-detail-page.hook"
import { DropIndicatorView } from "./drop-indicator.view"
import { ProjectTaskRowView } from "./project-task-row.view"

export function ProjectTaskGroupView({ page, group }: { page: ProjectDetailPageState; group: string }) {
  return (
    <>
      {page.taskLayout(group).map((item, index) =>
        item.kind === "indicator" ? (
          <DropIndicatorView key={`indicator-${index}`} />
        ) : (
          <ProjectTaskRowView key={item.task.id} page={page} task={item.task} group={group} />
        )
      )}
    </>
  )
}
