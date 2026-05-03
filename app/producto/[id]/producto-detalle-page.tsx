import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductoDetalleClient from './ProductoDetalleClient'

interface Props {
    params: Promise<{ id: string }>
}

export default async function ProductoPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()
    const db = supabase as any

    const { data: producto } = await db
        .from('productos')
        .select(`
      *,
      proveedor:profiles(id, full_name, email),
      categoria:categorias(nombre, slug, emoji)
    `)
        .eq('id', id)
        .eq('activo', true)
        .single()

    if (!producto) notFound()

    // Más productos del mismo proveedor
    const { data: masProductos } = await db
        .from('productos')
        .select('id, nombre, precio, emoji, categoria:categorias(nombre, emoji)')
        .eq('proveedor_id', producto.proveedor_id)
        .eq('activo', true)
        .eq('aprobado', true)
        .neq('id', id)
        .limit(3)

    return (
        <ProductoDetalleClient
            producto={producto}
            masProductos={masProductos ?? []}
        />
    )
}