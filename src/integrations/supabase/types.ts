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
      body_measurements: {
        Row: {
          biceps: number | null
          body_fat_percentage: number | null
          chest: number | null
          created_at: string | null
          date: string | null
          hips: number | null
          id: string
          thighs: number | null
          updated_at: string | null
          user_id: string | null
          waist: number | null
          weight: number | null
        }
        Insert: {
          biceps?: number | null
          body_fat_percentage?: number | null
          chest?: number | null
          created_at?: string | null
          date?: string | null
          hips?: number | null
          id?: string
          thighs?: number | null
          updated_at?: string | null
          user_id?: string | null
          waist?: number | null
          weight?: number | null
        }
        Update: {
          biceps?: number | null
          body_fat_percentage?: number | null
          chest?: number | null
          created_at?: string | null
          date?: string | null
          hips?: number | null
          id?: string
          thighs?: number | null
          updated_at?: string | null
          user_id?: string | null
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      exercise_progress: {
        Row: {
          created_at: string | null
          date: string | null
          duration: number | null
          exercise_id: string | null
          id: string
          notes: string | null
          reps: number | null
          sets: number | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
          workout_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          duration?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
          workout_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          duration?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_progress_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_progress_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          exercise_id: string | null
          id: string
          name: string
          reps: string | null
          sets: string | null
          updated_at: string
          weight: string | null
          workout_id: string
        }
        Insert: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          name: string
          reps?: string | null
          sets?: string | null
          updated_at?: string
          weight?: string | null
          workout_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string | null
          id?: string
          name?: string
          reps?: string | null
          sets?: string | null
          updated_at?: string
          weight?: string | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises_library: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          muscle_group: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          muscle_group: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          muscle_group?: string
          name?: string
        }
        Relationships: []
      }
      instagram_comments: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          post_id: string
          profile_picture: string | null
          text: string | null
          timestamp: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          post_id: string
          profile_picture?: string | null
          text?: string | null
          timestamp?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          post_id?: string
          profile_picture?: string | null
          text?: string | null
          timestamp?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "instagram_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "instagram_posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      instagram_posts: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string | null
          likes_count: number | null
          post_id: string
          profile_username: string
          timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          post_id: string
          profile_username: string
          timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          post_id?: string
          profile_username?: string
          timestamp?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instagram_posts_profile_username_fkey"
            columns: ["profile_username"]
            isOneToOne: false
            referencedRelation: "instagram_profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      instagram_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          posts_count: number | null
          profile_picture: string | null
          raw_data: Json | null
          updated_at: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          posts_count?: number | null
          profile_picture?: string | null
          raw_data?: Json | null
          updated_at?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          posts_count?: number | null
          profile_picture?: string | null
          raw_data?: Json | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          created_at: string
          date: string
          exercise: string
          id: string
          previous_value: string | null
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          date?: string
          exercise: string
          id?: string
          previous_value?: string | null
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          date?: string
          exercise?: string
          id?: string
          previous_value?: string | null
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          reminder_enabled: boolean | null
          reminder_time: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      scraping_history: {
        Row: {
          id: string
          profile_username: string
          scraped_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          profile_username: string
          scraped_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          profile_username?: string
          scraped_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scraping_history_profile_username_fkey"
            columns: ["profile_username"]
            isOneToOne: false
            referencedRelation: "instagram_profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          date: string
          duration: string | null
          id: string
          intensity: string | null
          name: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          duration?: string | null
          id?: string
          intensity?: string | null
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: string | null
          id?: string
          intensity?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
