import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProveedorSidebar from '@/components/proveedor/ProveedorSidebar'
import type { Tables } from '@/types/supabase'

export default async function ProveedorLayout({
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

  if (!profile || profile.role !== 'proveedor') redirect('/')

  return (
    <div className="flex min-h-screen pt-[60px]">
      <ProveedorSidebar profile={profile} />
      <main className="flex-1 bg-cream p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
