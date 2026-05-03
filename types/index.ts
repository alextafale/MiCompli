import type { Database } from './supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Experiencia = Database['public']['Tables']['experiencias']['Row']
export type ExperienciaAddon = Database['public']['Tables']['experiencia_addons']['Row']
export type Orden = Database['public']['Tables']['ordenes']['Row']
export type OrdenComplice = Database['public']['Tables']['orden_complices']['Row']
export type Servicio = Database['public']['Tables']['servicios']['Row']

// ─── Fase 3.5: Ecosistema de Proveedores ─────────────────
export type Categoria = Database['public']['Tables']['categorias']['Row']
export type Producto = Database['public']['Tables']['productos']['Row']
export type Conversacion = Database['public']['Tables']['conversaciones']['Row']
export type MensajeConversacion = Database['public']['Tables']['mensajes_conversacion']['Row']

export type ProductoConProveedor = Producto & {
  proveedor: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'email'>
  categoria: Categoria | null
}


// ─── Enums derivados del schema de Supabase ──────────────
export type AudienciaTipo = Database['public']['Enums']['audiencia_tipo']
export type OcasionTipo = Database['public']['Enums']['ocasion_tipo']

// ─── Extensiones de Experiencia ─────────────────────────
export type ExperienciaConAddons = Omit<Experiencia, 'audiencia' | 'ocasion'> & {
  addons: ExperienciaAddon[]
  audiencia: AudienciaTipo
  ocasion: OcasionTipo
}

export type OrdenConDetalles = Orden & {
  experiencia: Experiencia
  cliente: Profile
  complices: (OrdenComplice & { complice: Profile })[]
}

export type AddonSeleccionado = {
  addon_id: string
  nombre: string
  precio: number
  tipo: ExperienciaAddon['tipo']
}

export type CartState = {
  experiencia: ExperienciaConAddons | null
  addonsSeleccionados: AddonSeleccionado[]
  paraNombre: string
  mensajePersonal: string
  fechaDeseada: string
  total: number
}

// ─── Labels de ocasión ───────────────────────────────────
export const OCASION_LABELS: Record<OcasionTipo, string> = {
  cumpleanos: '🎂 Cumpleaños',
  aniversario_laboral: '🏆 Aniversario laboral',
  onboarding: '🎁 Onboarding',
  reconocimiento: '⭐ Reconocimiento',
  regalo_cliente: '💼 Regalo a cliente',
  dia_especial: '✨ Día especial',
  sin_ocasion: '🎀 Sin ocasión',
}