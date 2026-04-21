'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

import {
  BarChart,
  Inventory2,
  Storefront,
  Payments,
  Settings
} from '@mui/icons-material'

const NAV = [
  { href: '/dashboard', icon: BarChart, label: 'Dashboard' },
  { href: '/dashboard/ordenes', icon: Inventory2, label: 'Mis órdenes' },
  { href: '/dashboard/servicios', icon: Storefront, label: 'Mis servicios' },
  { href: '/dashboard/ganancias', icon: Payments, label: 'Ganancias' },
  { href: '/dashboard/perfil', icon: Settings, label: 'Perfil' },
]

export default function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-[260px] min-h-full bg-white border-r border-black/5 flex-shrink-0 flex flex-col shadow-sm">
      <div className="px-8 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-14 w-48 mb-2"
        >
          <Image
            src="/images/micompliLOGO.jpeg"
            alt="MiCompli Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        <p className="text-[10px] uppercase tracking-[3px] font-bold text-ink/10">Portal Cómplice</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 ${isActive
                  ? 'bg-ink text-white shadow-premium'
                  : 'text-ink/50 hover:text-ink hover:bg-black/5'
                }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-rose' : 'text-ink/40'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-8 py-8 border-t border-black/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-rose-light flex items-center justify-center text-rose font-bold text-xs">
            {profile?.full_name?.charAt(0) ?? 'C'}
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-bold text-ink truncate leading-none mb-1">{profile?.full_name ?? 'Cómplice'}</p>
            <p className="text-[10px] text-ink/40 font-medium">Plan Pro</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[1px] text-ink/30 hover:text-rose border border-black/5 rounded-lg transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
