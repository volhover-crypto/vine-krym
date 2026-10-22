import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      className="btn btn-ghost"
      onClick={toggle}
      title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      style={{ padding: '7px 12px' }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
