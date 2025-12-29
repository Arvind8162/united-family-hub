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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      classified_ads: {
        Row: {
          category: string
          contact_phone: string | null
          created_at: string | null
          description: string
          id: string
          images: string[] | null
          is_active: boolean | null
          location: string
          posted_by: string
          price: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          contact_phone?: string | null
          created_at?: string | null
          description: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          location: string
          posted_by: string
          price?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          location?: string
          posted_by?: string
          price?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          category: string
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          images: string[] | null
          is_pinned: boolean | null
          likes_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_pinned?: boolean | null
          likes_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_pinned?: boolean | null
          likes_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string
          submitted_by: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject: string
          submitted_by?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string
          submitted_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      donation_campaigns: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          organizer: string
          raised_amount: number | null
          target_amount: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          organizer: string
          raised_amount?: number | null
          target_amount: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          organizer?: string
          raised_amount?: number | null
          target_amount?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string
          donated_at: string | null
          donor_id: string
          donor_name: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
          payment_id: string | null
          payment_status: string | null
        }
        Insert: {
          amount: number
          campaign_id: string
          donated_at?: string | null
          donor_id: string
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          payment_id?: string | null
          payment_status?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string
          donated_at?: string | null
          donor_id?: string
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          payment_id?: string | null
          payment_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          event_date: string
          event_time: string
          id: string
          location: string
          max_attendees: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          event_date: string
          event_time: string
          id?: string
          location: string
          max_attendees?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          event_date?: string
          event_time?: string
          id?: string
          location?: string
          max_attendees?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          added_by: string
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          photo_url: string | null
          relation: string
          updated_at: string | null
        }
        Insert: {
          added_by: string
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          relation: string
          updated_at?: string | null
        }
        Update: {
          added_by?: string
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          relation?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string
          applied_at: string | null
          cover_letter: string | null
          id: string
          job_id: string
          resume_url: string | null
          status: string | null
        }
        Insert: {
          applicant_id: string
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id: string
          resume_url?: string | null
          status?: string | null
        }
        Update: {
          applicant_id?: string
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id?: string
          resume_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string
          created_at: string | null
          description: string
          experience_level: string
          id: string
          is_active: boolean | null
          job_type: string
          location: string
          posted_by: string
          requirements: string | null
          salary_range: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description: string
          experience_level: string
          id?: string
          is_active?: boolean | null
          job_type: string
          location: string
          posted_by: string
          requirements?: string | null
          salary_range?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string
          experience_level?: string
          id?: string
          is_active?: boolean | null
          job_type?: string
          location?: string
          posted_by?: string
          requirements?: string | null
          salary_range?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          category: string
          condition: string
          created_at: string | null
          description: string
          id: string
          images: string[] | null
          is_active: boolean | null
          is_sold: boolean | null
          location: string
          price: number
          seller_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          condition: string
          created_at?: string | null
          description: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_sold?: boolean | null
          location: string
          price: number
          seller_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string | null
          description?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_sold?: boolean | null
          location?: string
          price?: number
          seller_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          family_name: string | null
          full_name: string
          id: string
          is_admin: boolean | null
          location: string | null
          phone: string | null
          profession: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          family_name?: string | null
          full_name: string
          id?: string
          is_admin?: boolean | null
          location?: string | null
          phone?: string | null
          profession?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          family_name?: string | null
          full_name?: string
          id?: string
          is_admin?: boolean | null
          location?: string | null
          phone?: string | null
          profession?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          role_name: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Returns: boolean
      }
      increment_donation_amount: {
        Args: { amount_to_add: number; campaign_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
