'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AutoAwesome, Person, Email, Lock, ArrowForward,
  CheckCircle, Store, LocalFlorist, Restaurant,
  Spa, CameraAlt, MusicNote, CardGiftcard,
} from '@mui/icons-material'

const TIPOS_PROVEEDOR = [
  { val: 'floreria', label: 'Florería', icon: LocalFlorist },
  { val: 'restaurante', label: 'Restaurante / Chef', icon: Restaurant },
  { val: 'spa', label: 'Spa / Bienestar', icon: Spa },
  { val: 'fotografia', label: 'Fotografía / Video', icon: CameraAlt },
  { val: 'musica', label: 'Música en vivo', icon: MusicNote },
  { val: 'kits', label: 'Kits y Boxes', icon: CardGiftcard },
  { val: 'experiencias', label: 'Experiencias', icon: AutoAwesome },
  { val: 'otro', label: 'Otro', icon: Store },
]

const STEPS = ['Tu negocio', 'Tu cuenta', '¡Listo!']

export default function ProveedorRegistroPage() {
  const supabase = createClient()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const [form, setForm] = useState({
    // Negocio
    nombre_negocio: '',
    tipo: '',
    descripcion: '',
    ciudad: '',
    // Cuenta
    nombre_contacto: '',
    email: '',
    telefono: '',
    password: '',
    confirmar: '',
  })

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const validarStep1 = () => {
    if (!form.nombre_negocio) { toast.error('Ingresa el nombre de tu negocio'); return false }
    if (!form.tipo) { toast.error('Selecciona el tipo de negocio'); return false }
    if (!form.ciudad) { toast.error('Ingresa tu ciudad'); return false }
    return true
  }

  const validarStep2 = () => {
    if (!form.nombre_contacto) { toast.error('Ingresa tu nombre'); return false }
    if (!form.email) { toast.error('Ingresa tu email'); return false }
    if (!form.password || form.password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return false }
    if (form.password !== form.confirmar) { toast.error('Las contraseñas no coinciden'); return false }
    return true
  }

  const handleRegistro = async () => {
    if (!validarStep2()) return
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.nombre_contacto } },
      })
      if (error) throw error
      if (!data.user) throw new Error('No se pudo crear el usuario')

      // Actualizar rol a complice
      await supabase
        .from('profiles')
        .update({ role: 'complice', phone: form.telefono || null })
        .eq('id', data.user.id)

      // Crear registro en complices
      const db = supabase as any
      const { error: compError } = await db
        .from('complices')
        .insert({
          perfil_id: data.user.id,
          nombre_negocio: form.nombre_negocio,
          descripcion: form.descripcion || null,
          categoria: form.tipo,
          ciudad: form.ciudad,
        })
      if (compError) throw compError

      setStep(3)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FDF8F5]">

      {/* ── PANEL IZQUIERDO ──────────────────────────────── */}
      <div className="hidden lg:flex w-[42%] bg-rose flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-dark/20 blur-[80px] rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <AutoAwesome className="text-white text-sm" />
            </div>
            <span className="text-white/60 text-[12px] font-bold uppercase tracking-[2px] group-hover:text-white transition-colors">
              micompli · proveedores
            </span>
          </Link>
        </div>

        {/* Contenido */}
        <div className="relative z-10">
          <p className="text-[10px] tracking-[4px] text-white/50 uppercase font-bold mb-6">
            Únete como proveedor
          </p>
          <h2 className="font-display text-5xl font-bold text-white leading-[1.1] mb-8">
            Conecta tu negocio con{' '}
            <span className="italic font-serif font-light opacity-80">quien lo necesita.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-12">
            Sube tus productos o servicios y llega a cientos de empresas y personas que buscan exactamente lo que ofreces.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '10K+', label: 'Experiencias creadas' },
              { value: '500+', label: 'Empresas activas' },
              { value: '98%', label: 'Satisfacción' },
              { value: '0%', label: 'Comisión inicial' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="bg-white/10 rounded-2xl p-4"
              >
                <p className="font-display text-2xl font-black text-white">{s.value}</p>
                <p className="text-white/50 text-[11px] font-medium mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/30 text-[11px]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-white/60 hover:text-white transition-colors font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* ── PANEL DERECHO ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-xl bg-rose flex items-center justify-center">
              <AutoAwesome className="text-white text-sm" />
            </div>
            <span className="text-ink/60 text-[12px] font-bold uppercase tracking-[2px]">
              micompli · proveedores
            </span>
          </div>

          {/* Stepper */}
          {step < 3 && (
            <div className="flex items-center gap-3 mb-10">
              {STEPS.slice(0, 2).map((s, i) => (
                <div key={s} className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${step > i + 1 ? 'bg-rose text-white' :
                        step === i + 1 ? 'bg-ink text-white' :
                          'bg-black/8 text-ink/30'
                      }`}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-[1px] ${step === i + 1 ? 'text-ink' : 'text-ink/30'
                      }`}>{s}</span>
                  </div>
                  {i < 1 && (
                    <div className={`flex-1 h-[2px] rounded-full transition-all ${step > i + 1 ? 'bg-rose' : 'bg-black/8'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* Step 1: Datos del negocio */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <p className="text-[10px] tracking-[3px] uppercase text-rose font-bold mb-3">Paso 1 de 2</p>
                  <h1 className="font-display text-3xl font-bold text-ink">Cuéntanos de tu negocio</h1>
                </div>

                <div className="space-y-4">
                  <FloatingField
                    label="Nombre de tu negocio *"
                    value={form.nombre_negocio}
                    onChange={set('nombre_negocio')}
                    icon={<Store sx={{ fontSize: 18 }} />}
                    focused={focused === 'negocio'}
                    onFocus={() => setFocused('negocio')}
                    onBlur={() => setFocused(null)}
                  />

                  {/* Tipo de negocio */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-3">
                      ¿Qué ofreces? *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIPOS_PROVEEDOR.map(t => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => set('tipo')(t.val)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${form.tipo === t.val
                              ? 'border-rose bg-rose/5 shadow-sm'
                              : 'border-black/8 hover:border-rose/30'
                            }`}
                        >
                          <t.icon className={`text-lg ${form.tipo === t.val ? 'text-rose' : 'text-ink/30'}`} />
                          <span className={`text-[12px] font-semibold ${form.tipo === t.val ? 'text-rose' : 'text-ink/60'}`}>
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <FloatingField
                    label="Ciudad *"
                    value={form.ciudad}
                    onChange={set('ciudad')}
                    icon={<Store sx={{ fontSize: 18 }} />}
                    focused={focused === 'ciudad'}
                    onFocus={() => setFocused('ciudad')}
                    onBlur={() => setFocused(null)}
                    placeholder="Morelia, CDMX, Guadalajara..."
                  />

                  <div>
                    <label className="block text-[11px] uppercase tracking-[1.5px] text-ink/40 font-bold mb-2">
                      Descripción breve
                    </label>
                    <textarea
                      value={form.descripcion}
                      onChange={e => set('descripcion')(e.target.value)}
                      placeholder="¿Qué hace especial a tu negocio?"
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-white resize-none transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={() => validarStep1() && setStep(2)}
                  className="w-full mt-8 bg-ink text-white rounded-2xl py-4 font-semibold text-sm hover:bg-rose transition-all flex items-center justify-center gap-2 shadow-lg shadow-ink/10"
                >
                  Continuar <ArrowForward sx={{ fontSize: 18 }} />
                </button>

                <p className="text-center text-sm text-ink/40 mt-6">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-rose font-semibold hover:underline">Inicia sesión</Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: Datos de cuenta */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <p className="text-[10px] tracking-[3px] uppercase text-rose font-bold mb-3">Paso 2 de 2</p>
                  <h1 className="font-display text-3xl font-bold text-ink">Crea tu cuenta</h1>
                  <p className="text-ink/40 text-sm mt-2">
                    Para <span className="font-semibold text-ink">{form.nombre_negocio}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <FloatingField
                    label="Tu nombre completo *"
                    value={form.nombre_contacto}
                    onChange={set('nombre_contacto')}
                    icon={<Person sx={{ fontSize: 18 }} />}
                    focused={focused === 'nombre'}
                    onFocus={() => setFocused('nombre')}
                    onBlur={() => setFocused(null)}
                  />
                  <FloatingField
                    label="Email *"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    icon={<Email sx={{ fontSize: 18 }} />}
                    focused={focused === 'email'}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                  <FloatingField
                    label="Teléfono (opcional)"
                    type="tel"
                    value={form.telefono}
                    onChange={set('telefono')}
                    icon={<Person sx={{ fontSize: 18 }} />}
                    focused={focused === 'telefono'}
                    onFocus={() => setFocused('telefono')}
                    onBlur={() => setFocused(null)}
                    placeholder="+52 443 000 0000"
                  />
                  <FloatingField
                    label="Contraseña *"
                    type="password"
                    value={form.password}
                    onChange={set('password')}
                    icon={<Lock sx={{ fontSize: 18 }} />}
                    focused={focused === 'password'}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                  />
                  <FloatingField
                    label="Confirmar contraseña *"
                    type="password"
                    value={form.confirmar}
                    onChange={set('confirmar')}
                    icon={<Lock sx={{ fontSize: 18 }} />}
                    focused={focused === 'confirmar'}
                    onFocus={() => setFocused('confirmar')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <p className="text-[11px] text-ink/30 mt-4 leading-relaxed">
                  Al registrarte aceptas nuestros{' '}
                  <Link href="/terminos" className="text-rose hover:underline">términos</Link> y{' '}
                  <Link href="/privacidad" className="text-rose hover:underline">política de privacidad</Link>.
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-black/10 text-ink rounded-2xl py-4 text-sm font-semibold hover:border-rose/30 transition-all"
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={handleRegistro}
                    disabled={loading}
                    className="flex-1 bg-rose text-white rounded-2xl py-4 text-sm font-semibold hover:bg-ink transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose/20"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>Crear cuenta <ArrowForward sx={{ fontSize: 18 }} /></>
                    }
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Éxito */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                  className="w-20 h-20 rounded-[28px] bg-rose/10 flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle className="text-rose text-4xl" />
                </motion.div>

                <h1 className="font-display text-3xl font-bold text-ink mb-4">
                  ¡Bienvenido, {form.nombre_negocio}!
                </h1>
                <p className="text-ink/50 mb-4 leading-relaxed">
                  Tu cuenta está lista. Confirma tu email y empieza a subir tus productos.
                </p>
                <p className="text-[12px] text-ink/30 mb-10">
                  📧 Enviamos un correo a <span className="font-semibold text-ink/50">{form.email}</span>
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/dashboard"
                    className="block w-full bg-ink text-white rounded-2xl py-4 text-sm font-bold uppercase tracking-[1.5px] hover:bg-rose transition-all text-center"
                  >
                    Ir a mi panel →
                  </Link>
                  <Link
                    href="/"
                    className="block w-full text-center text-ink/40 text-sm hover:text-rose transition-colors py-2"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function FloatingField({
  label, type = 'text', value, onChange, focused, onFocus, onBlur, icon, placeholder,
}: {
  label: string; type?: string; value: string
  onChange: (v: string) => void; focused: boolean
  onFocus: () => void; onBlur: () => void
  icon: React.ReactNode; placeholder?: string
}) {
  const active = focused || value.length > 0
  return (
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? 'text-rose' : 'text-ink/30'}`}>
        {icon}
      </div>
      <label className={`absolute left-12 pointer-events-none transition-all duration-200 ${active ? 'top-2.5 text-[10px] font-bold tracking-wider uppercase text-rose' : 'top-1/2 -translate-y-1/2 text-sm text-ink/50'
        }`}>
        {label}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus} onBlur={onBlur}
        placeholder={active ? (placeholder ?? '') : ''}
        className={`w-full pl-12 pr-4 pt-6 pb-2.5 rounded-2xl border text-sm outline-none transition-all duration-200 bg-white ${focused ? 'border-rose shadow-sm shadow-rose/10' : 'border-black/8 hover:border-black/15'
          }`}
      />
    </div>
  )
}