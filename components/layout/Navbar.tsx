'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Close } from '@mui/icons-material'
import UserMenu from './UserMenu'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()
  
  const closeMenu = () => setIsMobileMenuOpen(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
        setUserRole(profile?.role ?? null)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setUserRole(profile?.role ?? null)
      } else {
        setUserRole(null)
      }
    })
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navLink = "text-[11px] font-semibold uppercase tracking-[1px] text-ink/70 hover:text-rose transition-all duration-300 relative group whitespace-nowrap"
  const underline = "absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-rose/40 rounded-full transition-all duration-300 group-hover:w-8"

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 h-[72px] md:h-[80px] transition-all duration-500 ${isScrolled
          ? 'bg-cream/40 backdrop-blur-xl border-b border-rose/5 shadow-premium'
          : 'bg-transparent'
        }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, filter: 'drop-shadow(0 0 15px rgba(212,83,126,0.2))' }}
          whileTap={{ scale: 0.95 }}
          className="relative h-10 w-36 md:h-14 md:w-56"
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

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {/* Link Empresas — destacado */}
          <Link href="/empresas" className={navLink}>
            Empresas
            <span className={underline} />
          </Link>

          <Link href="/explorar" className={navLink}>
            Explorar
            <span className={underline} />
          </Link>

          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="user-nav"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="relative"
              >
                <UserMenu user={user} userRole={userRole} supabase={supabase} />
              </motion.div>
            ) : (
              <motion.div
                key="guest-nav"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-6 lg:gap-8"
              >
                <Link href="/login" className={navLink}>
                  Iniciar sesión
                  <span className={underline} />
                </Link>
                <Link href="/register?rol=complice" className={navLink}>
                  Soy Cómplice
                  <span className={underline} />
                </Link>
                <Link href="/register?rol=proveedor" className={navLink}>
                  Soy Proveedor
                  <span className={underline} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} className="hidden md:block">
          <Link
            href="/empresas/registro"
            className="whitespace-nowrap bg-rose text-white text-[10px] font-bold uppercase tracking-[1px] rounded-full px-5 py-2.5 lg:px-7 lg:py-3 hover:bg-ink transition-all duration-500 shadow-premium active:shadow-sm"
          >
            Registro empresa
          </Link>
        </motion.div>
        {/* Mobile menu toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden text-ink p-1"
        >
          <Menu />
        </button>
      </div>
    </motion.nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[100] bg-cream/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
        >
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 text-ink p-2"
          >
            <Close />
          </button>
          
          <Link href="/empresas" onClick={closeMenu} className="text-xl font-display font-bold uppercase tracking-[2px] text-ink hover:text-rose transition-colors">
            Empresas
          </Link>
          <Link href="/explorar" onClick={closeMenu} className="text-xl font-display font-bold uppercase tracking-[2px] text-ink hover:text-rose transition-colors">
            Explorar
          </Link>
          
          {user ? (
            <Link
              href={userRole === 'proveedor' ? '/proveedor/dashboard' : '/dashboard'}
              onClick={closeMenu}
              className="text-xl font-display font-bold uppercase tracking-[2px] text-ink hover:text-rose transition-colors"
            >
              Mi portal
            </Link>
          ) : (
            <>
              <Link href="/login" onClick={closeMenu} className="text-xl font-display font-bold uppercase tracking-[2px] text-ink hover:text-rose transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register?rol=complice" onClick={closeMenu} className="text-xl font-display font-bold uppercase tracking-[2px] text-ink hover:text-rose transition-colors">
                Soy Cómplice
              </Link>
              <Link href="/register?rol=proveedor" onClick={closeMenu} className="text-xl font-display font-bold uppercase tracking-[2px] text-ink hover:text-rose transition-colors">
                Soy Proveedor
              </Link>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}