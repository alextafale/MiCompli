'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowBack, Send, Person, Email, Message, AttachMoney } from '@mui/icons-material'
import type { Experiencia } from '@/types'

type OcasionTipo = 'cumpleanos' | 'aniversario_laboral' | 'onboarding' | 'reconocimiento' | 'regalo_cliente' | 'dia_especial' | 'sin_ocasion'

const OCASIONES = [
    { val: 'cumpleanos', label: 'Cumpleaños', emoji: '🎂' },
    { val: 'aniversario_laboral', label: 'Aniversario laboral', emoji: '🏆' },
    { val: 'onboarding', label: 'Bienvenida / Onboarding', emoji: '🎁' },
    { val: 'reconocimiento', label: 'Reconocimiento', emoji: '⭐' },
    { val: 'regalo_cliente', label: 'Regalo a cliente', emoji: '💼' },
    { val: 'dia_especial', label: 'Día especial', emoji: '✨' },
    { val: 'sin_ocasion', label: 'Sin ocasión específica', emoji: '🎀' },
]

export default function NuevoEnvioPage() {
    const supabase = createClient()
    const router = useRouter()

    const [empresa, setEmpresa] = useState<any>(null)
    const [productos, setProductos] = useState<Experiencia[]>([])
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: ocasión, 2: destinatario, 3: producto, 4: confirmación

    const [form, setForm] = useState({
        ocasion: '' as OcasionTipo | '',
        para_nombre: '',
        para_email: '',
        mensaje: '',
        presupuesto: 500,
        experiencia_id: '',
    })

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: emp } = await supabase
                .from('empresas')
                .select('*')
                .eq('perfil_id', user.id)
                .single()

            setEmpresa(emp)

            const { data: prods } = await supabase
                .from('experiencias')
                .select('*')
                .in('audiencia', ['b2b', 'ambos'])
                .eq('activo', true)
                .lte('precio_base', form.presupuesto + 200)

            setProductos(prods ?? [])
        }
        load()
    }, [])

    // Recargar productos cuando cambia presupuesto
    useEffect(() => {
        async function recargarProductos() {
            const { data } = await supabase
                .from('experiencias')
                .select('*')
                .in('audiencia', ['b2b', 'ambos'])
                .eq('activo', true)
                .lte('precio_base', form.presupuesto + 200)
            setProductos(data ?? [])
        }
        recargarProductos()
    }, [form.presupuesto])

    const handleEnviar = async () => {
        if (!form.para_nombre || !form.para_email || !form.ocasion) {
            toast.error('Completa todos los campos requeridos')
            return
        }
        setLoading(true)
        try {
            const { error } = await supabase
                .from('envios_corporativos')
                .insert({
                    empresa_id: empresa.id,
                    ocasion: form.ocasion,
                    para_nombre: form.para_nombre,
                    para_email: form.para_email,
                    mensaje: form.mensaje || null,
                    presupuesto: form.presupuesto,
                    experiencia_id: form.experiencia_id || null,
                    estado: 'enviado',
                })

            if (error) throw error
            toast.success('¡Envío creado! El link se mandará al destinatario.')
            router.push('/dashboard/empresa')
        } catch (e: any) {
            toast.error('Error: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    const steps = ['Ocasión', 'Destinatario', 'Regalo', 'Confirmar']

    return (
        <div className="pt-[80px] min-h-screen bg-[#F9F9F9]">
            <div className="max-w-2xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/dashboard/empresa" className="w-10 h-10 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center hover:border-rose/30 transition-colors">
                        <ArrowBack className="text-ink/50 text-lg" />
                    </Link>
                    <div>
                        <p className="text-[10px] uppercase tracking-[2px] text-ink/40 font-bold">Nuevo envío</p>
                        <h1 className="font-display text-2xl font-bold text-ink">Crear regalo corporativo</h1>
                    </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-2 mb-10">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center gap-2 flex-1">
                            <div className={`flex items-center gap-2 ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${step > i + 1 ? 'bg-rose text-white' :
                                    step === i + 1 ? 'bg-ink text-white' :
                                        'bg-black/10 text-ink/30'
                                    }`}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-[1px] hidden sm:block ${step === i + 1 ? 'text-ink' : 'text-ink/30'
                                    }`}>{s}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`flex-1 h-[2px] rounded-full transition-all ${step > i + 1 ? 'bg-rose' : 'bg-black/10'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* Step 1: Ocasión */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[32px] p-8 border border-black/[0.04]"
                        >
                            <h2 className="font-display text-xl font-bold text-ink mb-2">¿Cuál es la ocasión?</h2>
                            <p className="text-ink/40 text-sm mb-8">Selecciona el motivo del regalo</p>
                            <div className="grid grid-cols-2 gap-3">
                                {OCASIONES.map(oc => (
                                    <button
                                        key={oc.val}
                                        onClick={() => setForm(f => ({ ...f, ocasion: oc.val as OcasionTipo }))}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${form.ocasion === oc.val
                                            ? 'border-rose bg-rose/5 shadow-sm'
                                            : 'border-black/[0.06] hover:border-rose/30'
                                            }`}
                                    >
                                        <span className="text-2xl">{oc.emoji}</span>
                                        <span className="text-[13px] font-semibold text-ink">{oc.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => form.ocasion && setStep(2)}
                                disabled={!form.ocasion}
                                className="w-full mt-8 bg-ink text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-rose transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Continuar →
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Destinatario */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[32px] p-8 border border-black/[0.04]"
                        >
                            <h2 className="font-display text-xl font-bold text-ink mb-2">¿Para quién es?</h2>
                            <p className="text-ink/40 text-sm mb-8">Le enviaremos un link para que elija su regalo</p>

                            <div className="space-y-4">
                                <Field
                                    icon={<Person className="text-ink/30 text-lg" />}
                                    label="Nombre del destinatario *"
                                    value={form.para_nombre}
                                    onChange={v => setForm(f => ({ ...f, para_nombre: v }))}
                                    placeholder="María González"
                                />
                                <Field
                                    icon={<Email className="text-ink/30 text-lg" />}
                                    label="Email del destinatario *"
                                    value={form.para_email}
                                    onChange={v => setForm(f => ({ ...f, para_email: v }))}
                                    placeholder="maria@empresa.com"
                                    type="email"
                                />
                                <Field
                                    icon={<Message className="text-ink/30 text-lg" />}
                                    label="Mensaje personal (opcional)"
                                    value={form.mensaje}
                                    onChange={v => setForm(f => ({ ...f, mensaje: v }))}
                                    placeholder="Felicidades por tu aniversario..."
                                    textarea
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setStep(1)} className="flex-1 border border-black/10 text-ink rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:border-rose/30 transition-all">
                                    ← Atrás
                                </button>
                                <button
                                    onClick={() => form.para_nombre && form.para_email && setStep(3)}
                                    disabled={!form.para_nombre || !form.para_email}
                                    className="flex-1 bg-ink text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-rose transition-all disabled:opacity-30"
                                >
                                    Continuar →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Presupuesto y producto */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[32px] p-8 border border-black/[0.04]"
                        >
                            <h2 className="font-display text-xl font-bold text-ink mb-2">Define el regalo</h2>
                            <p className="text-ink/40 text-sm mb-8">Puedes elegir un regalo específico o dejar que el destinatario elija</p>

                            {/* Presupuesto */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <AttachMoney className="text-rose" />
                                    <label className="text-[12px] font-bold uppercase tracking-[1.5px] text-ink/60">Presupuesto</label>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {[300, 500, 800, 1200, 2000].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setForm(f => ({ ...f, presupuesto: p }))}
                                            className={`px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${form.presupuesto === p
                                                ? 'bg-rose text-white border-rose'
                                                : 'border-black/10 text-ink/60 hover:border-rose/30'
                                                }`}
                                        >
                                            ${p.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Opción: el destinatario elige */}
                            <button
                                onClick={() => setForm(f => ({ ...f, experiencia_id: '' }))}
                                className={`w-full flex items-center gap-4 p-5 rounded-2xl border mb-4 text-left transition-all ${form.experiencia_id === ''
                                    ? 'border-rose bg-rose/5'
                                    : 'border-black/[0.06] hover:border-rose/30'
                                    }`}
                            >
                                <span className="text-3xl">🎀</span>
                                <div>
                                    <p className="font-bold text-ink text-[14px]">El destinatario elige</p>
                                    <p className="text-ink/40 text-[12px]">Le mostramos el catálogo y él/ella decide</p>
                                </div>
                                {form.experiencia_id === '' && (
                                    <span className="ml-auto text-rose font-bold text-lg">✓</span>
                                )}
                            </button>

                            {/* Productos específicos */}
                            {productos.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold">O elige uno específico</p>
                                    {productos.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setForm(f => ({ ...f, experiencia_id: p.id }))}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${form.experiencia_id === p.id
                                                ? 'border-rose bg-rose/5'
                                                : 'border-black/[0.06] hover:border-rose/30'
                                                }`}
                                        >
                                            <span className="text-2xl">{p.emoji}</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-ink text-[13px]">{p.nombre}</p>
                                                <p className="text-ink/40 text-[11px]">${p.precio_base.toLocaleString()} MXN</p>
                                            </div>
                                            {form.experiencia_id === p.id && (
                                                <span className="text-rose font-bold">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setStep(2)} className="flex-1 border border-black/10 text-ink rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:border-rose/30 transition-all">
                                    ← Atrás
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="flex-1 bg-ink text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-rose transition-all"
                                >
                                    Continuar →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Confirmación */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[32px] p-8 border border-black/[0.04]"
                        >
                            <h2 className="font-display text-xl font-bold text-ink mb-2">Confirma el envío</h2>
                            <p className="text-ink/40 text-sm mb-8">Revisa los detalles antes de enviar</p>

                            <div className="space-y-4 mb-8">
                                <Row label="Ocasión" value={OCASIONES.find(o => o.val === form.ocasion)?.label ?? ''} emoji={OCASIONES.find(o => o.val === form.ocasion)?.emoji} />
                                <Row label="Para" value={form.para_nombre} />
                                <Row label="Email" value={form.para_email} />
                                <Row label="Presupuesto" value={`$${form.presupuesto.toLocaleString()} MXN`} />
                                <Row
                                    label="Regalo"
                                    value={form.experiencia_id
                                        ? productos.find(p => p.id === form.experiencia_id)?.nombre ?? 'Específico'
                                        : 'El destinatario elige'}
                                />
                                {form.mensaje && <Row label="Mensaje" value={form.mensaje} />}
                            </div>

                            <div className="bg-rose/5 border border-rose/10 rounded-2xl p-4 mb-8 text-sm text-rose leading-relaxed">
                                🎁 Una vez confirmado, {form.para_nombre} recibirá un link por email para elegir o recibir su regalo.
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(3)} className="flex-1 border border-black/10 text-ink rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:border-rose/30 transition-all">
                                    ← Atrás
                                </button>
                                <button
                                    onClick={handleEnviar}
                                    disabled={loading}
                                    className="flex-1 bg-rose text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <><Send className="text-base" /> Enviar regalo</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}

function Field({ icon, label, value, onChange, placeholder = '', type = 'text', textarea = false }: {
    icon?: React.ReactNode
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
    textarea?: boolean
}) {
    return (
        <div>
            <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>}
                {textarea ? (
                    <textarea
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] resize-none transition-all"
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`w-full py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] transition-all ${icon ? 'pl-11 pr-4' : 'px-4'}`}
                    />
                )}
            </div>
        </div>
    )
}

function Row({ label, value, emoji }: { label: string; value: string; emoji?: string }) {
    return (
        <div className="flex justify-between items-start gap-4 py-3 border-b border-black/[0.04] last:border-0">
            <span className="text-[12px] uppercase tracking-[1px] text-ink/30 font-bold flex-shrink-0">{label}</span>
            <span className="text-[14px] font-semibold text-ink text-right">
                {emoji && <span className="mr-1">{emoji}</span>}{value}
            </span>
        </div>
    )
}