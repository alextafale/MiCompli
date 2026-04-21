// Este archivo es generado automáticamente por Supabase CLI.
// Ejecuta: npm run db:types
// para regenerarlo después de cambios en la base de datos.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string | null
          rol: 'cliente' | 'complice' | 'admin'
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['perfiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['perfiles']['Insert']>
      }
      experiencias: {
        Row: {
          id: string
          nombre: string
          descripcion: string
          categoria: 'regalo' | 'experiencia'
          precio_base: number
          emoji: string
          imagen_url: string | null
          activa: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['experiencias']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['experiencias']['Insert']>
      }
      ordenes: {
        Row: {
          id: string
          cliente_id: string
          experiencia_id: string
          estado: 'pendiente' | 'confirmada' | 'en_progreso' | 'completada' | 'cancelada'
          precio_total: number
          fecha_deseada: string | null
          para_nombre: string
          mensaje_personal: string | null
          ubicacion_id: string | null
          ambiente_musical_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ordenes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ordenes']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
