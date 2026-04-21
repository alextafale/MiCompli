import { createClient } from '@/lib/supabase/server'
import ExperienciaBuilder from '@/components/experiencia/ExperienciaBuilder'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ExperienciaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: experiencia } = await supabase
    .from('experiencias')
    .select('*, addons:experiencia_addons(*)')
    .eq('id', id)
    .eq('activo', true)
    .single()

  if (!experiencia) notFound()

  return <ExperienciaBuilder experiencia={experiencia} />
}
