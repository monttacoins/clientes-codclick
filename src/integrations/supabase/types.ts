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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_clientes: {
        Row: {
          admin_token_reserva: string | null
          created_at: string
          data_implementacao: string | null
          data_primeiro_pgto: string | null
          email_super_admin: string | null
          empresa_id: string | null
          id: number
          nome: string
          observacoes: string | null
          produto: string | null
          recorrencia: string | null
          valor_contrato: number | null
          valor_pago: number | null
        }
        Insert: {
          admin_token_reserva?: string | null
          created_at?: string
          data_implementacao?: string | null
          data_primeiro_pgto?: string | null
          email_super_admin?: string | null
          empresa_id?: string | null
          id?: number
          nome: string
          observacoes?: string | null
          produto?: string | null
          recorrencia?: string | null
          valor_contrato?: number | null
          valor_pago?: number | null
        }
        Update: {
          admin_token_reserva?: string | null
          created_at?: string
          data_implementacao?: string | null
          data_primeiro_pgto?: string | null
          email_super_admin?: string | null
          empresa_id?: string | null
          id?: number
          nome?: string
          observacoes?: string | null
          produto?: string | null
          recorrencia?: string | null
          valor_contrato?: number | null
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admin_clientes_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "admin_empresas"
            referencedColumns: ["empresa_id"]
          },
        ]
      }
      admin_credenciais: {
        Row: {
          campos_customizados: Json | null
          cliente_id: number
          created_at: string
          hospedagem: string | null
          id: number
          link_perfil: string | null
          login: string | null
          perfil: string | null
          senha: string | null
          tipo: string
          url: string | null
        }
        Insert: {
          campos_customizados?: Json | null
          cliente_id: number
          created_at?: string
          hospedagem?: string | null
          id?: number
          link_perfil?: string | null
          login?: string | null
          perfil?: string | null
          senha?: string | null
          tipo: string
          url?: string | null
        }
        Update: {
          campos_customizados?: Json | null
          cliente_id?: number
          created_at?: string
          hospedagem?: string | null
          id?: number
          link_perfil?: string | null
          login?: string | null
          perfil?: string | null
          senha?: string | null
          tipo?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_credenciais_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "admin_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_empresas: {
        Row: {
          created_at: string
          empresa_id: string | null
          id: number
          nome: string | null
        }
        Insert: {
          created_at?: string
          empresa_id?: string | null
          id?: number
          nome?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: string | null
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      admin_lancamentos: {
        Row: {
          categoria: string
          cliente_id: number | null
          created_at: string
          data: string
          descricao: string
          id: number
          is_prolabore: boolean
          observacoes: string | null
          status: string
          tipo: string
          usuario_id: number | null
          valor: number
        }
        Insert: {
          categoria?: string
          cliente_id?: number | null
          created_at?: string
          data?: string
          descricao: string
          id?: number
          is_prolabore?: boolean
          observacoes?: string | null
          status?: string
          tipo?: string
          usuario_id?: number | null
          valor?: number
        }
        Update: {
          categoria?: string
          cliente_id?: number | null
          created_at?: string
          data?: string
          descricao?: string
          id?: number
          is_prolabore?: boolean
          observacoes?: string | null
          status?: string
          tipo?: string
          usuario_id?: number | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "admin_lancamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "admin_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_lancamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "admin_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_produtos: {
        Row: {
          created_at: string
          id: number
          produto: string | null
          produto_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          produto?: string | null
          produto_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          produto?: string | null
          produto_id?: string | null
        }
        Relationships: []
      }
      admin_usuarios: {
        Row: {
          cargo: string | null
          created_at: string
          email: string | null
          id: number
          nome: string
        }
        Insert: {
          cargo?: string | null
          created_at?: string
          email?: string | null
          id?: number
          nome: string
        }
        Update: {
          cargo?: string | null
          created_at?: string
          email?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      areas: {
        Row: {
          cor: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          posicao: number | null
        }
        Insert: {
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          posicao?: number | null
        }
        Update: {
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          posicao?: number | null
        }
        Relationships: []
      }
      banco_de_tokens: {
        Row: {
          app: string | null
          created_at: string
          data_envio: string | null
          id: string
          token: string | null
          used: boolean | null
          user_email: string | null
          user_whatsapp: string | null
        }
        Insert: {
          app?: string | null
          created_at?: string
          data_envio?: string | null
          id?: string
          token?: string | null
          used?: boolean | null
          user_email?: string | null
          user_whatsapp?: string | null
        }
        Update: {
          app?: string | null
          created_at?: string
          data_envio?: string | null
          id?: string
          token?: string | null
          used?: boolean | null
          user_email?: string | null
          user_whatsapp?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          aniversario: string | null
          area_entrega: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          codigo: string | null
          complemento: string | null
          compras: number | null
          created_at: string
          distancia: number | null
          distancia_maxima: number | null
          estado: string | null
          id: number
          nome: string | null
          numero: string | null
          observacoes: string | null
          pedidos: string | null
          prox_msg: number | null
          rua: string | null
          status: string | null
          survey: string | null
          total_gasto: number | null
          ultima_atualizacao: string | null
          ultima_compra: string | null
          ultimo_envio: string | null
          ultimo_pedido: string | null
          valor_frete: number | null
          whatsapp: string | null
        }
        Insert: {
          aniversario?: string | null
          area_entrega?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          codigo?: string | null
          complemento?: string | null
          compras?: number | null
          created_at?: string
          distancia?: number | null
          distancia_maxima?: number | null
          estado?: string | null
          id?: number
          nome?: string | null
          numero?: string | null
          observacoes?: string | null
          pedidos?: string | null
          prox_msg?: number | null
          rua?: string | null
          status?: string | null
          survey?: string | null
          total_gasto?: number | null
          ultima_atualizacao?: string | null
          ultima_compra?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          valor_frete?: number | null
          whatsapp?: string | null
        }
        Update: {
          aniversario?: string | null
          area_entrega?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          codigo?: string | null
          complemento?: string | null
          compras?: number | null
          created_at?: string
          distancia?: number | null
          distancia_maxima?: number | null
          estado?: string | null
          id?: number
          nome?: string | null
          numero?: string | null
          observacoes?: string | null
          pedidos?: string | null
          prox_msg?: number | null
          rua?: string | null
          status?: string | null
          survey?: string | null
          total_gasto?: number | null
          ultima_atualizacao?: string | null
          ultima_compra?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          valor_frete?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      clientes_douglas_duplicate: {
        Row: {
          aniversario: string | null
          aniversario_timestamp: string | null
          created_at: string
          data_cadastro: string | null
          id: number
          ja_enviado: string | null
          nome: string | null
          observacoes: string | null
          pedidos: string | null
          taxa: string | null
          ultimo_envio: string | null
          ultimo_pedido: string | null
          ultimo_pedido_timestamp: string | null
          whatsapp: string | null
        }
        Insert: {
          aniversario?: string | null
          aniversario_timestamp?: string | null
          created_at?: string
          data_cadastro?: string | null
          id?: number
          ja_enviado?: string | null
          nome?: string | null
          observacoes?: string | null
          pedidos?: string | null
          taxa?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          ultimo_pedido_timestamp?: string | null
          whatsapp?: string | null
        }
        Update: {
          aniversario?: string | null
          aniversario_timestamp?: string | null
          created_at?: string
          data_cadastro?: string | null
          id?: number
          ja_enviado?: string | null
          nome?: string | null
          observacoes?: string | null
          pedidos?: string | null
          taxa?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          ultimo_pedido_timestamp?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      clientes_oliveira: {
        Row: {
          created_at: string
          data_cadastro: string | null
          id: number
          ja_enviado: string | null
          nome: string | null
          observacoes: string | null
          opt_out: boolean | null
          pedidos: string | null
          prox_msg: number | null
          taxa: string | null
          ultimo_envio: string | null
          ultimo_pedido: string | null
          ultimo_pedido_timestamp: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          data_cadastro?: string | null
          id?: number
          ja_enviado?: string | null
          nome?: string | null
          observacoes?: string | null
          opt_out?: boolean | null
          pedidos?: string | null
          prox_msg?: number | null
          taxa?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          ultimo_pedido_timestamp?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          data_cadastro?: string | null
          id?: number
          ja_enviado?: string | null
          nome?: string | null
          observacoes?: string | null
          opt_out?: boolean | null
          pedidos?: string | null
          prox_msg?: number | null
          taxa?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          ultimo_pedido_timestamp?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      collaborators: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      concluidos: {
        Row: {
          collaborator: number | null
          created_at: string
          id: number
          status: string | null
          task_id: string | null
        }
        Insert: {
          collaborator?: number | null
          created_at?: string
          id?: number
          status?: string | null
          task_id?: string | null
        }
        Update: {
          collaborator?: number | null
          created_at?: string
          id?: number
          status?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concluidos_collaborator_fkey"
            columns: ["collaborator"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concluidos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      conversas_chatassistant: {
        Row: {
          created_at: string
          empresa_id: string | null
          id: number
          msg_IA: string | null
          msg_usuario: string | null
        }
        Insert: {
          created_at?: string
          empresa_id?: string | null
          id?: number
          msg_IA?: string | null
          msg_usuario?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: string | null
          id?: number
          msg_IA?: string | null
          msg_usuario?: string | null
        }
        Relationships: []
      }
      copy_clientes_douglas: {
        Row: {
          aniversario: string | null
          aniversario_timestamp: string | null
          created_at: string
          data_cadastro: string | null
          data_envio_rec: string | null
          id: number
          ja_enviado: string | null
          mensagem_enviada_clickflow: string | null
          msg1_aniversario_data_envio: string | null
          msg1_aniversario_enviada: string | null
          msg2_aniversario_data_envio: string | null
          msg2_aniversario_enviada: string | null
          msg3_aniversario_data_envio: string | null
          msg3_aniversario_enviada: string | null
          nome: string | null
          observacoes: string | null
          opt_out: boolean | null
          pedidos: string | null
          promocao_enviada_clickflow: string | null
          taxa: string | null
          ultimo_envio: string | null
          ultimo_pedido: string | null
          ultimo_pedido_timestamp: string | null
          whatsapp: string | null
        }
        Insert: {
          aniversario?: string | null
          aniversario_timestamp?: string | null
          created_at?: string
          data_cadastro?: string | null
          data_envio_rec?: string | null
          id?: number
          ja_enviado?: string | null
          mensagem_enviada_clickflow?: string | null
          msg1_aniversario_data_envio?: string | null
          msg1_aniversario_enviada?: string | null
          msg2_aniversario_data_envio?: string | null
          msg2_aniversario_enviada?: string | null
          msg3_aniversario_data_envio?: string | null
          msg3_aniversario_enviada?: string | null
          nome?: string | null
          observacoes?: string | null
          opt_out?: boolean | null
          pedidos?: string | null
          promocao_enviada_clickflow?: string | null
          taxa?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          ultimo_pedido_timestamp?: string | null
          whatsapp?: string | null
        }
        Update: {
          aniversario?: string | null
          aniversario_timestamp?: string | null
          created_at?: string
          data_cadastro?: string | null
          data_envio_rec?: string | null
          id?: number
          ja_enviado?: string | null
          mensagem_enviada_clickflow?: string | null
          msg1_aniversario_data_envio?: string | null
          msg1_aniversario_enviada?: string | null
          msg2_aniversario_data_envio?: string | null
          msg2_aniversario_enviada?: string | null
          msg3_aniversario_data_envio?: string | null
          msg3_aniversario_enviada?: string | null
          nome?: string | null
          observacoes?: string | null
          opt_out?: boolean | null
          pedidos?: string | null
          promocao_enviada_clickflow?: string | null
          taxa?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          ultimo_pedido_timestamp?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      envios_recuperacao: {
        Row: {
          created_at: string
          id: number
          mensagem: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          mensagem?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          mensagem?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      keep_alive: {
        Row: {
          check: string | null
          created_at: string
          id: number
        }
        Insert: {
          check?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          check?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      leads_pizzaria_oliveira: {
        Row: {
          created_at: string
          data_cadastro: string | null
          id: number
          nome: string | null
          observacoes: string | null
          pedidos: string | null
          taxa: string | null
          telefone: string | null
          ultimo_envio: string | null
          ultimo_pedido: string | null
        }
        Insert: {
          created_at?: string
          data_cadastro?: string | null
          id?: number
          nome?: string | null
          observacoes?: string | null
          pedidos?: string | null
          taxa?: string | null
          telefone?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
        }
        Update: {
          created_at?: string
          data_cadastro?: string | null
          id?: number
          nome?: string | null
          observacoes?: string | null
          pedidos?: string | null
          taxa?: string | null
          telefone?: string | null
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
        }
        Relationships: []
      }
      meeting_resolutions: {
        Row: {
          concluido: boolean
          created_at: string
          id: string
          meeting_id: string
          ordem: number
          texto: string
        }
        Insert: {
          concluido?: boolean
          created_at?: string
          id?: string
          meeting_id: string
          ordem?: number
          texto?: string
        }
        Update: {
          concluido?: boolean
          created_at?: string
          id?: string
          meeting_id?: string
          ordem?: number
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_resolutions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          data_reuniao: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_reuniao: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_reuniao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      produto: {
        Row: {
          created_at: string
          descricao: string | null
          id: number
          nome: string | null
          tipo: string | null
          url_imagem: string | null
          valor: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: number
          nome?: string | null
          tipo?: string | null
          url_imagem?: string | null
          valor?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: number
          nome?: string | null
          tipo?: string | null
          url_imagem?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rel_envios_rec_clientes: {
        Row: {
          created_at: string
          enviado: string | null
          id: number
          nome: string | null
          promo_disparada_em: string | null
          promocao: string | null
          ultimo_envio: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          enviado?: string | null
          id?: number
          nome?: string | null
          promo_disparada_em?: string | null
          promocao?: string | null
          ultimo_envio?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          enviado?: string | null
          id?: number
          nome?: string | null
          promo_disparada_em?: string | null
          promocao?: string | null
          ultimo_envio?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          area_id: string | null
          collaborator_id: number | null
          created_at: string | null
          data: string | null
          data_conclusao: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          id: string
          prioridade: string
          status: string | null
          titulo: string
        }
        Insert: {
          area_id?: string | null
          collaborator_id?: number | null
          created_at?: string | null
          data?: string | null
          data_conclusao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string
          status?: string | null
          titulo: string
        }
        Update: {
          area_id?: string | null
          collaborator_id?: number | null
          created_at?: string | null
          data?: string | null
          data_conclusao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string
          status?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      tempo_mensagens: {
        Row: {
          created_at: string
          id: number
          numero_mensagem: string | null
          tempo_msg: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          numero_mensagem?: string | null
          tempo_msg?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          numero_mensagem?: string | null
          tempo_msg?: number | null
        }
        Relationships: []
      }
      workflow_falhas: {
        Row: {
          created_at: string
          execucao: string | null
          execucao_id: string | null
          id: number
          node: string | null
          node_erro: string | null
          retrys: number | null
          workflow: string | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string
          execucao?: string | null
          execucao_id?: string | null
          id?: number
          node?: string | null
          node_erro?: string | null
          retrys?: number | null
          workflow?: string | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string
          execucao?: string | null
          execucao_id?: string | null
          id?: number
          node?: string | null
          node_erro?: string | null
          retrys?: number | null
          workflow?: string | null
          workflow_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buscar_aniversariantes: {
        Args: { dia_alvo: string; mes_alvo: string }
        Returns: {
          aniversario: string | null
          aniversario_timestamp: string | null
          created_at: string
          data_cadastro: string | null
          data_envio_rec: string | null
          id: number
          ja_enviado: string | null
          mensagem_enviada_clickflow: string | null
          msg1_aniversario_data_envio: string | null
          msg1_aniversario_enviada: string | null
          msg2_aniversario_data_envio: string | null
          msg2_aniversario_enviada: string | null
          msg3_aniversario_data_envio: string | null
          msg3_aniversario_enviada: string | null
          nome: string | null
          observacoes: string | null
          opt_out: boolean | null
          pedidos: string | null
          promocao_enviada_clickflow: string | null
          taxa: string | null
          ultimo_envio: string | null
          ultimo_pedido: string | null
          ultimo_pedido_timestamp: string | null
          whatsapp: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "copy_clientes_douglas"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      check_token: { Args: { _token: string }; Returns: boolean }
      filtrar_datas_br: {
        Args: { data_fim: string; data_inicio: string }
        Returns: {
          created_at: string
          data_cadastro: string | null
          id: number
          ja_enviado: string | null
          nome: string | null
          observacoes: string | null
          opt_out: boolean | null
          pedidos: string | null
          prox_msg: number | null
          taxa: string | null
          ultimo_envio: string | null
          ultimo_pedido: string | null
          ultimo_pedido_timestamp: string | null
          whatsapp: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "clientes_oliveira"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
