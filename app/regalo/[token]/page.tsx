import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RecibirRegaloClient from './RecibirRegaloClient'

interface Props {
    params: Promise<{ token: string }>
}

export default async function RecibirRegaloPage({ params }: Props) {
    const { token } = await params
    const supabase = await createClient()

    const { data: envio } = await supabase
        .from('envios_corporativos')
        .select(`
      *,
      empresa:empresas(nombre_empresa, logo_url),
      experiencia:experiencias(*)
    `)
        .eq('token_unico', token)
        .single()

    if (!envio) notFound()

    // Si ya eligió, mostrar confirmación
    if (envio.estado === 'completado') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] px-6">
                <div className="text-center max-w-md">
                    <p className="text-6xl mb-6">🎉</p>
                    <h1 className="font-display text-3xl font-bold text-ink mb-4">
                        ¡Ya recibiste tu regalo!
                    </h1>
                    <p className="text-ink/50">
                        Tu regalo está en camino. Pronto recibirás más detalles en tu email.
                    </p>
                </div>
            </div>
        )
    }

    // Si expiró
    if (envio.estado === 'expirado') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] px-6">
                <div className="text-center max-w-md">
                    <p className="text-6xl mb-6">😔</p>
                    <h1 className="font-display text-3xl font-bold text-ink mb-4">
                        Este link ya expiró
                    </h1>
                    <p className="text-ink/50">
                        El enlace para recibir tu regalo ya no está disponible. Contacta a tu empresa para más información.
                    </p>
                </div>
            </div>
        )
    }

    return <RecibirRegaloClient envio={envio} token={token} />
}