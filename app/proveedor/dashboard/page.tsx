'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Add, Edit, Delete, Visibility, VisibilityOff,
  CheckCircle, HourglassEmpty, Store, ArrowForward,
} from '@mui/icons-material'
import Link from 'next/link'

type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  emoji: string
  activo: boolean
  aprobado: boolean
  categoria_id: string | null
  audiencia: string
  created_at: string
}

type Categoria = { id: string; nombre: string; emoji: string }

export default function ProveedorDashboard() {
  const supabase = createClient()
  const db = supabase as any
  const [perfil, setPerfil] = useState<any>(null)
  const [complice, setComplice] = useState<any>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setPerfil(p)

    const { data: c } = await db.from('complices').select('*').eq('perfil_id', user.id).single()
    setComplice(c)

    if (c) {
      const { data: prods } = await db.from('productos').select('*').eq('proveedor_id', user.id).order('created_at', { ascending: false })
      setProductos(prods ?? [])
    }

    const { data: cats } = await db.from('categorias').select('id, nombre, emoji').eq('activa', true).order('orden')
    setCategorias(cats ?? [])
    setLoading(false)
  }

  async function toggleActivo(id: string, activo: boolean) {
    await db.from('productos').update({ activo: !activo }).eq('id', id)
    setProductos(p => p.map(x => x.id === id ? { ...x, activo: !activo } : x))
    toast.success(activo ? 'Producto desactivado' : 'Producto activado')
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    await db.from('productos').delete().eq('id', id)
    setProductos(p => p.filter(x => x.id !== id))
    toast.success('Producto eliminado')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const stats = {
    total: productos.length,
    activos: productos.filter(p => p.activo).length,
    aprobados: productos.filter(p => p.aprobado).length,
    pendientes: productos.filter(p => !p.aprobado).length,
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-rose/10 flex items-center justify-center">
              <Store className="text-rose" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold">Mi negocio</p>
              <h1 className="font-display text-2xl font-bold text-ink">
                {complice?.nombre_negocio ?? perfil?.full_name}
              </h1>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditando(null); setModalAbierto(true) }}
          className="flex items-center gap-2 bg-rose text-white rounded-full px-6 py-3 text-[12px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all shadow-lg shadow-rose/20"
        >
          <Add /> Nuevo producto
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total productos', value: stats.total, color: 'text-ink' },
          { label: 'Activos', value: stats.activos, color: 'text-green-500' },
          { label: 'Aprobados', value: stats.aprobados, color: 'text-blue-500' },
          { label: 'En revisión', value: stats.pendientes, color: 'text-amber-500' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-[24px] p-5 border border-black/[0.04]"
          >
            <p className={`font-display text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-[11px] uppercase tracking-[1px] text-ink/40 font-semibold">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Lista de productos */}
      <div className="bg-white rounded-[32px] border border-black/[0.04] overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-black/[0.04]">
          <h2 className="font-display text-lg font-bold text-ink">Mis productos</h2>
          <Link
            href="/dashboard/mensajes"
            className="text-[11px] font-bold uppercase tracking-[1.5px] text-rose hover:text-ink transition-colors flex items-center gap-1"
          >
            Ver mensajes <ArrowForward className="text-sm" />
          </Link>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-20 px-6">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-display text-xl font-bold text-ink mb-2">Aún no tienes productos</p>
            <p className="text-ink/40 text-sm mb-8">Sube tu primer producto y empieza a recibir órdenes</p>
            <button
              onClick={() => setModalAbierto(true)}
              className="inline-flex items-center gap-2 bg-rose text-white rounded-full px-8 py-3 text-[12px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all"
            >
              <Add /> Agregar producto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {productos.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-8 py-5 hover:bg-[#F9F9F9] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose/10 flex items-center justify-center text-xl">
                    {prod.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-ink text-[14px]">{prod.nombre}</p>
                    <p className="text-ink/40 text-[12px]">
                      ${prod.precio.toLocaleString()} MXN · {prod.audiencia === 'b2b' ? 'Empresas' : prod.audiencia === 'b2c' ? 'Personal' : 'Todos'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Badge aprobación */}
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[1px] ${prod.aprobado
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                    {prod.aprobado
                      ? <><CheckCircle className="text-xs" /> Publicado</>
                      : <><HourglassEmpty className="text-xs" /> En revisión</>
                    }
                  </span>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActivo(prod.id, prod.activo)}
                      className="w-8 h-8 rounded-xl border border-black/[0.06] flex items-center justify-center hover:border-rose/30 transition-colors"
                      title={prod.activo ? 'Desactivar' : 'Activar'}
                    >
                      {prod.activo
                        ? <Visibility className="text-sm text-ink/40" />
                        : <VisibilityOff className="text-sm text-ink/20" />
                      }
                    </button>
                    <button
                      onClick={() => { setEditando(prod); setModalAbierto(true) }}
                      className="w-8 h-8 rounded-xl border border-black/[0.06] flex items-center justify-center hover:border-rose/30 transition-colors"
                    >
                      <Edit className="text-sm text-ink/40" />
                    </button>
                    <button
                      onClick={() => eliminar(prod.id)}
                      className="w-8 h-8 rounded-xl border border-black/[0.06] flex items-center justify-center hover:border-red-200 hover:text-red-400 transition-colors"
                    >
                      <Delete className="text-sm text-ink/40" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de producto */}
      <AnimatePresence>
        {modalAbierto && (
          <ProductoModal
            producto={editando}
            categorias={categorias}
            onClose={() => { setModalAbierto(false); setEditando(null) }}
            onGuardado={cargar}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Modal para crear/editar producto ─────────────────────
function ProductoModal({ producto, categorias, onClose, onGuardado }: {
  producto: Producto | null
  categorias: Categoria[]
  onClose: () => void
  onGuardado: () => void
}) {
  const supabase = createClient()
  const db = supabase as any
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto?.precio?.toString() ?? '',
    emoji: producto?.emoji ?? '✨',
    categoria_id: producto?.categoria_id ?? '',
    audiencia: producto?.audiencia ?? 'ambos',
  })

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleGuardar = async () => {
    if (!form.nombre || !form.descripcion || !form.precio) {
      toast.error('Completa nombre, descripción y precio')
      return
    }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        emoji: form.emoji,
        categoria_id: form.categoria_id || null,
        audiencia: form.audiencia,
        proveedor_id: user!.id,
        aprobado: false, // siempre requiere aprobación
      }

      if (producto) {
        await db.from('productos').update(payload).eq('id', producto.id)
        toast.success('Producto actualizado')
      } else {
        await db.from('productos').insert(payload)
        toast.success('Producto enviado a revisión ✨')
      }

      onGuardado()
      onClose()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[32px] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-display text-xl font-bold text-ink mb-6">
          {producto ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <div className="space-y-4">
          {/* Emoji + Nombre */}
          <div className="flex gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">Emoji</label>
              <input
                value={form.emoji}
                onChange={e => set('emoji')(e.target.value)}
                className="w-16 h-12 text-center text-2xl rounded-2xl border border-black/8 outline-none focus:border-rose bg-[#F9F9F9]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">Nombre *</label>
              <input
                value={form.nombre}
                onChange={e => set('nombre')(e.target.value)}
                placeholder="Ej: Bouquet de 24 rosas"
                className="w-full h-12 px-4 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] transition-all"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">Descripción *</label>
            <textarea
              value={form.descripcion}
              onChange={e => set('descripcion')(e.target.value)}
              placeholder="Describe tu producto con detalle..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] resize-none transition-all"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">Precio MXN *</label>
            <input
              type="number"
              value={form.precio}
              onChange={e => set('precio')(e.target.value)}
              placeholder="650"
              className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] transition-all"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">Categoría</label>
            <select
              value={form.categoria_id}
              onChange={e => set('categoria_id')(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-white text-ink/70"
            >
              <option value="">Sin categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Audiencia */}
          <div>
            <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-3">¿Para quién es?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'ambos', label: 'Todos' },
                { val: 'b2b', label: 'Empresas' },
                { val: 'b2c', label: 'Personal' },
              ].map(a => (
                <button
                  key={a.val}
                  type="button"
                  onClick={() => set('audiencia')(a.val)}
                  className={`py-2.5 rounded-xl border text-[12px] font-bold transition-all ${form.audiencia === a.val
                      ? 'border-rose bg-rose/5 text-rose'
                      : 'border-black/8 text-ink/50 hover:border-rose/30'
                    }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info de aprobación */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-6 text-[12px] text-amber-700">
          ⏳ Tu producto será revisado por nuestro equipo antes de publicarse. Generalmente tarda menos de 24 horas.
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-black/10 text-ink rounded-2xl py-3.5 text-sm font-semibold hover:border-rose/30 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="flex-1 bg-rose text-white rounded-2xl py-3.5 text-sm font-semibold hover:bg-ink transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : producto ? 'Guardar cambios' : 'Enviar a revisión'
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}