import type { Database } from './supabase'
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Experiencia = Database['public']['Tables']['experiencias']['Row']
export type ExperienciaAddon = Database['public']['Tables']['experiencia_addons']['Row']
export type Orden = Database['public']['Tables']['ordenes']['Row']
export type OrdenComplice = Database['public']['Tables']['orden_complices']['Row']
export type Servicio = Database['public']['Tables']['servicios']['Row']

export type ExperienciaConAddons = Experiencia & {
  addons: ExperienciaAddon[]
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
