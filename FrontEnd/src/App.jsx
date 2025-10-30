import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [themeMode, setThemeMode] = useState("light")

  const lightTheme = () => setThemeMode("light")
  const darkTheme = () => setThemeMode("dark")

  useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])
  
  return (
    <ThemeProvider value={{themeMode, lightTheme, darkTheme}}>
      <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Outlet />
      </div>
    </ThemeProvider>
  )
}

export default App