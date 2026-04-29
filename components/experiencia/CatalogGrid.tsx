'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ExperienciaConAddons } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { CardGiftcard, AutoAwesome, InfoOutlined, Business, Person } from '@mui/icons-material'
import IconMapper from '@/components/common/IconMapper'
import { getExperienceImage } from '@/lib/utils/image-fallbacks'

// ─── Tipos ────────────────────────────────────────────────
type Audiencia = 'todos' | 'b2b' | 'b2c'
type Ocasion = 'todas' | 'cumpleanos' | 'aniversario_laboral' | 'onboarding' | 'reconocimiento' | 'regalo_cliente' | 'dia_especial' | 'sin_ocasion'

const OCASION_LABELS: Record<string, string> = {
  cumpleanos: 'Cumpleaños',
  aniversario_laboral: 'Aniversario',
  onboarding: 'Onboarding',
  reconocimiento: 'Reconocimiento',
  regalo_cliente: 'Cliente VIP',
  dia_especial: 'Día especial',
  sin_ocasion: 'Sin ocasión',
}

const CATEGORIA_TABS = [
  { label: 'Todos', value: 'todos', icon: InfoOutlined },
  { label: 'Regalos', value: 'regalo', icon: CardGiftcard },
  { label: 'Experiencias', value: 'experiencia', icon: AutoAwesome },
]

interface Props {
  experiencias: ExperienciaConAddons[]
  audienciaInicial?: Audiencia
}

