import { Navigate, Outlet } from "react-router"
import { cn } from "@/shared/libs/utils"
import { useSettingsIndex, useSettingsLayout } from "../hooks/settings-layout.hook"
import { SettingsMenuView, SettingsNavView } from "../views/settings-menu.view"

export function SettingsIndexPage() {
  const { redirectTo } = useSettingsIndex()
  return redirectTo ? <Navigate to={redirectTo} replace /> : null
}

export function SettingsPage() {
  const { isIndex, showOutlet, redirectTo } = useSettingsLayout()
  if (redirectTo) return <Navigate to={redirectTo} replace />

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
      <h1 className={cn("mb-6 font-display text-[32px] leading-[1.08] font-semibold tracking-[-0.02em]", !isIndex && "hidden lg:block")}>
        Configuración
      </h1>
      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-10">
        {isIndex && <SettingsMenuView />}
        <SettingsNavView />
        {showOutlet && (
          <div className="flex min-h-0 min-w-0 max-w-xl flex-1 flex-col">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  )
}
