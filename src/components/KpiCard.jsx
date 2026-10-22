export default function KpiCard({ label, value, delta, deltaDir, sub }) {
  return (
    <div className="card kpi">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      {delta && (
        <span className={`delta ${deltaDir === 'down' ? 'down' : 'up'}`}>
          {deltaDir === 'down' ? '▼' : '▲'} {delta}
        </span>
      )}
      {sub && <span className="small muted">{sub}</span>}
    </div>
  )
}
