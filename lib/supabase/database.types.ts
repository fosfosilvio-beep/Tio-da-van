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
      alunos: {
        Row: {
          atualizado_em: string | null
          bairro_embarque: string
          criado_em: string | null
          embarcado_hoje: boolean | null
          escola: string
          id: string
          id_motorista: string | null
          id_responsavel: string
          nome_aluno: string
          notificar_ausencia_hoje: boolean | null
        }
        Insert: {
          atualizado_em?: string | null
          bairro_embarque: string
          criado_em?: string | null
          embarcado_hoje?: boolean | null
          escola: string
          id?: string
          id_motorista?: string | null
          id_responsavel: string
          nome_aluno: string
          notificar_ausencia_hoje?: boolean | null
        }
        Update: {
          atualizado_em?: string | null
          bairro_embarque?: string
          criado_em?: string | null
          embarcado_hoje?: boolean | null
          escola?: string
          id?: string
          id_motorista?: string | null
          id_responsavel?: string
          nome_aluno?: string
          notificar_ausencia_hoje?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_id_motorista_fkey"
            columns: ["id_motorista"]
            isOneToOne: false
            referencedRelation: "motoristas_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alunos_id_responsavel_fkey"
            columns: ["id_responsavel"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      cobrancas: {
        Row: {
          asaas_payment_id: string | null
          criado_em: string | null
          data_vencimento: string
          id: string
          id_aluno: string
          id_motorista: string
          id_responsavel: string
          pago_em: string | null
          pix_copia_cola: string | null
          status: Database["public"]["Enums"]["status_cobranca"]
          valor: number
          valor_split_admin: number
          valor_split_motorista: number
        }
        Insert: {
          asaas_payment_id?: string | null
          criado_em?: string | null
          data_vencimento: string
          id?: string
          id_aluno: string
          id_motorista: string
          id_responsavel: string
          pago_em?: string | null
          pix_copia_cola?: string | null
          status?: Database["public"]["Enums"]["status_cobranca"]
          valor: number
          valor_split_admin: number
          valor_split_motorista: number
        }
        Update: {
          asaas_payment_id?: string | null
          criado_em?: string | null
          data_vencimento?: string
          id?: string
          id_aluno?: string
          id_motorista?: string
          id_responsavel?: string
          pago_em?: string | null
          pix_copia_cola?: string | null
          status?: Database["public"]["Enums"]["status_cobranca"]
          valor?: number
          valor_split_admin?: number
          valor_split_motorista?: number
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_id_aluno_fkey"
            columns: ["id_aluno"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_id_motorista_fkey"
            columns: ["id_motorista"]
            isOneToOne: false
            referencedRelation: "motoristas_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_id_responsavel_fkey"
            columns: ["id_responsavel"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      motoristas_perfil: {
        Row: {
          asaas_wallet_id: string | null
          atualizado_em: string | null
          bairros_atendidos: string[] | null
          capacidade: number
          criado_em: string | null
          escolas_atendidas: string[] | null
          id: string
          id_perfil: string
          placa: string
        }
        Insert: {
          asaas_wallet_id?: string | null
          atualizado_em?: string | null
          bairros_atendidos?: string[] | null
          capacidade: number
          criado_em?: string | null
          escolas_atendidas?: string[] | null
          id?: string
          id_perfil: string
          placa: string
        }
        Update: {
          asaas_wallet_id?: string | null
          atualizado_em?: string | null
          bairros_atendidos?: string[] | null
          capacidade?: number
          criado_em?: string | null
          escolas_atendidas?: string[] | null
          id?: string
          id_perfil?: string
          placa?: string
        }
        Relationships: [
          {
            foreignKeyName: "motoristas_perfil_id_perfil_fkey"
            columns: ["id_perfil"]
            isOneToOne: true
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          id: string
          nome_completo: string | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["tipo_usuario"]
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          id: string
          nome_completo?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["tipo_usuario"]
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          nome_completo?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["tipo_usuario"]
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
      status_boleto: "pendente" | "pago" | "vencido"
      status_cobranca: "pendente" | "pago" | "vencido" | "cancelado"
      status_motorista: "pendente" | "aprovado" | "suspenso"
      tipo_usuario: "admin" | "motorista" | "responsavel"
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
      status_boleto: ["pendente", "pago", "vencido"],
      status_cobranca: ["pendente", "pago", "vencido", "cancelado"],
      status_motorista: ["pendente", "aprovado", "suspenso"],
      tipo_usuario: ["admin", "motorista", "responsavel"],
    },
  },
} as const
