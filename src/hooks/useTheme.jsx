// Тема оформления: тёмная по умолчанию (как у оригинала), светлая — по кнопке.
// Выбор сохраняется в localStorage; при первом входе уважается системная тема.

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} })
const STORAGE_KEY = 'vinekrym_theme'

function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* localStorage недоступен — просто системная тема */
  }
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* игнорируем — тема всё равно работает в рамках сессии */
    }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

// Цвета для SVG-графиков Recharts (атрибуты SVG не понимают CSS-переменные)
export const chartPalette = (theme) =>
  theme === 'light'
    ? { tick: '#5a6472', grid: '#d8dee8', tooltipBg: '#ffffff', tooltipBorder: '#d8dee8', tooltipText: '#1b2430' }
    : { tick: '#8b95a8', grid: 'hsl(216 12% 21%)', tooltipBg: 'hsl(216 21% 11%)', tooltipBorder: 'hsl(216 12% 21%)', tooltipText: '#e8ecf4' }
