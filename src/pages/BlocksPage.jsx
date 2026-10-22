import { BLOCKS } from '../data/estate'
import { numRu } from '../lib/format'

export default function BlocksPage() {
  return (
    <div className="page">
      <div>
        <h2 style={{ margin: 0 }}>Блоки виноградников</h2>
        <span className="small muted">Учебные данные · {BLOCKS.length} блоков</span>
      </div>
      <div className="card">
        <div className="row-list">
          {BLOCKS.map((b) => (
            <div className="row" key={b.id}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{b.name}</div>
                <div className="small muted">
                  {b.varietal} · {numRu(b.acres)} га · посадка {b.plantingYear} · подвой {b.rootstock}
                </div>
              </div>
              <div className="healthbar"><i style={{ width: `${b.health}%` }} /></div>
              <b style={{ width: 40, textAlign: 'right' }}>{b.health}%</b>
              <span className={`badge ${b.health >= 90 ? 'badge-green' : 'badge-amber'}`}>
                {b.health >= 90 ? 'здоров' : 'наблюдение'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="card small muted">
        В оригинале блоки хранятся в localStorage (структура «vineyards / blocks») — здесь
        для простоты статический справочник src/data/estate.js.
      </div>
    </div>
  )
}
