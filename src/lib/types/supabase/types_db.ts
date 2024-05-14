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
      paddle_prices: {
        Row: {
          created_at: string | null
          custom_data: Json | null
          description: string | null
          id: string
          interval:
            | Database["public"]["Enums"]["paddle_pricing_plan_interval"]
            | null
          interval_frequency: number | null
          name: string | null
          product_id: string | null
          quantity_max: number | null
          quantity_min: number | null
          status: Database["public"]["Enums"]["paddle_entity_status"] | null
          tax_mode: Database["public"]["Enums"]["paddle_tax_mode"] | null
          trial_interval:
            | Database["public"]["Enums"]["paddle_pricing_plan_interval"]
            | null
          trial_interval_frequency: number | null
          type: Database["public"]["Enums"]["paddle_item_type"] | null
          unit_price_amount: string | null
          unit_price_currency_code:
            | Database["public"]["Enums"]["paddle_currency_code"]
            | null
          unit_price_overrides: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_data?: Json | null
          description?: string | null
          id: string
          interval?:
            | Database["public"]["Enums"]["paddle_pricing_plan_interval"]
            | null
          interval_frequency?: number | null
          name?: string | null
          product_id?: string | null
          quantity_max?: number | null
          quantity_min?: number | null
          status?: Database["public"]["Enums"]["paddle_entity_status"] | null
          tax_mode?: Database["public"]["Enums"]["paddle_tax_mode"] | null
          trial_interval?:
            | Database["public"]["Enums"]["paddle_pricing_plan_interval"]
            | null
          trial_interval_frequency?: number | null
          type?: Database["public"]["Enums"]["paddle_item_type"] | null
          unit_price_amount?: string | null
          unit_price_currency_code?:
            | Database["public"]["Enums"]["paddle_currency_code"]
            | null
          unit_price_overrides?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_data?: Json | null
          description?: string | null
          id?: string
          interval?:
            | Database["public"]["Enums"]["paddle_pricing_plan_interval"]
            | null
          interval_frequency?: number | null
          name?: string | null
          product_id?: string | null
          quantity_max?: number | null
          quantity_min?: number | null
          status?: Database["public"]["Enums"]["paddle_entity_status"] | null
          tax_mode?: Database["public"]["Enums"]["paddle_tax_mode"] | null
          trial_interval?:
            | Database["public"]["Enums"]["paddle_pricing_plan_interval"]
            | null
          trial_interval_frequency?: number | null
          type?: Database["public"]["Enums"]["paddle_item_type"] | null
          unit_price_amount?: string | null
          unit_price_currency_code?:
            | Database["public"]["Enums"]["paddle_currency_code"]
            | null
          unit_price_overrides?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paddle_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      paddle_products: {
        Row: {
          created_at: string | null
          custom_data: Json | null
          description: string | null
          id: string
          image: string | null
          name: string | null
          status: Database["public"]["Enums"]["paddle_entity_status"] | null
          tax_category:
            | Database["public"]["Enums"]["paddle_product_tax_category"]
            | null
          type: Database["public"]["Enums"]["paddle_item_type"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_data?: Json | null
          description?: string | null
          id: string
          image?: string | null
          name?: string | null
          status?: Database["public"]["Enums"]["paddle_entity_status"] | null
          tax_category?:
            | Database["public"]["Enums"]["paddle_product_tax_category"]
            | null
          type?: Database["public"]["Enums"]["paddle_item_type"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_data?: Json | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          status?: Database["public"]["Enums"]["paddle_entity_status"] | null
          tax_category?:
            | Database["public"]["Enums"]["paddle_product_tax_category"]
            | null
          type?: Database["public"]["Enums"]["paddle_item_type"] | null
          updated_at?: string | null
        }
        Relationships: []
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
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          features: Json | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          features?: Json | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          features?: Json | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
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
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
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
      [_ in never]: never
    }
    Enums: {
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
      paddle_entity_status: "active" | "archived"
      paddle_item_type: "standard" | "custom"
      paddle_pricing_plan_interval: "day" | "week" | "month" | "year"
      paddle_product_tax_category:
        | "digital-goods"
        | "ebooks"
        | "implementation-services"
        | "professional-services"
        | "saas"
        | "software-programming-services"
        | "standard"
        | "training-services"
        | "website-hosting"
      paddle_subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "past_due"
        | "paused"
      paddle_tax_mode: "account_setting" | "external" | "internal"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
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

