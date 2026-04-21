'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Groups, 
  AutoAwesome, 
  AccessTime, 
  Favorite, 
  EmojiEvents 
} from '@mui/icons-material'

const features = [
  {
    title: 'Cómplices Profesionales',
    desc: 'Personas reales capacitadas para coordinar cada segundo de tu sorpresa.',
    icon: Groups,
    color: 'text-rose'
  },
  {
    title: 'Privacidad Total',
    desc: 'Tu identidad y la de la persona sorprendida están protegidas en todo momento.',
    icon: Shield,
    color: 'text-gold'
  },
  {
    title: 'Experiencias a la Medida',
    desc: 'Desde lo más íntimo hasta lo más espectacular, tú defines el límite.',
    icon: AutoAwesome,
    color: 'text-rose'
  },
  {
    title: 'Coordinación en Tiempo Real',
    desc: 'Seguimiento automático para asegurar que todo suceda exactamente como planeado.',
    icon: AccessTime,
    color: 'text-gold'
  },
  {
    title: 'Ejecución Impecable',
    desc: 'Cuidamos los detalles que otros ignoran para crear un momento perfecto.',
    icon: EmojiEvents,
    color: 'text-rose'
  },
  {
    title: 'Hecho con Pasión',
    desc: 'Nos apasiona crear conexiones emocionales que perduren en el tiempo.',
    icon: Favorite,
    color: 'text-gold'
  }
]

export default function Features() {
  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] tracking-[4px] text-rose uppercase font-bold mb-4"
            >
              ¿Por qué MiCompli?
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(40px,5vw,56px)] font-bold tracking-tight text-ink leading-[1.1]"
            >
              Diseñamos emociones, <br/> <span className="font-serif italic text-rose font-light">ejecutamos perfección.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-ink/40 text-lg font-medium max-w-sm lg:text-right leading-relaxed"
          >
            En MiCompli no enviamos paquetes, construimos recuerdos que se quedan para siempre.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
              className="flex flex-col gap-6 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F9F9F9] flex items-center justify-center border border-black/[0.03] group-hover:bg-rose group-hover:border-rose transition-all duration-500">
                <f.icon className="text-ink group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-3 text-ink group-hover:text-rose transition-colors duration-300 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-ink/50 text-[15px] leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
