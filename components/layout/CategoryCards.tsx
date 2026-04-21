'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CardGiftcard, AutoAwesome, ArrowForward } from '@mui/icons-material'

const categories = [
  {
    slug: 'regalos',
    icon: CardGiftcard,
    name: 'Regalos',
    desc: 'Flores, chocolates, peluches y detalles enviados a donde estén. Hacemos que llegue con magia.',
    gradient: 'from-rose-light to-rose-mid',
  },
  {
    slug: 'experiencias',
    icon: AutoAwesome,
    name: 'Experiencias',
    desc: 'Cenas románticas, sorpresas, reconciliaciones. Orquestamos cada detalle con múltiples cómplices.',
    gradient: 'from-gold-light via-[#FAC775] to-rose-mid',
  },
]

export default function CategoryCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' as const }
    }
  } as const

  return (
    <section className="py-32 px-6 max-w-6xl mx-auto">
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
          Elige cómo <span className="font-serif italic text-rose font-light">sorprender</span>
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat.slug}
            variants={cardVariants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <Link
              href={`/explorar?cat=${cat.slug}`}
              className="group block relative h-full bg-white rounded-[48px] p-12 overflow-hidden border border-black/[0.03] shadow-premium hover:shadow-premium-hover transition-all duration-500"
            >
              {/* Modern Gradient Background */}
              <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br ${cat.gradient} opacity-[0.08] blur-[80px] -mr-20 -mt-20 group-hover:opacity-[0.15] transition-opacity duration-500`} />
              
              <motion.div
                className="mb-10 w-20 h-20 rounded-[28px] bg-white shadow-premium flex items-center justify-center border border-black/[0.02]"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <cat.icon className="text-4xl text-ink group-hover:text-rose transition-colors duration-500" />
              </motion.div>

              <h3 className="font-display text-4xl font-bold mb-6 text-ink tracking-tight">
                {cat.name}
              </h3>

              <p className="text-ink/50 text-lg leading-relaxed mb-12 font-medium">
                {cat.desc}
              </p>

              <div className="flex items-center gap-3 text-ink font-bold uppercase tracking-[1.5px] text-[11px] group-hover:text-rose transition-colors">
                Explorar catálogo
                <ArrowForward className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>

              {/* Decorative Number */}
              <span className="absolute top-12 right-12 font-display text-8xl font-black text-ink/[0.02] pointer-events-none select-none">
                0{index + 1}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
