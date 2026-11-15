import { Navigate, Route, Routes } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/toast";
import { AppShell } from "@/components/app-shell";
import { InboxPage } from "@/pages/inbox-page";
import { SomedayPage } from "@/pages/someday-page";
import { TodayPage } from "@/pages/today-page";
import { TrashPage } from "@/pages/trash-page";
import { ProjectDetailPage } from "@/pages/project-detail-page";
import { ProjectsPage } from "@/pages/projects-page";
import { NotificationsPage } from "@/pages/settings/notifications-page";
import { PreferencesPage } from "@/pages/settings/preferences-page";
import { SecurityPage } from "@/pages/settings/security-page";
import { SettingsIndex, SettingsLayout } from "@/pages/settings/settings-layout";

export default function App() {
  return (
    <TooltipProvider>
      <ToastProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<SettingsIndex />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="security" element={<SecurityPage />} />
          </Route>
          <Route path="today" element={<TodayPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="someday" element={<SomedayPage />} />
          <Route path="trash" element={<TrashPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Route>
      </Routes>
      </ToastProvider>
    </TooltipProvider>
  );
}
