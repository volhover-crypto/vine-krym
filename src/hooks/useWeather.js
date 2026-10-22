// Загрузка живых данных Open-Meteo для выбранного хозяйства + расчёт GDD.
// Один архивный запрос 2016..сегодня закрывает и текущий сезон, и среднее.

import { useEffect, useState } from 'react'
import { fetchForecast, fetchArchive } from '../lib/openMeteo'
import { cumulativeGdd, averageSeasonCurve, harvestScenarios, seasonProgress, GDD_TARGET } from '../lib/gdd'

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

export function useWeather(region) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    forecast: null,
    season: null, // { curve, average, totalGdd, precip, scenarios, progress }
    syncedAt: null,
  })

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))

    const today = new Date()
    const archiveEnd = new Date(today)
    archiveEnd.setDate(archiveEnd.getDate() - 5) // у архива задержка ~5 дней
    const bigBack = new Date(today)
    bigBack.setFullYear(bigBack.getFullYear() - 10)

    Promise.all([
      fetchForecast(region.latitude, region.longitude),
      fetchArchive(region.latitude, region.longitude, isoDate(bigBack), isoDate(archiveEnd)),
    ])
      .then(([forecast, archive]) => {
        if (cancelled) return
        const times = archive.daily.time
        const curvesByYear = new Map()
        for (let i = 0; i < times.length; i++) {
          const year = times[i].slice(0, 4)
          if (!curvesByYear.has(year)) curvesByYear.set(year, { time: [], tmax: [], tmin: [] })
          const bucket = curvesByYear.get(year)
          bucket.time.push(times[i])
          bucket.tmax.push(archive.daily.temperature_2m_max[i])
          bucket.tmin.push(archive.daily.temperature_2m_min[i])
        }

        const currentYear = String(today.getFullYear())
        const curve = cumulativeGdd(
          curvesByYear.get(currentYear)?.time ?? [],
          curvesByYear.get(currentYear)?.tmax ?? [],
          curvesByYear.get(currentYear)?.tmin ?? [],
        )
        // Кумулятивные кривые прошлых лет — для среднего (берём те же месяцы сезона)
        const pastCurves = [...curvesByYear.entries()]
          .filter(([year]) => year !== currentYear)
          .map(([, b]) => cumulativeGdd(b.time, b.tmax, b.tmin))

        let precip = 0
        for (let i = 0; i < times.length; i++) {
          if (times[i].startsWith(currentYear)) {
            precip += archive.daily.precipitation_sum[i] ?? 0
          }
        }

        const season = {
          curve,
          average: averageSeasonCurve(pastCurves),
          totalGdd: curve.at(-1)?.gdd ?? 0,
          precip: Math.round(precip * 10) / 10,
          scenarios: harvestScenarios(curve, GDD_TARGET),
          progress: seasonProgress(curve, GDD_TARGET),
        }
        setState({
          loading: false,
          error: null,
          forecast,
          season,
          syncedAt: new Date(),
        })
      })
      .catch((err) => {
        if (cancelled) return
        setState((s) => ({ ...s, loading: false, error: String(err) }))
      })

    return () => {
      cancelled = true
    }
  }, [region.id])

  return state
}
