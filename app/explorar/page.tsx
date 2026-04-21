import { createClient } from '@/lib/supabase/server'
import CatalogGrid from '@/components/experiencia/CatalogGrid'

export const revalidate = 60 // ISR: revalidar cada 60s

export default async function ExplorarPage() {
  const supabase = await createClient()
  const { data: experiencias } = await supabase
    .from('experiencias')
    .select('*, addons:experiencia_addons(*)')
    .eq('activo', true)
    .order('categoria')

  return <CatalogGrid experiencias={experiencias ?? []} />
}