export default function CatalogGrid({ experiencias, audienciaInicial = 'todos' }: Props) {
  const [tab, setTab] = useState('todos')
  const [audiencia, setAudiencia] = useState<Audiencia>(audienciaInicial)
  const [ocasion, setOcasion] = useState<Ocasion>('todas')

  // Ocasiones disponibles según audiencia
  const ocasionesDisponibles = useMemo(() => {
    const items = audiencia === 'b2b'
      ? experiencias.filter(e => e.audiencia === 'b2b' || e.audiencia === 'ambos')
      : audiencia === 'b2c'
        ? experiencias.filter(e => e.audiencia === 'b2c' || e.audiencia === 'ambos')
        : experiencias

    const unique = [...new Set(items.map(e => e.ocasion).filter(Boolean))]
    return unique
  }, [experiencias, audiencia])

  // Filtrado final
  const filtered = useMemo(() => {
    return experiencias.filter(e => {
      const matchTab = tab === 'todos' || e.categoria === tab
      const matchAudiencia =
        audiencia === 'todos' ||
        e.audiencia === audiencia ||
        e.audiencia === 'ambos'
      const matchOcasion = ocasion === 'todas' || e.ocasion === ocasion
      return matchTab && matchAudiencia && matchOcasion
    })
  }, [experiencias, tab, audiencia, ocasion])

  const isB2B = audiencia === 'b2b'

  return (
    <div className="pt-[72px] min-h-screen bg-cream/30">

      {/* ── Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-b px-4 py-16 text-center shadow-sm ${isB2B ? 'bg-ink border-white/5' : 'bg-white border-rose/10'}`}
      >
        <p className={`text-[11px] tracking-[4px] uppercase font-semibold mb-3 ${isB2B ? 'text-rose' : 'text-rose'}`}>
          {isB2B ? 'Catálogo Empresarial' : 'Descubre'}
        </p>
        <h1 className={`font-serif text-[clamp(32px,5vw,48px)] mb-3 ${isB2B ? 'text-white' : 'text-ink'}`}>
          {isB2B ? 'Regalos para tu equipo' : 'Nuestras experiencias'}
        </h1>
        <p className={`text-lg font-light ${isB2B ? 'text-white/50' : 'text-ink/50'}`}>
          {isB2B
            ? 'Gifting corporativo con alma latinoamericana'
            : 'Cada momento merece ser extraordinario'}
        </p>
      </motion.div>

      {/* ── Filtros de audiencia ─────────────────────────── */}
      <div className="flex flex-wrap gap-3 justify-center py-5 px-4 bg-white/80 backdrop-blur-md border-b border-rose/10 sticky top-[72px] z-20">
        {[
          { value: 'todos', label: 'Todo', icon: InfoOutlined },
          { value: 'b2b', label: 'Empresas', icon: Business },
          { value: 'b2c', label: 'Personal', icon: Person },
        ].map(a => (
          <button
            key={a.value}
            onClick={() => { setAudiencia(a.value as Audiencia); setOcasion('todas') }}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${audiencia === a.value
                ? 'text-white'
                : 'text-ink/60 hover:text-rose border border-black/5 hover:border-rose/30'
              }`}
          >
            {audiencia === a.value && (
              <motion.div
                layoutId="activeAudiencia"
                className="absolute inset-0 bg-ink rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <a.icon className={`relative z-10 w-4 h-4 ${audiencia === a.value ? 'text-rose' : 'text-rose'}`} />
            <span className="relative z-10">{a.label}</span>
          </button>
        ))}
      </div>

      {/* ── Filtros de categoría ─────────────────────────── */}
      <div className="flex flex-wrap gap-3 justify-center py-4 px-4 bg-white/60 backdrop-blur-md border-b border-rose/5 sticky top-[136px] z-10">
        {CATEGORIA_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`relative flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${tab === t.value
                ? 'text-white'
                : 'text-ink/50 hover:text-rose border border-black/5 hover:border-rose/30'
              }`}
          >
            {tab === t.value && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-rose rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <t.icon className="relative z-10 w-4 h-4" />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Filtros de ocasión (solo si hay ocasiones) ────── */}
      <AnimatePresence>
        {ocasionesDisponibles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 justify-center py-4 px-4 bg-[#F9F9F9] border-b border-black/[0.04]"
          >
            <button
              onClick={() => setOcasion('todas')}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[1px] transition-all ${ocasion === 'todas'
                  ? 'bg-rose text-white'
                  : 'bg-white text-ink/50 border border-black/[0.06] hover:border-rose/30'
                }`}
            >
              Todas
            </button>
            {ocasionesDisponibles.map(oc => (
              <button
                key={oc}
                onClick={() => setOcasion(oc as Ocasion)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[1px] transition-all ${ocasion === oc
                    ? 'bg-rose text-white'
                    : 'bg-white text-ink/50 border border-black/[0.06] hover:border-rose/30'
                  }`}
              >
                {OCASION_LABELS[oc] ?? oc}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid ─────────────────────────────────────────── */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-10 max-w-7xl mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-3 text-center py-24 text-ink/30"
            >
              <CardGiftcard sx={{ fontSize: 60 }} className="mb-4 text-ink/30" />
              <p className="font-display text-xl font-bold">No hay productos en esta categoría aún</p>
              <p className="text-sm mt-2">Pronto agregaremos más opciones</p>
            </motion.div>
          ) : (
            filtered.map((exp, index) => (
              <motion.div
                layout
                key={exp.id}
                layoutId={`card-${exp.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[32px] border border-rose/5 overflow-hidden hover:shadow-rose-lg transition-shadow duration-300 group flex flex-col"
              >
                {/* Imagen */}
                <div className="h-52 relative overflow-hidden bg-cream/10">
                  <motion.div layoutId={`media-${exp.id}`} className="absolute inset-0">
                    <Image
                      src={getExperienceImage(exp)}
                      alt={exp.nombre}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60" />
                    {!exp.imagen_url && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <IconMapper icon={exp.emoji} className="text-6xl text-white/20" />
                      </div>
                    )}
                  </motion.div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] tracking-[1px] text-rose uppercase font-bold shadow-sm">
                      {exp.categoria}
                    </span>
                    {(exp.audiencia === 'b2b' || exp.audiencia === 'ambos') && (
                      <span className="px-3 py-1 rounded-full bg-ink/80 backdrop-blur-sm text-[10px] tracking-[1px] text-white uppercase font-bold shadow-sm">
                        Empresas
                      </span>
                    )}
                  </div>

                  {/* Badge ocasión */}
                  {exp.ocasion && exp.ocasion !== 'sin_ocasion' && (
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full bg-rose/90 text-[10px] tracking-[1px] text-white font-bold shadow-sm">
                        {OCASION_LABELS[exp.ocasion] ?? exp.ocasion}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-serif text-2xl mb-3 group-hover:text-rose transition-colors">{exp.nombre}</h3>
                  <p className="text-ink/50 text-sm leading-relaxed mb-8 line-clamp-2 font-light">{exp.descripcion}</p>
                  <div className="mt-auto flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <div className="text-2xl font-serif text-rose">${exp.precio_base.toLocaleString()}</div>
                      <div className="text-ink/30 text-[10px] uppercase tracking-wider font-semibold">MXN base</div>
                    </div>
                    <Link
                      href={`/experiencia/${exp.id}`}
                      className="inline-block bg-rose/10 text-rose text-xs font-bold rounded-full px-6 py-3 hover:bg-rose hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      {exp.audiencia === 'b2b' ? 'Ver detalle' : 'Personalizar'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}