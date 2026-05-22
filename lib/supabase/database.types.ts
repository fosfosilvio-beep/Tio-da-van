export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alunos: {
        Row: {
          created_at: string | null
          endereco_embarque: string
          escola: string
          id: string
          latitude_embarque: number | null
          longitude_embarque: number | null
          motorista_id: string | null
          nome: string
          pai_id: string
          serie_turma: string | null
          status_vinculo: Database["public"]["Enums"]["vinculo_status"]
          turno: Database["public"]["Enums"]["turno_aluno"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          endereco_embarque: string
          escola: string
          id?: string
          latitude_embarque?: number | null
          longitude_embarque?: number | null
          motorista_id?: string | null
          nome: string
          pai_id: string
          serie_turma?: string | null
          status_vinculo?: Database["public"]["Enums"]["vinculo_status"]
          turno: Database["public"]["Enums"]["turno_aluno"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          endereco_embarque?: string
          escola?: string
          id?: string
          latitude_embarque?: number | null
          longitude_embarque?: number | null
          motorista_id?: string | null
          nome?: string
          pai_id?: string
          serie_turma?: string | null
          status_vinculo?: Database["public"]["Enums"]["vinculo_status"]
          turno?: Database["public"]["Enums"]["turno_aluno"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alunos_pai_id_fkey"
            columns: ["pai_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cobrancas: {
        Row: {
          aluno_id: string
          created_at: string | null
          id: string
          mercadopago_payment_id: string | null
          motorista_id: string
          pago_em: string | null
          pai_id: string
          pix_copia_cola: string | null
          referencia_mes: string
          status: Database["public"]["Enums"]["cobranca_status"]
          valor_motorista: number
          valor_plataforma: number
          valor_total: number
          vencimento: string
        }
        Insert: {
          aluno_id: string
          created_at?: string | null
          id?: string
          mercadopago_payment_id?: string | null
          motorista_id: string
          pago_em?: string | null
          pai_id: string
          pix_copia_cola?: string | null
          referencia_mes: string
          status?: Database["public"]["Enums"]["cobranca_status"]
          valor_motorista: number
          valor_plataforma: number
          valor_total: number
          vencimento: string
        }
        Update: {
          aluno_id?: string
          created_at?: string | null
          id?: string
          mercadopago_payment_id?: string | null
          motorista_id?: string
          pago_em?: string | null
          pai_id?: string
          pix_copia_cola?: string | null
          referencia_mes?: string
          status?: Database["public"]["Enums"]["cobranca_status"]
          valor_motorista?: number
          valor_plataforma?: number
          valor_total?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_pai_id_fkey"
            columns: ["pai_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      motoristas: {
        Row: {
          bairros_atendidos: string[] | null
          capacidade: number
          cnh_categoria: string
          cnh_numero: string
          cnh_validade: string
          created_at: string | null
          escolas_atendidas: string[] | null
          id: string
          mercadopago_account_id: string | null
          modelo_van: string
          placa: string
          status: Database["public"]["Enums"]["motorista_status"]
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          bairros_atendidos?: string[] | null
          capacidade: number
          cnh_categoria: string
          cnh_numero: string
          cnh_validade: string
          created_at?: string | null
          escolas_atendidas?: string[] | null
          id?: string
          mercadopago_account_id?: string | null
          modelo_van: string
          placa: string
          status: Database["public"]["Enums"]["motorista_status"]
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          bairros_atendidos?: string[] | null
          capacidade?: number
          cnh_categoria?: string
          cnh_numero?: string
          cnh_validade?: string
          created_at?: string | null
          escolas_atendidas?: string[] | null
          id?: string
          mercadopago_account_id?: string | null
          modelo_van?: string
          placa?: string
          status?: Database["public"]["Enums"]["motorista_status"]
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motoristas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      posicao_motorista: {
        Row: {
          heading: number | null
          id: string
          latitude: number
          longitude: number
          motorista_id: string | null
          rota_ativa: boolean
          speed: number | null
          updated_at: string | null
        }
        Insert: {
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          motorista_id?: string | null
          rota_ativa?: boolean
          speed?: number | null
          updated_at?: string | null
        }
        Update: {
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          motorista_id?: string | null
          rota_ativa?: boolean
          speed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posicao_motorista_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: true
            referencedRelation: "motoristas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          nome_completo: string
          role: Database["public"]["Enums"]["user_role"]
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          nome_completo: string
          role: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome_completo?: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cobranca_status: "pendente" | "pago" | "vencido" | "cancelado"
      motorista_status: "pendente" | "aprovado" | "suspenso"
      turno_aluno: "manha" | "tarde" | "integral"
      user_role: "pai" | "motorista" | "admin"
      vinculo_status: "pendente" | "ativo" | "inativo"
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
      cobranca_status: ["pendente", "pago", "vencido", "cancelado"],
      motorista_status: ["pendente", "aprovado", "suspenso"],
      turno_aluno: ["manha", "tarde", "integral"],
      user_role: ["pai", "motorista", "admin"],
      vinculo_status: ["pendente", "ativo", "inativo"],
    },
  },
} as const
