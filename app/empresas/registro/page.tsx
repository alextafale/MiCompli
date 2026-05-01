'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Business,
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material'

const beneficios = [
  'Dashboard corporativo incluido',
  'Sin contratos ni mínimos',
  'Facturación empresarial',
  'Ejecutivo de cuenta dedicado',
]

const industriaOpts = [
  'Tecnología', 'Salud', 'Retail', 'Manufactura',
  'Servicios financieros', 'Educación', 'Alimentos', 'Otro',
]

const tamanoOpts = [
  { val: '1-10', label: '1–10 empleados' },
  { val: '11-50', label: '11–50 empleados' },
  { val: '51-200', label: '51–200 empleados' },
  { val: '200+', label: '200+ empleados' },
]

export default function EmpresaRegistroPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre_contacto: '',
    email: '',
    password: '',
    nombre_empresa: '',
    industria: '',
    tamano: '1-10',
  })

  const handleRegister = async () => {
    if (!form.nombre_contacto || !form.email || !form.password || !form.nombre_empresa) {
      toast.error('Completa todos los campos obligatorios')
      return
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      // 1. Crear usuario en auth
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.nombre_contacto } },
      })
      if (error) throw error
      if (!data.user) throw new Error('No se pudo crear el usuario')

      // 2. Actualizar rol a empresa
      await supabase
        .from('profiles')
        .update({ role: 'empresa' })
        .eq('id', data.user.id)

      // 3. Crear registro en tabla empresas
      const { error: empresaError } = await supabase
        .from('empresas')
        .insert({
          perfil_id: data.user.id,
          nombre_empresa: form.nombre_empresa,
          industria: form.industria || null,
          tamano: form.tamano,
        })
      if (empresaError) throw empresaError

      toast.success('¡Cuenta empresarial creada! Revisa tu email para confirmar.')
      router.push('/dashboard/empresa')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FDF8F5]">

      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-ink flex-col items-center justify-center p-16">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-rose/10 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-rose/5 blur-3xl" />

        <div className="relative z-10 text-white max-w-sm">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose/10 border border-rose/20 mb-12">
            <Business sx={{ fontSize: 14 }} className="text-rose" />
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-rose">Para Empresas</span>
          </div>

          <h2 className="font-serif text-5xl leading-tight mb-6">
            Gifting que<br />
            <span className="italic text-rose">conecta de verdad.</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-16">
            Reconoce a tu equipo con experiencias que se sienten personales.
            Sin catálogos genéricos. Con alma latina.
          </p>

          <div className="flex flex-col gap-4">
            {beneficios.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle sx={{ fontSize: 18 }} className="text-rose flex-shrink-0" />
                <span className="text-white/70 text-sm font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <Business className="text-rose" sx={{ fontSize: 28 }} />
            <span className="font-serif text-3xl">Mi<span className="text-rose italic">Compli</span></span>
          </div>

          <div className="mb-8">
            <p className="text-[10px] tracking-[3px] uppercase text-rose font-bold mb-3">Registro corporativo</p>
            <h1 className="font-serif text-4xl text-ink leading-tight">
              Crea tu<br />cuenta empresarial
            </h1>
          </div>

          <div className="space-y-3.5">
            {/* Contacto */}
            <FloatingField
              label="Nombre del contacto"
              type="text"
              value={form.nombre_contacto}
              onChange={e => setForm(f => ({ ...f, nombre_contacto: e.target.value }))}
              focused={focused === 'contacto'}
              onFocus={() => setFocused('contacto')}
              onBlur={() => setFocused(null)}
              icon={<PersonOutlined sx={{ fontSize: 18 }} />}
            />
            <FloatingField
              label="Email empresarial"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              focused={focused === 'email'}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              icon={<EmailOutlined sx={{ fontSize: 18 }} />}
            />
            <FloatingField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              focused={focused === 'password'}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              icon={<LockOutlined sx={{ fontSize: 18 }} />}
            />

            {/* Separador */}
            <div className="pt-2 pb-1">
              <p className="text-[10px] uppercase tracking-[2px] text-rose font-bold">Datos de tu empresa</p>
            </div>

            <FloatingField
              label="Nombre de la empresa"
              type="text"
              value={form.nombre_empresa}
              onChange={e => setForm(f => ({ ...f, nombre_empresa: e.target.value }))}
              focused={focused === 'empresa'}
              onFocus={() => setFocused('empresa')}
              onBlur={() => setFocused(null)}
              icon={<Business sx={{ fontSize: 18 }} />}
            />

            {/* Industria */}
            <div>
              <label className="block text-xs text-ink/50 mb-1.5">Industria</label>
              <select
                value={form.industria}
                onChange={e => setForm(f => ({ ...f, industria: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-white text-ink/70"
              >
                <option value="">Selecciona una industria</option>
                {industriaOpts.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {/* Tamaño */}
            <div>
              <label className="block text-xs text-ink/50 mb-1.5">Tamaño de empresa</label>
              <div className="grid grid-cols-2 gap-2">
                {tamanoOpts.map(t => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, tamano: t.val }))}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${form.tamano === t.val
                        ? 'border-rose bg-rose/5 text-rose'
                        : 'border-black/8 text-ink/50 hover:border-rose/30'
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="group w-full mt-7 bg-rose text-white rounded-2xl py-4 font-semibold text-sm hover:bg-ink transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose/20 hover:shadow-xl hover:shadow-rose/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta empresarial
                <ArrowForward sx={{ fontSize: 18 }} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-black/8" />
            <span className="text-[11px] text-ink/40 uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          <p className="text-center text-sm text-ink/50">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-rose font-semibold hover:underline underline-offset-2">
              Inicia sesión
            </Link>
          </p>

          <p className="text-center text-xs text-ink/30 mt-4">
            ¿Eres un Cómplice o cliente?{' '}
            <Link href="/register" className="text-rose hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}

function FloatingField({
  label, type, value, onChange, focused, onFocus, onBlur, icon,
}: {
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  focused: boolean
  onFocus: () => void
  onBlur: () => void
  icon: React.ReactNode
}) {
  const active = focused || value.length > 0
  return (
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? 'text-rose' : 'text-ink/30'}`}>
        {icon}
      </div>
      <label className={`absolute left-12 pointer-events-none transition-all duration-200 ${active ? 'top-2.5 text-[10px] font-bold tracking-wider uppercase text-rose' : 'top-1/2 -translate-y-1/2 text-sm text-ink/50'}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full pl-12 pr-4 pt-6 pb-2.5 rounded-2xl border text-sm outline-none transition-all duration-200 bg-white ${focused ? 'border-rose shadow-sm shadow-rose/10' : 'border-black/8 hover:border-black/15'}`}
      />
    </div>
  )
}
