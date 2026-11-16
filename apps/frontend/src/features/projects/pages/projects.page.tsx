import { PageColumn } from "@/shared/components/layouts/page-column"
import { useProjectsPage } from "../hooks/projects-page.hook"
import { DeleteProjectModal } from "../modals/delete-project.modal"
import { ProjectComposeModal } from "../modals/project-compose.modal"
import { ProjectMenuModal } from "../modals/project-menu.modal"
import { ProjectListView } from "../views/project-list.view"
import { ProjectsEmptyView } from "../views/projects-empty.view"
import { ProjectsHeaderView } from "../views/projects-header.view"
import { ProjectsErrorPage } from "./error.page"
import { ProjectsLoadingPage } from "./loading.page"

export function ProjectsPage() {
  const page = useProjectsPage()

  if (page.hasError) return <ProjectsErrorPage onRetry={page.reload} />
  if (page.isLoading) return <ProjectsLoadingPage />

  return (
    <PageColumn>
      <ProjectsHeaderView count={page.projects.length} />
      {page.projects.length === 0 ? (
        <ProjectsEmptyView onCreate={page.startCreate} />
      ) : (
        <ProjectListView
          projects={page.summaries}
          highlighted={page.highlighted}
          onCreate={page.startCreate}
          onOpen={page.openProject}
          onMore={page.openMenu}
        />
      )}
      <ProjectComposeModal composing={page.composing} onClose={page.closeCompose} onSave={page.save} />
      <ProjectMenuModal
        name={page.menu?.name}
        onClose={page.closeMenu}
        onEdit={page.editMenuProject}
        onAddTask={page.addTaskToMenuProject}
        onDelete={page.askDelete}
      />
      <DeleteProjectModal
        name={page.deleting?.name}
        pendingCount={page.pendingOfDeleting}
        moveToInbox={page.moveToInbox}
        onMoveToInboxChange={page.setMoveToInbox}
        onClose={page.cancelDelete}
        onConfirm={page.confirmDelete}
      />
    </PageColumn>
  )
}
