'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function CheckoutForm() {
  const router = useRouter()
  const supabase = createClient()
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '', fecha: '',
  })

  useEffect(() => {
    const raw = sessionStorage.getItem('mc_cart')
    if (!raw) { router.push('/explorar'); return }
    setCart(JSON.parse(raw))
  }, [])

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.fecha) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.from('ordenes').insert({
        cliente_id: user?.id ?? null,
        experiencia_id: cart.experiencia_id,
        estado: 'pendiente',
        fecha_deseada: form.fecha,
        para_nombre: cart.para_nombre || 'Sorpresa',
        mensaje_personal: cart.mensaje_personal || null,
        total: cart.total,
        addons_seleccionados: cart.addons,
      }).select('numero').single()

      if (error) throw error
      sessionStorage.removeItem('mc_cart')
      router.push(`/success?numero=${data.numero}&total=${cart.total}`)
    } catch (e: any) {
      toast.error('Error al confirmar: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!cart) return null

  return (
    <div className="pt-[80px] max-w-lg mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-2">Último paso 🎉</h1>
      <p className="text-ink-mid mb-8">Solo unos datos para coordinar a tus cómplices</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="Tu nombre *" placeholder="Ana García" value={form.nombre} onChange={v => setForm(f => ({ ...f, nombre: v }))} />
        <Field label="Teléfono" placeholder="+52 443 000 0000" value={form.telefono} onChange={v => setForm(f => ({ ...f, telefono: v }))} />
      </div>
      <Field label="Email *" placeholder="ana@ejemplo.com" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />
      <Field label="Fecha deseada *" value={form.fecha} onChange={v => setForm(f => ({ ...f, fecha: v }))} type="date" />

      <div className="bg-rose-light rounded-2xl p-4 my-6 text-sm text-rose-dark leading-relaxed">
        ✨ Una vez confirmado, tu equipo de cómplices recibirá la orden y se coordinarán para que todo salga perfecto.
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-2xl border border-black/5 p-5 mb-6">
        <h2 className="font-serif text-lg mb-4">Resumen</h2>
        <div className="space-y-2">
          <Line label={cart.experiencia_nombre} value={`$${cart.total - cart.addons.reduce((a: number, x: any) => a + x.precio, 0)}`} />
          {cart.addons.map((a: any) => (
            <Line key={a.addon_id} label={a.nombre} value={`+$${a.precio}`} />
          ))}
          <div className="flex justify-between font-medium pt-3 border-t border-black/5">
            <span>Total</span>
            <span>${cart.total.toLocaleString()} MXN</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit} disabled={loading}
        className="w-full bg-rose text-white rounded-full py-4 font-medium hover:bg-rose-dark transition-colors disabled:opacity-60 text-base"
      >
        {loading ? 'Confirmando...' : 'Confirmar y pagar →'}
      </button>
    </div>
  )
}

function Field({ label, placeholder = '', value, onChange, type = 'text' }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-ink-mid mb-1.5">{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm outline-none focus:border-rose bg-white"
      />
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm text-ink-mid">
      <span>{label}</span><span>{value}</span>
    </div>
  )
}
