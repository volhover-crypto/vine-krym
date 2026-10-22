// Кривые накопления GDD: текущий сезон против многолетнего среднего
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

const GREEN = '#3f9d63'
const GRAY = '#8b95a8'

const MONTHS = ['апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя']

export default function GddChart({ curve, average, target }) {
  // Выравниваем обе кривые по дню сезона (MM-DD), чтобы наложить друг на друга
  const byDay = new Map(average.map((p) => [p.date, p.gdd]))
  const data = curve.map((p) => ({
    day: p.date.slice(5),
    season: p.gdd,
    avg: byDay.get(p.date.slice(5)) ?? null,
  }))

  const fmtDay = (mmdd) => {
    const [m, d] = mmdd.split('-').map(Number)
    return d === 1 || d === 15 ? MONTHS[Math.max(0, m - 3)] ?? `${d}.${m}` : ''
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="hsl(216 12% 21%)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tickFormatter={fmtDay} tick={{ fill: 'hsl(214 11% 65%)', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: 'hsl(214 11% 65%)', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: 'hsl(216 21% 11%)',
            border: '1px solid hsl(216 12% 21%)',
            borderRadius: 8,
            fontSize: 13,
          }}
          labelFormatter={(l) => l.split('-').reverse().join('.')}
          formatter={(v, name) => [Math.round(v), name === 'season' ? 'Этот сезон' : 'Среднее 10 лет']}
        />
        {target && <ReferenceLine y={target} stroke="hsl(35 92% 55% / .7)" strokeDasharray="6 4" label={{ value: `цель ${target}`, fill: 'hsl(35 92% 65%)', fontSize: 11, position: 'insideTopRight' }} />}
        <Area type="monotone" dataKey="avg" stroke={GRAY} strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
        <Area type="monotone" dataKey="season" stroke={GREEN} fill="hsl(147 39% 39% / .16)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
