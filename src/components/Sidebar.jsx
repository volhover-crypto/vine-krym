import { NavLink, Link } from 'react-router-dom'
import { DEMO_USER, REGIONS, ALERTS } from '../data/estate'

export default function Sidebar({ region, onRegionChange }) {
  return (
    <aside className="sidebar">
      <Link to="/" className="brand" style={{ padding: '4px 10px' }}>
        <img src="/grape.svg" width={22} alt="" /> ВинКрым
      </Link>

      <label style={{ display: 'block', margin: '14px 8px 10px' }}>
        <span className="small muted">Хозяйство</span>
        <select
          value={region.id}
          onChange={(e) => onRegionChange(REGIONS.find((r) => r.id === Number(e.target.value)))}
          style={{
            width: '100%', marginTop: 6, padding: '8px 10px', borderRadius: 8,
            background: 'hsl(var(--muted))', color: 'inherit',
            border: '1px solid hsl(var(--border))', font: 'inherit', fontSize: 13,
          }}
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <span className="small muted">{region.location}</span>
      </label>

      {[
        { to: '/app', label: 'Дашборд', end: true },
        { to: '/app/weather', label: 'Погода' },
        { to: '/app/blocks', label: 'Блоки' },
        { to: '/app/analytics', label: 'Аналитика' },
        { to: '/app/alerts', label: 'Оповещения', count: ALERTS.length },
      ].map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          {item.label}
          {item.count && <span className="nav-count">{item.count}</span>}
        </NavLink>
      ))}

      <div className="user">
        <div className="avatar">{DEMO_USER.name[0]}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{DEMO_USER.name}</div>
          <div className="small muted">{DEMO_USER.role}</div>
        </div>
      </div>
    </aside>
  )
}
