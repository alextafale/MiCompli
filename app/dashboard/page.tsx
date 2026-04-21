import { createClient } from '@/lib/supabase/server'
import DashboardStats from '@/components/dashboard/DashboardStats'
import OrdenesTable from '@/components/dashboard/OrdenesTable'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: ordenes } = await supabase
    .from('orden_complices')
    .select('*, orden:ordenes(*, experiencia:experiencias(nombre,emoji))')
    .eq('complice_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-1">Dashboard</h1>
        <p className="text-ink-mid text-sm">Tus órdenes y métricas del mes</p>
      </div>
      <DashboardStats ordenes={ordenes ?? []} />
      <OrdenesTable ordenes={ordenes ?? []} />
    </div>
  )
}
