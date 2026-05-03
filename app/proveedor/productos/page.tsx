import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Tables } from '@/types/supabase'
import { AddCircleOutlined } from '@mui/icons-material'
import ProductosTable from '@/components/proveedor/ProductosTable'

export default async function MisProductosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: productos } = await supabase
    .from('productos')
    .select('*, categorias(nombre, emoji)')
    .eq('proveedor_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[3px] text-rose font-bold mb-2">Proveedor</p>
          <h1 className="font-display text-4xl font-bold text-ink mb-2">Mis Productos</h1>
          <p className="text-ink/50 text-sm">Gestiona tu catálogo de productos.</p>
        </div>
        <Link
          href="/proveedor/productos/nuevo"
          className="flex-shrink-0 flex items-center gap-2 bg-rose text-white rounded-full px-6 py-3 text-sm font-bold hover:bg-rose-dark transition-all shadow-lg shadow-rose/20"
        >
          <AddCircleOutlined sx={{ fontSize: 18 }} />
          Nuevo producto
        </Link>
      </div>

      <ProductosTable productos={productos ?? []} />
    </div>
  )
}
