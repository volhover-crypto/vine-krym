// Форматирование под русскую локаль

export const fmtDate = (d, opts = {}) =>
  new Date(d).toLocaleDateString('ru-RU', opts)

export const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

export const fmtTemp = (c) => `${Math.round(c)}°`

export const numRu = (n, digits = 1) =>
  n.toLocaleString('ru-RU', { maximumFractionDigits: digits })

export const WEEKDAYS_RU = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
