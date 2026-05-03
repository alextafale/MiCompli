'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyboardArrowDown, Logout, Settings } from '@mui/icons-material'
import Link from 'next/link'

export default function EmpresaNavClient({ nombre }: { nombre: string }) {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-[#F9F9F9] border border-black/[0.06] rounded-full px-4 py-2 hover:border-rose/30 transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-rose/10 flex items-center justify-center text-rose font-black text-[11px]">
          {nombre.charAt(0)}
        </div>
        <span className="text-[12px] font-semibold text-ink/60 max-w-[120px] truncate">{nombre}</span>
        <KeyboardArrowDown className={`text-ink/30 text-sm transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-12 bg-white rounded-2xl border border-black/[0.06] shadow-xl p-2 w-48 z-20"
            >
              <Link
                href="/dashboard/empresa/perfil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] text-ink/60 hover:bg-[#F9F9F9] hover:text-ink transition-all"
              >
                <Settings className="text-sm" /> Configuración
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] text-rose hover:bg-rose/5 transition-all"
              >
                <Logout className="text-sm" /> Cerrar sesión
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}