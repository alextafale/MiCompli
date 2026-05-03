import { createClient } from '@/lib/supabase/server'
import CatalogGrid from '@/components/experiencia/CatalogGrid'
import type { OcasionTipo } from '@/types'

export const revalidate = 60

type Audiencia = 'b2b' | 'b2c' | 'ambos'

interface SearchParams {
  audiencia?: Audiencia
  ocasion?: string
  cat?: string
  categoria?: string
}

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const db = supabase as any

  // ── Categorías dinámicas ─────────────────────────────────
  const { data: categorias } = await db
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('orden')

  // ── Productos de proveedores aprobados ───────────────────
  let prodQuery = db
    .from('productos')
    .select(`*, proveedor:profiles(full_name), categoria:categorias(nombre, slug, emoji)`)
    .eq('activo', true)
    .eq('aprobado', true)

  if (params.audiencia && params.audiencia !== 'ambos') {
    prodQuery = prodQuery.in('audiencia', [params.audiencia, 'ambos'])
  }

  const { data: productos } = await prodQuery.order('created_at', { ascending: false })

  // ── Experiencias legacy ──────────────────────────────────
  let expQuery = supabase
    .from('experiencias')
    .select('*, addons:experiencia_addons(*)')
    .eq('activo', true)

  if (params.audiencia && params.audiencia !== 'ambos') {
    expQuery = expQuery.in('audiencia', [params.audiencia, 'ambos'] as any)
  }

  // Cast string → OcasionTipo para evitar error TS2345
  if (params.ocasion) {
    expQuery = expQuery.eq('ocasion', params.ocasion as OcasionTipo)
  }

  if (params.cat === 'regalos') {
    expQuery = expQuery.eq('categoria', 'regalo')
  } else if (params.cat === 'experiencias') {
    expQuery = expQuery.eq('categoria', 'experiencia')
  }

  const { data: experiencias } = await expQuery.order('created_at', { ascending: false })

  return (
    <CatalogGrid
      experiencias={(experiencias ?? []) as any}
      productos={productos ?? []}
      categorias={categorias ?? []}
      audienciaInicial={
        params.audiencia === 'b2b' ? 'b2b' :
          params.audiencia === 'b2c' ? 'b2c' : 'todos'
      }
      categoriaInicial={params.categoria ?? ''}
    />
  )
}