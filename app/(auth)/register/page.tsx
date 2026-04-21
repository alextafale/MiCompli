'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', confirmar: '', rol: 'cliente' as 'cliente' | 'complice',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

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
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.nombre },
        },
      })
      if (error) throw error

      // Actualizar rol si es cómplice
      if (form.rol === 'complice' && data.user) {
        await supabase
          .from('profiles')
          .update({ role: 'complice' })
          .eq('id', data.user.id)
      }

      toast.success('¡Cuenta creada! Revisa tu email para confirmar.')
      router.push(form.rol === 'complice' ? '/dashboard' : '/')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-3xl border border-black/5 p-8 w-full max-w-sm shadow-rose">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="font-serif text-3xl mb-1">
            Mi<span className="text-rose italic">Compli</span>
          </p>
          <p className="text-ink-mid text-sm">Crea tu cuenta y empieza a sorprender</p>
        </div>

        {/* Rol selector */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-cream rounded-2xl">
          {[
            { val: 'cliente',  emoji: '🎁', label: 'Quiero sorprender' },
            { val: 'complice', emoji: '✨', label: 'Soy Cómplice' },
          ].map(r => (
            <button
              key={r.val}
              onClick={() => setForm(f => ({ ...f, rol: r.val as any }))}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all ${
                form.rol === r.val
                  ? 'bg-white text-rose shadow-sm border border-rose/20'
                  : 'text-ink-mid hover:text-ink'
              }`}
            >
              <span className="text-lg">{r.emoji}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <Field
            placeholder="Tu nombre completo"
            value={form.nombre}
            onChange={set('nombre')}
            icon="👤"
          />
          <Field
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={set('email')}
            icon="✉️"
          />
          <Field
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={set('password')}
            icon="🔒"
          />
          <Field
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
            onChange={set('confirmar')}
            icon="🔒"
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-5 bg-rose text-white rounded-full py-3 font-medium hover:bg-rose-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Creando cuenta...' : `Crear cuenta ${form.rol === 'complice' ? 'de Cómplice' : ''}`}
        </button>

        <p className="text-center text-xs text-ink-mid mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-rose hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({
  type = 'text', placeholder, value, onChange, icon,
}: {
  type?: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon: string
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-3 rounded-xl border border-black/10 text-sm outline-none focus:border-rose bg-white transition-colors"
      />
    </div>
  )
}
