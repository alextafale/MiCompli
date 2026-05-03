'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { use, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  CheckCircle, Chat, Star, Share,
  ContentCopy, WhatsApp,
} from '@mui/icons-material'

interface SuccessPageProps {
  searchParams: Promise<{ numero?: string; total?: string; orden_id?: string }>
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = use(searchParams)
  const supabase = createClient()
  const db = supabase as any
  const [orden, setOrden] = useState<any>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    async function cargar() {
      if (!resolvedParams.orden_id) return
      const { data } = await supabase
        .from('ordenes')
        .select('*, experiencia:experiencias(nombre, emoji, descripcion)')
        .eq('id', resolvedParams.orden_id)
        .single()
      setOrden(data)
    }
    cargar()
  }, [resolvedParams.orden_id])

  const copiarNumero = () => {
    navigator.clipboard.writeText(resolvedParams.numero ?? '')
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const compartirWhatsApp = () => {
    const texto = `¡Acabo de reservar una experiencia increíble en micompli! 🎉 Orden: ${resolvedParams.numero}`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">

        {/* ── Animación de éxito ──────────────────────────── */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 rounded-[32px] bg-green-50 flex items-center justify-center">
            <CheckCircle className="text-green-500 text-6xl" style={{ fontSize: '4rem' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-ink mb-3">
            ¡Reserva confirmada!
          </h1>
          <p className="text-ink/50 text-lg leading-relaxed">
            Tus cómplices ya recibieron la orden. Prepárate para vivir algo inolvidable.
          </p>
        </motion.div>

        {/* ── Tarjeta de reserva ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[32px] border border-black/[0.04] p-8 mb-6 shadow-sm"
        >
          {/* Experiencia */}
          {orden?.experiencia && (
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-14 h-14 rounded-2xl bg-rose/10 flex items-center justify-center text-3xl flex-shrink-0">
                {orden.experiencia.emoji}
              </div>
              <div>
                <p className="font-bold text-ink text-lg">{orden.experiencia.nombre}</p>
                <p className="text-ink/40 text-sm">{orden.experiencia.descripcion?.slice(0, 60)}...</p>
              </div>
            </div>
          )}

          {/* Detalles */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-ink/40 text-sm">Estado</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[1px]">
                ✓ Confirmada
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-black/[0.04] pt-4">
              <span className="text-ink/40 text-sm">Nº de Orden</span>
              <div className="flex items-center gap-2">
                <strong className="font-mono text-ink">{resolvedParams.numero ?? '–'}</strong>
                <button
                  onClick={copiarNumero}
                  className="w-7 h-7 rounded-lg bg-[#F9F9F9] flex items-center justify-center hover:bg-rose/10 transition-colors"
                >
                  {copiado
                    ? <CheckCircle className="text-green-500 text-sm" />
                    : <ContentCopy className="text-ink/40 text-sm" />
                  }
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-black/[0.04] pt-4">
              <span className="text-ink/40 text-sm">Cómplices</span>
              <span className="text-rose font-semibold text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose animate-pulse inline-block" />
                Asignando...
              </span>
            </div>

            {resolvedParams.total && (
              <div className="flex justify-between items-center border-t border-black/[0.04] pt-4">
                <span className="text-ink/50 text-sm font-semibold">Total invertido</span>
                <strong className="font-display text-2xl text-ink">
                  ${Number(resolvedParams.total).toLocaleString()}
                  <span className="text-sm text-ink/30 font-normal ml-1">MXN</span>
                </strong>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Info importante ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-rose/5 border border-rose/10 rounded-[24px] p-6 mb-6"
        >
          <p className="text-[11px] uppercase tracking-[2px] text-rose font-bold mb-3">
            Información importante
          </p>
          <ul className="space-y-2 text-sm text-ink/60">
            <li className="flex items-start gap-2">
              <span className="text-rose mt-0.5">•</span>
              Llega 15 min antes de tu reserva
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose mt-0.5">•</span>
              Menciona tu número de orden al llegar
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose mt-0.5">•</span>
              Recibirás confirmación por email
            </li>
          </ul>
        </motion.div>

        {/* ── CTAs ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {/* Contactar cómplice */}
          <Link
            href="/dashboard/mensajes"
            className="w-full flex items-center justify-center gap-3 bg-ink text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-rose transition-all"
          >
            <Chat className="text-base" />
            Contactar al cómplice
          </Link>

          {/* Calificar - solo si tiene orden_id */}
          {resolvedParams.orden_id && (
            <Link
              href={`/resena/${resolvedParams.orden_id}`}
              className="w-full flex items-center justify-center gap-3 border border-black/10 text-ink rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:border-rose/30 hover:text-rose transition-all"
            >
              <Star className="text-base" />
              Calificar experiencia
            </Link>
          )}

          {/* Compartir */}
          <button
            onClick={compartirWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366]/10 text-[#25D366] rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-[#25D366]/20 transition-all"
          >
            <WhatsApp className="text-base" />
            Compartir por WhatsApp
          </button>

          <Link
            href="/explorar"
            className="w-full flex items-center justify-center text-ink/30 text-sm hover:text-rose transition-colors py-2"
          >
            Crear otra experiencia →
          </Link>
        </motion.div>

      </div>

      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(212,83,126,0.04),transparent_60%)]" />
    </div>
  )
}