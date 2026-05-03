'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyboardArrowDown, Logout, Person } from '@mui/icons-material'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
  userRole: string | null
  supabase: any
}

export default function UserMenu({ user, userRole, supabase }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const portalLink = userRole === 'proveedor' ? '/proveedor/dashboard' : '/dashboard'

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose font-bold text-xs border border-rose/20 group-hover:border-rose/40 transition-colors">
          {user.email?.charAt(0).toUpperCase() || <Person sx={{ fontSize: 16 }} />}
        </div>
        <KeyboardArrowDown 
          className={`text-ink/40 group-hover:text-rose transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          sx={{ fontSize: 18 }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-black/5 overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-black/5 bg-black/[0.02]">
                <p className="text-[10px] uppercase tracking-wider text-ink/40 font-bold mb-0.5">Usuario</p>
                <p className="text-xs text-ink font-medium truncate">{user.email}</p>
              </div>
              <div className="p-1.5">
                <Link 
                  href={portalLink}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-ink/70 hover:text-rose hover:bg-rose/5 transition-all"
                >
                  <Person sx={{ fontSize: 16 }} />
                  Mi portal
                </Link>
                <button
                  onClick={async () => {
                    setIsOpen(false)
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-ink/70 hover:text-rose hover:bg-rose/5 transition-all"
                >
                  <Logout sx={{ fontSize: 16 }} />
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
