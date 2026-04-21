'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-black/5 p-8 w-full max-w-sm">
        <h1 className="font-serif text-3xl mb-2">Bienvenido 👋</h1>
        <p className="text-ink-mid text-sm mb-6">Inicia sesión en tu cuenta</p>
        <div className="space-y-4">
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm outline-none focus:border-rose"
          />
          <input
            type="password" placeholder="Contraseña" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm outline-none focus:border-rose"
          />
          <button
            onClick={handleLogin} disabled={loading}
            className="w-full bg-rose text-white rounded-full py-3 font-medium hover:bg-rose-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </div>
        <p className="text-center text-sm text-ink-mid mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-rose hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
