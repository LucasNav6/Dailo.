import { Navigate, Route, Routes } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { PagePlaceholder } from "@/components/page-placeholder";
import { allNav } from "@/lib/navigation";
import { NotificationsPage } from "@/pages/settings/notifications-page";
import { PreferencesPage } from "@/pages/settings/preferences-page";
import { SecurityPage } from "@/pages/settings/security-page";
import { SettingsIndex, SettingsLayout } from "@/pages/settings/settings-layout";

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<SettingsIndex />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="security" element={<SecurityPage />} />
          </Route>
          {allNav.filter(({ to }) => to !== "/settings").map(({ to, label }) => (
            <Route key={to} path={to} element={<PagePlaceholder description={`Pantalla de ${label} próximamente.`} />} />
          ))}
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}
