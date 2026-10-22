// Комбинированный график на 24 часа: линия температуры + вероятность осадков
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const GREEN = '#3f9d63'

export default function WeatherChart({ hourly }) {
  const now = new Date()
  const data = hourly.time
    .map((t, i) => ({
      time: new Date(t),
      temp: hourly.temperature_2m[i],
      prob: hourly.precipitation_probability?.[i] ?? 0,
    }))
    .filter((d) => d.time >= new Date(now.getTime() - 60 * 60 * 1000))
    .slice(0, 24)
    .map((d) => ({ ...d, label: d.time.toLocaleTimeString('ru-RU', { hour: '2-digit' }) }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="hsl(216 12% 21%)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: 'hsl(214 11% 65%)', fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
        <YAxis yAxisId="t" tick={{ fill: 'hsl(214 11% 65%)', fontSize: 11 }} tickLine={false} axisLine={false} unit="°" />
        <YAxis yAxisId="p" orientation="right" tick={{ fill: 'hsl(214 11% 65%)', fontSize: 11 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            background: 'hsl(216 21% 11%)',
            border: '1px solid hsl(216 12% 21%)',
            borderRadius: 8,
            fontSize: 13,
          }}
          labelFormatter={(l) => `${l}:00`}
          formatter={(value, name) =>
            name === 'Температура' ? [`${Math.round(value)}°C`, name] : [`${value}%`, 'Вероятность осадков']
          }
        />
        <Area yAxisId="p" type="monotone" dataKey="prob" name="Осадки" stroke="none" fill="hsl(213 80% 60% / .18)" />
        <Line yAxisId="t" type="monotone" dataKey="temp" name="Температура" stroke={GREEN} strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
