import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Carrega o último tema salvo
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true // começa escuro
  })

  // Atualiza o Bootstrap e salva preferência
  useEffect(() => {
    const body = document.body
    if (darkMode) {
      body.classList.add('bg-dark', 'text-light')
      body.classList.remove('bg-light', 'text-dark')
    } else {
      body.classList.add('bg-light', 'text-dark')
      body.classList.remove('bg-dark', 'text-light')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
