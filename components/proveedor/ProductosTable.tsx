'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { EditOutlined, DeleteOutlined, ToggleOnOutlined, ToggleOffOutlined } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

type ProductoRow = {
  id: string
  nombre: string
  precio: number
  aprobado: boolean | null
  activo: boolean | null
  emoji: string | null
  audiencia: string
  categorias?: { nombre: string; emoji: string | null } | null
}

export default function ProductosTable({ productos }: { productos: ProductoRow[] }) {
  const [lista, setLista] = useState(productos)
  const supabase = createClient()
  const router = useRouter()

  const toggleActivo = async (id: string, current: boolean | null) => {
    const { error } = await supabase
      .from('productos')
      .update({ activo: !current })
      .eq('id', id)
    if (error) { toast.error('Error al actualizar'); return }
    setLista(l => l.map(p => p.id === id ? { ...p, activo: !current } : p))
    toast.success(!current ? 'Producto activado' : 'Producto desactivado')
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) { toast.error('Error al eliminar'); return }
    setLista(l => l.filter(p => p.id !== id))
    toast.success('Producto eliminado')
    router.refresh()
  }

  if (lista.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-16 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="font-display font-bold text-ink text-xl mb-2">Sin productos aún</h3>
        <p className="text-ink/50 text-sm mb-8">Sube tu primer producto para empezar.</p>
        <Link
          href="/proveedor/productos/nuevo"
          className="inline-flex items-center gap-2 bg-rose text-white rounded-full px-8 py-3 text-sm font-bold hover:bg-rose-dark transition-all"
        >
          Subir producto
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-3 border-b border-black/5 bg-black/2">
        <div className="w-8" />
        <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold">Producto</p>
        <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold w-20 text-right">Precio</p>
        <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold w-24 text-center">Estado</p>
        <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold w-20 text-center">Visible</p>
        <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold w-16" />
      </div>

      <div className="divide-y divide-black/5">
        {lista.map(p => (
          <div
            key={p.id}
            className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 hover:bg-black/[0.01] transition-colors"
          >
            {/* Emoji */}
            <div className="hidden md:flex w-8 h-8 rounded-lg bg-rose/10 items-center justify-center text-lg">
              {p.emoji ?? '✨'}
            </div>

            {/* Info */}
            <div>
              <p className="text-sm font-semibold text-ink flex items-center gap-2">
                <span className="md:hidden">{p.emoji ?? '✨'}</span>
                {p.nombre}
              </p>
              <p className="text-xs text-ink/40 mt-0.5">
                {p.categorias?.emoji} {p.categorias?.nombre ?? '—'} · {p.audiencia}
              </p>
            </div>

            {/* Precio */}
            <div className="w-20 text-right hidden md:block">
              <p className="text-sm font-bold text-ink">${Number(p.precio).toLocaleString('es-MX')}</p>
            </div>

            {/* Estado aprobación */}
            <div className="w-24 flex justify-center hidden md:flex">
              {p.aprobado ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
                  Aprobado
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
                  Pendiente
                </span>
              )}
            </div>

            {/* Toggle visible */}
            <div className="w-20 flex justify-center">
              <button
                onClick={() => toggleActivo(p.id, p.activo)}
                title={p.activo ? 'Desactivar' : 'Activar'}
                className={`transition-colors ${p.activo ? 'text-emerald-500 hover:text-emerald-600' : 'text-ink/20 hover:text-ink/50'}`}
              >
                {p.activo
                  ? <ToggleOnOutlined sx={{ fontSize: 28 }} />
                  : <ToggleOffOutlined sx={{ fontSize: 28 }} />
                }
              </button>
            </div>

            {/* Acciones */}
            <div className="w-16 flex items-center gap-2 justify-end">
              <Link
                href={`/proveedor/productos/${p.id}/editar`}
                className="text-ink/30 hover:text-rose transition-colors"
                title="Editar"
              >
                <EditOutlined sx={{ fontSize: 18 }} />
              </Link>
              <button
                onClick={() => eliminar(p.id)}
                className="text-ink/20 hover:text-red-500 transition-colors"
                title="Eliminar"
              >
                <DeleteOutlined sx={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
