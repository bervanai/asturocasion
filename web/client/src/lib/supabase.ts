import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  km: number;
  fuel_type: string;
  transmission: string;
  color: string | null;
  doors: number | null;
  power_cv: number | null;
  description: string | null;
  features: string[] | null;
  images: string[] | null;
  status: string;
  is_featured: boolean;
  created_at: string;
};

export async function fetchVehicles(status?: string): Promise<Vehicle[]> {
  let query = supabase.from("vehicles").select("*").order("created_at", { ascending: false });
  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Vehicle[];
}

export async function fetchVehicleById(id: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Vehicle;
}

export async function insertLead(lead: {
  name: string;
  email: string;
  phone?: string | null;
  type: "contact" | "valuation" | "vehicle_inquiry";
  message?: string | null;
  vehicle_id?: string | null;
  vehicle_info?: Record<string, unknown> | null;
}) {
  const { error } = await supabase.from("leads").insert({
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? null,
    type: lead.type,
    message: lead.message ?? null,
    vehicle_id: lead.vehicle_id ?? null,
    vehicle_info: lead.vehicle_info ?? null,
    status: "new",
  });
  if (error) throw error;
}
