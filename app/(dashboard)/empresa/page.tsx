'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Send, CheckCircle, HourglassEmpty, Celebration,
    Add, Business, ArrowForward,
} from '@mui/icons-material'

type Envio = {
    id: string
    para_nombre: string | null
    para_email: string | null
    ocasion: string | null
    presupuesto: number | null
    estado: string
    created_at: string | null
    token_unico: string
}

type Stats = {
    total: number
    pendientes: number
    elegidos: number
    completados: number
}

const OCASION_LABELS: Record<string, string> = {
    cumpleanos: '🎂 Cumpleaños',
    aniversario_laboral: '🏆 Aniversario',
    onboarding: '🎁 Onboarding',
    reconocimiento: '⭐ Reconocimiento',
    regalo_cliente: '💼 Cliente VIP',
    dia_especial: '✨ Día especial',
    sin_ocasion: '🎀 Sin ocasión',
}

const ESTADO_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    pendiente: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700', icon: HourglassEmpty },
    enviado: { label: 'Enviado', color: 'bg-blue-100 text-blue-700', icon: Send },
    elegido: { label: 'Elegido', color: 'bg-purple-100 text-purple-700', icon: Celebration },
    completado: { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    expirado: { label: 'Expirado', color: 'bg-gray-100 text-gray-500', icon: HourglassEmpty },
}

export default function EmpresaDashboard() {
    const supabase = createClient()
    const [empresa, setEmpresa] = useState<any>(null)
    const [envios, setEnvios] = useState<Envio[]>([])
    const [stats, setStats] = useState<Stats>({ total: 0, pendientes: 0, elegidos: 0, completados: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: emp } = await supabase
                .from('empresas')
                .select('*')
                .eq('perfil_id', user.id)
                .single()

            if (!emp) return
            setEmpresa(emp)

            const { data: enviosData } = await supabase
                .from('envios_corporativos')
                .select('*')
                .eq('empresa_id', emp.id)
                .order('created_at', { ascending: false })

            const lista = enviosData ?? []
            setEnvios(lista)
            setStats({
                total: lista.length,
                pendientes: lista.filter(e => e.estado === 'pendiente' || e.estado === 'enviado').length,
                elegidos: lista.filter(e => e.estado === 'elegido').length,
                completados: lista.filter(e => e.estado === 'completado').length,
            })
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="pt-[80px] min-h-screen bg-[#F9F9F9]">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-ink flex items-center justify-center">
                                <Business className="text-white text-lg" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold">Panel Empresarial</p>
                                <h1 className="font-display text-2xl font-bold text-ink">{empresa?.nombre_empresa}</h1>
                            </div>
                        </div>
                    </div>
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            href="/dashboard/empresa/nuevo-envio"
                            className="flex items-center gap-2 bg-rose text-white rounded-full px-6 py-3 text-[12px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all duration-300 shadow-lg shadow-rose/20"
                        >
                            <Add className="text-lg" />
                            Nuevo envío
                        </Link>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total enviados', value: stats.total, icon: Send, color: 'text-ink' },
                        { label: 'En camino', value: stats.pendientes, icon: HourglassEmpty, color: 'text-amber-500' },
                        { label: 'Ya eligieron', value: stats.elegidos, icon: Celebration, color: 'text-purple-500' },
                        { label: 'Completados', value: stats.completados, icon: CheckCircle, color: 'text-green-500' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-[24px] p-6 border border-black/[0.04]"
                        >
                            <s.icon className={`text-2xl mb-3 ${s.color}`} />
                            <p className="font-display text-3xl font-black text-ink mb-1">{s.value}</p>
                            <p className="text-[11px] uppercase tracking-[1px] text-ink/40 font-semibold">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Envíos */}
                <div className="bg-white rounded-[32px] border border-black/[0.04] overflow-hidden">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-black/[0.04]">
                        <h2 className="font-display text-lg font-bold text-ink">Historial de envíos</h2>
                        {envios.length > 0 && (
                            <Link
                                href="/dashboard/empresa/nuevo-envio"
                                className="text-[11px] font-bold uppercase tracking-[1.5px] text-rose hover:text-ink transition-colors flex items-center gap-1"
                            >
                                Nuevo <ArrowForward className="text-sm" />
                            </Link>
                        )}
                    </div>

                    {envios.length === 0 ? (
                        <div className="text-center py-24 px-6">
                            <p className="text-5xl mb-4">🎁</p>
                            <p className="font-display text-xl font-bold text-ink mb-2">Aún no has enviado ningún regalo</p>
                            <p className="text-ink/40 text-sm mb-8">Empieza reconociendo a alguien de tu equipo hoy</p>
                            <Link
                                href="/dashboard/empresa/nuevo-envio"
                                className="inline-flex items-center gap-2 bg-rose text-white rounded-full px-8 py-3 text-[12px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all"
                            >
                                <Add /> Crear primer envío
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-black/[0.04]">
                            {envios.map((envio, i) => {
                                const estado = ESTADO_CONFIG[envio.estado] ?? ESTADO_CONFIG.pendiente
                                const EstadoIcon = estado.icon
                                return (
                                    <motion.div
                                        key={envio.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between px-8 py-5 hover:bg-[#F9F9F9] transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-rose/10 flex items-center justify-center text-lg">
                                                {OCASION_LABELS[envio.ocasion ?? '']?.split(' ')[0] ?? '🎁'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-ink text-[14px]">{envio.para_nombre}</p>
                                                <p className="text-ink/40 text-[12px]">{envio.para_email} · {OCASION_LABELS[envio.ocasion ?? ''] ?? envio.ocasion}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <p className="font-display font-bold text-ink text-[15px]">
                                                ${(envio.presupuesto ?? 0).toLocaleString()}
                                                <span className="text-[10px] text-ink/30 font-normal ml-1">MXN</span>
                                            </p>
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[1px] ${estado.color}`}>
                                                <EstadoIcon className="text-sm" />
                                                {estado.label}
                                            </span>
                                            {envio.estado === 'pendiente' && (
                                                <Link
                                                    href={`/dashboard/empresa/envio/${envio.id}`}
                                                    className="text-[11px] font-bold text-ink/30 hover:text-rose transition-colors uppercase tracking-[1px]"
                                                >
                                                    Ver →
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}