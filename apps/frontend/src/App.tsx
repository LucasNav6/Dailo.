import { Navigate, Route, Routes } from "react-router"
import { TooltipProvider } from "@/shared/components/atoms/tooltip"
import { AppShell } from "@/shared/components/layouts/app-shell"
import { PagePlaceholder } from "@/shared/components/layouts/page-placeholder"
import { Toaster } from "@/shared/components/organisms/toaster"
import { useToast } from "@/shared/hooks/toast.hook"
import { allNav } from "@/shared/libs/navigation"
import { AgendaPage } from "@/features/agenda/pages/agenda.page"
import { InboxPage } from "@/features/inbox/pages/inbox.page"
import { QuickCaptureModal } from "@/features/inbox/modals/quick-capture.modal"
import { MaybePage } from "@/features/maybe/pages/maybe.page"
import { ProjectDetailPage } from "@/features/projects/pages/project-detail.page"
import { ProjectsPage } from "@/features/projects/pages/projects.page"
import { NotificationsPage } from "@/features/settings/pages/notifications.page"
import { PreferencesPage } from "@/features/settings/pages/preferences.page"
import { SecurityPage } from "@/features/settings/pages/security.page"
import { SettingsIndexPage, SettingsPage } from "@/features/settings/pages/settings.page"
import { TaskDetailPage } from "@/features/tasks/pages/task-detail.page"

const IMPLEMENTED = ["/settings", "/inbox", "/someday", "/today", "/projects"]

function AppToaster() {
  const { toast, dismiss } = useToast()
  return (
    <Toaster
      message={toast?.message}
      actionLabel={toast?.actionLabel}
      onAction={() => {
        toast?.onAction?.()
        dismiss()
      }}
    />
  )
}

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route element={<AppShell capture={QuickCaptureModal} />}>
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="settings" element={<SettingsPage />}>
            <Route index element={<SettingsIndexPage />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="security" element={<SecurityPage />} />
          </Route>
          <Route path="inbox" element={<InboxPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="projects/:id/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="today" element={<AgendaPage />} />
          <Route path="someday" element={<MaybePage />} />
          {allNav
            .filter(({ to }) => !IMPLEMENTED.includes(to))
            .map(({ to, label }) => (
              <Route key={to} path={to} element={<PagePlaceholder title={label} description={`Pantalla de ${label} próximamente.`} />} />
            ))}
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Route>
      </Routes>
      <AppToaster />
    </TooltipProvider>
  )
}
