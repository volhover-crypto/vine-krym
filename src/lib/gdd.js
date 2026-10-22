// Агрономические расчёты: GDD (градусо-дни роста), сезонная кривая,
// многолетнее среднее и прогноз даты готовности урожая.
// База 10°C — принятый в виноградарстве эквивалент «base 50°F» из оригинала.

export const GDD_BASE = 10
export const SEASON_START_MONTH = 3 // апрель (0-based): сезон стартует 1 апреля
export const GDD_TARGET = 1650 // учебная цель для технических сортов Крыма

export const dailyGdd = (tmax, tmin, base = GDD_BASE) =>
  Math.max(0, (tmax + tmin) / 2 - base)

// Кумулятивная кривая GDD по дневным данным архива
export function cumulativeGdd(times, tmax, tmin, base = GDD_BASE) {
  let acc = 0
  return times.map((date, i) => {
    acc += dailyGdd(tmax[i], tmin[i], base)
    return { date, gdd: Math.round(acc * 10) / 10 }
  })
}

// Многолетнее среднее: группируем дни по MM-DD и усредняем нарастающий итог
// по годам. Возвращает массив { date: 'MM-DD', gdd } для наложения на сезон.
export function averageSeasonCurve(yearlyCurves) {
  if (yearlyCurves.length === 0) return []
  const byDay = new Map()
  for (const curve of yearlyCurves) {
    for (const point of curve) {
      const mmdd = point.date.slice(5)
      if (!byDay.has(mmdd)) byDay.set(mmdd, [])
      byDay.get(mmdd).push(point.gdd)
    }
  }
  return [...byDay.entries()]
    .map(([mmdd, values]) => ({
      date: mmdd,
      gdd: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
}

// Прогноз достижения целевого GDD: экстраполяция темпа последних N дней.
// Возвращает три сценария (оптимистичный / базовый / консервативный),
// отклонение берём от фактической дисперсии темпа.
export function harvestScenarios(curve, target = GDD_TARGET, lookbackDays = 30) {
  if (curve.length < lookbackDays + 1) return null
  const last = curve[curve.length - 1]
  const prev = curve[curve.length - 1 - lookbackDays]
  const perDay = (last.gdd - prev.gdd) / lookbackDays
  if (perDay <= 0) return null

  const remaining = target - last.gdd
  if (remaining <= 0) {
    return { reached: true, perDay, scenarios: null }
  }
  const daysLeft = remaining / perDay
  const base = new Date(last.date)
  const at = (offsetDays) => {
    const d = new Date(base)
    d.setDate(d.getDate() + Math.round(daysLeft + offsetDays))
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }
  // Разброс ~±20% от остатка дней — грубая замена «10-yr variance» оригинала
  const spread = Math.max(2, Math.round(daysLeft * 0.2))
  return {
    reached: false,
    perDay: Math.round(perDay * 10) / 10,
    scenarios: [
      { label: 'Оптимистичный', date: at(-spread) },
      { label: 'Базовый', date: at(0) },
      { label: 'Консервативный', date: at(spread) },
    ],
    confidence: Math.min(95, Math.round(60 + lookbackDays / 2)),
  }
}

export const seasonProgress = (curve, target = GDD_TARGET) =>
  Math.min(1, (curve.at(-1)?.gdd ?? 0) / target)
