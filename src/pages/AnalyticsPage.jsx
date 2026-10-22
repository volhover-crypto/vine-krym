import { useWeather } from '../hooks/useWeather'
import { numRu } from '../lib/format'
import { GDD_TARGET } from '../lib/gdd'
import { REGIONS } from '../data/estate'
import GddChart from '../components/GddChart'

// Сравнение накопления GDD по всем демо-хозяйствам: единая кривая выбранного
// хозяйства + сводка (полные кривые всех регионов не грузим, чтобы не мильштрёмить API)
export default function AnalyticsPage({ region }) {
  const { loading, error, season } = useWeather(region)

  if (loading) return <div className="page"><div className="card muted">Считаю аналитику…</div></div>
  if (error) return <div className="page"><div className="card">Ошибка: {error}</div></div>

  const progressPct = Math.round(season.progress * 100)
  const avgAtSeasonEnd = season.average.at(-1)?.gdd ?? 0
  const vsAvg = avgAtSeasonEnd > 0 ? Math.round((season.totalGdd / avgAtSeasonEnd - 1) * 100) : 0

  return (
    <div className="page">
      <div>
        <h2 style={{ margin: 0 }}>Аналитика</h2>
        <span className="small muted">{region.name} · {region.location}</span>
      </div>

      <div className="grid grid-4">
        <div className="card kpi">
          <span className="label">GDD сезона (база 10°C)</span>
          <span className="value">{numRu(season.totalGdd, 0)}</span>
          <span className={`delta ${vsAvg >= 0 ? 'up' : 'down'}`}>{vsAvg >= 0 ? '▲' : '▼'} {Math.abs(vsAvg)}% к среднему 10 лет</span>
        </div>
        <div className="card kpi">
          <span className="label">Прогресс к цели {GDD_TARGET}</span>
          <span className="value">{progressPct}%</span>
          <div className="healthbar" style={{ width: '100%', marginTop: 8 }}><i style={{ width: `${progressPct}%` }} /></div>
        </div>
        <div className="card kpi">
          <span className="label">Осадки за сезон</span>
          <span className="value">{numRu(season.precip)} мм</span>
        </div>
        <div className="card kpi">
          <span className="label">Дней в сезоне</span>
          <span className="value">{season.curve.length}</span>
          <span className="small muted">с 1 апреля по последний день архива</span>
        </div>
      </div>

      <div className="card chart-card">
        <h3>Накопление GDD — сезон vs среднее 10 лет</h3>
        <p className="sub">Архив Open-Meteo 2016–{new Date().getFullYear()}, сглаженное среднее по годам</p>
        <div className="legend">
          <span><i style={{ background: '#3f9d63' }} />Этот сезон</span>
          <span><i style={{ background: '#8b95a8' }} />Среднее 10 лет</span>
        </div>
        <GddChart curve={season.curve} average={season.average} target={GDD_TARGET} />
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Методика (что именно считается)</h3>
        <ul className="small muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>GDD за день = max(0, (Tмакс + Tмин)/2 − 10°C), накопление с 1 апреля — живой архив Open-Meteo.</li>
          <li>«Среднее 10 лет» — нарастающие итоги каждого из прошлых 10 сезонов, усреднённые по дню года.</li>
          <li>Прогноз сбора — линейная экстраполяция темпа последних 30 дней до цели {GDD_TARGET} °C·дн, разброс ±20%.</li>
          <li>ЭТП₀ (испаряемость) берётся напрямую из Open-Meteo, поле et0_fao_evapotranspiration.</li>
          <li>Демо-хозяйств в наборе: {REGIONS.length} — переключаются в сайдбаре, кривая пересчитывается.</li>
        </ul>
      </div>
    </div>
  )
}
