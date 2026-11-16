import { useParams } from "react-router"
import { CompleteWithSubtasksModal, DeleteSubtaskModal } from "@/features/tasks"
import { PageColumn } from "@/shared/components/layouts/page-column"
import { useProjectDetailPage } from "../hooks/project-detail-page.hook"
import { AddTaskModal } from "../modals/add-task.modal"
import { DeleteProjectModal } from "../modals/delete-project.modal"
import { DeleteSectionModal } from "../modals/delete-section.modal"
import { ProjectComposeModal } from "../modals/project-compose.modal"
import { ProjectMenuModal } from "../modals/project-menu.modal"
import { SectionComposeModal } from "../modals/section-compose.modal"
import { SectionMenuModal } from "../modals/section-menu.modal"
import { ProjectDetailView } from "../views/project-detail.view"
import { ProjectNotFoundView } from "../views/project-not-found.view"
import { ProjectsLoadingPage } from "./loading.page"

export function ProjectDetailPage() {
  const { id = "" } = useParams()
  const page = useProjectDetailPage(id)
  const { project } = page

  if (page.isLoading) return <ProjectsLoadingPage />

  if (page.projectMissing || !project) {
    return (
      <PageColumn>
        <ProjectNotFoundView onBack={page.goProjects} />
      </PageColumn>
    )
  }

  return (
    <PageColumn>
      <ProjectDetailView page={page} project={project} />
      <AddTaskModal open={page.adding !== false} sectionName={page.addingSection?.name} onClose={page.closeAdding} onSave={page.addTask} />
      <SectionComposeModal sheet={page.sectionSheet} projectName={project.name} onClose={() => page.setSectionSheet(null)} onSave={page.saveSection} />
      <SectionMenuModal
        section={page.sectionMenu}
        pendingCount={page.sectionMenuCount}
        collapsed={page.sectionMenu ? page.isCollapsed(page.sectionMenu.id) : false}
        onClose={() => page.setSectionMenu(null)}
        onRename={page.menuRenameSection}
        onAddTask={page.menuAddTaskToSection}
        onToggle={page.menuToggleSection}
        onDelete={page.menuDeleteSection}
      />
      <DeleteSectionModal
        section={page.sectionDelete}
        taskCount={page.sectionDeleteCount}
        mode={page.deleteMode}
        onModeChange={page.setDeleteMode}
        onClose={() => page.setSectionDelete(null)}
        onConfirm={page.confirmDeleteSection}
      />
      <ProjectComposeModal
        composing={page.editing ? project : null}
        onClose={() => page.setEditing(false)}
        onSave={page.saveProject}
      />
      <ProjectMenuModal
        name={page.menu ? project.name : undefined}
        onClose={() => page.setMenu(false)}
        onEdit={() => { page.setMenu(false); page.setEditing(true) }}
        onAddTask={() => { page.setMenu(false); page.openAdding() }}
        onNewSection={() => { page.setMenu(false); page.setSectionSheet("new") }}
        onDelete={() => { page.setMenu(false); page.setConfirmDelete(true) }}
      />
      <DeleteProjectModal
        name={page.confirmDelete ? project.name : undefined}
        pendingCount={page.pending.length}
        moveToInbox={page.moveToInbox}
        onMoveToInboxChange={page.setMoveToInbox}
        onClose={() => page.setConfirmDelete(false)}
        onConfirm={page.confirmDeleteProject}
      />
      <DeleteSubtaskModal title={page.subtaskToDelete?.title} onClose={() => page.setSubtaskToDelete(null)} onConfirm={page.confirmDeleteSubtask} />
      <CompleteWithSubtasksModal
        title={page.pendingParent?.title}
        pendingCount={page.pendingParentCount}
        onClose={() => page.setPendingParent(null)}
        onComplete={page.completeAll}
      />
    </PageColumn>
  )
}
