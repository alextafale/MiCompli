'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ExperienciaConAddons } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { CardGiftcard, AutoAwesome, InfoOutlined } from '@mui/icons-material'
import IconMapper from '@/components/common/IconMapper'
import { getExperienceImage } from '@/lib/utils/image-fallbacks'

const TABS = [
  { label: 'Todos', value: 'todos', icon: InfoOutlined },
  { label: 'Regalos', value: 'regalo', icon: CardGiftcard },
  { label: 'Experiencias', value: 'experiencia', icon: AutoAwesome },
]

export default function CatalogGrid({ experiencias }: { experiencias: ExperienciaConAddons[] }) {
  const [tab, setTab] = useState('todos')

  const filtered = tab === 'todos'
    ? experiencias
    : experiencias.filter(e => e.categoria === tab)

  return (
    <div className="pt-[72px] min-h-screen bg-cream/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-rose/10 px-4 py-16 text-center shadow-sm"
      >
        <p className="text-[11px] tracking-[4px] text-rose uppercase font-semibold mb-3">descubre</p>
        <h1 className="font-serif text-[clamp(32px,5vw,48px)] mb-3">Nuestras experiencias</h1>
        <p className="text-ink-mid text-lg font-light">Cada momento merece ser extraordinario</p>
      </motion.div>

      <div className="flex gap-3 justify-center py-6 px-4 bg-white/80 backdrop-blur-md border-b border-rose/10 sticky top-[72px] z-10">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`relative px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === t.value
                ? 'text-white'
                : 'text-ink-mid hover:text-rose border border-black/5 hover:border-rose/30'
            }`}
          >
            {tab === t.value && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-rose rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 } as const}
              />
            )}
            <t.icon className={`relative z-10 w-4 h-4 ${tab === t.value ? 'text-white' : 'text-rose'}`} />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-10 max-w-7xl mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((exp, index) => (
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
              <div className="h-52 relative overflow-hidden bg-cream/10">
                <motion.div
                  layoutId={`media-${exp.id}`}
                  className="absolute inset-0"
                >
                  <Image
                    src={getExperienceImage(exp)}
                    alt={exp.nombre}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60" />
                  
                  {/* Overlay Icon for specific mood if no image was in DB */}
                  {!exp.imagen_url && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <IconMapper icon={exp.emoji} className="text-6xl text-white/20 backdrop-blur-[2px] rounded-full p-4" />
                    </div>
                  )}
                </motion.div>
                
                {/* Category Badge on Image */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] tracking-[1px] text-rose uppercase font-bold shadow-sm">
                  {exp.categoria}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h3 className="font-serif text-2xl mb-3 group-hover:text-rose-dark transition-colors">{exp.nombre}</h3>
                <p className="text-ink-mid text-sm leading-relaxed mb-8 line-clamp-2 font-light">{exp.descripcion}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-serif text-rose-dark">${exp.precio_base.toLocaleString()}</div>
                    <div className="text-ink-light text-[10px] uppercase tracking-wider font-semibold">MXN base</div>
                  </div>
                  <Link
                    href={`/experiencia/${exp.id}`}
                    className="bg-rose-light text-rose-dark text-xs font-bold rounded-full px-6 py-3 hover:bg-rose hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Personalizar
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
