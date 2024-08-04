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
      account_user: {
        Row: {
          account_id: string
          account_role: Database["public"]["Enums"]["account_role"]
          user_id: string
        }
        Insert: {
          account_id: string
          account_role: Database["public"]["Enums"]["account_role"]
          user_id: string
        }
        Update: {
          account_id?: string
          account_role?: Database["public"]["Enums"]["account_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_user_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string | null
          personal_account: boolean
          primary_owner_user_id: string
          private_metadata: Json | null
          public_metadata: Json | null
          slug: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string | null
          personal_account?: boolean
          primary_owner_user_id?: string
          private_metadata?: Json | null
          public_metadata?: Json | null
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string | null
          personal_account?: boolean
          primary_owner_user_id?: string
          private_metadata?: Json | null
          public_metadata?: Json | null
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_primary_owner_user_id_fkey"
            columns: ["primary_owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          billing_provider: string | null
          enable_personal_account_billing: boolean | null
          enable_team_account_billing: boolean | null
          enable_team_accounts: boolean | null
        }
        Insert: {
          billing_provider?: string | null
          enable_personal_account_billing?: boolean | null
          enable_team_account_billing?: boolean | null
          enable_team_accounts?: boolean | null
        }
        Update: {
          billing_provider?: string | null
          enable_personal_account_billing?: boolean | null
          enable_team_account_billing?: boolean | null
          enable_team_accounts?: boolean | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ls_customers: {
        Row: {
          id: string
          ls_customer_id: string | null
        }
        Insert: {
          id: string
          ls_customer_id?: string | null
        }
        Update: {
          id?: string
          ls_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ls_customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ls_orders: {
        Row: {
          created_at: string | null
          currency: string
          currency_rate: string | null
          customer_id: number
          discount_total: number | null
          discount_total_formatted: string | null
          discount_total_usd: number | null
          first_order_item: Json | null
          id: string
          identifier: string | null
          order_number: number
          refunded: boolean | null
          refunded_at: string | null
          setup_fee: number | null
          setup_fee_formatted: string | null
          setup_fee_usd: number | null
          status: Database["public"]["Enums"]["ls_order_status"] | null
          store_id: number
          subtotal: number | null
          subtotal_formatted: string | null
          subtotal_usd: number | null
          tax: number | null
          tax_formatted: string | null
          tax_inclusive: boolean | null
          tax_name: string | null
          tax_rate: string | null
          tax_usd: number | null
          total: number | null
          total_formatted: string | null
          total_usd: number | null
          updated_at: string | null
          urls: Json | null
          user_email: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          currency: string
          currency_rate?: string | null
          customer_id: number
          discount_total?: number | null
          discount_total_formatted?: string | null
          discount_total_usd?: number | null
          first_order_item?: Json | null
          id: string
          identifier?: string | null
          order_number: number
          refunded?: boolean | null
          refunded_at?: string | null
          setup_fee?: number | null
          setup_fee_formatted?: string | null
          setup_fee_usd?: number | null
          status?: Database["public"]["Enums"]["ls_order_status"] | null
          store_id: number
          subtotal?: number | null
          subtotal_formatted?: string | null
          subtotal_usd?: number | null
          tax?: number | null
          tax_formatted?: string | null
          tax_inclusive?: boolean | null
          tax_name?: string | null
          tax_rate?: string | null
          tax_usd?: number | null
          total?: number | null
          total_formatted?: string | null
          total_usd?: number | null
          updated_at?: string | null
          urls?: Json | null
          user_email?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          currency_rate?: string | null
          customer_id?: number
          discount_total?: number | null
          discount_total_formatted?: string | null
          discount_total_usd?: number | null
          first_order_item?: Json | null
          id?: string
          identifier?: string | null
          order_number?: number
          refunded?: boolean | null
          refunded_at?: string | null
          setup_fee?: number | null
          setup_fee_formatted?: string | null
          setup_fee_usd?: number | null
          status?: Database["public"]["Enums"]["ls_order_status"] | null
          store_id?: number
          subtotal?: number | null
          subtotal_formatted?: string | null
          subtotal_usd?: number | null
          tax?: number | null
          tax_formatted?: string | null
          tax_inclusive?: boolean | null
          tax_name?: string | null
          tax_rate?: string | null
          tax_usd?: number | null
          total?: number | null
          total_formatted?: string | null
          total_usd?: number | null
          updated_at?: string | null
          urls?: Json | null
          user_email?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ls_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ls_subscriptions: {
        Row: {
          billing_anchor: number | null
          cancelled: boolean | null
          card_brand: string | null
          card_last_four: string | null
          created_at: string
          customer_id: number
          ends_at: string | null
          first_subscription_item: Json | null
          id: string
          order_id: number
          order_item_id: number
          pause: string | null
          product_id: number
          renews_at: string
          status: Database["public"]["Enums"]["ls_subscription_status"]
          store_id: number
          trial_ends_at: string | null
          updated_at: string
          urls: Json | null
          user_email: string
          user_id: string
          user_name: string
          variant_id: number
        }
        Insert: {
          billing_anchor?: number | null
          cancelled?: boolean | null
          card_brand?: string | null
          card_last_four?: string | null
          created_at: string
          customer_id: number
          ends_at?: string | null
          first_subscription_item?: Json | null
          id: string
          order_id: number
          order_item_id: number
          pause?: string | null
          product_id: number
          renews_at: string
          status: Database["public"]["Enums"]["ls_subscription_status"]
          store_id: number
          trial_ends_at?: string | null
          updated_at: string
          urls?: Json | null
          user_email: string
          user_id: string
          user_name: string
          variant_id: number
        }
        Update: {
          billing_anchor?: number | null
          cancelled?: boolean | null
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          customer_id?: number
          ends_at?: string | null
          first_subscription_item?: Json | null
          id?: string
          order_id?: number
          order_item_id?: number
          pause?: string | null
          product_id?: number
          renews_at?: string
          status?: Database["public"]["Enums"]["ls_subscription_status"]
          store_id?: number
          trial_ends_at?: string | null
          updated_at?: string
          urls?: Json | null
          user_email?: string
          user_id?: string
          user_name?: string
          variant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ls_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created: string
          id: string
          items: Json | null
          metadata: Json | null
          total: number | null
          user_id: string
        }
        Insert: {
          created?: string
          id: string
          items?: Json | null
          metadata?: Json | null
          total?: number | null
          user_id: string
        }
        Update: {
          created?: string
          id?: string
          items?: Json | null
          metadata?: Json | null
          total?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      paddle_customers: {
        Row: {
          id: string
          paddle_customer_id: string | null
        }
        Insert: {
          id: string
          paddle_customer_id?: string | null
        }
        Update: {
          id?: string
          paddle_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paddle_customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      paddle_subscriptions: {
        Row: {
          address_id: string | null
          billing_cycle: Json | null
          billing_details: Json | null
          business_id: string | null
          cancelled_at: string | null
          collection_mode:
            | Database["public"]["Enums"]["paddle_collection_mode"]
            | null
          created_at: string | null
          currency_code:
            | Database["public"]["Enums"]["paddle_currency_code"]
            | null
          current_billing_period: Json | null
          custom_data: Json | null
          customer_id: string | null
          discount: Json | null
          first_billed_at: string | null
          id: string
          items: Json | null
          next_billed_at: string | null
          paused_at: string | null
          scheduled_change: Json | null
          started_at: string | null
          status:
            | Database["public"]["Enums"]["paddle_subscription_status"]
            | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_id?: string | null
          billing_cycle?: Json | null
          billing_details?: Json | null
          business_id?: string | null
          cancelled_at?: string | null
          collection_mode?:
            | Database["public"]["Enums"]["paddle_collection_mode"]
            | null
          created_at?: string | null
          currency_code?:
            | Database["public"]["Enums"]["paddle_currency_code"]
            | null
          current_billing_period?: Json | null
          custom_data?: Json | null
          customer_id?: string | null
          discount?: Json | null
          first_billed_at?: string | null
          id: string
          items?: Json | null
          next_billed_at?: string | null
          paused_at?: string | null
          scheduled_change?: Json | null
          started_at?: string | null
          status?:
            | Database["public"]["Enums"]["paddle_subscription_status"]
            | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_id?: string | null
          billing_cycle?: Json | null
          billing_details?: Json | null
          business_id?: string | null
          cancelled_at?: string | null
          collection_mode?:
            | Database["public"]["Enums"]["paddle_collection_mode"]
            | null
          created_at?: string | null
          currency_code?:
            | Database["public"]["Enums"]["paddle_currency_code"]
            | null
          current_billing_period?: Json | null
          custom_data?: Json | null
          customer_id?: string | null
          discount?: Json | null
          first_billed_at?: string | null
          id?: string
          items?: Json | null
          next_billed_at?: string | null
          paused_at?: string | null
          scheduled_change?: Json | null
          started_at?: string | null
          status?:
            | Database["public"]["Enums"]["paddle_subscription_status"]
            | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paddle_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_account_role: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      generate_token: {
        Args: {
          length: number
        }
        Returns: string
      }
      get_account: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      get_account_by_slug: {
        Args: {
          slug: string
        }
        Returns: Json
      }
      get_account_members: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_accounts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_accounts_with_role: {
        Args: {
          passed_in_role?: Database["public"]["Enums"]["account_role"]
        }
        Returns: string[]
      }
      get_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_personal_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      has_role_on_account: {
        Args: {
          account_id: string
          account_role?: Database["public"]["Enums"]["account_role"]
        }
        Returns: boolean
      }
      is_set: {
        Args: {
          field_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_role: "owner" | "member"
      ls_collection_mode: "manual" | "automatic"
      ls_currency_code:
        | "USD"
        | "EUR"
        | "GBP"
        | "JPY"
        | "AUD"
        | "CAD"
        | "CHF"
        | "HKD"
        | "SGD"
        | "SEK"
        | "ARS"
        | "BRL"
        | "CNY"
        | "COP"
        | "CZK"
        | "DKK"
        | "HUF"
        | "ILS"
        | "INR"
        | "KRW"
        | "MXN"
        | "NOK"
        | "NZD"
        | "PLN"
        | "RUB"
        | "THB"
        | "TRY"
        | "TWD"
        | "UAH"
        | "ZAR"
      ls_entity_status: "active" | "archived"
      ls_item_type: "standard" | "custom"
      ls_order_status: "pending" | "failed" | "paid" | "refunded"
      ls_subscription_status:
        | "on_trial"
        | "active"
        | "cancelled"
        | "past_due"
        | "paused"
        | "unpaid"
        | "expired"
      ls_tax_mode: "account_setting" | "external" | "internal"
      paddle_collection_mode: "manual" | "automatic"
      paddle_currency_code:
        | "USD"
        | "EUR"
        | "GBP"
        | "JPY"
        | "AUD"
        | "CAD"
        | "CHF"
        | "HKD"
        | "SGD"
        | "SEK"
        | "ARS"
        | "BRL"
        | "CNY"
        | "COP"
        | "CZK"
        | "DKK"
        | "HUF"
        | "ILS"
        | "INR"
        | "KRW"
        | "MXN"
        | "NOK"
        | "NZD"
        | "PLN"
        | "RUB"
        | "THB"
        | "TRY"
        | "TWD"
        | "UAH"
        | "ZAR"
      paddle_subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "past_due"
        | "paused"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

