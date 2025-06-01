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
          hours_of_operation: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          state: string
          thumbnail_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          admission_fee?: string | null
          category?: string | null
          city_name: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          hours_of_operation?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          state: string
          thumbnail_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          admission_fee?: string | null
          category?: string | null
          city_name?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          hours_of_operation?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          state?: string
          thumbnail_url?: string | null
          updated_at?: string
          website?: string | null
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
          city_name: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          website: string | null
        }
        Insert: {
          city_name: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          city_name?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
