import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [themeMode, setThemeMode] = useState("dark")

  const lightTheme = () => setThemeMode("light")
  const darkTheme = () => setThemeMode("dark")

  useEffect(() => {
    // Set the theme class on the root HTML element
    const htmlElement = document.querySelector('html')
    if (htmlElement) {
      htmlElement.classList.remove("light", "dark")
      htmlElement.classList.add(themeMode)
    }
  }, [themeMode])
  
  return (
    <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
      <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Outlet />
      </div>
    </ThemeProvider>
  )
}

export default App