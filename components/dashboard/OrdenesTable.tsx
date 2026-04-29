import IconMapper from '@/components/common/IconMapper'

const ESTADO_BADGE: Record<string, string> = {
  asignado:    'bg-gold-light text-gold',
  en_proceso:  'bg-rose-light text-rose-dark',
  completado:  'bg-green-50 text-green-700',
  aceptado:    'bg-blue-50 text-blue-700',
}

export default function OrdenesTable({ ordenes }: { ordenes: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
        <h2 className="font-medium">Órdenes recientes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5">
              {['Orden', 'Experiencia', 'Fecha', 'Estado', 'Total'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-[11px] text-ink-mid tracking-wide uppercase font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-ink-mid">No hay órdenes aún</td></tr>
            ) : ordenes.map((o: any) => (
              <tr key={o.id} className="border-b border-black/[0.04] hover:bg-cream/50 transition-colors">
                <td className="px-6 py-3 font-mono text-xs">{o.orden?.numero ?? '–'}</td>
                <td className="px-6 py-3"><IconMapper icon={o.orden?.experiencia?.emoji} className="inline-block w-4 h-4 mr-1 text-ink/40" /> {o.orden?.experiencia?.nombre ?? '–'}</td>
                <td className="px-6 py-3 text-ink-mid">{o.orden?.fecha_deseada ?? '–'}</td>
                <td className="px-6 py-3">
                  <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${ESTADO_BADGE[o.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                    {o.estado}
                  </span>
                </td>
                <td className="px-6 py-3">${(o.orden?.total ?? 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
