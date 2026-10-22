import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { DEFAULT_REGION } from './data/estate'
import { ThemeProvider } from './hooks/useTheme'
import Sidebar from './components/Sidebar'
import ThemeToggle from './components/ThemeToggle'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import WeatherPage from './pages/WeatherPage'
import BlocksPage from './pages/BlocksPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AlertsPage from './pages/AlertsPage'

const TITLES = {
  '/app': 'Дашборд',
  '/app/weather': 'Погода',
  '/app/blocks': 'Блоки',
  '/app/analytics': 'Аналитика',
  '/app/alerts': 'Оповещения',
}

function AppShell() {
  const [region, setRegion] = useState(DEFAULT_REGION)
  const { pathname } = useLocation()

  return (
    <div className="app">
      <Sidebar region={region} onRegionChange={setRegion} />
      <div>
        <div className="topbar">
          <h1>{TITLES[pathname] ?? 'ВинКрым'}</h1>
          <button className="search-btn">Поиск блоков, отчётов, оповещений… ⌘K</button>
          <ThemeToggle />
          <Link to="/" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }}>
            Выйти
          </Link>
        </div>
        <Routes>
          <Route index element={<Dashboard region={region} />} />
          <Route path="weather" element={<WeatherPage region={region} />} />
          <Route path="blocks" element={<BlocksPage />} />
          <Route path="analytics" element={<AnalyticsPage region={region} />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/*" element={<AppShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
