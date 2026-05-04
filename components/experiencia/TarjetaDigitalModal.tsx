'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Close, 
  PaymentsOutlined, 
  AutoFixHighOutlined, 
  SendOutlined, 
  CardGiftcardOutlined,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const STEPS = [
  {
    icon: PaymentsOutlined,
    title: 'Elige el monto',
    description: 'Selecciona el valor que deseas regalar. Libertad total para el destinatario.',
    longDesc: 'Puedes elegir desde montos pequeños para detalles significativos hasta valores más altos para experiencias premium completas.',
    color: 'bg-rose/10 text-rose',
    image: '/images/tarjeta_digital_hero.png'
  },
  {
    icon: AutoFixHighOutlined,
    title: 'Personaliza',
    description: 'Agrega un mensaje y un diseño que capture la esencia de tu sorpresa.',
    longDesc: 'Haz que tu regalo sea único. Elige entre diferentes plantillas y escribe una dedicatoria que llegue al corazón.',
    color: 'bg-amber-100 text-amber-600',
    image: '/images/tarjeta_digital_hero.png'
  },
  {
    icon: SendOutlined,
    title: 'Envía al instante',
    description: 'Por WhatsApp o Email en segundos. Sin esperas, sin complicaciones.',
    longDesc: 'Ideal para celebraciones de último minuto o para acortar distancias físicas al instante.',
    color: 'bg-blue-100 text-blue-600',
    image: '/images/tarjeta_digital_received.png'
  },
  {
    icon: CardGiftcardOutlined,
    title: 'Canjea',
    description: 'El destinatario elige su experiencia favorita de todo nuestro catálogo.',
    longDesc: 'El saldo no caduca pronto y puede ser usado en cualquier producto, servicio o experiencia disponible en MiCompli.',
    color: 'bg-emerald-100 text-emerald-600',
    image: '/images/tarjeta_digital_received.png'
  }
]

export default function TarjetaDigitalModal({ isOpen, onClose }: Props) {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/80 backdrop-blur-xl z-[100] cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 lg:inset-16 bg-cream rounded-[48px] md:rounded-[80px] z-[101] overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-ink hover:bg-rose hover:text-white hover:border-rose transition-all duration-500 shadow-xl"
            >
              <Close />
            </button>

            {/* Visual Side (Interactive) */}
            <div className="relative w-full lg:w-[45%] h-72 lg:h-auto bg-black overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={STEPS[activeStep].image}
                    alt={STEPS[activeStep].title}
                    fill
                    className="object-cover opacity-80"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                </motion.div>
              </AnimatePresence>
              
              {/* Floating Content Over Image */}
              <div className="absolute bottom-12 left-12 right-12 z-10">
                <motion.div
                  key={`badge-${activeStep}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="glass p-8 rounded-[32px] border border-white/20 shadow-2xl"
                >
                  <div className="flex items-center gap-5 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${STEPS[activeStep].color} flex items-center justify-center shadow-inner`}>
                      {activeStep === 0 && <PaymentsOutlined />}
                      {activeStep === 1 && <AutoFixHighOutlined />}
                      {activeStep === 2 && <SendOutlined />}
                      {activeStep === 3 && <CardGiftcardOutlined />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[3px] text-white/50 mb-0.5">Paso {activeStep + 1}</p>
                      <h4 className="font-display font-bold text-xl text-white">{STEPS[activeStep].title}</h4>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    "{STEPS[activeStep].longDesc}"
                  </p>
                </motion.div>
              </div>

              {/* Progress Bar (Visual) */}
              <div className="absolute top-12 left-12 right-12 flex gap-3 z-10">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer`}
                    onClick={() => setActiveStep(i)}
                  >
                    <motion.div 
                      initial={false}
                      animate={{ width: i <= activeStep ? '100%' : '0%' }}
                      className="h-full bg-rose shadow-[0_0_15px_rgba(212,83,126,0.8)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto custom-scrollbar bg-cream flex flex-col">
              <div className="mb-16">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/5 text-rose text-[10px] font-black uppercase tracking-[4px] mb-8 border border-rose/10"
                >
                  <CheckCircle sx={{ fontSize: 14 }} />
                  Experiencia Garantizada
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-serif text-[clamp(40px,5vw,72px)] leading-[0.95] text-ink mb-8"
                >
                  La magia de regalar <br />
                  <span className="text-rose italic font-light underline decoration-rose/20 underline-offset-8">en segundos.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-ink/60 text-xl max-w-xl leading-relaxed font-light"
                >
                  Redefinimos el obsequio digital para que se sienta tan personal y cálido como uno físico, con la ventaja de la inmediatez.
                </motion.p>
              </div>

              <div className="space-y-6 mb-16">
                {STEPS.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    onMouseEnter={() => setActiveStep(idx)}
                    className={`p-6 rounded-[32px] cursor-pointer transition-all duration-500 flex items-center gap-6 border ${
                      activeStep === idx 
                      ? 'bg-white shadow-premium border-rose/10 scale-[1.02]' 
                      : 'bg-transparent border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-2xl shadow-sm transition-transform duration-500 ${activeStep === idx ? 'scale-110 rotate-3' : ''}`}>
                      <step.icon fontSize="inherit" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-rose/40 uppercase tracking-widest">Step 0{idx + 1}</span>
                        <h3 className="font-display font-bold text-xl text-ink">{step.title}</h3>
                      </div>
                      <p className="text-sm text-ink/50 leading-relaxed font-medium">{step.description}</p>
                    </div>
                    {activeStep === idx && (
                      <motion.div layoutId="arrow" className="text-rose">
                        <ArrowForward />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap gap-8 items-center pt-8 border-t border-black/5">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="bg-ink text-white rounded-full px-12 py-5 text-[14px] font-black uppercase tracking-[3px] hover:bg-rose transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-rose-lg group"
                >
                  Empezar Sorpresa
                  <span className="inline-block ml-3 group-hover:translate-x-2 transition-transform">→</span>
                </motion.button>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-cream bg-rose/10 flex items-center justify-center text-[10px] font-bold text-rose">
                        {i}k+
                      </div>
                    ))}
                  </div>
                  <p className="text-ink/30 text-[10px] font-bold uppercase tracking-[2px] leading-tight">
                    Usuarios han <br /> sorprendido hoy
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
