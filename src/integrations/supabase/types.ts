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
      attractions: {
        Row: {
          admission_fee: string | null
          category: string | null
          city_name: string
          created_at: string
          description: string | null
          featured: boolean | null
          founded_year: number | null
          hours_of_operation: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          slug: string | null
          state: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          website: string | null
          year_opened: number | null
        }
        Insert: {
          admission_fee?: string | null
          category?: string | null
          city_name: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          founded_year?: number | null
          hours_of_operation?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          slug?: string | null
          state: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          website?: string | null
          year_opened?: number | null
        }
        Update: {
          admission_fee?: string | null
          category?: string | null
          city_name?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          founded_year?: number | null
          hours_of_operation?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          slug?: string | null
          state?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          website?: string | null
          year_opened?: number | null
        }
        Relationships: []
      }
      destination_cities: {
        Row: {
          created_at: string
          description: string | null
          elevation_ft: number | null
          featured: boolean | null
          founded_year: number | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          population: number | null
          state: string
          status: string | null
          thumbnail_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          elevation_ft?: number | null
          featured?: boolean | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          population?: number | null
          state: string
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          elevation_ft?: number | null
          featured?: boolean | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          population?: number | null
          state?: string
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      drive_ins: {
        Row: {
          capacity_cars: number | null
          city_name: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          screens_count: number | null
          state: string
          status: string | null
          status_notes: string | null
          thumbnail_url: string | null
          updated_at: string
          website: string | null
          year_opened: number | null
        }
        Insert: {
          capacity_cars?: number | null
          city_name: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          screens_count?: number | null
          state: string
          status?: string | null
          status_notes?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          website?: string | null
          year_opened?: number | null
        }
        Update: {
          capacity_cars?: number | null
          city_name?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          screens_count?: number | null
          state?: string
          status?: string | null
          status_notes?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          website?: string | null
          year_opened?: number | null
        }
        Relationships: []
      }
      hidden_gems: {
        Row: {
          category: string | null
          city_name: string
          created_at: string
          description: string | null
          featured: boolean | null
          founded_year: number | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string | null
          slug: string | null
          state: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          website: string | null
          year_opened: number | null
        }
        Insert: {
          category?: string | null
          city_name: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name?: string | null
          slug?: string | null
          state?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          website?: string | null
          year_opened?: number | null
        }
        Update: {
          category?: string | null
          city_name?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string | null
          slug?: string | null
          state?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          website?: string | null
          year_opened?: number | null
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          caption: string | null
          carousel_media: Json | null
          comments_count: number | null
          created_at: string
          hashtags: string[] | null
          id: string
          instagram_post_id: string
          is_featured: boolean | null
          like_count: number | null
          likes: number | null
          location_id: string | null
          location_name: string | null
          media_type: string
          media_url: string
          mentions: string[] | null
          permalink: string
          route66_relevant: boolean | null
          thumbnail_url: string | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          carousel_media?: Json | null
          comments_count?: number | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          instagram_post_id: string
          is_featured?: boolean | null
          like_count?: number | null
          likes?: number | null
          location_id?: string | null
          location_name?: string | null
          media_type: string
          media_url: string
          mentions?: string[] | null
          permalink: string
          route66_relevant?: boolean | null
          thumbnail_url?: string | null
          timestamp: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          carousel_media?: Json | null
          comments_count?: number | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          instagram_post_id?: string
          is_featured?: boolean | null
          like_count?: number | null
          likes?: number | null
          location_id?: string | null
          location_name?: string | null
          media_type?: string
          media_url?: string
          mentions?: string[] | null
          permalink?: string
          route66_relevant?: boolean | null
          thumbnail_url?: string | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      moderation_results: {
        Row: {
          bucket: string
          created_at: string | null
          id: string
          name: string
          result: Json | null
        }
        Insert: {
          bucket: string
          created_at?: string | null
          id?: string
          name: string
          result?: Json | null
        }
        Update: {
          bucket?: string
          created_at?: string | null
          id?: string
          name?: string
          result?: Json | null
        }
        Relationships: []
      }
      photo_challenges: {
        Row: {
          completion_time: string | null
          created_at: string | null
          id: string
          is_trailblazer: boolean | null
          moderation_result: Json | null
          photo_url: string
          stop_id: string
          trailblazer_awarded_at: string | null
          trip_id: string | null
          updated_at: string | null
          user_session_id: string | null
        }
        Insert: {
          completion_time?: string | null
          created_at?: string | null
          id?: string
          is_trailblazer?: boolean | null
          moderation_result?: Json | null
          photo_url: string
          stop_id: string
          trailblazer_awarded_at?: string | null
          trip_id?: string | null
          updated_at?: string | null
          user_session_id?: string | null
        }
        Update: {
          completion_time?: string | null
          created_at?: string | null
          id?: string
          is_trailblazer?: boolean | null
          moderation_result?: Json | null
          photo_url?: string
          stop_id?: string
          trailblazer_awarded_at?: string | null
          trip_id?: string | null
          updated_at?: string | null
          user_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_challenges_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      route66_waypoints: {
        Row: {
          created_at: string
          description: string | null
          highway_designation: string | null
          id: string
          image_url: string | null
          is_major_stop: boolean | null
          latitude: number
          longitude: number
          name: string
          sequence_order: number
          state: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          highway_designation?: string | null
          id?: string
          image_url?: string | null
          is_major_stop?: boolean | null
          latitude: number
          longitude: number
          name: string
          sequence_order: number
          state: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          highway_designation?: string | null
          id?: string
          image_url?: string | null
          is_major_stop?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          sequence_order?: number
          state?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      trailblazer_achievements: {
        Row: {
          achieved_at: string
          created_at: string
          id: string
          photo_challenge_id: string
          stop_id: string
          user_session_id: string | null
        }
        Insert: {
          achieved_at?: string
          created_at?: string
          id?: string
          photo_challenge_id: string
          stop_id: string
          user_session_id?: string | null
        }
        Update: {
          achieved_at?: string
          created_at?: string
          id?: string
          photo_challenge_id?: string
          stop_id?: string
          user_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trailblazer_achievements_photo_challenge_id_fkey"
            columns: ["photo_challenge_id"]
            isOneToOne: false
            referencedRelation: "photo_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          description: string | null
          id: string
          share_code: string
          title: string | null
          trip_data: Json
          updated_at: string
          user_id: string | null
          view_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          share_code: string
          title?: string | null
          trip_data: Json
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          share_code?: string
          title?: string | null
          trip_data?: Json
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      get_location_trailblazer: {
        Args: { location_stop_id: string }
        Returns: {
          has_trailblazer: boolean
          user_session_id: string
          achieved_at: string
          photo_url: string
        }[]
      }
      get_trailblazer_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_session_id: string
          trailblazer_count: number
          latest_achievement: string
          locations: string[]
        }[]
      }
      validate_route66_sequence: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_valid: boolean
          errors: string[]
          sequence_gaps: number[]
          duplicate_sequences: number[]
        }[]
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
