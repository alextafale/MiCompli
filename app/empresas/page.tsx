'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  EmojiEvents,
  Groups,
  Celebration,
  Handshake,
  AutoAwesome,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material'

// ─── Ocasiones corporativas ────────────────────────────────
const ocasiones = [
  { icon: Celebration, label: 'Cumpleaños', slug: 'cumpleanos' },
  { icon: EmojiEvents, label: 'Aniversario laboral', slug: 'aniversario_laboral' },
  { icon: Groups, label: 'Onboarding', slug: 'onboarding' },
  { icon: AutoAwesome, label: 'Reconocimiento', slug: 'reconocimiento' },
  { icon: Handshake, label: 'Regalo a cliente', slug: 'regalo_cliente' },
]

// ─── Beneficios ────────────────────────────────────────────
const beneficios = [
  {
    title: 'El destinatario elige',
    desc: 'Envías el presupuesto, ellos escogen el regalo que más les gusta. Cero desperdicio, máximo impacto.',
  },
  {
    title: 'Sin necesidad de dirección',
    desc: 'Mandamos un link por email o WhatsApp. El destinatario pone su dirección cuando elige su regalo.',
  },
  {
    title: 'Dashboard corporativo',
    desc: 'Ve el estatus de cada envío, quién ya eligió y qué tan feliz quedó tu equipo.',
  },
  {
    title: 'Productos locales LATAM',
    desc: 'Marcas mexicanas y latinoamericanas. Experiencias reales, no catálogos genéricos.',
  },
  {
    title: 'Facturación empresarial',
    desc: 'Facturamos a tu empresa. Proceso sencillo y sin complicaciones administrativas.',
  },
  {
    title: 'Atención dedicada',
    desc: 'Un ejecutivo de cuenta asignado para campañas grandes y entregas masivas.',
  },
]

// ─── Proceso ───────────────────────────────────────────────
const pasos = [
  {
    number: '01',
    title: 'Elige la ocasión',
    desc: 'Cumpleaños, aniversario, onboarding o reconocimiento. Tenemos el regalo perfecto para cada momento.',
  },
  {
    number: '02',
    title: 'Define el presupuesto',
    desc: 'Tú decides cuánto invertir. Nosotros cubrimos todo el proceso de selección, logística y entrega.',
  },
  {
    number: '03',
    title: 'El destinatario elige',
    desc: 'Reciben un link con una experiencia digital de regalo. Ellos escogen lo que más les gusta.',
  },
]

// ─── Testimonials ──────────────────────────────────────────
const testimonios = [
  {
    quote: 'Nuestro equipo sintió el detalle de verdad. Cada quien recibió algo que realmente quería.',
    name: 'Gabriela R.',
    role: 'Directora de RR.HH., TechMX',
  },
  {
    quote: 'Implementarlo fue muy fácil. En menos de 10 minutos ya teníamos la campaña lista para 80 personas.',
    name: 'Carlos M.',
    role: 'CEO, Distribuidora Norte',
  },
]

