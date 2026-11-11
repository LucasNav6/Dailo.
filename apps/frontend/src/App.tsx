import { Navigate, Route, Routes } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { PagePlaceholder } from "@/components/page-placeholder";
import { allNav } from "@/lib/navigation";

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/today" replace />} />
          {allNav.map(({ to, label }) => (
            <Route key={to} path={to} element={<PagePlaceholder description={`Pantalla de ${label} próximamente.`} />} />
          ))}
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}
