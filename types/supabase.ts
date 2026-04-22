export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      experiencia_addons: {
        Row: {
          descripcion: string | null
          experiencia_id: string | null
          icon: string | null
          id: string
          nombre: string
          orden: number | null
          precio: number
          tipo: Database["public"]["Enums"]["addon_tipo"]
        }
        Insert: {
          descripcion?: string | null
          experiencia_id?: string | null
          icon?: string | null
          id?: string
          nombre: string
          orden?: number | null
          precio?: number
          tipo?: Database["public"]["Enums"]["addon_tipo"]
        }
        Update: {
          descripcion?: string | null
          experiencia_id?: string | null
          icon?: string | null
          id?: string
          nombre?: string
          orden?: number | null
          precio?: number
          tipo?: Database["public"]["Enums"]["addon_tipo"]
        }
        Relationships: [
          {
            foreignKeyName: "experiencia_addons_experiencia_id_fkey"
            columns: ["experiencia_id"]
            isOneToOne: false
            referencedRelation: "experiencias"
            referencedColumns: ["id"]
          },
        ]
      }
      experiencias: {
        Row: {
          activo: boolean | null
          categoria: Database["public"]["Enums"]["categoria_tipo"]
          created_at: string | null
          descripcion: string
          emoji: string | null
          id: string
          imagen_url: string | null
          nombre: string
          precio_base: number
        }
        Insert: {
          activo?: boolean | null
          categoria: Database["public"]["Enums"]["categoria_tipo"]
          created_at?: string | null
          descripcion: string
          emoji?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          precio_base: number
        }
        Update: {
          activo?: boolean | null
          categoria?: Database["public"]["Enums"]["categoria_tipo"]
          created_at?: string | null
          descripcion?: string
          emoji?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          precio_base?: number
        }
        Relationships: []
      }
      orden_complices: {
        Row: {
          complice_id: string | null
          created_at: string | null
          estado: string
          id: string
          notas: string | null
          orden_id: string | null
          servicio_id: string | null
        }
        Insert: {
          complice_id?: string | null
          created_at?: string | null
          estado?: string
          id?: string
          notas?: string | null
          orden_id?: string | null
          servicio_id?: string | null
        }
        Update: {
          complice_id?: string | null
          created_at?: string | null
          estado?: string
          id?: string
          notas?: string | null
          orden_id?: string | null
          servicio_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orden_complices_complice_id_fkey"
            columns: ["complice_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orden_complices_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes: {
        Row: {
          addons_seleccionados: Json | null
          cliente_id: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["orden_estado"]
          experiencia_id: string | null
          fecha_deseada: string
          id: string
          mensaje_personal: string | null
          numero: string | null
          para_nombre: string
          total: number
          updated_at: string | null
        }
        Insert: {
          addons_seleccionados?: Json | null
          cliente_id?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["orden_estado"]
          experiencia_id?: string | null
          fecha_deseada: string
          id?: string
          mensaje_personal?: string | null
          numero?: string | null
          para_nombre: string
          total: number
          updated_at?: string | null
        }
        Update: {
          addons_seleccionados?: Json | null
          cliente_id?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["orden_estado"]
          experiencia_id?: string | null
          fecha_deseada?: string
          id?: string
          mensaje_personal?: string | null
          numero?: string | null
          para_nombre?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_experiencia_id_fkey"
            columns: ["experiencia_id"]
            isOneToOne: false
            referencedRelation: "experiencias"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      servicios: {
        Row: {
          activo: boolean | null
          categoria: Database["public"]["Enums"]["categoria_tipo"]
          complice_id: string | null
          created_at: string | null
          descripcion: string
          id: string
          imagenes: string[] | null
          nombre: string
          precio_base: number
        }
        Insert: {
          activo?: boolean | null
          categoria: Database["public"]["Enums"]["categoria_tipo"]
          complice_id?: string | null
          created_at?: string | null
          descripcion: string
          id?: string
          imagenes?: string[] | null
          nombre: string
          precio_base: number
        }
        Update: {
          activo?: boolean | null
          categoria?: Database["public"]["Enums"]["categoria_tipo"]
          complice_id?: string | null
          created_at?: string | null
          descripcion?: string
          id?: string
          imagenes?: string[] | null
          nombre?: string
          precio_base?: number
        }
        Relationships: [
          {
            foreignKeyName: "servicios_complice_id_fkey"
            columns: ["complice_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      addon_tipo: "ubicacion" | "musica" | "extra"
      categoria_tipo: "regalo" | "experiencia"
      orden_estado:
      | "pendiente"
      | "confirmada"
      | "en_proceso"
      | "completada"
      | "cancelada"
      user_role: "cliente" | "complice" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      addon_tipo: ["ubicacion", "musica", "extra"],
      categoria_tipo: ["regalo", "experiencia"],
      orden_estado: [
        "pendiente",
        "confirmada",
        "en_proceso",
        "completada",
        "cancelada",
      ],
      user_role: ["cliente", "complice", "admin"],
    },
  },
} as const
