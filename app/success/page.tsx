'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { use, useEffect, useState } from 'react'
import { Celebration } from '@mui/icons-material'

interface SuccessPageProps {
  searchParams: Promise<{ numero?: string; total?: string }>
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = use(searchParams)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md w-full">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2 
          }}
          className="mb-8 select-none flex justify-center"
        >
          <Celebration className="text-rose text-8xl" style={{ fontSize: '6rem' }} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-[ clamp(32px,5vw,40px)] mb-3 text-rose-dark"
        >
          ¡Todo en marcha!
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-ink-mid text-lg mb-10 leading-relaxed font-light"
        >
          Tus cómplices ya recibieron la orden. Prepárate para crear un momento que no olvidarán.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-white rounded-[32px] border border-rose/10 p-8 text-left mb-10 shadow-rose shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-black/5">
              <span className="text-ink-mid text-sm">Estado</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-green-600/10">
                ORDEN CONFIRMADA
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-black/5">
              <span className="text-ink-mid text-sm">Nº de Orden</span>
              <strong className="font-medium">{resolvedParams.numero ?? '–'}</strong>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-black/5">
              <span className="text-ink-mid text-sm">Cómplices</span>
              <span className="text-rose font-medium animate-pulse">Asignando cómplices...</span>
            </div>
            
            {resolvedParams.total && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-ink-mid text-sm font-semibold">Total invertido</span>
                <strong className="text-xl font-serif text-rose-dark">
                  ${Number(resolvedParams.total).toLocaleString()} MXN
                </strong>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/explorar"
            className="group inline-flex items-center gap-2 bg-rose text-white rounded-full px-10 py-4 font-bold hover:bg-rose-dark transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose/20"
          >
            <span>Crear otra experiencia</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
      
      {/* Visual reward background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(212,83,126,0.05),transparent_60%)]" />
    </div>
  )
}
