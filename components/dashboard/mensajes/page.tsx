'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Send, Chat, Person } from '@mui/icons-material'

type Conversacion = {
  id: string
  comprador_id: string
  proveedor_id: string
  ultimo_mensaje: string | null
  updated_at: string
  comprador: { full_name: string; email: string }
  proveedor: { full_name: string; email: string }
  producto: { nombre: string; emoji: string } | null
}

type Mensaje = {
  id: string
  conversacion_id: string
  emisor_id: string
  contenido: string
  leido: boolean
  created_at: string
}

export default function MensajesPage() {
  const supabase = createClient()
  const db = supabase as any
  const [perfil, setPerfil] = useState<any>(null)
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [activa, setActiva] = useState<Conversacion | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { cargar() }, [])

  useEffect(() => {
    if (!activa) return
    cargarMensajes(activa.id)
    marcarLeidos(activa.id)

    // Suscripción realtime
    const canal = supabase
      .channel(`mensajes:${activa.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes_conversacion',
        filter: `conversacion_id=eq.${activa.id}`,
      }, payload => {
        setMensajes(prev => [...prev, payload.new as Mensaje])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [activa?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  async function cargar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setPerfil(p)

    const { data } = await db
      .from('conversaciones')
      .select(`
        *,
        comprador:profiles!conversaciones_comprador_id_fkey(full_name, email),
        proveedor:profiles!conversaciones_proveedor_id_fkey(full_name, email),
        producto:productos(nombre, emoji)
      `)
      .or(`comprador_id.eq.${user.id},proveedor_id.eq.${user.id}`)
      .order('updated_at', { ascending: false })

    setConversaciones(data ?? [])
    if (data && data.length > 0) setActiva(data[0])
    setLoading(false)
  }

  async function cargarMensajes(convId: string) {
    const { data } = await db
      .from('mensajes_conversacion')
      .select('*')
      .eq('conversacion_id', convId)
      .order('created_at', { ascending: true })
    setMensajes(data ?? [])
  }

  async function marcarLeidos(convId: string) {
    if (!perfil?.id) return
    await db
      .from('mensajes_conversacion')
      .update({ leido: true })
      .eq('conversacion_id', convId)
      .neq('emisor_id', perfil.id)
  }

  async function enviarMensaje() {
    if (!texto.trim() || !activa || !perfil) return
    setEnviando(true)
    try {
      const { error } = await db
        .from('mensajes_conversacion')
        .insert({
          conversacion_id: activa.id,
          emisor_id: perfil.id,
          contenido: texto.trim(),
        })
      if (error) throw error

      // Actualizar último mensaje
      await db
        .from('conversaciones')
        .update({ ultimo_mensaje: texto.trim(), updated_at: new Date().toISOString() })
        .eq('id', activa.id)

      setTexto('')
    } catch (e: any) {
      toast.error('Error al enviar: ' + e.message)
    } finally {
      setEnviando(false)
    }
  }

  const otroUsuario = (conv: Conversacion) =>
    perfil?.id === conv.comprador_id ? conv.proveedor : conv.comprador

  const formatHora = (fecha: string) => {
    const d = new Date(fecha)
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha)
    const hoy = new Date()
    const diff = hoy.getTime() - d.getTime()
    if (diff < 86400000) return formatHora(fecha)
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="h-[calc(100vh-140px)] flex rounded-[32px] overflow-hidden border border-black/[0.04] bg-white">

      {/* ── Lista de conversaciones ──────────────────────── */}
      <div className="w-[320px] border-r border-black/[0.04] flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-black/[0.04]">
          <h2 className="font-display text-lg font-bold text-ink">Mensajes</h2>
          <p className="text-ink/40 text-[12px]">{conversaciones.length} conversaciones</p>
        </div>

        {conversaciones.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <Chat className="text-ink/10 text-5xl mb-4" />
            <p className="font-bold text-ink/30 text-sm">Sin mensajes aún</p>
            <p className="text-ink/20 text-xs mt-1">Cuando alguien te escriba aparecerá aquí</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversaciones.map(conv => {
              const otro = otroUsuario(conv)
              const esActiva = activa?.id === conv.id
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiva(conv)}
                  className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-all border-b border-black/[0.03] ${esActiva ? 'bg-rose/5 border-l-2 border-l-rose' : 'hover:bg-[#F9F9F9]'
                    }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose/10 flex items-center justify-center text-rose font-black text-sm flex-shrink-0 mt-0.5">
                    {otro?.full_name?.charAt(0) ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-[13px] font-bold truncate ${esActiva ? 'text-rose' : 'text-ink'}`}>
                        {otro?.full_name ?? otro?.email ?? 'Usuario'}
                      </p>
                      <p className="text-[10px] text-ink/30 flex-shrink-0 ml-2">
                        {formatFecha(conv.updated_at)}
                      </p>
                    </div>
                    {conv.producto && (
                      <p className="text-[11px] text-rose/70 font-semibold mb-0.5">
                        {conv.producto.emoji} {conv.producto.nombre}
                      </p>
                    )}
                    <p className="text-[12px] text-ink/40 truncate">
                      {conv.ultimo_mensaje ?? 'Nueva conversación'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Panel de chat ────────────────────────────────── */}
      {activa ? (
        <div className="flex-1 flex flex-col">
          {/* Header del chat */}
          <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center text-rose font-black text-sm">
              {otroUsuario(activa)?.full_name?.charAt(0) ?? '?'}
            </div>
            <div>
              <p className="font-bold text-ink text-[14px]">
                {otroUsuario(activa)?.full_name ?? otroUsuario(activa)?.email}
              </p>
              {activa.producto && (
                <p className="text-[11px] text-ink/40">
                  {activa.producto.emoji} {activa.producto.nombre}
                </p>
              )}
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            <AnimatePresence initial={false}>
              {mensajes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-4xl mb-3">👋</p>
                  <p className="font-bold text-ink/30">Inicia la conversación</p>
                  <p className="text-ink/20 text-sm mt-1">Sé el primero en escribir</p>
                </div>
              ) : (
                mensajes.map(msg => {
                  const esMio = msg.emisor_id === perfil?.id
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${esMio ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${esMio
                            ? 'bg-ink text-white rounded-br-md'
                            : 'bg-[#F9F9F9] text-ink rounded-bl-md border border-black/[0.04]'
                          }`}>
                          {msg.contenido}
                        </div>
                        <p className="text-[10px] text-ink/30 px-1">
                          {formatHora(msg.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-black/[0.04]">
            <div className="flex items-center gap-3 bg-[#F9F9F9] rounded-2xl px-4 py-3 border border-black/[0.06] focus-within:border-rose/30 transition-all">
              <input
                value={texto}
                onChange={e => setTexto(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), enviarMensaje())}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-transparent text-[14px] outline-none text-ink placeholder:text-ink/30"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={enviarMensaje}
                disabled={!texto.trim() || enviando}
                className="w-8 h-8 rounded-xl bg-rose flex items-center justify-center disabled:opacity-30 transition-all hover:bg-ink"
              >
                {enviando
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send className="text-white text-sm" />
                }
              </motion.button>
            </div>
            <p className="text-[10px] text-ink/20 text-center mt-2">Enter para enviar</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <Chat className="text-ink/10 text-6xl mb-4" />
          <p className="font-display text-xl font-bold text-ink/20">Selecciona una conversación</p>
        </div>
      )}
    </div>
  )
}