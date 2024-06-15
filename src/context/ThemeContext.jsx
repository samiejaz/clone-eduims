import { createContext, useContext, useEffect, useState } from "react"

export const ThemeContext = createContext()

export const ThemeProivder = ({ children }) => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeProvider() {
  const { theme, setTheme } = useContext(ThemeContext)

  return {
    theme,
    setTheme,
  }
}
