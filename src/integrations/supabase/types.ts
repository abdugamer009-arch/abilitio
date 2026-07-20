export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      assessment_results: {
        Row: {
          analytical_score: number;
          answers: Json;
          careers: Json;
          created_at: string;
          id: string;
          interest_scores: Json;
          iq_level: string;
          iq_score: number;
          logical_score: number;
          mbti_scores: Json;
          mbti_type: string;
          pattern_score: number;
          time_seconds: number;
          top_strengths: Json;
          user_id: string;
          weaknesses: Json;
        };
        Insert: {
          analytical_score?: number;
          answers?: Json;
          careers?: Json;
          created_at?: string;
          id?: string;
          interest_scores?: Json;
          iq_level: string;
          iq_score: number;
          logical_score?: number;
          mbti_scores?: Json;
          mbti_type: string;
          pattern_score?: number;
          time_seconds?: number;
          top_strengths?: Json;
          user_id: string;
          weaknesses?: Json;
        };
        Update: {
          analytical_score?: number;
          answers?: Json;
          careers?: Json;
          created_at?: string;
          id?: string;
          interest_scores?: Json;
          iq_level?: string;
          iq_score?: number;
          logical_score?: number;
          mbti_scores?: Json;
          mbti_type?: string;
          pattern_score?: number;
          time_seconds?: number;
          top_strengths?: Json;
          user_id?: string;
          weaknesses?: Json;
        };
        Relationships: [];
      };
      assessment_sessions: {
        Row: {
          answers: Json;
          id: string;
          option_order: Json;
          question_order: Json;
          started_at: string;
          step: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          answers?: Json;
          id?: string;
          option_order?: Json;
          question_order?: Json;
          started_at?: string;
          step?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          answers?: Json;
          id?: string;
          option_order?: Json;
          question_order?: Json;
          started_at?: string;
          step?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      abbi_usage: {
        Row: {
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      aura_achievements: {
        Row: {
          achievement_key: string;
          id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          achievement_key: string;
          id?: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          achievement_key?: string;
          id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      aura_purchase_requests: {
        Row: {
          coins: number;
          contact_note: string | null;
          created_at: string;
          id: string;
          package_key: string;
          status: string;
          updated_at: string;
          user_id: string;
          uzs_amount: number;
        };
        Insert: {
          coins: number;
          contact_note?: string | null;
          created_at?: string;
          id?: string;
          package_key: string;
          status?: string;
          updated_at?: string;
          user_id: string;
          uzs_amount: number;
        };
        Update: {
          coins?: number;
          contact_note?: string | null;
          created_at?: string;
          id?: string;
          package_key?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
          uzs_amount?: number;
        };
        Relationships: [];
      };
      aura_transactions: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          kind: string;
          meta: Json;
          reason: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          kind: string;
          meta?: Json;
          reason: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          kind?: string;
          meta?: Json;
          reason?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      aura_unlocks: {
        Row: {
          feature_key: string;
          id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          feature_key: string;
          id?: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          feature_key?: string;
          id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      aura_wallets: {
        Row: {
          balance: number;
          created_at: string;
          last_login_date: string | null;
          lifetime_earned: number;
          lifetime_spent: number;
          streak_days: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number;
          created_at?: string;
          last_login_date?: string | null;
          lifetime_earned?: number;
          lifetime_spent?: number;
          streak_days?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number;
          created_at?: string;
          last_login_date?: string | null;
          lifetime_earned?: number;
          lifetime_spent?: number;
          streak_days?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      career_assessment_answers: {
        Row: {
          answer: Json;
          created_at: string;
          id: string;
          question_id: string;
          user_id: string;
        };
        Insert: {
          answer: Json;
          created_at?: string;
          id?: string;
          question_id: string;
          user_id: string;
        };
        Update: {
          answer?: Json;
          created_at?: string;
          id?: string;
          question_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      career_assessment_results: {
        Row: {
          career_matches: Json | null;
          cognitive_profile: string | null;
          cognitive_score: number | null;
          cognitive_tier: string | null;
          created_at: string;
          id: string;
          improvements: Json | null;
          interests: Json | null;
          leadership_style: string | null;
          learning_style: string | null;
          personality_type: string | null;
          strengths: Json | null;
          team_style: string | null;
          university_matches: Json | null;
          user_id: string;
          work_style: string | null;
        };
        Insert: {
          career_matches?: Json | null;
          cognitive_profile?: string | null;
          cognitive_score?: number | null;
          cognitive_tier?: string | null;
          created_at?: string;
          id?: string;
          improvements?: Json | null;
          interests?: Json | null;
          leadership_style?: string | null;
          learning_style?: string | null;
          personality_type?: string | null;
          strengths?: Json | null;
          team_style?: string | null;
          university_matches?: Json | null;
          user_id: string;
          work_style?: string | null;
        };
        Update: {
          career_matches?: Json | null;
          cognitive_profile?: string | null;
          cognitive_score?: number | null;
          cognitive_tier?: string | null;
          created_at?: string;
          id?: string;
          improvements?: Json | null;
          interests?: Json | null;
          leadership_style?: string | null;
          learning_style?: string | null;
          personality_type?: string | null;
          strengths?: Json | null;
          team_style?: string | null;
          university_matches?: Json | null;
          user_id?: string;
          work_style?: string | null;
        };
        Relationships: [];
      };
      careers: {
        Row: {
          category: string;
          created_at: string;
          demand_score: number | null;
          description: string | null;
          id: string;
          key: string;
          name: string;
          required_interests: string[] | null;
          required_profile: string[] | null;
          required_skills: string[] | null;
          required_traits: Json | null;
          salary_max: number | null;
          salary_min: number | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          demand_score?: number | null;
          description?: string | null;
          id?: string;
          key: string;
          name: string;
          required_interests?: string[] | null;
          required_profile?: string[] | null;
          required_skills?: string[] | null;
          required_traits?: Json | null;
          salary_max?: number | null;
          salary_min?: number | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          demand_score?: number | null;
          description?: string | null;
          id?: string;
          key?: string;
          name?: string;
          required_interests?: string[] | null;
          required_profile?: string[] | null;
          required_skills?: string[] | null;
          required_traits?: Json | null;
          salary_max?: number | null;
          salary_min?: number | null;
        };
        Relationships: [];
      };
      communities: {
        Row: {
          career_key: string;
          created_at: string;
          description: string;
          id: string;
          member_count: number;
          name: string;
          slug: string;
          welcome_message: string;
        };
        Insert: {
          career_key: string;
          created_at?: string;
          description?: string;
          id?: string;
          member_count?: number;
          name: string;
          slug: string;
          welcome_message?: string;
        };
        Update: {
          career_key?: string;
          created_at?: string;
          description?: string;
          id?: string;
          member_count?: number;
          name?: string;
          slug?: string;
          welcome_message?: string;
        };
        Relationships: [];
      };
      community_daily_questions: {
        Row: {
          community_id: string;
          created_at: string;
          id: string;
          question: string;
        };
        Insert: {
          community_id: string;
          created_at?: string;
          id?: string;
          question: string;
        };
        Update: {
          community_id?: string;
          created_at?: string;
          id?: string;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_daily_questions_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
        ];
      };
      community_members: {
        Row: {
          community_id: string;
          joined_at: string;
          user_id: string;
        };
        Insert: {
          community_id: string;
          joined_at?: string;
          user_id: string;
        };
        Update: {
          community_id?: string;
          joined_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
        ];
      };
      community_messages: {
        Row: {
          community_id: string;
          content: string;
          created_at: string;
          id: string;
          is_pinned: boolean;
          user_id: string;
        };
        Insert: {
          community_id: string;
          content: string;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          user_id: string;
        };
        Update: {
          community_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_messages_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
        ];
      };
      iq_results: {
        Row: {
          analytical_score: number;
          answers: Json;
          correct_count: number;
          created_at: string;
          id: string;
          level: string;
          logical_score: number;
          pattern_score: number;
          score: number;
          time_seconds: number;
          total_questions: number;
          user_id: string;
        };
        Insert: {
          analytical_score?: number;
          answers?: Json;
          correct_count?: number;
          created_at?: string;
          id?: string;
          level: string;
          logical_score?: number;
          pattern_score?: number;
          score: number;
          time_seconds?: number;
          total_questions?: number;
          user_id: string;
        };
        Update: {
          analytical_score?: number;
          answers?: Json;
          correct_count?: number;
          created_at?: string;
          id?: string;
          level?: string;
          logical_score?: number;
          pattern_score?: number;
          score?: number;
          time_seconds?: number;
          total_questions?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      mbti_types: {
        Row: {
          description: string;
          strengths: Json;
          title: string;
          type_code: string;
          weaknesses: Json;
        };
        Insert: {
          description: string;
          strengths?: Json;
          title: string;
          type_code: string;
          weaknesses?: Json;
        };
        Update: {
          description?: string;
          strengths?: Json;
          title?: string;
          type_code?: string;
          weaknesses?: Json;
        };
        Relationships: [];
      };
      personality_answers: {
        Row: {
          answer_value: number;
          created_at: string;
          id: string;
          question_id: string;
          user_id: string;
        };
        Insert: {
          answer_value: number;
          created_at?: string;
          id?: string;
          question_id: string;
          user_id: string;
        };
        Update: {
          answer_value?: number;
          created_at?: string;
          id?: string;
          question_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "personality_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "personality_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      personality_questions: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          left_statement: string;
          question_number: number;
          right_statement: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          left_statement: string;
          question_number: number;
          right_statement: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          left_statement?: string;
          question_number?: number;
          right_statement?: string;
        };
        Relationships: [];
      };
      personality_results: {
        Row: {
          created_at: string;
          ft_score: number;
          id: string;
          ie_score: number;
          jp_score: number;
          mbti_type: string;
          sn_score: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          ft_score: number;
          id?: string;
          ie_score: number;
          jp_score: number;
          mbti_type: string;
          sn_score: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          ft_score?: number;
          id?: string;
          ie_score?: number;
          jp_score?: number;
          mbti_type?: string;
          sn_score?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          age_group: string | null;
          created_at: string;
          id: string;
          is_banned: boolean;
          name: string;
          surname: string;
          updated_at: string;
        };
        Insert: {
          age_group?: string | null;
          created_at?: string;
          id: string;
          is_banned?: boolean;
          name: string;
          surname: string;
          updated_at?: string;
        };
        Update: {
          age_group?: string | null;
          created_at?: string;
          id?: string;
          is_banned?: boolean;
          name?: string;
          surname?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      school_classes: {
        Row: {
          created_at: string;
          grade: number | null;
          id: string;
          name: string;
          school_id: string;
        };
        Insert: {
          created_at?: string;
          grade?: number | null;
          id?: string;
          name: string;
          school_id: string;
        };
        Update: {
          created_at?: string;
          grade?: number | null;
          id?: string;
          name?: string;
          school_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "school_classes_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      school_members: {
        Row: {
          class_id: string | null;
          id: string;
          joined_at: string;
          role: string;
          school_id: string;
          user_id: string;
        };
        Insert: {
          class_id?: string | null;
          id?: string;
          joined_at?: string;
          role: string;
          school_id: string;
          user_id: string;
        };
        Update: {
          class_id?: string | null;
          id?: string;
          joined_at?: string;
          role?: string;
          school_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "school_members_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "school_classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "school_members_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      school_specialized_classes: {
        Row: {
          created_at: string;
          created_by: string;
          focus: string;
          focus_key: string | null;
          id: string;
          reason: string;
          school_id: string;
          student_user_ids: string[];
          title: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          focus: string;
          focus_key?: string | null;
          id?: string;
          reason: string;
          school_id: string;
          student_user_ids?: string[];
          title: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          focus?: string;
          focus_key?: string | null;
          id?: string;
          reason?: string;
          school_id?: string;
          student_user_ids?: string[];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "school_specialized_classes_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      school_users: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          role: string;
          school_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          role: string;
          school_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          role?: string;
          school_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "school_users_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      schools: {
        Row: {
          city: string | null;
          code: string;
          country: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          owner_user_id: string;
          phone: string | null;
          plan: string;
          principal_name: string;
          student_count_estimate: number | null;
          updated_at: string;
        };
        Insert: {
          city?: string | null;
          code: string;
          country?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          owner_user_id: string;
          phone?: string | null;
          plan?: string;
          principal_name: string;
          student_count_estimate?: number | null;
          updated_at?: string;
        };
        Update: {
          city?: string | null;
          code?: string;
          country?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          owner_user_id?: string;
          phone?: string | null;
          plan?: string;
          principal_name?: string;
          student_count_estimate?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      university_majors: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          key: string;
          name: string;
          related_career_keys: string[] | null;
          required_interests: string[] | null;
          required_profile: string[] | null;
          required_traits: Json | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          key: string;
          name: string;
          related_career_keys?: string[] | null;
          required_interests?: string[] | null;
          required_profile?: string[] | null;
          required_traits?: Json | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          key?: string;
          name?: string;
          related_career_keys?: string[] | null;
          required_interests?: string[] | null;
          required_profile?: string[] | null;
          required_traits?: Json | null;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_stats: {
        Row: {
          avatar_url: string | null;
          communication_score: number;
          created_at: string;
          creativity_score: number;
          emotional_intelligence: number;
          ielts_band: number | null;
          leadership_level: number;
          productivity_level: number;
          sat_score: number | null;
          study_progress: number;
          tagline: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          communication_score?: number;
          created_at?: string;
          creativity_score?: number;
          emotional_intelligence?: number;
          ielts_band?: number | null;
          leadership_level?: number;
          productivity_level?: number;
          sat_score?: number | null;
          study_progress?: number;
          tagline?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          communication_score?: number;
          created_at?: string;
          creativity_score?: number;
          emotional_intelligence?: number;
          ielts_band?: number | null;
          leadership_level?: number;
          productivity_level?: number;
          sat_score?: number | null;
          study_progress?: number;
          tagline?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_adjust_aura: {
        Args: { _amount: number; _reason: string; _target: string };
        Returns: {
          balance: number;
          created_at: string;
          last_login_date: string | null;
          lifetime_earned: number;
          lifetime_spent: number;
          streak_days: number;
          updated_at: string;
          user_id: string;
        };
        SetofOptions: {
          from: "*";
          to: "aura_wallets";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      admin_set_ban: {
        Args: { _banned: boolean; _target: string };
        Returns: undefined;
      };
      admin_set_daily_question: {
        Args: { _community: string; _q: string };
        Returns: string;
      };
      admin_toggle_pin: {
        Args: { _msg: string; _pin: boolean };
        Returns: undefined;
      };
      assign_user_to_community: {
        Args: { _career_key: string };
        Returns: string;
      };
      assign_user_to_community_by_slug: {
        Args: { _slug: string };
        Returns: string;
      };
      aura_apply_delta: {
        Args: {
          _amount: number;
          _kind: string;
          _meta?: Json;
          _reason: string;
          _user: string;
        };
        Returns: {
          balance: number;
          created_at: string;
          last_login_date: string | null;
          lifetime_earned: number;
          lifetime_spent: number;
          streak_days: number;
          updated_at: string;
          user_id: string;
        };
        SetofOptions: {
          from: "*";
          to: "aura_wallets";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      aura_unlock_feature: {
        Args: { _feature_key: string; _price: number };
        Returns: Json;
      };
      generate_school_code: { Args: never; Returns: string };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin: { Args: { _user_id: string }; Returns: boolean };
      is_community_member: {
        Args: { _community: string; _user: string };
        Returns: boolean;
      };
      is_school_member: {
        Args: { _school: string; _user: string };
        Returns: boolean;
      };
      is_school_principal: {
        Args: { _school: string; _user: string };
        Returns: boolean;
      };
      join_school: {
        Args: { _class_name: string; _code: string };
        Returns: string;
      };
      register_school: {
        Args: {
          _city: string;
          _country: string;
          _email: string;
          _name: string;
          _phone: string;
          _principal_name: string;
          _students: number;
        };
        Returns: {
          city: string | null;
          code: string;
          country: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          owner_user_id: string;
          phone: string | null;
          plan: string;
          principal_name: string;
          student_count_estimate: number | null;
          updated_at: string;
        };
        SetofOptions: {
          from: "*";
          to: "schools";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      school_save_specialized_class: {
        Args: {
          _focus: string;
          _focus_key: string;
          _reason: string;
          _school: string;
          _students: string[];
          _title: string;
        };
        Returns: string;
      };
      submit_personality_assessment: {
        Args: { _answers: Json };
        Returns: {
          created_at: string;
          ft_score: number;
          id: string;
          ie_score: number;
          jp_score: number;
          mbti_type: string;
          sn_score: number;
          user_id: string;
        };
        SetofOptions: {
          from: "*";
          to: "personality_results";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
