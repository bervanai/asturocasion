import { createClient } from "@supabase/supabase-js";

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuel_type: string;
  transmission: string;
  color?: string;
  doors?: number;
  power_cv?: number;
  description?: string;
  features?: string[];
  images?: string[];
  status: "available" | "reserved" | "sold";
  is_featured: boolean;
  created_at: string;
};

export type Lead = {
  type: "contact" | "valuation" | "vehicle_inquiry";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  vehicle_id?: string;
  vehicle_info?: Record<string, unknown>;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
