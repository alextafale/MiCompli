import { createClient } from '@/lib/supabase/server'
import NuevoProductoForm from '@/components/proveedor/NuevoProductoForm'

export default async function NuevoProductoPage() {
  const supabase = await createClient()

  const { data: categorias } = await supabase
    .from('categorias')
    .select('id, nombre, slug, emoji')
    .eq('activa', true)
    .order('orden', { ascending: true })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[3px] text-rose font-bold mb-2">Proveedor</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-2">Nuevo Producto</h1>
        <p className="text-ink/50 text-sm">
          Completa la información. Nuestro equipo revisará y aprobará tu producto antes de publicarlo.
        </p>
      </div>

      <NuevoProductoForm
        categorias={categorias ?? []}
        proveedorId={user!.id}
      />
    </div>
  )
}
