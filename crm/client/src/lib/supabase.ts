import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ctouvshwrvijrkrxblrk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0b3V2c2h3cnZpanJrcnhibHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzgwNDcsImV4cCI6MjA5Njc1NDA0N30.5p0P81aMrzTBHNzq2UfOI3Yjx9YPaIvgLWnWQDQ6Rvc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Types ─────────────────────────────────────────────────────────────────── */

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

export type Lead = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  vehicle_id: string | null;
  vehicle_info: Record<string, unknown> | null;
  status: string;
  notes: string | null;
  created_at: string;
};

/* ── Vehicle helpers ────────────────────────────────────────────────────────── */

export async function fetchAllVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Vehicle[];
}

export async function createVehicle(v: {
  brand: string; model: string; year: number; price: string; km: number;
  fuel_type: string; transmission: string; status: string;
  description?: string | null;
}) {
  const { error } = await supabase.from("vehicles").insert(v);
  if (error) throw error;
}

export async function updateVehicle(id: string, v: Partial<{
  brand: string; model: string; year: number; price: string; km: number;
  fuel_type: string; transmission: string; status: string;
  description: string | null;
}>) {
  const { error } = await supabase
    .from("vehicles")
    .update({ ...v, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

/* ── Lead helpers ───────────────────────────────────────────────────────────── */

export async function fetchAllLeads(status?: string): Promise<Lead[]> {
  let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Lead[];
}

export async function updateLead(id: string, data: Partial<{
  status: string; notes: string | null; name: string; email: string;
  phone: string | null; message: string | null;
}>) {
  const { error } = await supabase.from("leads").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
