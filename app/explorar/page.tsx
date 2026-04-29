import { createClient } from '@/lib/supabase/server'
import CatalogGrid from '@/components/experiencia/CatalogGrid'

export const revalidate = 60

type Audiencia = 'b2b' | 'b2c' | 'ambos'

interface SearchParams {
  audiencia?: Audiencia
  ocasion?: string
  cat?: string
}

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('experiencias')
    .select('*, addons:experiencia_addons(*)')
    .eq('activo', true)

  // Filtro por audiencia desde URL
  if (params.audiencia && params.audiencia !== 'ambos') {
    query = query.in('audiencia', [params.audiencia, 'ambos'])
  }

  // Filtro por ocasión desde URL
  if (params.ocasion) {
    query = query.eq('ocasion', params.ocasion)
  }

  // Filtro legacy por categoría
  if (params.cat === 'regalos') {
    query = query.eq('categoria', 'regalo')
  } else if (params.cat === 'experiencias') {
    query = query.eq('categoria', 'experiencia')
  }

  const { data: experiencias } = await query.order('created_at', { ascending: false })

  return (
    <CatalogGrid
      experiencias={experiencias ?? []}
      audienciaInicial={params.audiencia === 'b2b' ? 'b2b' : params.audiencia === 'b2c' ? 'b2c' : 'todos'}
    />
  )
}