export default function EmpresasPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[100px] relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,83,126,0.12),transparent_70%)]"
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
          className="relative z-10 max-w-4xl"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose/5 border border-rose/10 mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-rose">
              Gifting Corporativo · micompli para empresas
            </p>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="font-display text-[clamp(44px,7vw,80px)] font-bold leading-[1.05] tracking-[-0.04em] mb-8 text-ink"
          >
            Tu equipo lo da todo.{' '}
            <span className="text-rose relative inline-block">
              Reconócelo.
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.5, duration: 1, ease: 'circOut' }}
                className="absolute -bottom-2 left-0 h-[4px] bg-rose/20 rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-[clamp(18px,2vw,22px)] text-ink/50 font-medium max-w-2xl mx-auto mb-16 leading-relaxed"
          >
            Gifting corporativo que se siente personal. Regalos para empleados y clientes,{' '}
            <span className="text-ink italic font-serif">con alma latinoamericana.</span>
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/empresas/registro"
                className="inline-block bg-ink text-white rounded-full px-10 py-4 text-[13px] font-bold uppercase tracking-[2px] hover:bg-rose transition-all duration-500 shadow-premium"
              >
                Crear cuenta empresarial
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <a
                href="mailto:hola@micompli.com"
                className="inline-block group border border-black/10 rounded-full px-10 py-4 text-[13px] font-bold uppercase tracking-[2px] text-ink hover:bg-black/5 transition-all duration-500"
              >
                Hablar con un asesor
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-3 text-rose">→</span>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── OCASIONES ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#F9F9F9]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[4px] text-rose uppercase font-bold mb-4">Ocasiones</p>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-ink">
              Un regalo para{' '}
              <span className="font-serif italic text-rose font-light">cada momento</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ocasiones.map((oc, i) => (
              <motion.div
                key={oc.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={`/explorar?audiencia=b2b&ocasion=${oc.slug}`}
                  className="group flex flex-col items-center gap-4 bg-white rounded-[28px] p-8 border border-black/[0.04] hover:border-rose/20 hover:shadow-premium transition-all duration-500"
                >
                  <oc.icon sx={{ fontSize: 36 }} className="text-rose/80" />
                  <span className="text-[12px] font-bold text-ink/70 group-hover:text-rose transition-colors text-center uppercase tracking-[1px]">
                    {oc.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESO ──────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <p className="text-[10px] tracking-[4px] text-rose uppercase font-bold mb-4">Cómo funciona</p>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-ink">
              Así de{' '}
              <span className="font-serif italic text-rose font-light">sencillo</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pasos.map((paso, i) => (
              <motion.div
                key={paso.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-[#F9F9F9] rounded-[40px] p-10 border border-black/[0.03]"
              >
                <span className="font-display text-7xl font-black text-ink/[0.04] absolute top-8 right-10 select-none">
                  {paso.number}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-rose/10 flex items-center justify-center mb-8">
                  <span className="font-display text-lg font-black text-rose">{paso.number}</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-4 text-ink">{paso.title}</h3>
                <p className="text-ink/50 leading-relaxed font-medium">{paso.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ───────────────────────────────────── */}
      <section className="py-32 px-6 bg-ink">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <p className="text-[10px] tracking-[4px] text-rose uppercase font-bold mb-4">Ventajas</p>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-white">
              Por qué las empresas{' '}
              <span className="font-serif italic text-rose font-light">nos eligen</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficios.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5 group"
              >
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle className="text-rose text-2xl" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-2 text-white group-hover:text-rose transition-colors duration-300">
                    {b.title}
                  </h3>
                  <p className="text-white/40 text-[15px] leading-relaxed font-medium">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────── */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-[10px] tracking-[4px] text-rose uppercase font-bold mb-4">Testimonios</p>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-ink">
              Lo que dicen{' '}
              <span className="font-serif italic text-rose font-light">nuestros clientes</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonios.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#F9F9F9] rounded-[40px] p-10 border border-black/[0.03]"
              >
                <p className="text-ink/70 text-lg leading-relaxed font-medium mb-8 italic font-serif">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-bold text-ink text-[15px]">{t.name}</p>
                  <p className="text-ink/40 text-[13px] mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-32 px-6 bg-rose">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-[clamp(36px,5vw,60px)] font-bold text-white mb-8 leading-[1.1]">
            Empieza a regalar experiencias hoy
          </h2>
          <p className="text-white/70 text-xl font-medium mb-12 leading-relaxed">
            Sin contratos. Sin mínimos. Solo gifting que conecta de verdad.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/empresas/registro"
                className="inline-block bg-white text-rose rounded-full px-10 py-4 text-[13px] font-bold uppercase tracking-[2px] hover:bg-ink hover:text-white transition-all duration-500 shadow-premium"
              >
                Crear cuenta gratis
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <a
                href="mailto:hola@micompli.com"
                className="inline-block group border-2 border-white/40 text-white rounded-full px-10 py-4 text-[13px] font-bold uppercase tracking-[2px] hover:border-white transition-all duration-500"
              >
                Hablar con un asesor
                <ArrowForward className="inline ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </main>
  )
}