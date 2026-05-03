'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { SaveOutlined } from '@mui/icons-material'

export default function ProveedorPerfilPage() {
  const supabase = createClient()
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: p } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', data.user.id)
        .single()
      if (p) setForm({ full_name: p.full_name ?? '', phone: p.phone ?? '' })
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, phone: form.phone })
      .eq('id', user!.id)
    setLoading(false)
    if (error) toast.error(error.message)
    else toast.success('Perfil actualizado')
  }

  const fieldCls = "w-full px-4 py-3 rounded-2xl border border-black/8 text-sm outline-none focus:border-rose bg-white text-ink transition-colors"
  const labelCls = "block text-[11px] font-bold uppercase tracking-[1.5px] text-ink/40 mb-2"

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[3px] text-rose font-bold mb-2">Proveedor</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-2">Mi Perfil</h1>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-5">
        <div>
          <label className={labelCls}>Nombre completo</label>
          <input
            className={fieldCls}
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelCls}>Teléfono</label>
          <input
            className={fieldCls}
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="group w-full bg-rose text-white rounded-2xl py-4 font-bold text-sm hover:bg-rose-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose/20"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <SaveOutlined sx={{ fontSize: 18 }} />
          )}
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
