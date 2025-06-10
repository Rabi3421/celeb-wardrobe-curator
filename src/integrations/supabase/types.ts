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
      admin_users: {
        Row: {
          avatar: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          role: string
        }
        Insert: {
          avatar?: string | null
          email: string
          id: string
          last_login?: string | null
          name: string
          role?: string
        }
        Update: {
          avatar?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          role?: string
        }
        Relationships: []
      }
      affiliate_products: {
        Row: {
          affiliate_link: string
          created_at: string
          description: string | null
          id: string
          image: string
          outfit_id: string
          price: string
          retailer: string
          title: string
        }
        Insert: {
          affiliate_link: string
          created_at?: string
          description?: string | null
          id?: string
          image: string
          outfit_id: string
          price: string
          retailer: string
          title: string
        }
        Update: {
          affiliate_link?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          outfit_id?: string
          price?: string
          retailer?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_products_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          page_url: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          page_url?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_analytics: {
        Row: {
          blog_post_id: string | null
          clicks_count: number | null
          created_at: string
          id: string
          last_updated: string
          read_time_avg: number | null
          shares_count: number | null
          views_count: number | null
        }
        Insert: {
          blog_post_id?: string | null
          clicks_count?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          read_time_avg?: number | null
          shares_count?: number | null
          views_count?: number | null
        }
        Update: {
          blog_post_id?: string | null
          clicks_count?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          read_time_avg?: number | null
          shares_count?: number | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: true
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          date: string
          excerpt: string
          id: string
          image: string
          keywords: string | null
          meta_description: string | null
          slug: string | null
          structured_data: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          date: string
          excerpt: string
          id?: string
          image: string
          keywords?: string | null
          meta_description?: string | null
          slug?: string | null
          structured_data?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          date?: string
          excerpt?: string
          id?: string
          image?: string
          keywords?: string | null
          meta_description?: string | null
          slug?: string | null
          structured_data?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      category_items: {
        Row: {
          affiliate_link: string | null
          category_name: string
          created_at: string
          description: string | null
          id: string
          image: string
          price: string | null
          retailer: string | null
          title: string
        }
        Insert: {
          affiliate_link?: string | null
          category_name: string
          created_at?: string
          description?: string | null
          id?: string
          image: string
          price?: string | null
          retailer?: string | null
          title: string
        }
        Update: {
          affiliate_link?: string | null
          category_name?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          price?: string | null
          retailer?: string | null
          title?: string
        }
        Relationships: []
      }
      celebrities: {
        Row: {
          awards: string | null
          bio: string
          birthdate: string | null
          birthplace: string | null
          brand_endorsements: string | null
          business_ventures: string | null
          career_highlights: string | null
          category: string
          controversies: string | null
          created_at: string
          diet_fitness: string | null
          education: string | null
          fanbase_nickname: string | null
          height: string | null
          id: string
          image: string
          influences: string | null
          interesting_facts: string | null
          languages: string | null
          measurements: string | null
          name: string
          nationality: string | null
          net_worth: string | null
          outfitcount: number | null
          personal_life: string | null
          philanthropy_work: string | null
          public_perception: string | null
          quotes: string | null
          signature: Json | null
          slug: string | null
          social_media: Json | null
          style_evolution: string | null
          style_type: string
          updated_at: string
          zodiac_sign: string | null
        }
        Insert: {
          awards?: string | null
          bio: string
          birthdate?: string | null
          birthplace?: string | null
          brand_endorsements?: string | null
          business_ventures?: string | null
          career_highlights?: string | null
          category: string
          controversies?: string | null
          created_at?: string
          diet_fitness?: string | null
          education?: string | null
          fanbase_nickname?: string | null
          height?: string | null
          id?: string
          image: string
          influences?: string | null
          interesting_facts?: string | null
          languages?: string | null
          measurements?: string | null
          name: string
          nationality?: string | null
          net_worth?: string | null
          outfitcount?: number | null
          personal_life?: string | null
          philanthropy_work?: string | null
          public_perception?: string | null
          quotes?: string | null
          signature?: Json | null
          slug?: string | null
          social_media?: Json | null
          style_evolution?: string | null
          style_type: string
          updated_at?: string
          zodiac_sign?: string | null
        }
        Update: {
          awards?: string | null
          bio?: string
          birthdate?: string | null
          birthplace?: string | null
          brand_endorsements?: string | null
          business_ventures?: string | null
          career_highlights?: string | null
          category?: string
          controversies?: string | null
          created_at?: string
          diet_fitness?: string | null
          education?: string | null
          fanbase_nickname?: string | null
          height?: string | null
          id?: string
          image?: string
          influences?: string | null
          interesting_facts?: string | null
          languages?: string | null
          measurements?: string | null
          name?: string
          nationality?: string | null
          net_worth?: string | null
          outfitcount?: number | null
          personal_life?: string | null
          philanthropy_work?: string | null
          public_perception?: string | null
          quotes?: string | null
          signature?: Json | null
          slug?: string | null
          social_media?: Json | null
          style_evolution?: string | null
          style_type?: string
          updated_at?: string
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          subscribed: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          subscribed?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          subscribed?: boolean
        }
        Relationships: []
      }
      outfit_tags: {
        Row: {
          created_at: string
          id: string
          outfit_id: string
          tag_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          outfit_id: string
          tag_name: string
        }
        Update: {
          created_at?: string
          id?: string
          outfit_id?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_tags_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      outfits: {
        Row: {
          affiliate_link: string | null
          celebrity_id: string
          created_at: string
          date: string | null
          description: string
          full_description: string | null
          id: string
          image: string
          occasion: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          affiliate_link?: string | null
          celebrity_id: string
          created_at?: string
          date?: string | null
          description: string
          full_description?: string | null
          id?: string
          image: string
          occasion?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          affiliate_link?: string | null
          celebrity_id?: string
          created_at?: string
          date?: string | null
          description?: string
          full_description?: string | null
          id?: string
          image?: string
          occasion?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfits_celebrity_id_fkey"
            columns: ["celebrity_id"]
            isOneToOne: false
            referencedRelation: "celebrities"
            referencedColumns: ["id"]
          },
        ]
      }
      product_analytics: {
        Row: {
          clicks_count: number | null
          conversion_count: number | null
          created_at: string
          id: string
          last_updated: string
          product_id: string
          product_type: string
          revenue: number | null
          views_count: number | null
        }
        Insert: {
          clicks_count?: number | null
          conversion_count?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          product_id: string
          product_type: string
          revenue?: number | null
          views_count?: number | null
        }
        Update: {
          clicks_count?: number | null
          conversion_count?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          product_id?: string
          product_type?: string
          revenue?: number | null
          views_count?: number | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          ip_address: string | null
          pages_visited: number | null
          referrer: string | null
          session_duration: number | null
          session_id: string
          started_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          pages_visited?: number | null
          referrer?: string | null
          session_duration?: number | null
          session_id: string
          started_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          pages_visited?: number | null
          referrer?: string | null
          session_duration?: number | null
          session_id?: string
          started_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_blog_analytics: {
        Args: {
          p_blog_post_id: string
          p_event_type: string
          p_read_time?: number
        }
        Returns: undefined
      }
      update_product_analytics: {
        Args: {
          p_product_id: string
          p_product_type: string
          p_event_type: string
          p_revenue?: number
        }
        Returns: undefined
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
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
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
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
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
