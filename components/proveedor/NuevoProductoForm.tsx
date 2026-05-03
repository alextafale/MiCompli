'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AddPhotoAlternateOutlined,
  CloseOutlined,
  EmojiEmotionsOutlined,
  SaveOutlined,
} from '@mui/icons-material'

type Categoria = { id: string; nombre: string; slug: string; emoji: string | null }

const OCASIONES = [
  { val: 'cumpleanos',        label: '🎂 Cumpleaños' },
  { val: 'aniversario_laboral', label: '🏆 Aniversario laboral' },
  { val: 'onboarding',        label: '🎁 Onboarding' },
  { val: 'reconocimiento',    label: '⭐ Reconocimiento' },
  { val: 'regalo_cliente',    label: '💼 Regalo a cliente' },
  { val: 'dia_especial',      label: '✨ Día especial' },
  { val: 'sin_ocasion',       label: '🎀 Sin ocasión' },
]

const AUDIENCIAS = [
  { val: 'b2c', label: 'Consumidor final (B2C)' },
  { val: 'b2b', label: 'Empresas (B2B)' },
  { val: 'ambos', label: 'Ambos' },
]

const EMOJIS = ['✨','🎁','🌹','🍫','💆','📸','🎶','🍷','💝','🌟','🎀','💐','🧁','🍾','🎭']

