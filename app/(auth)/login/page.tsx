'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { EmailOutlined, LockOutlined, FavoriteOutlined, ArrowForward, AutoAwesome } from '@mui/icons-material'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex bg-[#FDF8F5]">

      {/* LEFT PANEL — decorativo */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-rose flex-col items-center justify-center p-16">
        {/* Dot texture */}
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
            Cada detalle<br />
            <span className="italic opacity-80">importa.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            Detrás de cada sorpresa perfecta hay cómplices que hacen la magia posible.
          </p>

          <div className="mt-14 flex flex-col gap-3">
            {[
              { icon: <AutoAwesome sx={{ fontSize: 16 }} />, text: 'Experiencias únicas e irrepetibles' },
              { icon: <FavoriteOutlined sx={{ fontSize: 16 }} />, text: 'Coordinadas por cómplices expertos' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-left">
                <span className="text-white/70">{item.icon}</span>
                <span className="text-white/70 text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-rose/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-rose/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-sm relative">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <FavoriteOutlined className="text-rose" sx={{ fontSize: 20 }} />
            <span className="font-serif text-2xl">Mi<span className="text-rose italic">Compli</span></span>
          </div>

          <div className="mb-10">
            <p className="text-xs tracking-[3px] uppercase text-rose font-semibold mb-3">Bienvenido de vuelta</p>
            <h1 className="font-serif text-4xl text-ink leading-tight">
              Inicia<br />sesión
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            <FloatingField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={setEmail}
              onKeyDown={handleKeyDown}
              focused={focused === 'email'}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              icon={<EmailOutlined sx={{ fontSize: 18 }} />}
            />
            <FloatingField
              label="Contraseña"
              type="password"
              value={password}
              onChange={setPassword}
              onKeyDown={handleKeyDown}
              focused={focused === 'password'}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              icon={<LockOutlined sx={{ fontSize: 18 }} />}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="group w-full bg-rose text-white rounded-2xl py-4 font-semibold text-sm hover:bg-rose-dark transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose/20 hover:shadow-xl hover:shadow-rose/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowForward sx={{ fontSize: 18 }} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-black/8" />
            <span className="text-[11px] text-ink-mid uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          <p className="text-center text-sm text-ink-mid">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-rose font-semibold hover:underline underline-offset-2">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function FloatingField({
  label, type, value, onChange, onKeyDown, focused, onFocus, onBlur, icon,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  focused: boolean
  onFocus: () => void
  onBlur: () => void
  icon: React.ReactNode
}) {
  const active = focused || value.length > 0
  return (
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? 'text-rose' : 'text-ink-mid/40'}`}>
        {icon}
      </div>
      <label className={`absolute left-12 pointer-events-none transition-all duration-200 ${active ? 'top-2.5 text-[10px] font-bold tracking-wider uppercase text-rose' : 'top-1/2 -translate-y-1/2 text-sm text-ink-mid'
        }`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full pl-12 pr-4 pt-6 pb-2.5 rounded-2xl border text-sm outline-none transition-all duration-200 bg-white ${focused ? 'border-rose shadow-sm shadow-rose/10' : 'border-black/8 hover:border-black/15'
          }`}
      />
    </div>
  )
}