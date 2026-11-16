import { useLocation } from "react-router"
import { useMediaQuery } from "@/shared/hooks/use-media-query.hook"
import { settingsCategories } from "../libs/settings-menu"

export function useSettingsLayout() {
  const { pathname } = useLocation()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isIndex = pathname.replace(/\/$/, "") === "/settings"
  const current = settingsCategories.find((category) => pathname.startsWith(category.to))
  return {
    isIndex,
    showOutlet: !isIndex && Boolean(current),
    redirectTo: isIndex && isDesktop ? settingsCategories[0].to : null,
  }
}

export function useSettingsIndex() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  return { redirectTo: isDesktop ? settingsCategories[0].to : null }
}
