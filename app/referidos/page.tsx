'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
    ContentCopy, CheckCircle, WhatsApp,
    Facebook, Share, CardGiftcard, Groups,
} from '@mui/icons-material'
import Link from 'next/link'

export default function ReferidosPage() {
    const supabase = createClient()
    const db = supabase as any
    const [perfil, setPerfil] = useState<any>(null)
    const [referido, setReferido] = useState<any>(null)
    const [usos, setUsos] = useState<any[]>([])
    const [copiado, setCopiado] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => { cargar() }, [])

    async function cargar() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        setPerfil(p)

        // Buscar o crear referido
        let { data: ref } = await db
            .from('referidos')
            .select('*')
            .eq('usuario_id', user.id)
            .single()

        if (!ref) {
            // Generar código único
            const nombre = p?.full_name ?? 'USER'
            const base = nombre.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'MC'
            const codigo = base + Math.floor(1000 + Math.random() * 9000)

            const { data: nuevo } = await db
                .from('referidos')
                .insert({ usuario_id: user.id, codigo })
                .select()
                .single()
            ref = nuevo
        }

        setReferido(ref)

        // Cargar usos
        if (ref) {
            const { data: usosData } = await db
                .from('referido_usos')
                .select('*, nuevo_usuario:profiles(full_name, email)')
                .eq('referido_id', ref.id)
                .order('created_at', { ascending: false })
            setUsos(usosData ?? [])
        }

        setLoading(false)
    }

    const copiarCodigo = () => {
        navigator.clipboard.writeText(referido?.codigo ?? '')
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2000)
        toast.success('Código copiado')
    }

    const linkReferido = `https://micompli.com/registro?ref=${referido?.codigo ?? ''}`

    const compartirWhatsApp = () => {
        const texto = `¡Descubre experiencias increíbles en micompli! 🎁 Usa mi código *${referido?.codigo}* al registrarte y ambos recibimos $200 MXN en experiencias. ${linkReferido}`
        window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
    }

    const compartirFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkReferido)}`, '_blank')
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#FDF8F5] pt-[80px] px-4 py-12">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="w-20 h-20 rounded-[28px] bg-rose/10 flex items-center justify-center mx-auto mb-6">
                        <CardGiftcard className="text-rose text-4xl" style={{ fontSize: '2.5rem' }} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[3px] text-rose font-bold mb-3">
                        Invita y gana
                    </p>
                    <h1 className="font-display text-4xl font-bold text-ink mb-4">
                        Comparte y recibe{' '}
                        <span className="text-rose">$200 MXN</span>
                    </h1>
                    <p className="text-ink/50 leading-relaxed">
                        Invita a tus amigos y ambos reciben $200 MXN en experiencias cuando hagan su primera reserva.
                    </p>
                </motion.div>

                {/* Código */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[32px] p-8 border border-black/[0.04] mb-6"
                >
                    <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-4">
                        Tu código de referido
                    </p>
                    <div className="flex items-center gap-4 bg-[#F9F9F9] rounded-2xl p-4 mb-6">
                        <span className="font-display text-3xl font-black text-ink tracking-[4px] flex-1">
                            {referido?.codigo}
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copiarCodigo}
                            className="flex items-center gap-2 bg-rose text-white rounded-xl px-4 py-2.5 text-[12px] font-bold uppercase tracking-[1px] hover:bg-ink transition-all"
                        >
                            {copiado ? <CheckCircle className="text-sm" /> : <ContentCopy className="text-sm" />}
                            {copiado ? 'Copiado' : 'Copiar'}
                        </motion.button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: referido?.total_referidos ?? 0, label: 'Amigos referidos' },
                            { value: `$${(referido?.creditos_ganados ?? 0).toLocaleString()}`, label: 'Créditos ganados' },
                            { value: `$${(200 * (referido?.total_referidos ?? 0)).toLocaleString()}`, label: 'Total ahorrado' },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <p className="font-display text-2xl font-black text-ink">{s.value}</p>
                                <p className="text-[10px] text-ink/30 uppercase tracking-[1px] font-semibold mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Compartir */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[32px] p-8 border border-black/[0.04] mb-6"
                >
                    <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-5">
                        Comparte tu código
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={compartirWhatsApp}
                            className="flex items-center justify-center gap-3 bg-[#25D366]/10 text-[#25D366] rounded-2xl py-4 font-bold text-[13px] hover:bg-[#25D366]/20 transition-all"
                        >
                            <WhatsApp /> WhatsApp
                        </button>
                        <button
                            onClick={compartirFacebook}
                            className="flex items-center justify-center gap-3 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl py-4 font-bold text-[13px] hover:bg-[#1877F2]/20 transition-all"
                        >
                            <Facebook /> Facebook
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(linkReferido)
                                toast.success('Link copiado')
                            }}
                            className="col-span-2 flex items-center justify-center gap-3 border border-black/8 text-ink/60 rounded-2xl py-4 font-bold text-[13px] hover:border-rose/30 hover:text-rose transition-all"
                        >
                            <Share /> Copiar link de invitación
                        </button>
                    </div>
                </motion.div>

                {/* Cómo funciona */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-ink rounded-[32px] p-8 mb-6"
                >
                    <p className="text-[11px] uppercase tracking-[2px] text-rose font-bold mb-6">
                        Cómo funciona
                    </p>
                    <div className="space-y-5">
                        {[
                            { num: '01', title: 'Comparte tu código', desc: 'Envía tu código o link a tus amigos por WhatsApp, Instagram o donde quieras.' },
                            { num: '02', title: 'Tu amigo se registra', desc: 'Usa tu código al crear su cuenta en micompli.' },
                            { num: '03', title: 'Ambos ganan $200 MXN', desc: 'Cuando haga su primera reserva, ambos reciben créditos automáticamente.' },
                        ].map((paso, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-xl bg-rose/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-rose text-[11px] font-black">{paso.num}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-white text-[14px] mb-1">{paso.title}</p>
                                    <p className="text-white/40 text-[12px] leading-relaxed">{paso.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Historial de referidos */}
                {usos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-[32px] p-8 border border-black/[0.04]"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Groups className="text-rose" />
                            <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold">
                                Amigos que invitaste
                            </p>
                        </div>
                        <div className="space-y-3">
                            {usos.map((uso, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-black/[0.04] last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-rose/10 flex items-center justify-center text-rose font-black text-[11px]">
                                            {uso.nuevo_usuario?.full_name?.charAt(0) ?? '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-ink text-[13px]">
                                                {uso.nuevo_usuario?.full_name ?? uso.nuevo_usuario?.email ?? 'Usuario'}
                                            </p>
                                            <p className="text-ink/30 text-[11px]">
                                                {new Date(uso.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-bold text-[13px]">
                                        +${uso.credito_otorgado} MXN
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    )
}