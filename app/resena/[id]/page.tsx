'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Star, StarBorder, CheckCircle, ArrowForward } from '@mui/icons-material'
import Link from 'next/link'

const ASPECTOS = [
    '¡Nos encantó!',
    'Increíble lugar',
    'Excelente servicio',
    'La vista espectacular',
    'Muy romántico',
    'Superó expectativas',
    'Lo recomendaría',
    'Volvería sin duda',
]

export default function ResenaPage() {
    const params = useParams()
    const router = useRouter()
    const supabase = createClient()
    const db = supabase as any
    const ordenId = params.id as string

    const [orden, setOrden] = useState<any>(null)
    const [calificacion, setCalificacion] = useState(0)
    const [hover, setHover] = useState(0)
    const [comentario, setComentario] = useState('')
    const [aspectos, setAspectos] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [enviado, setEnviado] = useState(false)

    useEffect(() => {
        async function cargar() {
            const { data } = await supabase
                .from('ordenes')
                .select('*, experiencia:experiencias(nombre, emoji)')
                .eq('id', ordenId)
                .single()
            setOrden(data)
        }
        cargar()
    }, [ordenId])

    const toggleAspecto = (a: string) =>
        setAspectos(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

    const handleEnviar = async () => {
        if (calificacion === 0) {
            toast.error('Selecciona una calificación')
            return
        }
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            const textoFinal = [
                ...aspectos,
                comentario.trim() ? comentario.trim() : '',
            ].filter(Boolean).join('. ')

            const { error } = await db.from('resenas').insert({
                orden_id: ordenId,
                usuario_id: user?.id,
                calificacion,
                comentario: textoFinal || null,
            })

            if (error) throw error
            setEnviado(true)
        } catch (e: any) {
            toast.error('Error: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    if (enviado) {
        return (
            <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                        className="w-24 h-24 rounded-[32px] bg-rose/10 flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle className="text-rose text-5xl" style={{ fontSize: '3.5rem' }} />
                    </motion.div>
                    <h1 className="font-display text-3xl font-bold text-ink mb-4">¡Gracias por tu reseña!</h1>
                    <p className="text-ink/50 mb-10 leading-relaxed">
                        Tu opinión ayuda a otros a descubrir y elegir mejor. ¡Hasta la próxima sorpresa!
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/referidos"
                            className="w-full bg-rose text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all flex items-center justify-center gap-2"
                        >
                            Invita amigos y gana $200 MXN <ArrowForward className="text-sm" />
                        </Link>
                        <Link
                            href="/explorar"
                            className="w-full text-center text-ink/40 text-sm hover:text-rose transition-colors py-2"
                        >
                            Explorar más experiencias
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-lg">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    {orden?.experiencia && (
                        <div className="text-5xl mb-4">{orden.experiencia.emoji}</div>
                    )}
                    <p className="text-[10px] uppercase tracking-[3px] text-rose font-bold mb-3">
                        Califica tu experiencia
                    </p>
                    <h1 className="font-display text-3xl font-bold text-ink mb-2">
                        ¿Cómo fue la experiencia?
                    </h1>
                    {orden?.experiencia && (
                        <p className="text-ink/40 text-sm">{orden.experiencia.nombre}</p>
                    )}
                </motion.div>

                {/* Estrellas */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[32px] p-8 border border-black/[0.04] mb-6"
                >
                    <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-6 text-center">
                        Tu calificación
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center gap-3 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                            <motion.button
                                key={star}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setCalificacion(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                {star <= (hover || calificacion)
                                    ? <Star className="text-[#FFB800]" style={{ fontSize: '2.5rem' }} />
                                    : <StarBorder className="text-ink/20" style={{ fontSize: '2.5rem' }} />
                                }
                            </motion.button>
                        ))}
                    </div>

                    {/* Label de calificación */}
                    <AnimatePresence mode="wait">
                        {(hover || calificacion) > 0 && (
                            <motion.p
                                key={hover || calificacion}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center font-bold text-ink text-lg"
                            >
                                {['', '😕 Malo', '😐 Regular', '🙂 Bueno', '😊 Muy bueno', '🤩 ¡Increíble!'][hover || calificacion]}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Aspectos destacados */}
                <AnimatePresence>
                    {calificacion >= 3 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-[32px] p-8 border border-black/[0.04] mb-6"
                        >
                            <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-5">
                                ¿Qué destacarías?
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {ASPECTOS.map(a => (
                                    <button
                                        key={a}
                                        onClick={() => toggleAspecto(a)}
                                        className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-all ${aspectos.includes(a)
                                                ? 'bg-rose text-white border-rose'
                                                : 'border-black/8 text-ink/60 hover:border-rose/30'
                                            }`}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Comentario */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[32px] p-8 border border-black/[0.04] mb-6"
                >
                    <p className="text-[11px] uppercase tracking-[2px] text-ink/30 font-bold mb-4">
                        Cuéntanos más (opcional)
                    </p>
                    <textarea
                        value={comentario}
                        onChange={e => setComentario(e.target.value)}
                        placeholder="Incredible lugar, excelente servicio y la vista espectacular..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-[#F9F9F9] resize-none transition-all"
                    />
                </motion.div>

                {/* Submit */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnviar}
                    disabled={loading || calificacion === 0}
                    className="w-full bg-rose text-white rounded-full py-4 text-[13px] font-bold uppercase tracking-[1.5px] hover:bg-ink transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-rose/20"
                >
                    {loading
                        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : 'Publicar opinión ✨'
                    }
                </motion.button>

                <p className="text-center text-ink/30 text-xs mt-4">
                    Tu reseña ayuda a otros a descubrir experiencias increíbles
                </p>
            </div>
        </div>
    )
}