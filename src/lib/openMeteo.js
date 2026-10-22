// Клиент Open-Meteo: прогноз и архив. Вся «серверная» часть оригинала —
// эти два GET-запроса, остальное считается на клиенте.
// Единицы метрические: °C, мм, км/ч (ветер переводим в м/с на месте).

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive'

export async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration',
    timezone: 'auto',
    forecast_days: '7',
  })
  const res = await fetch(`${FORECAST_URL}?${params}`)
  if (!res.ok) throw new Error(`Open-Meteo forecast: ${res.status}`)
  return res.json()
}

// Архив: один длинный запрос закрывает и текущий сезон, и многолетнее среднее.
export async function fetchArchive(lat, lon, startDate, endDate) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'auto',
  })
  const res = await fetch(`${ARCHIVE_URL}?${params}`)
  if (!res.ok) throw new Error(`Open-Meteo archive: ${res.status}`)
  return res.json()
}

// WMO weather codes -> русские описания (Open-Meteo Documentation, таблица кодов)
export const WMO_RU = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Переменная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Изморозь',
  51: 'Слабая морось',
  53: 'Морось',
  55: 'Сильная морось',
  61: 'Слабый дождь',
  63: 'Дождь',
  65: 'Сильный дождь',
  66: 'Ледяной дождь',
  67: 'Сильный ледяной дождь',
  71: 'Слабый снег',
  73: 'Снег',
  75: 'Сильный снег',
  77: 'Снежные зёрна',
  80: 'Слабый ливень',
  81: 'Ливень',
  82: 'Сильный ливень',
  85: 'Снежные ливни',
  86: 'Сильные снежные ливни',
  95: 'Гроза',
  96: 'Гроза с градом',
  99: 'Сильная гроза с градом',
}

export const describeCode = (code) => WMO_RU[code] ?? '—'

export const kmhToMs = (kmh) => Math.round((kmh / 3.6) * 10) / 10
