import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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
  sold_at?: string | null;
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
  next_contact_date: string | null;
  created_at: string;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  type: string;
  description: string;
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

/** Filtra URLs que no pertenezcan al bucket de Supabase */
function onlyBucketImages(images?: string[] | null): string[] | null {
  if (!images || images.length === 0) return null;
  const clean = images.filter((url) => url.includes("supabase.co"));
  return clean.length > 0 ? clean : null;
}

export async function createVehicle(v: {
  brand: string; model: string; year: number; price: string; km: number;
  fuel_type: string; transmission: string; status: string;
  description?: string | null; images?: string[] | null;
  color?: string | null; doors?: number | null; power_cv?: number | null;
  is_featured?: boolean;
}) {
  const { error } = await supabase.from("vehicles").insert({
    ...v,
    images: onlyBucketImages(v.images),
  });
  if (error) throw error;
}

export async function updateVehicle(id: string, v: Partial<{
  brand: string; model: string; year: number; price: string; km: number;
  fuel_type: string; transmission: string; status: string;
  description: string | null; images: string[] | null;
  color: string | null; doors: number | null; power_cv: number | null;
  is_featured: boolean; sold_at?: string | null;
}>) {
  const patch = {
    ...v,
    ...(v.images !== undefined ? { images: onlyBucketImages(v.images) } : {}),
  };
  const { error } = await supabase
    .from("vehicles")
    .update(patch)
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
  phone: string | null; message: string | null; next_contact_date: string | null;
}>) {
  const { error } = await supabase.from("leads").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

export async function insertLead(data: {
  name: string;
  email: string;
  phone?: string;
  type: string;
  message?: string;
}) {
  const { error } = await supabase.from("leads").insert({ ...data, status: "new" });
  if (error) throw error;
}

/* ── Lead Activities ────────────────────────────────────────────────────────── */

export async function fetchLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as LeadActivity[];
}

export async function insertLeadActivity(leadId: string, type: string, description: string): Promise<void> {
  const { error } = await supabase.from("lead_activities").insert({
    lead_id: leadId,
    type,
    description,
  });
  if (error) throw error;
}

/* ── Storage helpers ────────────────────────────────────────────────────────── */

const BUCKET = "fotos";

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadVehicleImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `vehicles/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return getPublicUrl(path);
}

export async function deleteVehicleImage(url: string): Promise<void> {
  // Extract path after "/object/public/fotos/"
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
