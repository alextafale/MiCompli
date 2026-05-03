import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CatalogoProductos from '@/components/experiencias/CatalogoProductos'

export const metadata = {
  title: 'Catálogo de Proveedores — MiCompli',
  description: 'Explora productos y servicios de nuestros proveedores certificados.',
}

export default async function ExplorarProductosPage({
  searchParams,
}: {
  searchParams: { categoria?: string; audiencia?: string }
}) {
  const supabase = await createClient()

  // Categorías dinámicas
  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('orden', { ascending: true })

  // Query de productos
  let query = supabase
    .from('productos')
    .select('*, categorias(nombre, emoji, slug), profiles!productos_proveedor_id_fkey(full_name)')
    .eq('activo', true)
    .eq('aprobado', true)
    .order('created_at', { ascending: false })

  if (searchParams.categoria) {
    const cat = categorias?.find(c => c.slug === searchParams.categoria)
    if (cat) query = query.eq('categoria_id', cat.id)
  }
  if (searchParams.audiencia && searchParams.audiencia !== 'todos') {
    query = query.or(`audiencia.eq.${searchParams.audiencia},audiencia.eq.ambos`)
  }

  const { data: productos } = await query

  return (
    <div className="min-h-screen bg-cream pt-[80px] pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center py-16">
          <p className="text-[11px] uppercase tracking-[4px] text-rose font-bold mb-4">Proveedores</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Catálogo de <span className="text-rose italic">productos</span>
          </h1>
          <p className="text-ink/50 text-lg max-w-xl mx-auto">
            Descubre productos y servicios únicos de nuestros proveedores certificados.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <Link
            href="/explorar/productos"
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${!searchParams.categoria
                ? 'bg-ink text-white shadow-premium'
                : 'bg-white border border-black/8 text-ink/60 hover:text-ink hover:border-rose/20'
              }`}
          >
            ✨ Todos
          </Link>
          {(categorias ?? []).map(cat => (
            <Link
              key={cat.id}
              href={`/explorar/productos?categoria=${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${searchParams.categoria === cat.slug
                  ? 'bg-ink text-white shadow-premium'
                  : 'bg-white border border-black/8 text-ink/60 hover:text-ink hover:border-rose/20'
                }`}
            >
              {cat.emoji} {cat.nombre}
            </Link>
          ))}
        </div>

        {/* Audiencia filter */}
        <div className="flex gap-2 justify-center mb-12">
          {[
            { val: 'todos', label: 'Todos' },
            { val: 'b2c', label: 'Para personas' },
            { val: 'b2b', label: 'Para empresas' },
          ].map(a => (
            <Link
              key={a.val}
              href={`/explorar/productos?${searchParams.categoria ? `categoria=${searchParams.categoria}&` : ''}audiencia=${a.val}`}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${(searchParams.audiencia ?? 'todos') === a.val
                  ? 'border-rose bg-rose/5 text-rose'
                  : 'border-black/8 text-ink/40 hover:border-rose/20'
                }`}
            >
              {a.label}
            </Link>
          ))}
        </div>

        <CatalogoProductos productos={productos ?? []} />
      </div>
    </div>
  )
}
