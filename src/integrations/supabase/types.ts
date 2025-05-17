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
          bio: string
          category: string
          created_at: string
          id: string
          image: string
          name: string
          outfitcount: number | null
          slug: string | null
          style_type: string
          updated_at: string
        }
        Insert: {
          bio: string
          category: string
          created_at?: string
          id?: string
          image: string
          name: string
          outfitcount?: number | null
          slug?: string | null
          style_type: string
          updated_at?: string
        }
        Update: {
          bio?: string
          category?: string
          created_at?: string
          id?: string
          image?: string
          name?: string
          outfitcount?: number | null
          slug?: string | null
          style_type?: string
          updated_at?: string
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
