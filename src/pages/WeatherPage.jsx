import { useState } from 'react'
import { useWeather } from '../hooks/useWeather'
import { describeCode, kmhToMs } from '../lib/openMeteo'
import { fmtTemp, numRu } from '../lib/format'
import WeatherChart from '../components/WeatherChart'

export default function WeatherPage({ region }) {
  const { loading, error, forecast, season } = useWeather(region)
  const [selectedDay, setSelectedDay] = useState(0)

  if (loading) return <div className="page"><div className="card muted">Загружаю погоду…</div></div>
  if (error) return <div className="page"><div className="card">Ошибка: {error}</div></div>

  const cur = forecast.current
  const day = forecast.daily
  const weekPrecip = day.precipitation_sum.reduce((a, b) => a + b, 0)
  const weekHigh = Math.max(...day.temperature_2m_max)
  const et0Week = day.et0_fao_evapotranspiration.reduce((a, b) => a + b, 0)
  const minNext24 = Math.min(...forecast.hourly.temperature_2m.slice(0, 24))
  const frostRisk = minNext24 <= 2 ? 'ВЫСОКИЙ' : minNext24 <= 5 ? 'СРЕДНИЙ' : 'НИЗКИЙ'
  const heatStressDays = day.temperature_2m_max.filter((t) => t >= 33).length

  return (
    <div className="page">
      <div>
        <h2 style={{ margin: 0 }}>Погода</h2>
        <span className="small muted">
          {region.name} · {region.latitude.toFixed(2)}°N {region.longitude.toFixed(2)}°E · источник: Open-Meteo, live
        </span>
      </div>

      <div className="grid grid-4">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ fontSize: 34, fontWeight: 800 }}>{fmtTemp(cur.temperature_2m)}</div>
          <div style={{ fontWeight: 600 }}>{describeCode(cur.weather_code)}</div>
          <div className="small muted">Ощущается как {fmtTemp(cur.apparent_temperature)} · {cur.relative_humidity_2m}% влажность</div>
        </div>
        <div className="card kpi"><span className="label">Ветер</span><span className="value">{kmhToMs(cur.wind_speed_10m)} м/с</span></div>
        <div className="card kpi"><span className="label">Осадки за 7 дней</span><span className="value">{numRu(weekPrecip)} мм</span></div>
        <div className="card kpi"><span className="label">Максимум за 7 дней</span><span className="value">{fmtTemp(weekHigh)}</span></div>
        <div className="card kpi">
          <span className="label">Риск заморозка · 24 ч</span>
          <span className="value" style={{ color: frostRisk === 'НИЗКИЙ' ? undefined : 'hsl(35 92% 65%)' }}>{frostRisk}</span>
          <span className="small muted">минимум ночи {fmtTemp(minNext24)}</span>
        </div>
        <div className="card kpi">
          <span className="label">Тепловой стресс</span>
          <span className="value">{heatStressDays === 0 ? 'НИЗКИЙ' : `${heatStressDays} дн. >33°`}</span>
        </div>
        <div className="card kpi">
          <span className="label">ЭТП₀ за неделю (оценка)</span>
          <span className="value">{numRu(et0Week)} мм</span>
          <span className="small muted">баланс полива: {numRu(Math.max(0, et0Week - weekPrecip))} мм внести</span>
        </div>
      </div>

      <div className="card chart-card">
        <h3>Ближайшие 24 часа</h3>
        <p className="sub">Температура и вероятность осадков</p>
        <WeatherChart hourly={forecast.hourly} />
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 4px', fontSize: 15 }}>Прогноз на 7 дней</h3>
        <p className="small muted" style={{ margin: '0 0 12px' }}>День — для деталей GDD, ЭТП₀ и часов</p>
        <div className="grid grid-4" style={{ gap: 10 }}>
          {day.time.map((d, i) => (
            <button
              key={d}
              className={`day-btn${selectedDay === i ? ' active' : ''}`}
              onClick={() => setSelectedDay(i)}
            >
              <div style={{ fontWeight: 600 }}>
                {i === 0 ? 'Сегодня' : new Date(d).toLocaleDateString('ru-RU', { weekday: 'long' })}
              </div>
              <div className="small muted">{new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</div>
              <div style={{ fontSize: 15, marginTop: 4 }}>
                {fmtTemp(day.temperature_2m_max[i])} / {fmtTemp(day.temperature_2m_min[i])}
              </div>
              <div className="small muted">
                {describeCode(day.weather_code[i])}
                {day.precipitation_probability_max?.[i] > 20 && ` · ${day.precipitation_probability_max[i]}%`}
              </div>
            </button>
          ))}
        </div>
        {selectedDay > 0 && (
          <div className="card" style={{ marginTop: 12, background: 'hsl(var(--muted))' }}>
            <b>
              {new Date(day.time[selectedDay]).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </b>
            <div className="small muted" style={{ marginTop: 6 }}>
              Осадки: {numRu(day.precipitation_sum[selectedDay] ?? 0)} мм · ЭТП₀:{' '}
              {numRu(day.et0_fao_evapotranspiration?.[selectedDay] ?? 0)} мм/день ·{' '}
              {describeCode(day.weather_code[selectedDay])}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Архив погоды сезона</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Сезон с 1 апреля {new Date().getFullYear()} · {numRu(season.totalGdd, 0)} GDD (база 10°C) · осадков за сезон {numRu(season.precip)} мм
        </p>
      </div>
    </div>
  )
}
