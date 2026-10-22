import { useState } from 'react'
import { ALERTS } from '../data/estate'

export default function AlertsPage() {
  const [acknowledged, setAcknowledged] = useState([])
  const active = ALERTS.filter((a) => !acknowledged.includes(a.id))

  const ack = (id) => setAcknowledged((s) => [...s, id])

  return (
    <div className="page">
      <div>
        <h2 style={{ margin: 0 }}>Оповещения</h2>
        <span className="small muted">Активных: {active.length} из {ALERTS.length}</span>
      </div>
      {active.length === 0 && <div className="card muted">Все оповещения подтверждены. Хороший день в винограднике.</div>}
      {active.map((a) => (
        <div className="card" key={a.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <b>{a.title}</b>
              <span className={`badge badge-${a.severity}`}>{a.severity === 'red' ? 'Критично' : 'Внимание'}</span>
            </div>
            <p className="small muted" style={{ margin: '6px 0 0' }}>{a.detail}</p>
            <span className="small muted">{a.time}</span>
          </div>
          <button className="btn btn-ghost" onClick={() => ack(a.id)}>Подтвердить</button>
        </div>
      ))}
    </div>
  )
}
