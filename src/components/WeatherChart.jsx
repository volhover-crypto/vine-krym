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
import { useTheme, chartPalette } from '../hooks/useTheme'

export default function WeatherChart({ hourly }) {
  const { theme } = useTheme()
  const c = chartPalette(theme)
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
        <CartesianGrid stroke={c.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: c.tick, fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
        <YAxis yAxisId="t" tick={{ fill: c.tick, fontSize: 11 }} tickLine={false} axisLine={false} unit="°" />
        <YAxis yAxisId="p" orientation="right" tick={{ fill: c.tick, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            background: c.tooltipBg,
            border: `1px solid ${c.tooltipBorder}`,
            borderRadius: 8,
            fontSize: 13,
            color: c.tooltipText,
          }}
          labelFormatter={(l) => `${l}:00`}
          formatter={(value, name) =>
            name === 'Температура' ? [`${Math.round(value)}°C`, name] : [`${value}%`, 'Вероятность осадков']
          }
        />
        <Area
          yAxisId="p"
          type="monotone"
          dataKey="prob"
          name="Осадки"
          stroke="hsl(213 80% 52%)"
          strokeWidth={1.5}
          fill="hsl(213 80% 55% / .22)"
        />
        <Line yAxisId="t" type="monotone" dataKey="temp" name="Температура" stroke="#3f9d63" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
