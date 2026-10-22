import { Link } from 'react-router-dom'
import { useWeather } from '../hooks/useWeather'
import { describeCode, kmhToMs } from '../lib/openMeteo'
import { fmtTemp, numRu, fmtTime } from '../lib/format'
import { GDD_TARGET } from '../lib/gdd'
import { BLOCKS, ALERTS, ACTIVITY, DEMO_USER } from '../data/estate'
import KpiCard from '../components/KpiCard'
import WeatherChart from '../components/WeatherChart'
import GddChart from '../components/GddChart'

export default function Dashboard({ region }) {
  const { loading, error, forecast, season, syncedAt } = useWeather(region)

  if (loading) return <div className="page"><div className="card muted">Загружаю живые данные Open-Meteo…</div></div>
  if (error) return <div className="page"><div className="card">Не удалось получить погоду: {error}</div></div>

  const cur = forecast.current
  const day = forecast.daily
  const todayIdx = 0
  const healthAvg = Math.round(BLOCKS.reduce((a, b) => a + b.health, 0) / BLOCKS.length)
  const yieldPerHa = 4.2 // учебная модель прогноза урожая, т/га

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ margin: 0 }}>
            Доброе утро, {DEMO_USER.name}
          </h2>
          <span className="small muted">
            {region.name} · {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
            {syncedAt && ` · синхронизация ${fmtTime(syncedAt.toISOString())}`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost">Записать наблюдение</button>
          <button className="btn btn-primary">Создать отчёт</button>
        </div>
      </div>

      <div className="grid grid-4">
        <KpiCard
          label="Температура сейчас"
          value={fmtTemp(cur.temperature_2m)}
          sub={`${describeCode(cur.weather_code)} · ветер ${kmhToMs(cur.wind_speed_10m)} м/с · ощущается ${fmtTemp(cur.apparent_temperature)}`}
        />
        <KpiCard
          label="GDD сезона (база 10°C)"
          value={numRu(season.totalGdd, 0)}
          sub={`цель ${GDD_TARGET} — ${Math.round(season.progress * 100)}% · накоплено с 1 апреля, живой архив`}
        />
        <KpiCard label="Здоровье лоз" value={`${healthAvg}%`} delta="1,6%" sub="индекс по блокам NDVI" />
        <KpiCard label="Прогноз урожая" value={`${numRu(yieldPerHa)} т/га`} sub="точность ±8%" />
      </div>

      <div className="grid grid-2">
        <div className="card chart-card">
          <h3>Погода — {region.name}</h3>
          <p className="sub">Ближайшие 24 часа · температура и вероятность осадков</p>
          <div className="legend">
            <span><i style={{ background: '#3f9d63' }} />Температура</span>
            <span><i style={{ background: 'hsl(213 80% 60% / .4)' }} />Вероятность осадков</span>
          </div>
          <WeatherChart hourly={forecast.hourly} />
          <div className="row-list" style={{ marginTop: 10 }}>
            {day.time.slice(0, 7).map((d, i) => (
              <Link key={d} to="/app/weather" className="row" style={{ padding: '8px 4px' }}>
                <span style={{ width: 90 }}>
                  {i === 0 ? 'Сегодня' : new Date(d).toLocaleDateString('ru-RU', { weekday: 'short' })}
                </span>
                <span style={{ fontWeight: 600 }}>{fmtTemp(day.temperature_2m_max[i])} / {fmtTemp(day.temperature_2m_min[i])}</span>
                <span className="small muted" style={{ marginLeft: 'auto' }}>{describeCode(day.weather_code[i])}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card chart-card">
            <h3>Прогресс GDD сезона</h3>
            <p className="sub">Накопление с 1 апреля · цель {GDD_TARGET} °C·дн · сравнение со средним за 10 лет</p>
            <div className="legend">
              <span><i style={{ background: '#3f9d63' }} />Этот сезон</span>
              <span><i style={{ background: '#8b95a8' }} />Среднее 10 лет</span>
            </div>
            <GddChart curve={season.curve} average={season.average} target={GDD_TARGET} />
          </div>

          <div className="card">
            <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Прогноз готовности к сбору</h3>
            {season.scenarios?.reached ? (
              <p className="muted" style={{ margin: 0 }}>Целевой GDD достигнут — окно сбора открыто.</p>
            ) : season.scenarios ? (
              <>
                <div className="row-list">
                  {season.scenarios.scenarios.map((s) => (
                    <div className="row" key={s.label} style={{ padding: '8px 0' }}>
                      <span className="small muted" style={{ width: 130 }}>{s.label}</span>
                      <b>{s.date}</b>
                    </div>
                  ))}
                </div>
                <div className="small muted" style={{ marginTop: 8 }}>
                  Уверенность {season.scenarios.confidence}% · темп {season.scenarios.perDay} °C·дн/день
                </div>
              </>
            ) : (
              <p className="muted" style={{ margin: 0 }}>Недостаточно данных сезона для прогноза.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>Активные оповещения</h3>
            <Link to="/app/alerts" className="small" style={{ color: 'hsl(147 60% 62%)' }}>Все →</Link>
          </div>
          <div className="row-list" style={{ marginTop: 6 }}>
            {ALERTS.map((a) => (
              <div className="row" key={a.id} style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                  <div className="small muted">{a.time}</div>
                </div>
                <span className={`badge badge-${a.severity}`}>{a.severity === 'red' ? 'Критично' : 'Внимание'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15 }}>Здоровье блоков</h3>
            <Link to="/app/blocks" className="small" style={{ color: 'hsl(147 60% 62%)' }}>Управлять →</Link>
          </div>
          <div className="row-list" style={{ marginTop: 6 }}>
            {BLOCKS.map((b) => (
              <div className="row" key={b.id}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                  <div className="small muted">{b.varietal} · {numRu(b.acres)} га · {b.plantingYear} г.</div>
                </div>
                <div className="healthbar"><i style={{ width: `${b.health}%` }} /></div>
                <b style={{ width: 36, textAlign: 'right' }}>{b.health}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Последняя активность</h3>
        <div className="row-list">
          {ACTIVITY.map((a) => (
            <div className="row" key={a.id}>
              <span style={{ flex: 1 }}>{a.text}</span>
              <span className="small muted">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
