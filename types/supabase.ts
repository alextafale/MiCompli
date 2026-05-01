export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      envios_corporativos: {
        Row: {
          id: string
          empresa_id: string | null
          token_unico: string
          estado: string
          ocasion: string | null
          para_nombre: string | null
          para_email: string | null
          mensaje: string | null
          presupuesto: number | null
          experiencia_id: string | null
          regalo_elegido_id: string | null
          direccion_entrega: Json | null
          elegido_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          empresa_id?: string | null
          token_unico?: string
          estado?: string
          ocasion?: string | null
          para_nombre?: string | null
          para_email?: string | null
          mensaje?: string | null
          presupuesto?: number | null
          experiencia_id?: string | null
          regalo_elegido_id?: string | null
          direccion_entrega?: Json | null
          elegido_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          empresa_id?: string | null
          token_unico?: string
          estado?: string
          ocasion?: string | null
          para_nombre?: string | null
          para_email?: string | null
          mensaje?: string | null
          presupuesto?: number | null
          experiencia_id?: string | null
          regalo_elegido_id?: string | null
          direccion_entrega?: Json | null
          elegido_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          id: string
          perfil_id: string | null
          nombre_empresa: string
          industria: string | null
          tamano: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          perfil_id?: string | null
          nombre_empresa: string
          industria?: string | null
          tamano?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          perfil_id?: string | null
          nombre_empresa?: string
          industria?: string | null
          tamano?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
          audiencia: Database["public"]["Enums"]["audiencia_tipo"] | null
          categoria: Database["public"]["Enums"]["categoria_tipo"]
          created_at: string | null
          descripcion: string
          emoji: string | null
          id: string
          imagen_url: string | null
          nombre: string
          ocasion: Database["public"]["Enums"]["ocasion_tipo"] | null
          precio_base: number
        }
        Insert: {
          activo?: boolean | null
          audiencia?: Database["public"]["Enums"]["audiencia_tipo"] | null
          categoria: Database["public"]["Enums"]["categoria_tipo"]
          created_at?: string | null
          descripcion: string
          emoji?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          ocasion?: Database["public"]["Enums"]["ocasion_tipo"] | null
          precio_base: number
        }
        Update: {
          activo?: boolean | null
          audiencia?: Database["public"]["Enums"]["audiencia_tipo"] | null
          categoria?: Database["public"]["Enums"]["categoria_tipo"]
          created_at?: string | null
          descripcion?: string
          emoji?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          ocasion?: Database["public"]["Enums"]["ocasion_tipo"] | null
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
      audiencia_tipo: "b2b" | "b2c" | "ambos"
      categoria_tipo: "regalo" | "experiencia"
      ocasion_tipo:
      | "cumpleanos"
      | "aniversario_laboral"
      | "onboarding"
      | "reconocimiento"
      | "regalo_cliente"
      | "dia_especial"
      | "sin_ocasion"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof Database
}
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
