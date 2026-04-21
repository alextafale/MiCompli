import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'cliente') redirect('/')

  return (
    <div className="flex min-h-screen pt-[60px]">
      <DashboardSidebar profile={profile} />
      <main className="flex-1 bg-cream p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
