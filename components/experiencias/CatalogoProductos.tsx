'use client'
import Link from 'next/link'

type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagenes: string[] | null
  emoji: string | null
  audiencia: string
  categorias?: { nombre: string; emoji: string | null; slug: string } | null
  profiles?: { full_name: string | null } | null
}

export default function CatalogoProductos({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="font-display text-2xl font-bold text-ink mb-2">No hay productos aún</h3>
        <p className="text-ink/50">Prueba con otros filtros o categorías.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((p, i) => (
        <Link
          key={p.id}
          href={`/explorar/productos/${p.id}`}
          className="group bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          {/* Image / Emoji */}
          <div className="relative h-52 bg-gradient-to-br from-rose/5 to-cream overflow-hidden">
            {p.imagenes && p.imagenes.length > 0 ? (
              <img
                src={p.imagenes[0]}
                alt={p.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {p.emoji ?? '✨'}
              </div>
            )}
            {/* Audiencia badge */}
            {p.audiencia !== 'ambos' && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wide text-ink/60">
                {p.audiencia === 'b2b' ? 'Empresas' : 'Personal'}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {p.categorias && (
              <p className="text-[10px] uppercase tracking-[2px] text-rose font-bold mb-2">
                {p.categorias.emoji} {p.categorias.nombre}
              </p>
            )}
            <h3 className="font-display font-bold text-ink text-base mb-1 line-clamp-2 group-hover:text-rose transition-colors">
              {p.nombre}
            </h3>
            <p className="text-xs text-ink/40 line-clamp-2 mb-4">
              {p.descripcion}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-display font-bold text-ink">
                ${Number(p.precio).toLocaleString('es-MX')}
                <span className="text-xs font-normal text-ink/40 ml-1">MXN</span>
              </p>
              <span className="text-[10px] text-ink/30 font-medium">
                {p.profiles?.full_name ?? 'Proveedor'}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
