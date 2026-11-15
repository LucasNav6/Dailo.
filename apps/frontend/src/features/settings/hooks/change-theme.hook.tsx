import { useTheme, type Theme } from "@/lib/theme";

/** Tema actual y acción para cambiarlo. */
export function useChangeTheme() {
  const { theme, setTheme } = useTheme();
  return { theme, changeTheme: (next: Theme) => setTheme(next) };
}
