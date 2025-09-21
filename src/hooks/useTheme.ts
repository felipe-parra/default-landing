import { useThemeStore } from "@/lib/store/themeStore"

export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore()

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  }
}
