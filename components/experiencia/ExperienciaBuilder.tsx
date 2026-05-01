'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { ExperienciaConAddons, AddonSeleccionado } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { LocationOn, MusicNote, Star, MailOutlined, FilterVintage } from '@mui/icons-material'
import IconMapper from '@/components/common/IconMapper'
import { getExperienceImage } from '@/lib/utils/image-fallbacks'

export default function ExperienciaBuilder({ experiencia }: { experiencia: ExperienciaConAddons }) {
  const router = useRouter()
  const addons = (experiencia.addons ?? []) as Array<{
    id: string
    tipo: 'ubicacion' | 'musica' | 'extra'
    nombre: string
    precio: number
    icon: string
    descripcion: string | null
    orden: number | null
    experiencia_id: string | null
  }>
  const ubicaciones = addons.filter(a => a.tipo === 'ubicacion')
  const musica = addons.filter(a => a.tipo === 'musica')
  const extras = addons.filter(a => a.tipo === 'extra')

  const [selLoc, setSelLoc] = useState<string | null>(null)
  const [selMusic, setSelMusic] = useState<string | null>(null)
  const [selExtras, setSelExtras] = useState<string[]>([])
  const [paraNombre, setParaNombre] = useState('')
  const [mensaje, setMensaje] = useState('')

  const total = useMemo(() => {
    let t = experiencia.precio_base
    const loc = ubicaciones.find(u => u.id === selLoc)
    if (loc) t += loc.precio
    const mus = musica.find(m => m.id === selMusic)
    if (mus) t += mus.precio
    selExtras.forEach(id => {
      const ex = extras.find(e => e.id === id)
      if (ex) t += ex.precio
    })
    return t
  }, [selLoc, selMusic, selExtras, experiencia.precio_base])

  const toggleExtra = (id: string) =>
    setSelExtras(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleContinuar = () => {
    const selected: AddonSeleccionado[] = []
    const loc = ubicaciones.find(u => u.id === selLoc)
    if (loc) selected.push({ addon_id: loc.id, nombre: loc.nombre, precio: loc.precio, tipo: 'ubicacion' })
    const mus = musica.find(m => m.id === selMusic)
    if (mus) selected.push({ addon_id: mus.id, nombre: mus.nombre, precio: mus.precio, tipo: 'musica' })
    selExtras.forEach(id => {
      const ex = extras.find(e => e.id === id)
      if (ex) selected.push({ addon_id: ex.id, nombre: ex.nombre, precio: ex.precio, tipo: 'extra' })
    })
    sessionStorage.setItem('mc_cart', JSON.stringify({
      experiencia_id: experiencia.id,
      experiencia_nombre: experiencia.nombre,
      addons: selected,
      para_nombre: paraNombre,
      mensaje_personal: mensaje,
      total,
    }))
    router.push('/checkout')
  }

  return (
    <div className="pt-[72px] max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
      {/* LEFT */}
      <motion.div
        layoutId={`card-${experiencia.id}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 } as const}
      >
        <div className="h-96 relative rounded-[32px] overflow-hidden mb-8 shadow-rose shadow-sm group">
          <motion.div
            layoutId={`media-${experiencia.id}`}
            className="absolute inset-0"
          >
            <Image
              src={getExperienceImage(experiencia)}
              alt={experiencia.nombre}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Overlay Icon for specific mood if no image was in DB */}
            {!experiencia.imagen_url && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <IconMapper icon={experiencia.emoji} className="text-9xl text-white/20 backdrop-blur-[2px] rounded-full p-8" />
              </div>
            )}
          </motion.div>

          {/* Subtle overlay info if needed */}
          <div className="absolute bottom-6 left-8 z-10">
            <p className="text-[11px] tracking-[3px] text-white/80 uppercase font-bold mb-1">
              {experiencia.categoria}
            </p>
          </div>
        </div>

        <h1 className="font-serif text-4xl mb-3 text-rose-dark">{experiencia.nombre}</h1>
        <p className="text-ink-mid text-lg leading-relaxed mb-10 font-light">{experiencia.descripcion}</p>

        <div className="space-y-12">
          {/* Ubicación */}
          {ubicaciones.length > 0 && (
            <Section label="Ubicación" icon={LocationOn}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ubicaciones.map(u => (
                  <Chip
                    key={u.id}
                    icon="📍" name={u.nombre}
                    price={u.precio}
                    selected={selLoc === u.id}
                    onClick={() => setSelLoc(selLoc === u.id ? null : u.id)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Música */}
          {musica.length > 0 && (
            <Section label="Ambiente musical" icon={MusicNote}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {musica.map(m => (
                  <Chip
                    key={m.id}
                    icon="🎵" name={m.nombre}
                    price={m.precio}
                    selected={selMusic === m.id}
                    onClick={() => setSelMusic(selMusic === m.id ? null : m.id)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <Section label="Agrega más magia" icon={Star}>
              <div className="bg-white rounded-[24px] border border-rose/5 overflow-hidden">
                {extras.map((ex, idx) => (
                  <AddonRow
                    key={ex.id}
                    icon={ex.icon} name={ex.nombre} price={ex.precio}
                    selected={selExtras.includes(ex.id)}
                    onClick={() => toggleExtra(ex.id)}
                    isLast={idx === extras.length - 1}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Para quién */}
          <Section label="¿Para quién es?" icon={MailOutlined}>
            <div className="space-y-4">
              <input
                value={paraNombre} onChange={e => setParaNombre(e.target.value)}
                placeholder="Nombre de quien sorprendes"
                className="w-full px-5 py-4 rounded-2xl border border-black/5 bg-white text-sm outline-none focus:border-rose focus:ring-4 focus:ring-rose/5 transition-all"
              />
              <textarea
                value={mensaje} onChange={e => setMensaje(e.target.value)}
                placeholder="Mensaje personal (opcional)"
                rows={3}
                className="w-full px-5 py-4 rounded-2xl border border-black/5 bg-white text-sm outline-none focus:border-rose focus:ring-4 focus:ring-rose/5 transition-all resize-none"
              />
            </div>
          </Section>
        </div>
      </motion.div>

      {/* RIGHT — SUMMARY */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as const}
        className="lg:sticky lg:top-[100px] h-fit"
      >
        <div className="bg-white rounded-[32px] border border-rose/5 p-8 shadow-rose shadow-sm">
          <h2 className="font-serif text-2xl mb-6 pb-5 border-b border-black/5 text-rose-dark flex items-center gap-2">
            Tu experiencia <FilterVintage className="text-rose w-6 h-6" />
          </h2>

          <div className="space-y-3 mb-8">
            <SummaryLine label={experiencia.nombre} value={`$${experiencia.precio_base.toLocaleString()}`} />

            <AnimatePresence>
              {selLoc && (
                <SummaryLineMotion
                  icon={LocationOn}
                  label={ubicaciones.find(u => u.id === selLoc)?.nombre || ''}
                  value={ubicaciones.find(u => u.id === selLoc)?.precio ? `+$${ubicaciones.find(u => u.id === selLoc)?.precio}` : 'incluido'}
                />
              )}
              {selMusic && (
                <SummaryLineMotion
                  icon={MusicNote}
                  label={musica.find(m => m.id === selMusic)?.nombre || ''}
                  value="incluido"
                />
              )}
              {selExtras.map(id => {
                const ex = extras.find(e => e.id === id)
                return ex ? (
                  <SummaryLineMotion key={id} emoji={ex.icon} label={ex.nombre} value={`+$${ex.precio}`} />
                ) : null
              })}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-end font-serif pt-6 border-t border-black/5 mb-8">
            <span className="text-ink-mid text-sm font-sans mb-1 uppercase tracking-widest">Total</span>
            <motion.span
              key={total}
              initial={{ scale: 1.1, color: '#D4537E' }}
              animate={{ scale: 1, color: '#1C1612' }}
              className="text-3xl"
            >
              ${total.toLocaleString()} <span className="text-sm font-sans text-ink-light">MXN</span>
            </motion.span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinuar}
            className="w-full bg-rose text-white rounded-full py-4 font-bold hover:bg-rose-dark transition-all shadow-lg shadow-rose/20"
          >
            Confirmar experiencia →
          </motion.button>

          <p className="text-center text-[10px] uppercase tracking-wider text-ink-light mt-6 font-semibold flex items-center justify-center gap-2">
            <Star className="w-3 h-3 text-rose" /> tus cómplices están listos <Star className="w-3 h-3 text-rose" />
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function Section({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="text-[11px] tracking-[3px] text-rose uppercase font-bold mb-5 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
        <div className="h-px flex-1 bg-rose/10" />
      </div>
      {children}
    </div>
  )
}

function Chip({ icon, name, price, selected, onClick }: {
  icon: string; name: string; price: number; selected: boolean; onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-[20px] p-5 text-center border-[1.5px] transition-all flex flex-col items-center justify-center gap-1 ${selected
        ? 'border-rose bg-rose-light/50 shadow-sm ring-4 ring-rose/5'
        : 'border-black/5 bg-white hover:border-rose/30 hover:bg-cream/30'
        }`}
    >
      <div className="mb-1">
        <IconMapper icon={icon} className="text-3xl text-rose" />
      </div>
      <div className="text-xs font-bold leading-tight">{name}</div>
      <div className="text-[10px] font-semibold opacity-60">{price ? `+$${price}` : 'Incluido'}</div>
    </motion.button>
  )
}

function AddonRow({ icon, name, price, selected, onClick, isLast }: {
  icon: string; name: string; price: number; selected: boolean; onClick: () => void; isLast?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between py-4 px-6 transition-all hover:bg-cream/40 ${!isLast ? 'border-b border-black/5' : ''}`}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: selected ? 360 : 0 }}
          className="text-2xl"
        >
          <IconMapper icon={icon} className="text-2xl text-rose" />
        </motion.div>
        <div className="text-left">
          <div className="text-sm font-bold">{name}</div>
          <div className="text-[10px] text-ink-mid uppercase font-semibold">+$${price} MXN</div>
        </div>
      </div>
      <motion.div
        animate={{
          backgroundColor: selected ? '#D4537E' : 'transparent',
          borderColor: selected ? '#D4537E' : '#B4B2A9',
          scale: selected ? ([1, 1.2, 1] as const) : 1
        }}
        className="w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center text-[10px]"
      >
        {selected && <span className="text-white font-bold">✓</span>}
      </motion.div>
    </button>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px] text-ink-mid">
      <span className="font-light">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  )
}

function SummaryLineMotion({ label, value, icon: Icon, emoji }: {
  label: string; value: string; icon?: any; emoji?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex justify-between text-[13px] text-ink-mid overflow-hidden items-center"
    >
      <span className="font-light flex items-center gap-2">
        {Icon ? <Icon className="w-3.5 h-3.5 text-rose/60" /> : <IconMapper icon={emoji} className="w-3.5 h-3.5 text-rose/60" />}
        {label}
      </span>
      <span className="font-medium text-ink">{value}</span>
    </motion.div>
  )
}
