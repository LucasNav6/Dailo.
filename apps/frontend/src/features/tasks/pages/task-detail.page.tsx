import { useParams } from "react-router"
import { PageColumn } from "@/shared/components/layouts/page-column"
import { useTaskDetailPage } from "../hooks/task-detail-page.hook"
import { AddSubtaskModal } from "../modals/add-subtask.modal"
import { DeleteSubtaskModal } from "../modals/delete-subtask.modal"
import { DeleteTaskModal } from "../modals/delete-task.modal"
import { MoveToSectionModal } from "../modals/move-to-section.modal"
import { TaskMenuModal } from "../modals/task-menu.modal"
import { TaskDetailView } from "../views/task-detail.view"
import { TaskNotFoundView } from "../views/task-not-found.view"
import { TaskLoadingPage } from "./loading.page"

export function TaskDetailPage() {
  const { id: projectId = "", taskId = "" } = useParams()
  const page = useTaskDetailPage(projectId, taskId)
  const { task } = page

  if (page.isLoading) return <TaskLoadingPage />

  if (page.notFound || !task) {
    return (
      <PageColumn>
        <TaskNotFoundView onBack={page.backToProject} onHome={page.goToday} onProject={page.backToProject} />
      </PageColumn>
    )
  }

  return (
    <PageColumn>
      <TaskDetailView page={page} task={task} />
      <AddSubtaskModal open={page.dialog === "subtask"} onOpenChange={(open) => !open && page.closeDialog()} onSave={page.saveSubtask} />
      <MoveToSectionModal
        key={`${task.id}-${task.sectionId ?? "none"}-${page.dialog === "move"}`}
        open={page.dialog === "move"}
        onOpenChange={(open) => !open && page.closeDialog()}
        taskTitle={task.title}
        sections={page.sections}
        current={page.currentSection?.id}
        projectName={page.project?.name ?? ""}
        onMove={page.move}
        onCreateSection={page.saveSection}
      />
      <TaskMenuModal
        open={page.dialog === "menu"}
        onOpenChange={(open) => !open && page.closeDialog()}
        title={task.title}
        onDelete={() => page.openDialog("delete")}
      />
      <DeleteSubtaskModal
        title={page.subtaskToDelete?.title}
        onClose={() => page.askDeleteSubtask(null)}
        onConfirm={page.confirmDeleteSubtask}
      />
      <DeleteTaskModal
        open={page.dialog === "delete"}
        onOpenChange={(open) => !open && page.closeDialog()}
        title={task.title}
        onConfirm={page.confirmDeleteTask}
      />
    </PageColumn>
  )
}
