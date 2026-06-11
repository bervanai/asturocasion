import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon);

// Server-side client with elevated privileges (only used in server actions/routes)
export function createAdminClient() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

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
  updated_at: string;
};

export type Lead = {
  id: string;
  type: "contact" | "valuation" | "vehicle_inquiry";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  vehicle_id?: string;
  vehicle_info?: Record<string, unknown>;
  status: "new" | "contacted" | "closed";
  notes?: string;
  created_at: string;
  vehicles?: { brand: string; model: string } | null;
};
