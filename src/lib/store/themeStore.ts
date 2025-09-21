import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme: Theme) => {
        set({ theme })
        document.documentElement.classList.toggle("dark", theme === "dark")
      },
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === "light" ? "dark" : "light"
        get().setTheme(newTheme)
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => state => {
        if (state) {
          document.documentElement.classList.toggle(
            "dark",
            state.theme === "dark"
          )
        }
      },
    }
  )
)
