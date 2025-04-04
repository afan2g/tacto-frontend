export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      notification_tokens: {
        Row: {
          created_at: string | null;
          device_type: string;
          id: string;
          last_used: string | null;
          push_token: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          device_type: string;
          id?: string;
          last_used?: string | null;
          push_token: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          device_type?: string;
          id?: string;
          last_used?: string | null;
          push_token?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      payment_requests: {
        Row: {
          amount: number;
          created_at: string | null;
          expires_at: string | null;
          fulfilled_by: string | null;
          id: string;
          message: string | null;
          requestee_id: string;
          requester_id: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          expires_at?: string | null;
          fulfilled_by?: string | null;
          id?: string;
          message?: string | null;
          requestee_id: string;
          requester_id: string;
          status: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          expires_at?: string | null;
          fulfilled_by?: string | null;
          id?: string;
          message?: string | null;
          requestee_id?: string;
          requester_id?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payment_requests_fulfilled_by_fkey";
            columns: ["fulfilled_by"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          first_name: string | null;
          full_name: string;
          id: string;
          last_name: string | null;
          onboarding_complete: boolean;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          first_name?: string | null;
          full_name: string;
          id: string;
          last_name?: string | null;
          onboarding_complete?: boolean;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          first_name?: string | null;
          full_name?: string;
          id?: string;
          last_name?: string | null;
          onboarding_complete?: boolean;
          username?: string;
        };
        Relationships: [];
      };
      transaction_methods: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          asset: string;
          created_at: string | null;
          fee: number;
          from_address: string;
          from_user_id: string | null;
          hash: string;
          id: string;
          method_id: number;
          request_id: string | null;
          status: string;
          to_address: string;
          to_user_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          asset: string;
          created_at?: string | null;
          fee: number;
          from_address: string;
          from_user_id?: string | null;
          hash: string;
          id?: string;
          method_id: number;
          request_id?: string | null;
          status: string;
          to_address: string;
          to_user_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          asset?: string;
          created_at?: string | null;
          fee?: number;
          from_address?: string;
          from_user_id?: string | null;
          hash?: string;
          id?: string;
          method_id?: number;
          request_id?: string | null;
          status?: string;
          to_address?: string;
          to_user_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_method_id_fkey";
            columns: ["method_id"];
            isOneToOne: false;
            referencedRelation: "transaction_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "payment_requests";
            referencedColumns: ["id"];
          }
        ];
      };
      wallets: {
        Row: {
          address: string;
          chain_code: string | null;
          created_at: string | null;
          depth: number;
          eth_balance: number;
          id: string;
          index: number;
          is_primary: boolean | null;
          name: string | null;
          nonce: number;
          owner_id: string;
          parent_fingerprint: string | null;
          path: string | null;
          public_key: string;
          updated_at: string | null;
          usdc_balance: number;
        };
        Insert: {
          address: string;
          chain_code?: string | null;
          created_at?: string | null;
          depth: number;
          eth_balance?: number;
          id?: string;
          index: number;
          is_primary?: boolean | null;
          name?: string | null;
          nonce?: number;
          owner_id: string;
          parent_fingerprint?: string | null;
          path?: string | null;
          public_key: string;
          updated_at?: string | null;
          usdc_balance?: number;
        };
        Update: {
          address?: string;
          chain_code?: string | null;
          created_at?: string | null;
          depth?: number;
          eth_balance?: number;
          id?: string;
          index?: number;
          is_primary?: boolean | null;
          name?: string | null;
          nonce?: number;
          owner_id?: string;
          parent_fingerprint?: string | null;
          path?: string | null;
          public_key?: string;
          updated_at?: string | null;
          usdc_balance?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_email_exists: {
        Args: {
          email_input: string;
        };
        Returns: boolean;
      };
      validate_username: {
        Args: {
          username_input: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
