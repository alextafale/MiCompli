'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 h-[80px] transition-all duration-500 ${
        isScrolled 
          ? 'bg-cream/40 backdrop-blur-xl border-b border-rose/5 shadow-premium' 
          : 'bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ 
            scale: 1.05,
            filter: 'drop-shadow(0 0 15px rgba(212,83,126,0.2))'
          }}
          whileTap={{ scale: 0.95 }}
          className="relative h-18 w-72"
        >
          <Image
            src="/images/micompliLOGO.jpeg"
            alt="MiCompli Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </Link>

      <div className="flex items-center gap-10">
        <div className="hidden md:flex items-center gap-10">
          <Link href="/explorar" className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink/70 hover:text-rose transition-all duration-300 relative group">
            Explorar
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-rose/40 rounded-full transition-all duration-300 group-hover:w-8" />
          </Link>
          
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="user-nav"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <Link href="/dashboard" className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink/70 hover:text-rose transition-all duration-300 relative group">
                  Mi portal
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-rose/40 rounded-full transition-all duration-300 group-hover:w-8" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="guest-nav"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-10"
              >
                <Link href="/login" className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink/70 hover:text-rose transition-all duration-300 relative group">
                  Iniciar sesión
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-rose/40 rounded-full transition-all duration-300 group-hover:w-8" />
                </Link>
                <Link href="/register" className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink/70 hover:text-rose transition-all duration-300 relative group">
                  Soy Cómplice
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-rose/40 rounded-full transition-all duration-300 group-hover:w-8" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/explorar"
            className="bg-ink text-white text-[11px] font-bold uppercase tracking-[2px] rounded-full px-8 py-3 hover:bg-rose transition-all duration-500 shadow-premium active:shadow-sm"
          >
            Crear experiencia
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  )
}
