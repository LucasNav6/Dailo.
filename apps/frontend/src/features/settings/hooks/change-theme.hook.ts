import { useTheme, type Theme } from "@/shared/libs/theme"

export function useChangeTheme() {
  const { theme, setTheme } = useTheme()
  return { theme, changeTheme: (next: Theme) => setTheme(next) }
}
