'use client'

import { motion } from 'framer-motion'

import { VolunteerActivism, Handshake, AutoAwesome } from '@mui/icons-material'

const stats = [
  { label: 'Sorpresas realizadas', value: '+500', icon: VolunteerActivism },
  { label: 'Cómplices activos', value: '+200', icon: Handshake },
  { label: 'Sonrisas garantizadas', value: '98%', icon: AutoAwesome },
]

export default function Stats() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F9F9F9] flex items-center justify-center mb-6 border border-black/[0.03] group-hover:bg-rose group-hover:border-rose transition-all duration-500">
                <stat.icon className="text-ink group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="font-display text-5xl font-bold text-ink tracking-tight mb-3">
                {stat.value}
              </div>
              <p className="text-ink/30 text-[10px] uppercase tracking-[3px] font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
