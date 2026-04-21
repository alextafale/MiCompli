export default function DashboardStats({ ordenes }: { ordenes: any[] }) {
  const activas    = ordenes.filter(o => o.estado === 'asignado' || o.estado === 'en_proceso').length
  const completadas = ordenes.filter(o => o.estado === 'completado').length
  const ganancias  = ordenes.filter(o => o.estado === 'completado')
    .reduce((acc: number, o: any) => acc + (o.orden?.total ?? 0), 0)

  const stats = [
    { label: 'Órdenes activas',       value: activas,    sub: `${activas} en progreso` },
    { label: 'Completadas este mes',   value: completadas, sub: 'este mes' },
    { label: 'Calificación',           value: '4.9',       sub: '★ de 5 estrellas' },
    { label: 'Ganancias',              value: `$${ganancias.toLocaleString()}`, sub: 'MXN acumulado' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-black/5 p-5">
          <p className="text-[11px] text-ink-mid tracking-wide uppercase mb-2">{s.label}</p>
          <p className="text-3xl font-medium">{s.value}</p>
          <p className="text-[11px] text-rose mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
