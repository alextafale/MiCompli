'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

import {
  DashboardOutlined,
  Inventory2Outlined,
  AddCircleOutlined,
  SettingsOutlined,
  StorefrontOutlined,
} from '@mui/icons-material'

const NAV = [
  { href: '/proveedor/dashboard', icon: DashboardOutlined, label: 'Dashboard' },
  { href: '/proveedor/productos', icon: Inventory2Outlined, label: 'Mis productos' },
  { href: '/proveedor/productos/nuevo', icon: AddCircleOutlined, label: 'Subir producto' },
  { href: '/proveedor/perfil', icon: SettingsOutlined, label: 'Perfil' },
]

export default function ProveedorSidebar({ profile }: { profile: Profile | null }) {
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
      <div className="px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative h-20 w-full mb-5"
        >
          <Image
            src="/images/micompliLOGO.jpeg"
            alt="MiCompli Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </motion.div>
        <div className="flex items-center gap-2">
          <StorefrontOutlined sx={{ fontSize: 14 }} className="text-rose" />
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-rose/60">Portal Proveedor</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV.map((item, i) => {
          const isActive = pathname === item.href || (item.href !== '/proveedor/dashboard' && pathname.startsWith(item.href))
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 ${isActive
                  ? 'bg-ink text-white shadow-premium'
                  : 'text-ink/50 hover:text-ink hover:bg-black/5'
                  }`}
              >
                <item.icon
                  className={`transition-colors ${isActive ? 'text-rose' : 'text-ink/40'}`}
                  sx={{ fontSize: 18 }}
                />
                {item.label}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <div className="px-8 py-8 border-t border-black/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose font-bold text-xs">
            {profile?.full_name?.charAt(0) ?? 'P'}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[13px] font-bold text-ink truncate leading-none mb-1">
              {profile?.full_name ?? 'Proveedor'}
            </p>
            <p className="text-[10px] text-ink/40 font-medium">Proveedor Verificado</p>
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
