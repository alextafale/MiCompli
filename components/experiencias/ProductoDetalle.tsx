'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ChatOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material'

type ProductoData = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  precio_mayoreo: number | null
  imagenes: string[] | null
  emoji: string | null
  audiencia: string
  ocasiones: string[] | null
  proveedor_id: string | null
  categorias?: { nombre: string; emoji: string | null; slug: string } | null
  profiles?: { id: string; full_name: string | null; email: string } | null
}

const OCASION_LABELS: Record<string, string> = {
  cumpleanos: '🎂 Cumpleaños',
  aniversario_laboral: '🏆 Aniversario laboral',
  onboarding: '🎁 Onboarding',
  reconocimiento: '⭐ Reconocimiento',
  regalo_cliente: '💼 Regalo a cliente',
  dia_especial: '✨ Día especial',
  sin_ocasion: '🎀 Sin ocasión',
}

export default function ProductoDetalle({
  producto,
  userId,
}: {
  producto: ProductoData
  userId: string | null
}) {
  const [imgIdx, setImgIdx]       = useState(0)
  const [mensaje, setMensaje]     = useState('')
  const [loading, setLoading]     = useState(false)
  const supabase = createClient()
  const router   = useRouter()

  const imgs = producto.imagenes ?? []

  const prev = () => setImgIdx(i => (i === 0 ? imgs.length - 1 : i - 1))
  const next = () => setImgIdx(i => (i === imgs.length - 1 ? 0 : i + 1))

  const handleContacto = async () => {
    if (!userId) { router.push('/login'); return }
    if (!mensaje.trim()) { toast.error('Escribe un mensaje'); return }
    if (!producto.proveedor_id) { toast.error('Sin proveedor asignado'); return }

    setLoading(true)
    try {
      // Get or create conversacion
      let convId: string
      const { data: existing } = await supabase
        .from('conversaciones')
        .select('id')
        .eq('comprador_id', userId)
        .eq('proveedor_id', producto.proveedor_id)
        .eq('producto_id', producto.id)
        .maybeSingle()

      if (existing) {
        convId = existing.id
      } else {
        const { data: nueva, error } = await supabase
          .from('conversaciones')
          .insert({
            comprador_id: userId,
            proveedor_id: producto.proveedor_id,
            producto_id: producto.id,
            ultimo_mensaje: mensaje.trim(),
          })
          .select('id')
          .single()
        if (error) throw error
        convId = nueva.id
      }

      // Insert message
      const { error: msgError } = await supabase
        .from('mensajes_conversacion')
        .insert({
          conversacion_id: convId,
          emisor_id: userId,
          contenido: mensaje.trim(),
        })
      if (msgError) throw msgError

      // Update ultimo_mensaje
      await supabase
        .from('conversaciones')
        .update({ ultimo_mensaje: mensaje.trim() })
        .eq('id', convId)

      toast.success('¡Mensaje enviado al proveedor!')
      setMensaje('')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Gallery */}
      <div>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose/5 to-cream aspect-square shadow-premium">
          {imgs.length > 0 ? (
            <>
              <img
                src={imgs[imgIdx]}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft sx={{ fontSize: 20 }} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight sx={{ fontSize: 20 }} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imgs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              {producto.emoji ?? '✨'}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {imgs.length > 1 && (
          <div className="flex gap-2 mt-3">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-rose' : 'border-transparent opacity-50 hover:opacity-75'}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        {producto.categorias && (
          <p className="text-[11px] uppercase tracking-[3px] text-rose font-bold mb-3">
            {producto.categorias.emoji} {producto.categorias.nombre}
          </p>
        )}

        <h1 className="font-display text-4xl font-bold text-ink mb-3">{producto.nombre}</h1>

        <div className="flex items-baseline gap-3 mb-6">
          <p className="text-3xl font-display font-bold text-ink">
            ${Number(producto.precio).toLocaleString('es-MX')}
            <span className="text-base font-normal text-ink/40 ml-1">MXN</span>
          </p>
          {producto.precio_mayoreo && (
            <span className="text-sm text-ink/40">
              Mayoreo: ${Number(producto.precio_mayoreo).toLocaleString('es-MX')}
            </span>
          )}
        </div>

        <p className="text-ink/60 text-sm leading-relaxed mb-6">{producto.descripcion}</p>

        {/* Audiencia */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-black/5 text-ink/50 text-xs font-semibold">
            {producto.audiencia === 'b2b' ? '🏢 Para empresas' : producto.audiencia === 'b2c' ? '👤 Personal' : '✨ Para todos'}
          </span>
        </div>

        {/* Ocasiones */}
        {producto.ocasiones && producto.ocasiones.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold mb-2">Ideal para</p>
            <div className="flex flex-wrap gap-1.5">
              {producto.ocasiones.map(o => (
                <span key={o} className="px-3 py-1 rounded-full bg-rose/8 text-rose text-xs font-medium">
                  {OCASION_LABELS[o] ?? o}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Proveedor */}
        {producto.profiles && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/3 mb-6">
            <div className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center text-rose font-bold text-sm flex-shrink-0">
              {producto.profiles.full_name?.charAt(0) ?? 'P'}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{producto.profiles.full_name ?? 'Proveedor'}</p>
              <p className="text-xs text-ink/40">Proveedor certificado</p>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="mt-auto space-y-3">
          <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold">Contactar al proveedor</p>
          <textarea
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-white text-ink transition-colors resize-none"
            placeholder="Hola, me interesa este producto. ¿Tienen disponibilidad para..."
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
          />
          <button
            onClick={handleContacto}
            disabled={loading}
            className="group w-full bg-rose text-white rounded-2xl py-4 font-bold text-sm hover:bg-rose-dark transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose/20 hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ChatOutlined sx={{ fontSize: 18 }} />
            )}
            {userId ? 'Enviar mensaje' : 'Iniciar sesión para contactar'}
          </button>
        </div>
      </div>
    </div>
  )
}
