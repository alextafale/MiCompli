'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { AutoAwesome, VolunteerActivism } from '@mui/icons-material'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[100px] relative overflow-hidden bg-white">
      {/* Dynamic Background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,83,126,0.15),transparent_70%)]"
      />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl flex flex-col items-center"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="relative h-16 w-56 md:h-24 md:w-80 mb-8">
          <Image
            src="/images/micompliLOGO.jpeg"
            alt="MiCompli Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose/5 border border-rose/10 mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-rose">
            Marketplace de Regalos y Experiencias
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-[clamp(48px,8vw,88px)] font-bold leading-[1.05] tracking-[-0.04em] mb-8 text-ink"
        >
          Regala momentos,{' '}
          <span className="text-rose relative inline-block">
            no cosas
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1.5, duration: 1, ease: 'circOut' }}
              className="absolute -bottom-2 left-0 h-[4px] bg-rose/20 rounded-full"
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-[clamp(18px,2vw,22px)] text-ink/50 font-medium max-w-2xl mx-auto mb-6 leading-relaxed"
        >
          Para empresas que quieren reconocer a su equipo,{' '}
          y personas que quieren{' '}
          <span className="text-ink italic font-serif">sorprender de verdad.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center flex-wrap mt-10"
        >
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/empresas"
              className="inline-block bg-ink text-white rounded-full px-10 py-4 text-[13px] font-bold uppercase tracking-[2px] hover:bg-rose transition-all duration-500 shadow-premium"
            >
              Soy empresa
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/explorar?audiencia=b2c"
              className="inline-block group glass rounded-full px-10 py-4 text-[13px] font-bold uppercase tracking-[2px] text-ink hover:bg-black/5 transition-all duration-500 border border-black/[0.05]"
            >
              Quiero sorprender
              <span className="inline-block transition-transform group-hover:translate-x-1 ml-3 text-rose">→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-ink/30 text-[11px] uppercase tracking-[2px] font-semibold"
        >
          <span>500+ empresas</span>
          <span className="w-1 h-1 rounded-full bg-ink/20" />
          <span>10K+ experiencias</span>
          <span className="w-1 h-1 rounded-full bg-ink/20" />
          <span>México y LATAM</span>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-10 text-4xl pointer-events-none grayscale opacity-30"
      >
        <AutoAwesome fontSize="inherit" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-10 text-4xl pointer-events-none grayscale opacity-30"
      >
        <VolunteerActivism fontSize="inherit" />
      </motion.div>
    </section>
  )
}