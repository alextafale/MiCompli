'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CardGiftcard, AutoAwesome, ArrowForward, Business } from '@mui/icons-material'

const categories = [
  {
    slug: 'empresas',
    href: '/empresas',
    icon: Business,
    tag: 'B2B',
    name: 'Para Empresas',
    desc: 'Reconoce a tu equipo, sorprende a tus clientes y construye cultura. Gifting corporativo que se siente personal.',
    cta: 'Ver soluciones',
    gradient: 'from-[#1a1a2e] to-[#16213e]',
    accent: 'text-rose',
    bg: 'bg-ink',
    textColor: 'text-white',
    descColor: 'text-white/50',
    tagBg: 'bg-white/10',
    tagText: 'text-white/70',
    ctaColor: 'text-white',
    iconBg: 'bg-white/10',
    iconColor: 'text-rose',
    numberColor: 'text-white/[0.03]',
    border: 'border-white/5',
  },
  {
    slug: 'particulares',
    href: '/explorar?audiencia=b2c',
    icon: CardGiftcard,
    tag: 'B2C',
    name: 'Para Ti',
    desc: 'Convierte un simple gesto en una experiencia inolvidable. Regalos y sorpresas orquestadas por expertos.',
    cta: 'Explorar catálogo',
    gradient: 'from-rose/20 to-rose/5',
    accent: 'text-rose',
    bg: 'bg-white',
    textColor: 'text-ink',
    descColor: 'text-ink/50',
    tagBg: 'bg-rose/10',
    tagText: 'text-rose',
    ctaColor: 'text-ink',
    iconBg: 'bg-[#F9F9F9]',
    iconColor: 'text-rose',
    numberColor: 'text-ink/[0.03]',
    border: 'border-black/[0.03]',
  },
]

const stats = [
  { value: '500+', label: 'Empresas confían en nosotros' },
  { value: '10K+', label: 'Experiencias creadas' },
  { value: '98%', label: 'Clientes satisfechos' },
]

export default function CategoryCards() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <p className="text-[10px] tracking-[4px] text-rose uppercase font-bold mb-4">
          Un Mundo de Posibilidades
        </p>
        <h2 className="font-display text-[clamp(40px,5vw,56px)] font-bold tracking-tight text-ink leading-[1.1]">
          ¿Para quién es{' '}
          <span className="font-serif italic text-rose font-light">la sorpresa</span>?
        </h2>
      </motion.div>

      {/* Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat.slug}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={cat.href}
              className={`group block relative h-full ${cat.bg} rounded-[48px] p-12 overflow-hidden border ${cat.border} shadow-premium hover:shadow-premium-hover transition-all duration-500`}
            >
              {/* Gradient blob */}
              <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br ${cat.gradient} opacity-[0.08] blur-[80px] -mr-20 -mt-20 group-hover:opacity-[0.18] transition-opacity duration-500`} />

              {/* Tag */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${cat.tagBg} mb-8`}>
                <span className={`text-[10px] font-bold uppercase tracking-[2px] ${cat.tagText}`}>
                  {cat.tag}
                </span>
              </div>

              {/* Icon */}
              <motion.div
                className={`mb-8 w-20 h-20 rounded-[28px] ${cat.iconBg} flex items-center justify-center border ${cat.border}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <cat.icon className={`text-4xl ${cat.iconColor}`} />
              </motion.div>

              <h3 className={`font-display text-4xl font-bold mb-6 ${cat.textColor} tracking-tight`}>
                {cat.name}
              </h3>

              <p className={`text-lg leading-relaxed mb-12 font-medium ${cat.descColor}`}>
                {cat.desc}
              </p>

              <div className={`flex items-center gap-3 font-bold uppercase tracking-[1.5px] text-[11px] ${cat.ctaColor} group-hover:text-rose transition-colors`}>
                {cat.cta}
                <ArrowForward className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>

              {/* Decorative number */}
              <span className={`absolute top-12 right-12 font-display text-8xl font-black pointer-events-none select-none ${cat.numberColor}`}>
                0{index + 1}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-3 gap-4 border border-black/[0.05] rounded-[32px] p-8 bg-[#F9F9F9]"
      >
        {stats.map((stat, i) => (
          <div key={i} className={`text-center ${i < stats.length - 1 ? 'border-r border-black/[0.05]' : ''}`}>
            <p className="font-display text-3xl font-black text-ink mb-1">{stat.value}</p>
            <p className="text-[11px] text-ink/40 uppercase tracking-[1.5px] font-semibold">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}