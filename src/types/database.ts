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
      products: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          price: number
          created_at: string | null
          updated_at: string | null
          images: string[] | null
          variants: Json | null
          supplier: string | null
          category: string | null
          tags: string[] | null
          status: string | null
          source_url: string | null
          external_id: string | null
          seo_score: number | null
          translations: Json | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          price: number
          created_at?: string | null
          updated_at?: string | null
          images?: string[] | null
          variants?: Json | null
          supplier?: string | null
          category?: string | null
          tags?: string[] | null
          status?: string | null
          source_url?: string | null
          external_id?: string | null
          seo_score?: number | null
          translations?: Json | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          price?: number
          created_at?: string | null
          updated_at?: string | null
          images?: string[] | null
          variants?: Json | null
          supplier?: string | null
          category?: string | null
          tags?: string[] | null
          status?: string | null
          source_url?: string | null
          external_id?: string | null
          seo_score?: number | null
          translations?: Json | null
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          email: string | null
          website: string | null
          verified: boolean | null
          rating: number | null
          created_at: string | null
          country: string | null
          description: string | null
          logo: string | null
          categories: string[] | null
          products_count: number | null
          processing_time: string | null
          shipping_time: string | null
          minimum_order: number | null
          performance: Json | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          website?: string | null
          verified?: boolean | null
          rating?: number | null
          created_at?: string | null
          country?: string | null
          description?: string | null
          logo?: string | null
          categories?: string[] | null
          products_count?: number | null
          processing_time?: string | null
          shipping_time?: string | null
          minimum_order?: number | null
          performance?: Json | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          website?: string | null
          verified?: boolean | null
          rating?: number | null
          created_at?: string | null
          country?: string | null
          description?: string | null
          logo?: string | null
          categories?: string[] | null
          products_count?: number | null
          processing_time?: string | null
          shipping_time?: string | null
          minimum_order?: number | null
          performance?: Json | null
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          avatar_url: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: string | null
          status: string | null
          price_id: string | null
          current_period_end: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: string | null
          status?: string | null
          price_id?: string | null
          current_period_end?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: string | null
          status?: string | null
          price_id?: string | null
          current_period_end?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}