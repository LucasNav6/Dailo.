import { Navigate, Route, Routes } from "react-router";
import { TooltipProvider } from "@/components/atoms/tooltip";
import { AppShell } from "@/components/layouts/app-shell";
import { QuickCapture } from "@/features/inbox/components/quick-capture";
import { PagePlaceholder } from "@/components/layouts/page-placeholder";
import { allNav } from "@/lib/navigation";
import { InboxPage } from "@/pages/inbox-page";
import { MockupsPage } from "@/pages/mockups-page";
import { NotificationsPage } from "@/pages/settings/notifications-page";
import { PreferencesPage } from "@/pages/settings/preferences-page";
import { ProjectDetailPage } from "@/pages/projects/project-detail-page";
import { ProjectsPage } from "@/pages/projects/projects-page";
import { TaskDetailPage } from "@/pages/projects/task-detail-page";
import { TodayPage } from "@/pages/today-page";
import { SomedayPage } from "@/pages/someday-page";
import { SecurityPage } from "@/pages/settings/security-page";
import { SettingsIndex, SettingsLayout } from "@/pages/settings/settings-layout";

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="mockups" element={<MockupsPage />} />
        <Route element={<AppShell capture={QuickCapture} />}>
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<SettingsIndex />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="security" element={<SecurityPage />} />
          </Route>
          <Route path="inbox" element={<InboxPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="projects/:id/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="someday" element={<SomedayPage />} />
          {allNav.filter(({ to }) => to !== "/settings" && to !== "/inbox" && to !== "/someday" && to !== "/today" && to !== "/projects").map(({ to, label }) => (
            <Route key={to} path={to} element={<PagePlaceholder title={label} description={`Pantalla de ${label} próximamente.`} />} />
          ))}
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}
