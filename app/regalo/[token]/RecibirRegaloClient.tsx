'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { CheckCircle, LocationOn } from '@mui/icons-material'
import type { Experiencia } from '@/types'

interface Props {
    envio: any
    token: string
}

export default function RecibirRegaloClient({ envio, token }: Props) {
    const supabase = createClient()
    const [step, setStep] = useState<'elegir' | 'direccion' | 'listo'>('elegir')
    const [regaloElegido, setRegaloElegido] = useState<Experiencia | null>(envio.experiencia ?? null)
    const [direccion, setDireccion] = useState({ calle: '', ciudad: '', cp: '', referencias: '' })
    const [loading, setLoading] = useState(false)

    const empresa = envio.empresa

    const handleConfirmar = async () => {
        if (!regaloElegido) {
            toast.error('Elige un regalo primero')
            return
        }
        setLoading(true)
        try {
            const { error } = await supabase
                .from('envios_corporativos')
                .update({
                    estado: 'completado',
                    regalo_elegido_id: regaloElegido.id,
                    direccion_entrega: direccion,
                    elegido_at: new Date().toISOString(),
                })
                .eq('token_unico', token)

            if (error) throw error
            setStep('listo')
        } catch (e: any) {
            toast.error('Error al confirmar: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5]">

            {/* Header */}
            <div className="bg-white border-b border-black/[0.05] px-6 py-5 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[3px] text-ink/30 font-bold mb-1">
                        {empresa?.nombre_empresa ?? 'Tu empresa'} te envía
                    </p>
                    <h1 className="font-display text-2xl font-bold text-ink">🎁 Tienes un regalo</h1>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-6 py-12">
                <AnimatePresence mode="wait">

                    {/* Step: Elegir regalo */}
                    {step === 'elegir' && (
                        <motion.div
                            key="elegir"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Mensaje personal */}
                            <div className="bg-white rounded-[28px] p-8 border border-black/[0.04] mb-6 text-center">
                                <p className="text-4xl mb-4">💌</p>
                                <h2 className="font-display text-xl font-bold text-ink mb-3">
                                    Hola, {envio.para_nombre}
                                </h2>
                                {envio.mensaje ? (
                                    <p className="text-ink/60 leading-relaxed italic font-serif">
                                        "{envio.mensaje}"
                                    </p>
                                ) : (
                                    <p className="text-ink/40 text-sm">
                                        {empresa?.nombre_empresa ?? 'Tu empresa'} quiere reconocerte con un regalo especial.
                                    </p>
                                )}
                                <div className="mt-6 pt-6 border-t border-black/[0.04]">
                                    <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-1">Presupuesto disponible</p>
                                    <p className="font-display text-3xl font-black text-rose">
                                        ${envio.presupuesto.toLocaleString()}
                                        <span className="text-base text-ink/30 font-normal ml-2">MXN</span>
                                    </p>
                                </div>
                            </div>

                            {/* Regalo preseleccionado o libre elección */}
                            {envio.experiencia ? (
                                <div className="bg-white rounded-[28px] p-8 border border-black/[0.04] mb-6">
                                    <p className="text-[11px] uppercase tracking-[2px] text-rose font-bold mb-4">Tu regalo</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{envio.experiencia.emoji}</span>
                                        <div>
                                            <p className="font-bold text-ink text-lg">{envio.experiencia.nombre}</p>
                                            <p className="text-ink/50 text-sm">{envio.experiencia.descripcion}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setRegaloElegido(envio.experiencia); setStep('direccion') }}
                                        className="w-full mt-6 bg-rose text-white rounded-full py-4 font-bold text-[13px] uppercase tracking-[1.5px] hover:bg-ink transition-all"
                                    >
                                        ¡Lo quiero! →
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[28px] p-8 border border-black/[0.04] mb-6">
                                    <p className="text-[11px] uppercase tracking-[2px] text-rose font-bold mb-4">Elige tu regalo</p>
                                    <p className="text-ink/50 text-sm mb-6">
                                        Selecciona la experiencia que más te guste con tu presupuesto disponible.
                                    </p>
                                    <div className="text-center py-8 text-ink/30">
                                        <p className="text-4xl mb-3">🎀</p>
                                        <p className="font-bold">Catálogo disponible próximamente</p>
                                        <p className="text-sm">Por ahora tu empresa elegirá el regalo perfecto para ti.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step: Dirección */}
                    {step === 'direccion' && (
                        <motion.div
                            key="direccion"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="bg-white rounded-[28px] p-8 border border-black/[0.04] mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <LocationOn className="text-rose text-2xl" />
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-ink">¿Dónde te lo enviamos?</h2>
                                        <p className="text-ink/40 text-sm">Solo necesitamos tu dirección de entrega</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'calle', label: 'Calle, número y colonia *', placeholder: 'Av. Ejemplo 123, Col. Centro' },
                                        { key: 'ciudad', label: 'Ciudad y estado *', placeholder: 'Morelia, Michoacán' },
                                        { key: 'cp', label: 'Código postal *', placeholder: '58000' },
                                        { key: 'referencias', label: 'Referencias (opcional)', placeholder: 'Casa color azul, junto al...' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">{f.label}</label>
                                            <input
                                                value={direccion[f.key as keyof typeof direccion]}
                                                onChange={e => setDireccion(d => ({ ...d, [f.key]: e.target.value }))}
                                                placeholder={f.placeholder}
                                                className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleConfirmar}
                                    disabled={loading || !direccion.calle || !direccion.ciudad || !direccion.cp}
                                    className="w-full mt-8 bg-rose text-white rounded-full py-4 font-bold text-[13px] uppercase tracking-[1.5px] hover:bg-ink transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                                >
                                    {loading
                                        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : '🎁 Confirmar mi regalo'
                                    }
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step: Listo */}
                    {step === 'listo' && (
                        <motion.div
                            key="listo"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                                className="text-8xl mb-6"
                            >
                                🎉
                            </motion.div>
                            <h2 className="font-display text-3xl font-bold text-ink mb-4">¡Listo!</h2>
                            <p className="text-ink/50 text-lg mb-8">
                                Tu regalo está confirmado. Recibirás un email con los detalles de tu entrega.
                            </p>
                            <div className="bg-white rounded-[28px] p-6 border border-black/[0.04] text-left">
                                <p className="text-[11px] uppercase tracking-[2px] text-rose font-bold mb-3">Resumen</p>
                                <p className="font-bold text-ink">{regaloElegido?.nombre}</p>
                                <p className="text-ink/40 text-sm mt-1">{direccion.calle}, {direccion.ciudad}</p>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}