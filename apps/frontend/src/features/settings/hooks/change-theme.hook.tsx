import { useTheme, type Theme } from "@/lib/theme";

export function useChangeTheme() {
  const { theme, setTheme } = useTheme();
  return { theme, changeTheme: (next: Theme) => setTheme(next) };
}
