'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ExperienciaConAddons } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CardGiftcard,
  AutoAwesome,
  InfoOutlined,
  Business,
  Person,
  AccountBalanceWallet,
  BusinessCenter,
  Stars,
  Redeem,
  VolunteerActivism,
  AllInclusive,
  CreditCard,
  AutoMode,
  PaymentsOutlined,
  AutoFixHighOutlined,
  SendOutlined,
  CardGiftcardOutlined
} from '@mui/icons-material'
import IconMapper from '@/components/common/IconMapper'
import { getExperienceImage } from '@/lib/utils/image-fallbacks'
import TarjetaDigitalModal from './TarjetaDigitalModal'

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
  { label: 'Todos', value: 'todos', icon: AllInclusive },
  { label: 'Tarjeta Digital', value: 'tarjeta_digital', icon: CreditCard },
  { label: 'Saldo Digital', value: 'saldo_digital', icon: AccountBalanceWallet },
  { label: 'Mesa de Regalos', value: 'mesas_regalo', icon: VolunteerActivism },
  { label: 'Corporativos', value: 'corporativos', icon: BusinessCenter },
  { label: 'Experiencia Sorpresa', value: 'sorpresas', icon: AutoAwesome },
  { label: 'Fondos para Sueños', value: 'suenos', icon: Stars },
  { label: 'Gift Cards', value: 'gift_cards', icon: Redeem },
]

interface Props {
  experiencias: ExperienciaConAddons[]
  productos?: any[]        // productos de proveedores
  categorias?: any[]       // categorías dinámicas
  audienciaInicial?: Audiencia
  categoriaInicial?: string
}

function CatalogGridContent({
  experiencias,
  productos = [],
  categorias = [],
  audienciaInicial = 'todos',
  categoriaInicial = '',
}: Props) {
  const [tab, setTab] = useState(categoriaInicial || 'todos')
  const [audiencia, setAudiencia] = useState<Audiencia>(audienciaInicial)
  const [ocasion, setOcasion] = useState<Ocasion>('todas')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Sincronizar tab con prop inicial si cambia (ej. navegando desde navbar)
  useEffect(() => {
    setTab(categoriaInicial || 'todos')
  }, [categoriaInicial])

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
    let baseItems = experiencias.filter(e => {
      const matchTab = tab === 'todos' || e.categoria === tab
      const matchAudiencia =
        audiencia === 'todos' ||
        e.audiencia === audiencia ||
        e.audiencia === 'ambos'
      const matchOcasion = ocasion === 'todas' || e.ocasion === ocasion
      return matchTab && matchAudiencia && matchOcasion
    })

    // Si no hay productos en las nuevas categorías, agregar placeholders para demo
    if (baseItems.length === 0 && tab !== 'todos' && tab !== 'regalo' && tab !== 'experiencia') {
      const placeholders: any[] = [
        {
          id: `placeholder-${tab}`,
          nombre: CATEGORIA_TABS.find(t => t.value === tab)?.label || 'Servicio',
          descripcion: `Próximamente: ${CATEGORIA_TABS.find(t => t.value === tab)?.label}. Estamos preparando las mejores opciones para ti.`,
          precio_base: 0,
          categoria: tab,
          audiencia: 'ambos',
          activo: true,
          emoji: '✨',
          created_at: new Date().toISOString()
        }
      ]
      return placeholders
    }

    return baseItems
  }, [experiencias, tab, audiencia, ocasion])

  const isB2B = audiencia === 'b2b'

  return (
    <div className="pt-[72px] min-h-screen bg-cream/30">

      {/* ── Header ──────────────────────────────────────── */}
      {tab !== 'tarjeta_digital' && (
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
      )}

      {/* ── Filtros de audiencia ─────────────────────────── */}
      {tab !== 'tarjeta_digital' && (
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
      )}

      {/* ── Filtros de categoría ─────────────────────────── */}
      {tab !== 'tarjeta_digital' && (
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
      )}

      {/* ── Filtros de ocasión (solo si hay ocasiones) ────── */}
      <AnimatePresence>
        {tab !== 'tarjeta_digital' && ocasionesDisponibles.length > 0 && (
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
          {tab === 'tarjeta_digital' ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="col-span-full"
            >
              <div className="bg-white rounded-[64px] overflow-hidden border border-rose/10 shadow-premium flex flex-col lg:flex-row">
                
                {/* Visual Side */}
                <div className="relative lg:w-2/5 h-80 lg:h-auto bg-black">
                  <Image 
                    src="/images/tarjeta_digital_hero.png" 
                    alt="Tarjeta Digital Premium" 
                    fill 
                    className="object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="glass p-6 rounded-3xl border border-white/20"
                    >
                      <h4 className="text-white font-display font-bold text-lg mb-1">Impacto Instantáneo</h4>
                      <p className="text-white/60 text-xs uppercase tracking-widest font-black">98% de felicidad garantizada</p>
                    </motion.div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-12 md:p-20 lg:p-24 bg-cream/20">
                  <div className="mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose/10 text-rose text-[10px] font-black uppercase tracking-[3px] mb-8 border border-rose/10">
                      Innovación en Regalos
                    </span>
                    <h2 className="font-serif text-[clamp(40px,5vw,64px)] leading-[0.9] text-ink mb-8">
                      ¿Cómo funciona la <br />
                      <span className="text-rose italic font-light underline decoration-rose/10 underline-offset-8">Tarjeta Digital?</span>
                    </h2>
                    <p className="text-ink/50 text-xl max-w-2xl leading-relaxed font-light">
                      La forma más rápida, personal y elegante de estar presente. <br />
                      <span className="text-ink font-medium">Sorprende a quien quieras, donde quiera que esté.</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {[
                      { icon: PaymentsOutlined, step: '01', title: 'Monto Flexible', desc: 'Tú decides el valor del regalo según la ocasión.' },
                      { icon: AutoFixHighOutlined, step: '02', title: 'Personalización', desc: 'Añade tu toque personal con mensajes y diseños.' },
                      { icon: SendOutlined, step: '03', title: 'Envío Inmediato', desc: 'Llega por WhatsApp o Email en segundos.' },
                      { icon: CardGiftcardOutlined, step: '04', title: 'Elección Libre', desc: 'El destinatario elige su experiencia ideal.' },
                    ].map((s, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="w-14 h-14 shrink-0 bg-white rounded-2xl flex items-center justify-center text-rose shadow-sm group-hover:bg-rose group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                          <s.icon />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-rose/30 uppercase tracking-[2px]">{s.step}</span>
                            <h3 className="font-display text-lg font-bold text-ink">{s.title}</h3>
                          </div>
                          <p className="text-ink/40 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8 pt-12 border-t border-black/5">
                    <button className="bg-ink text-white rounded-full px-12 py-5 text-[14px] font-black uppercase tracking-[3px] hover:bg-rose transition-all duration-500 shadow-premium active:scale-95 group">
                      Regalar Ahora
                      <span className="inline-block ml-3 group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-rose text-sm font-bold uppercase tracking-[2px] hover:underline underline-offset-8 decoration-2 transition-all"
                      >
                        Guía Interactiva
                      </button>
                      <button 
                        onClick={() => setTab('todos')}
                        className="text-ink/40 text-[11px] font-black uppercase tracking-[2px] hover:text-ink transition-colors border-l border-black/10 pl-8 hidden sm:block"
                      >
                        Catálogo Completo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : filtered.length === 0 ? (
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
      {/* ── Modal Explicativo ─────────────────────────── */}
      <TarjetaDigitalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default function CatalogGrid(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-cream/10" />}>
      <CatalogGridContent {...props} />
    </Suspense>
  )
}