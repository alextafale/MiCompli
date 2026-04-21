// Auto-generado con: npm run db:types
// Regenerar cada vez que cambies el schema de Supabase

export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'cliente' | 'complice' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      servicios: {
        Row: {
          id: string
          complice_id: string
          nombre: string
          descripcion: string
          categoria: 'regalo' | 'experiencia'
          precio_base: number
          imagenes: string[]
          activo: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['servicios']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['servicios']['Insert']>
      }
      experiencias: {
        Row: {
          id: string
          nombre: string
          descripcion: string
          categoria: 'regalo' | 'experiencia'
          precio_base: number
          imagen_url: string | null
          emoji: string
          activo: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['experiencias']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['experiencias']['Insert']>
      }
      experiencia_addons: {
        Row: {
          id: string
          experiencia_id: string
          nombre: string
          descripcion: string | null
          precio: number
          icon: string
          tipo: 'ubicacion' | 'musica' | 'extra'
          orden: number
        }
        Insert: Omit<Database['public']['Tables']['experiencia_addons']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['experiencia_addons']['Insert']>
      }
      ordenes: {
        Row: {
          id: string
          numero: string
          cliente_id: string
          experiencia_id: string
          estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada'
          fecha_deseada: string
          para_nombre: string
          mensaje_personal: string | null
          total: number
          addons_seleccionados: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ordenes']['Row'], 'id' | 'numero' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ordenes']['Insert']>
      }
      orden_complices: {
        Row: {
          id: string
          orden_id: string
          complice_id: string
          servicio_id: string | null
          estado: 'asignado' | 'aceptado' | 'en_proceso' | 'completado'
          notas: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['orden_complices']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orden_complices']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'cliente' | 'complice' | 'admin'
      orden_estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada'
    }
  }
}
