import { useEffect, useState } from 'react'
import './App.css'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import Footer from './components/Footer'

function App() {
  const [themeMode, setThemeMode] = useState("light")

  const lightTheme = () => {
    setThemeMode("light")
  }

  const darkTheme = () => {
    setThemeMode("dark")
  }

  useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])
  
  return (
    <ThemeProvider value={{themeMode, lightTheme, darkTheme}}>
      <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <Header />
        <main className="grow">
          <HeroSection />
          <StatsSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App