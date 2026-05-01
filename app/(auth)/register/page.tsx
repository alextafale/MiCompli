'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  PersonOutlined,
  EmailOutlined,
  LockOutlined,
  FavoriteOutlined,
  ArrowForward,
  CardGiftcardOutlined,
  AutoAwesome,
  Business,
} from '@mui/icons-material'

type Rol = 'cliente' | 'complice' | 'empresa'

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
    rol: 'cliente' as Rol,
    // Campos empresa
    nombre_empresa: '',
    industria: '',
    tamano: '1-10',
  })
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async () => {
    if (!form.nombre || !form.email || !form.password) {
      toast.error('Completa todos los campos')
      return
    }
    if (form.password !== form.confirmar) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (form.rol === 'empresa' && !form.nombre_empresa) {
      toast.error('Ingresa el nombre de tu empresa')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.nombre } },
      })
      if (error) throw error
      if (!data.user) throw new Error('No se pudo crear el usuario')

      // Actualizar rol en profiles
      if (form.rol !== 'cliente') {
        await supabase
          .from('profiles')
          .update({ role: form.rol })
          .eq('id', data.user.id)
      }

      // Si es empresa, crear registro en tabla empresas
      if (form.rol === 'empresa') {
        const { error: empresaError } = await supabase
          .from('empresas')
          .insert({
            perfil_id: data.user.id,
            nombre_empresa: form.nombre_empresa,
            industria: form.industria || null,
            tamano: form.tamano,
          })
        if (empresaError) throw empresaError
      }

      toast.success('¡Cuenta creada! Revisa tu email para confirmar.')

      if (form.rol === 'empresa') {
        router.push('/dashboard/empresa')
      } else if (form.rol === 'complice') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    {
      val: 'cliente',
      icon: <CardGiftcardOutlined sx={{ fontSize: 22 }} />,
      label: 'Quiero sorprender',
      desc: 'Organiza experiencias únicas',
    },
    {
      val: 'empresa',
      icon: <Business sx={{ fontSize: 22 }} />,
      label: 'Soy Empresa',
      desc: 'Gifting para mi equipo',
    },
    {
      val: 'complice',
      icon: <AutoAwesome sx={{ fontSize: 22 }} />,
      label: 'Soy Cómplice',
      desc: 'Haz la magia posible',
    },
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

  return (
    <div className="min-h-screen flex bg-[#FDF8F5]">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-rose flex-col items-center justify-center p-16">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-rose-dark/30 blur-3xl" />

        <div className="relative z-10 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-10">
            <FavoriteOutlined sx={{ fontSize: 16 }} className="opacity-60" />
            <span className="text-xs tracking-[4px] uppercase font-semibold opacity-60">MiCompli</span>
            <FavoriteOutlined sx={{ fontSize: 16 }} className="opacity-60" />
          </div>
          <h2 className="font-serif text-5xl leading-tight mb-6">
            Empieza a<br />
            <span className="italic opacity-80">sorprender.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            Únete a la comunidad que convierte los momentos especiales en recuerdos inolvidables.
          </p>
          <div className="mt-14 flex flex-col gap-3">
            {roles.map((r, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 text-left">
                <div className="text-white/70 flex-shrink-0">{r.icon}</div>
                <div>
                  <p className="text-white/90 text-sm font-semibold">{r.label}</p>
                  <p className="text-white/50 text-xs">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-rose/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-rose/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-sm relative">

          {/* Logo mobile */}
          <div className="lg:hidden flex flex-col items-start gap-4 mb-10">
            <FavoriteOutlined className="text-rose" sx={{ fontSize: 48 }} />
            <span className="font-serif text-5xl">Mi<span className="text-rose italic">Compli</span></span>
          </div>

          <div className="mb-8">
            <p className="text-xs tracking-[3px] uppercase text-rose font-semibold mb-3">Crear cuenta</p>
            <h1 className="font-serif text-4xl text-ink leading-tight">
              Únete a<br />la familia
            </h1>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-7 p-1.5 bg-black/5 rounded-2xl">
            {roles.map(r => (
              <button
                key={r.val}
                onClick={() => setForm(f => ({ ...f, rol: r.val as Rol }))}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl text-xs font-semibold transition-all duration-200 ${form.rol === r.val
                    ? 'bg-white text-rose shadow-sm border border-rose/15 scale-[1.02]'
                    : 'text-ink/50 hover:text-ink'
                  }`}
              >
                <span className={form.rol === r.val ? 'text-rose' : 'text-ink/40'}>
                  {r.icon}
                </span>
                {r.label}
              </button>
            ))}
          </div>

          {/* Campos base */}
          <div className="space-y-3.5 mb-4">
            <FloatingField
              label={form.rol === 'empresa' ? 'Nombre del contacto' : 'Tu nombre completo'}
              type="text"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              focused={focused === 'nombre'}
              onFocus={() => setFocused('nombre')}
              onBlur={() => setFocused(null)}
              icon={<PersonOutlined sx={{ fontSize: 18 }} />}
            />
            <FloatingField
              label="Correo electrónico"
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
            <FloatingField
              label="Confirmar contraseña"
              type="password"
              value={form.confirmar}
              onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))}
              focused={focused === 'confirmar'}
              onFocus={() => setFocused('confirmar')}
              onBlur={() => setFocused(null)}
              icon={<LockOutlined sx={{ fontSize: 18 }} />}
            />
          </div>

          {/* Campos extra para empresa */}
          {form.rol === 'empresa' && (
            <div className="space-y-3.5 mb-4 border-t border-black/5 pt-4">
              <p className="text-[10px] uppercase tracking-[2px] text-rose font-bold">Datos de tu empresa</p>
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
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="group w-full bg-rose text-white rounded-2xl py-4 font-semibold text-sm hover:bg-rose-dark transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose/20 hover:shadow-xl hover:shadow-rose/25 hover:-translate-y-0.5 active:translate-y-0 mt-6"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                {form.rol === 'empresa'
                  ? 'Crear cuenta empresarial'
                  : form.rol === 'complice'
                    ? 'Unirme como Cómplice'
                    : 'Crear mi cuenta'}
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
      <label className={`absolute left-12 pointer-events-none transition-all duration-200 ${active ? 'top-2.5 text-[10px] font-bold tracking-wider uppercase text-rose' : 'top-1/2 -translate-y-1/2 text-sm text-ink/50'
        }`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full pl-12 pr-4 pt-6 pb-2.5 rounded-2xl border text-sm outline-none transition-all duration-200 bg-white ${focused ? 'border-rose shadow-sm shadow-rose/10' : 'border-black/8 hover:border-black/15'
          }`}
      />
    </div>
  )
}