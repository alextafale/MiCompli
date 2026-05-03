import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NuevoProductoForm from '@/components/proveedor/NuevoProductoForm'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditarProductoPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: producto } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .eq('proveedor_id', user.id)
    .single()

  if (!producto) notFound()

  const { data: categorias } = await supabase
    .from('categorias')
    .select('id, nombre, slug, emoji')
    .eq('activa', true)
    .order('orden', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[3px] text-rose font-bold mb-2">Proveedor</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-2">Editar Producto</h1>
        <p className="text-ink/50 text-sm">
          Los cambios se aplicarán inmediatamente en tu catálogo (si ya estaba aprobado).
        </p>
      </div>

      <NuevoProductoForm
        categorias={categorias ?? []}
        proveedorId={user.id}
        inicial={producto}
        productoId={id}
      />
    </div>
  )
}
