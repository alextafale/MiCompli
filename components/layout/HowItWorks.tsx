'use client'

import { motion } from 'framer-motion'

import { Search, HistoryEdu, Celebration } from '@mui/icons-material'

const steps = [
  {
    number: '01',
    title: 'Elige',
    desc: 'Selecciona entre regalos detallistas o experiencias orquestadas por múltiples cómplices.',
    icon: Search
  },
  {
    number: '02',
    title: 'Personaliza',
    desc: 'Agrega música, define la ubicación y dinos qué mensaje especial quieres transmitir.',
    icon: HistoryEdu
  },
  {
    number: '03',
    title: 'Sorprende',
    desc: 'Nuestros cómplices coordinan la ejecución para que tú solo disfrutes el momento.',
    icon: Celebration
  }
]

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-rose/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[4px] text-rose uppercase font-bold mb-4"
          >
            El Proceso
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(40px,5vw,56px)] font-bold tracking-tight text-ink leading-[1.1]"
          >
            Tres pasos hacia <span className="font-serif italic text-rose font-light">la magia</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Step 1 - Large card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-12 lg:col-span-7 bg-[#F9F9F9] rounded-[40px] p-10 md:p-14 flex flex-col md:flex-row gap-12 items-center hover:shadow-premium transition-all duration-500 border border-black/[0.03]"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-rose/10 flex items-center justify-center">
                  <Search className="text-3xl text-rose" />
                </div>
                <span className="font-display text-5xl font-black text-ink/5">01</span>
              </div>
              <h3 className="font-display text-3xl font-bold mb-6 text-ink">{steps[0].title}</h3>
              <p className="text-ink/50 text-lg leading-relaxed font-medium">
                {steps[0].desc}
              </p>
            </div>
            <div className="w-full md:w-1/2 aspect-video bg-white rounded-3xl shadow-premium-hover flex items-center justify-center p-8 border border-black/[0.02]">
              <div className="relative w-full h-full opacity-20">
                <Search className="absolute top-0 left-0 text-[120px] text-rose" />
                <Search className="absolute bottom-0 right-0 text-[80px] text-ink" />
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-6 lg:col-span-5 bg-ink rounded-[40px] p-10 md:p-12 text-white hover:shadow-premium transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center">
                <HistoryEdu className="text-3xl text-rose" />
              </div>
              <span className="font-display text-5xl font-black text-white/5">02</span>
            </div>
            <h3 className="font-display text-3xl font-bold mb-6">{steps[1].title}</h3>
            <p className="text-white/50 text-lg leading-relaxed font-medium">
              {steps[1].desc}
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-6 lg:col-span-12 bg-rose rounded-[40px] p-10 md:p-14 flex flex-col md:flex-row gap-12 items-center text-white hover:shadow-premium transition-all duration-500"
          >
             <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-white/20 flex items-center justify-center">
                  <Celebration className="text-3xl text-white" />
                </div>
                <span className="font-display text-5xl font-black text-black/5">03</span>
              </div>
              <h3 className="font-display text-3xl font-bold mb-6">{steps[2].title}</h3>
              <p className="text-white/70 text-lg leading-relaxed font-medium">
                {steps[2].desc}
              </p>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center">
               <Celebration className="text-[100px] text-white/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