export default function NuevoProductoForm({
  categorias,
  proveedorId,
  inicial,
  productoId,
}: {
  categorias: Categoria[]
  proveedorId: string
  inicial?: Record<string, any>
  productoId?: string
}) {
  const supabase = createClient()
  const router   = useRouter()

  const [form, setForm] = useState({
    nombre:        inicial?.nombre        ?? '',
    descripcion:   inicial?.descripcion   ?? '',
    precio:        inicial?.precio        ?? '',
    precio_mayoreo: inicial?.precio_mayoreo ?? '',
    categoria_id:  inicial?.categoria_id  ?? '',
    audiencia:     inicial?.audiencia     ?? 'ambos',
    ocasiones:     (inicial?.ocasiones    ?? []) as string[],
    emoji:         inicial?.emoji         ?? '✨',
    activo:        inicial?.activo        ?? true,
  })

  const [imagenes, setImagenes]         = useState<File[]>([])
  const [previews, setPreviews]         = useState<string[]>(inicial?.imagenes ?? [])
  const [existentes, setExistentes]     = useState<string[]>(inicial?.imagenes ?? [])
  const [showEmojis, setShowEmojis]     = useState(false)
  const [loading, setLoading]           = useState(false)
  const fileRef                         = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (imagenes.length + existentes.length + files.length > 5) {
      toast.error('Máximo 5 imágenes'); return
    }
    setImagenes(prev => [...prev, ...files])
    files.forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => setPreviews(prev => [...prev, ev.target!.result as string])
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (idx: number) => {
    const totalExistentes = existentes.length
    if (idx < totalExistentes) {
      setExistentes(prev => prev.filter((_, i) => i !== idx))
    } else {
      const newIdx = idx - totalExistentes
      setImagenes(prev => prev.filter((_, i) => i !== newIdx))
    }
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const toggleOcasion = (val: string) => {
    setForm(f => ({
      ...f,
      ocasiones: f.ocasiones.includes(val)
        ? f.ocasiones.filter(o => o !== val)
        : [...f.ocasiones, val],
    }))
  }

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [...existentes]
    for (const file of imagenes) {
      const ext  = file.name.split('.').pop()
      const path = `${proveedorId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('productos-imagenes')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) throw new Error(`Error al subir imagen: ${error.message}`)
      const { data } = supabase.storage.from('productos-imagenes').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  const handleSubmit = async () => {
    if (!form.nombre || !form.descripcion || !form.precio) {
      toast.error('Completa los campos obligatorios'); return
    }
    setLoading(true)
    try {
      const imageUrls = await uploadImages()
      const payload = {
        proveedor_id:   proveedorId,
        nombre:         form.nombre,
        descripcion:    form.descripcion,
        precio:         Number(form.precio),
        precio_mayoreo: form.precio_mayoreo ? Number(form.precio_mayoreo) : null,
        categoria_id:   form.categoria_id   || null,
        audiencia:      form.audiencia as 'b2b' | 'b2c' | 'ambos',
        ocasiones:      form.ocasiones as any,
        emoji:          form.emoji,
        imagenes:       imageUrls,
        activo:         form.activo,
      }

      if (productoId) {
        const { error } = await supabase.from('productos').update(payload).eq('id', productoId)
        if (error) throw error
        toast.success('Producto actualizado')
      } else {
        const { error } = await supabase.from('productos').insert(payload)
        if (error) throw error
        toast.success('¡Producto enviado! Será revisado por nuestro equipo.')
      }
      router.push('/proveedor/productos')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fieldCls = "w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-white text-ink transition-colors"
  const labelCls = "block text-[11px] font-bold uppercase tracking-[1.5px] text-ink/40 mb-2"

  return (
    <div className="space-y-6">
      {/* Imagen upload */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
        <p className={labelCls}>Imágenes del producto <span className="text-ink/20 normal-case tracking-normal font-normal">(máx. 5)</span></p>
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group border border-black/5">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CloseOutlined sx={{ fontSize: 18 }} className="text-white" />
              </button>
            </div>
          ))}
          {previews.length < 5 && (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center gap-1.5 text-ink/30 hover:text-rose hover:border-rose/30 transition-all"
            >
              <AddPhotoAlternateOutlined sx={{ fontSize: 22 }} />
              <span className="text-[10px] font-semibold">Agregar</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
        </div>
      </div>

      {/* Info básica */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-5">
        <p className="text-[11px] uppercase tracking-[2px] font-bold text-rose">Información básica</p>

        {/* Emoji + nombre */}
        <div className="flex gap-3 items-start">
          <div className="relative">
            <button
              onClick={() => setShowEmojis(v => !v)}
              className="w-14 h-14 text-3xl rounded-xl border border-black/8 bg-rose/5 hover:bg-rose/10 transition-colors flex-shrink-0 flex items-center justify-center"
              title="Cambiar emoji"
            >
              {form.emoji}
            </button>
            {showEmojis && (
              <div className="absolute top-16 left-0 z-10 bg-white rounded-2xl shadow-premium border border-black/5 p-3 grid grid-cols-5 gap-1.5">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => { setForm(f => ({ ...f, emoji: e })); setShowEmojis(false) }}
                    className="text-xl hover:bg-rose/10 rounded-lg p-1.5 transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className={labelCls}>Nombre del producto *</label>
            <input
              className={fieldCls}
              placeholder="Ej. Bouquet de rosas rojas"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Descripción *</label>
          <textarea
            rows={4}
            className={`${fieldCls} resize-none`}
            placeholder="Describe tu producto: qué incluye, qué hace especial a tu oferta..."
            value={form.descripcion}
            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          />
        </div>
      </div>

      {/* Precios */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-5">
        <p className="text-[11px] uppercase tracking-[2px] font-bold text-rose">Precios</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Precio unitario (MXN) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={fieldCls}
              placeholder="0.00"
              value={form.precio}
              onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelCls}>Precio mayoreo <span className="normal-case tracking-normal font-normal">(opcional)</span></label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={fieldCls}
              placeholder="0.00"
              value={form.precio_mayoreo}
              onChange={e => setForm(f => ({ ...f, precio_mayoreo: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Categoría + audiencia */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-5">
        <p className="text-[11px] uppercase tracking-[2px] font-bold text-rose">Categoría y audiencia</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Categoría</label>
            <select
              className={fieldCls}
              value={form.categoria_id}
              onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}
            >
              <option value="">Sin categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Audiencia</label>
            <select
              className={fieldCls}
              value={form.audiencia}
              onChange={e => setForm(f => ({ ...f, audiencia: e.target.value }))}
            >
              {AUDIENCIAS.map(a => (
                <option key={a.val} value={a.val}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ocasiones */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-4">
        <p className="text-[11px] uppercase tracking-[2px] font-bold text-rose">Ocasiones ideales</p>
        <div className="grid grid-cols-2 gap-2">
          {OCASIONES.map(o => (
            <button
              key={o.val}
              type="button"
              onClick={() => toggleOcasion(o.val)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                form.ocasiones.includes(o.val)
                  ? 'border-rose bg-rose/5 text-rose'
                  : 'border-black/8 text-ink/50 hover:border-rose/20'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visibilidad */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-black/10 peer-checked:bg-rose rounded-full transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Activar producto</p>
            <p className="text-xs text-ink/40">El producto será visible una vez aprobado por el equipo.</p>
          </div>
        </label>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="group w-full bg-rose text-white rounded-2xl py-4 font-bold text-sm hover:bg-rose-dark transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {productoId ? 'Guardando...' : 'Enviando...'}
          </>
        ) : (
          <>
            <SaveOutlined sx={{ fontSize: 18 }} />
            {productoId ? 'Guardar cambios' : 'Enviar para revisión'}
          </>
        )}
      </button>
    </div>
  )
}
