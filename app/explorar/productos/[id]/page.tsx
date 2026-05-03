import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowBack } from '@mui/icons-material'
import ProductoDetalle from '@/components/experiencias/ProductoDetalle'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('productos')
    .select('nombre, descripcion')
    .eq('id', id)
    .single()
  return {
    title: data ? `${data.nombre} — MiCompli` : 'Producto — MiCompli',
    description: data?.descripcion,
  }
}

export default async function ProductoDetallePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: producto } = await supabase
    .from('productos')
    .select('*, categorias(nombre, emoji, slug), profiles!productos_proveedor_id_fkey(id, full_name, email)')
    .eq('id', id)
    .eq('activo', true)
    .eq('aprobado', true)
    .single()

  if (!producto) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-cream pt-[80px] pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Link
          href="/explorar/productos"
          className="inline-flex items-center gap-2 text-ink/40 hover:text-rose text-sm font-medium transition-colors mb-8 mt-6"
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          Volver al catálogo
        </Link>
        <ProductoDetalle producto={producto} userId={user?.id ?? null} />
      </div>
    </div>
  )
}