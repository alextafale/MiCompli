import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import type { Tables } from '@/types/supabase'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = data as Tables<'profiles'> | null

  // ── Redireccionamiento por rol ───────────────────────────
  // Clientes no tienen dashboard
  if (profile?.role === 'cliente') redirect('/')

  // Empresas tienen su propio dashboard sin sidebar de proveedor
  if (profile?.role === 'empresa') redirect('/dashboard/empresa')

  // Admins y cómplices (proveedores) usan este layout
  // Si no tiene rol reconocido, mandar al home
  if (!profile?.role || !['complice', 'admin'].includes(profile.role)) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen pt-[60px]">
      <DashboardSidebar profile={profile} />
      <main className="flex-1 bg-cream p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}