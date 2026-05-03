'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  ArrowBack, Chat, Store, CheckCircle,
  ArrowForward, Send,
} from '@mui/icons-material'

interface Props {
  producto: any
  masProductos: any[]
}

export default function ProductoDetalleClient({ producto, masProductos }: Props) {
  const supabase = createClient()
  const db = supabase as any
  const router = useRouter()
  const [modalContacto, setModalContacto] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleContactar = async () => {
    if (!mensaje.trim()) {
      toast.error('Escribe un mensaje primero')
      return
    }
    setEnviando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Inicia sesión para contactar al proveedor')
        router.push('/login')
        return
      }

      // Buscar o crear conversación
      let convId: string

      const { data: convExistente } = await db
        .from('conversaciones')
        .select('id')
        .eq('comprador_id', user.id)
        .eq('proveedor_id', producto.proveedor.id)
        .eq('producto_id', producto.id)
        .single()

      if (convExistente) {
        convId = convExistente.id
      } else {
        const { data: nuevaConv, error } = await db
          .from('conversaciones')
          .insert({
            comprador_id: user.id,
            proveedor_id: producto.proveedor.id,
            producto_id: producto.id,
            ultimo_mensaje: mensaje.trim(),
          })
          .select('id')
          .single()

        if (error) throw error
        convId = nuevaConv.id
      }

      // Enviar mensaje
      await db.from('mensajes_conversacion').insert({
        conversacion_id: convId,
        emisor_id: user.id,
        contenido: mensaje.trim(),
      })

      // Actualizar último mensaje
      await db
        .from('conversaciones')
        .update({ ultimo_mensaje: mensaje.trim(), updated_at: new Date().toISOString() })
        .eq('id', convId)

      toast.success('¡Mensaje enviado! El proveedor te responderá pronto.')
      setModalContacto(false)
      setMensaje('')
    } catch (e: any) {
      toast.error('Error: ' + e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pt-[80px] min-h-screen bg-[#F9F9F9]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/explorar"
            className="flex items-center gap-2 text-ink/40 hover:text-rose transition-colors text-[13px] font-semibold"
          >
            <ArrowBack className="text-sm" /> Explorar
          </Link>
          <span className="text-ink/20">/</span>
          {producto.categoria && (
            <>
              <Link
                href={`/explorar?categoria=${producto.categoria.slug}`}
                className="text-ink/40 hover:text-rose transition-colors text-[13px] font-semibold"
              >
                {producto.categoria.emoji} {producto.categoria.nombre}
              </Link>
              <span className="text-ink/20">/</span>
            </>
          )}
          <span className="text-ink/60 text-[13px] font-semibold truncate">{producto.nombre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Lado izquierdo ──────────────────────────── */}
          <div>
            {/* Imagen / Emoji hero */}
            <div className="h-80 bg-white rounded-[32px] border border-black/[0.04] flex items-center justify-center mb-8 overflow-hidden relative">
              {producto.imagenes && producto.imagenes.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={producto.imagenes[0]}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <span className="text-[100px]">{producto.emoji}</span>
                </div>
              )}
              {/* Badge categoría */}
              {producto.categoria && (
                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-ink/60 uppercase tracking-[1px]">
                  {producto.categoria.emoji} {producto.categoria.nombre}
                </div>
              )}
              {/* Badge audiencia */}
              {(producto.audiencia === 'b2b' || producto.audiencia === 'ambos') && (
                <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-ink/80 text-[10px] font-bold text-white uppercase tracking-[1px]">
                  Empresas
                </div>
              )}
            </div>

            {/* Info */}
            <h1 className="font-display text-4xl font-bold text-ink mb-4">{producto.nombre}</h1>
            <p className="text-ink/50 text-lg leading-relaxed mb-8">{producto.descripcion}</p>

            {/* Proveedor */}
            <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose/10 flex items-center justify-center text-rose font-black text-lg flex-shrink-0">
                {producto.proveedor?.full_name?.charAt(0) ?? '?'}
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[2px] text-ink/30 font-bold mb-1">Proveedor</p>
                <p className="font-bold text-ink">{producto.proveedor?.full_name ?? 'Proveedor verificado'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="text-green-500 text-sm" />
                  <span className="text-[11px] text-green-600 font-semibold">Verificado por micompli</span>
                </div>
              </div>
              <button
                onClick={() => setModalContacto(true)}
                className="flex items-center gap-2 border border-black/10 text-ink rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-[1px] hover:border-rose/30 hover:text-rose transition-all"
              >
                <Chat className="text-sm" /> Contactar
              </button>
            </div>

            {/* Más productos del proveedor */}
            {masProductos.length > 0 && (
              <div className="mt-10">
                <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-4">
                  Más de este proveedor
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {masProductos.map(p => (
                    <Link
                      key={p.id}
                      href={`/producto/${p.id}`}
                      className="bg-white rounded-[20px] p-5 border border-black/[0.04] hover:border-rose/20 hover:shadow-sm transition-all group"
                    >
                      <span className="text-3xl mb-3 block">{p.emoji}</span>
                      <p className="font-bold text-ink text-[13px] group-hover:text-rose transition-colors mb-1">
                        {p.nombre}
                      </p>
                      <p className="text-rose font-bold text-[13px]">
                        ${p.precio.toLocaleString()} MXN
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Lado derecho — Sticky ────────────────────── */}
          <div className="lg:sticky lg:top-[100px] h-fit">
            <div className="bg-white rounded-[32px] border border-black/[0.04] p-8">
              <div className="mb-6 pb-6 border-b border-black/[0.04]">
                <p className="text-[10px] uppercase tracking-[2px] text-ink/30 font-bold mb-2">Precio</p>
                <p className="font-display text-4xl font-black text-ink">
                  ${producto.precio.toLocaleString()}
                  <span className="text-base text-ink/30 font-normal ml-2">MXN</span>
                </p>
                {producto.precio_mayoreo && (
                  <p className="text-[12px] text-rose font-semibold mt-1">
                    Precio mayoreo: ${producto.precio_mayoreo.toLocaleString()} MXN
                  </p>
                )}
              </div>

              {/* Para quién */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[2px] text-ink/30 font-bold mb-3">Disponible para</p>
                <div className="flex gap-2 flex-wrap">
                  {(producto.audiencia === 'b2b' || producto.audiencia === 'ambos') && (
                    <span className="px-3 py-1 rounded-full bg-ink/5 text-ink text-[11px] font-bold uppercase tracking-[1px]">
                      🏢 Empresas
                    </span>
                  )}
                  {(producto.audiencia === 'b2c' || producto.audiencia === 'ambos') && (
                    <span className="px-3 py-1 rounded-full bg-rose/5 text-rose text-[11px] font-bold uppercase tracking-[1px]">
                      👤 Particulares
                    </span>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModalContacto(true)}
                  className="w-full bg-rose text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all shadow-lg shadow-rose/20 flex items-center justify-center gap-2"
                >
                  <Chat className="text-base" /> Contactar proveedor
                </motion.button>

                <Link
                  href={`/explorar?audiencia=${producto.audiencia}`}
                  className="w-full border border-black/10 text-ink rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:border-rose/30 transition-all flex items-center justify-center gap-2"
                >
                  Ver más productos <ArrowForward className="text-sm" />
                </Link>
              </div>

              {/* Trust */}
              <div className="mt-6 pt-6 border-t border-black/[0.04] space-y-3">
                {[
                  '✅ Proveedor verificado por micompli',
                  '🔒 Pago seguro y protegido',
                  '📦 Entrega coordinada por nuestro equipo',
                ].map((item, i) => (
                  <p key={i} className="text-[12px] text-ink/40 font-medium">{item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal de contacto ──────────────────────────────── */}
      <AnimatePresence>
        {modalContacto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-6"
            onClick={e => e.target === e.currentTarget && setModalContacto(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-md"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose/10 flex items-center justify-center text-rose font-black text-lg">
                  {producto.proveedor?.full_name?.charAt(0) ?? '?'}
                </div>
                <div>
                  <p className="font-bold text-ink">{producto.proveedor?.full_name}</p>
                  <p className="text-[12px] text-ink/40">{producto.emoji} {producto.nombre}</p>
                </div>
              </div>

              <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-3">
                Tu mensaje
              </p>
              <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder={`Hola, me interesa "${producto.nombre}". ¿Tienen disponibilidad para...?`}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] resize-none transition-all mb-6"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setModalContacto(false)}
                  className="flex-1 border border-black/10 text-ink rounded-2xl py-3.5 text-sm font-semibold hover:border-rose/30 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleContactar}
                  disabled={enviando || !mensaje.trim()}
                  className="flex-1 bg-rose text-white rounded-2xl py-3.5 text-sm font-semibold hover:bg-ink transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {enviando
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Send className="text-sm" /> Enviar</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}