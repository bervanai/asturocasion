import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase env vars not set");
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: string;
}): Promise<void> {
  const sb = getSupabase();
  const now = new Date().toISOString();
  const role = user.openId === ENV.ownerOpenId ? "admin" : (user.role ?? "user");
  await sb.from("users").upsert(
    {
      open_id: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      login_method: user.loginMethod ?? null,
      role,
      last_signed_in: now,
      updated_at: now,
    },
    { onConflict: "open_id" }
  );
}

export async function getUserByOpenId(openId: string) {
  const sb = getSupabase();
  const { data } = await sb.from("users").select("*").eq("open_id", openId).single();
  if (!data) return undefined;
  return {
    id: data.id,
    openId: data.open_id,
    name: data.name,
    email: data.email,
    loginMethod: data.login_method,
    role: data.role,
    lastSignedIn: data.last_signed_in,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

function mapVehicle(v: Record<string, unknown>) {
  return {
    id: v.id as string,
    brand: v.brand as string,
    model: v.model as string,
    year: v.year as number,
    price: v.price as string,
    km: v.km as number,
    fuelType: v.fuel_type as string,
    transmission: v.transmission as string,
    color: v.color as string | null,
    doors: v.doors as number | null,
    powerCv: v.power_cv as number | null,
    status: v.status as string,
    description: v.description as string | null,
    features: v.features as string[] | null,
    images: v.images as string[] | null,
    isFeatured: v.is_featured as boolean,
    createdAt: v.created_at as string,
    updatedAt: v.updated_at as string,
  };
}

export async function listVehicles(statusFilter?: string) {
  const sb = getSupabase();
  let query = sb.from("vehicles").select("*").order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapVehicle);
}

export async function getVehicleById(id: string) {
  const sb = getSupabase();
  const { data, error } = await sb.from("vehicles").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapVehicle(data);
}

export async function createVehicle(data: {
  brand: string;
  model: string;
  year: number;
  price: string;
  km: number;
  fuelType: string;
  transmission: string;
  color?: string | null;
  doors?: number | null;
  powerCv?: number | null;
  status?: string;
  description?: string | null;
  features?: string[] | null;
  images?: string[] | null;
  isFeatured?: boolean;
}) {
  const sb = getSupabase();
  const { data: row, error } = await sb
    .from("vehicles")
    .insert({
      brand: data.brand,
      model: data.model,
      year: data.year,
      price: data.price,
      km: data.km,
      fuel_type: data.fuelType,
      transmission: data.transmission,
      color: data.color ?? null,
      doors: data.doors ?? null,
      power_cv: data.powerCv ?? null,
      status: data.status ?? "available",
      description: data.description ?? null,
      features: data.features ?? null,
      images: data.images ?? null,
      is_featured: data.isFeatured ?? false,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: row!.id as string };
}

export async function updateVehicle(
  id: string,
  data: Partial<{
    brand: string;
    model: string;
    year: number;
    price: string;
    km: number;
    fuelType: string;
    transmission: string;
    color: string | null;
    doors: number | null;
    powerCv: number | null;
    status: string;
    description: string | null;
    features: string[] | null;
    images: string[] | null;
    isFeatured: boolean;
  }>
) {
  const sb = getSupabase();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.brand !== undefined) update.brand = data.brand;
  if (data.model !== undefined) update.model = data.model;
  if (data.year !== undefined) update.year = data.year;
  if (data.price !== undefined) update.price = data.price;
  if (data.km !== undefined) update.km = data.km;
  if (data.fuelType !== undefined) update.fuel_type = data.fuelType;
  if (data.transmission !== undefined) update.transmission = data.transmission;
  if (data.color !== undefined) update.color = data.color;
  if (data.doors !== undefined) update.doors = data.doors;
  if (data.powerCv !== undefined) update.power_cv = data.powerCv;
  if (data.status !== undefined) update.status = data.status;
  if (data.description !== undefined) update.description = data.description;
  if (data.features !== undefined) update.features = data.features;
  if (data.images !== undefined) update.images = data.images;
  if (data.isFeatured !== undefined) update.is_featured = data.isFeatured;
  const { error } = await sb.from("vehicles").update(update).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteVehicle(id: string) {
  const sb = getSupabase();
  const { error } = await sb.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function countVehicles() {
  const sb = getSupabase();
  const { data } = await sb.from("vehicles").select("status");
  const rows = data ?? [];
  return {
    total: rows.length,
    available: rows.filter((r) => r.status === "available").length,
    reserved: rows.filter((r) => r.status === "reserved").length,
    sold: rows.filter((r) => r.status === "sold").length,
  };
}

// ─── Leads ───────────────────────────────────────────────────────────────────

function mapLead(l: Record<string, unknown>) {
  return {
    id: l.id as string,
    name: l.name as string,
    email: l.email as string,
    phone: l.phone as string | null,
    vehicleId: l.vehicle_id as string | null,
    vehicleInfo: l.vehicle_info as Record<string, unknown> | null,
    message: l.message as string | null,
    notes: l.notes as string | null,
    status: l.status as string,
    createdAt: l.created_at as string,
  };
}

export async function listLeads(statusFilter?: string) {
  const sb = getSupabase();
  let query = sb.from("leads").select("*").order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapLead);
}

export async function getLeadById(id: string) {
  const sb = getSupabase();
  const { data, error } = await sb.from("leads").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapLead(data);
}

export async function createLead(data: {
  name: string;
  email: string;
  phone?: string | null;
  vehicleId?: string | null;
  vehicleInfo?: Record<string, unknown> | null;
  message?: string | null;
  notes?: string | null;
  status?: string;
}) {
  const sb = getSupabase();
  const { data: row, error } = await sb
    .from("leads")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      vehicle_id: data.vehicleId ?? null,
      vehicle_info: data.vehicleInfo ?? null,
      message: data.message ?? null,
      notes: data.notes ?? null,
      status: data.status ?? "Nuevo",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: row!.id as string };
}

export async function updateLead(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string | null;
    vehicleId: string | null;
    vehicleInfo: Record<string, unknown> | null;
    message: string | null;
    notes: string | null;
    status: string;
  }>
) {
  const sb = getSupabase();
  const update: Record<string, unknown> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email;
  if (data.phone !== undefined) update.phone = data.phone;
  if (data.vehicleId !== undefined) update.vehicle_id = data.vehicleId;
  if (data.vehicleInfo !== undefined) update.vehicle_info = data.vehicleInfo;
  if (data.message !== undefined) update.message = data.message;
  if (data.notes !== undefined) update.notes = data.notes;
  if (data.status !== undefined) update.status = data.status;
  const { error } = await sb.from("leads").update(update).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteLead(id: string) {
  const sb = getSupabase();
  const { error } = await sb.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function countLeads() {
  const sb = getSupabase();
  const { data } = await sb.from("leads").select("status");
  const rows = data ?? [];
  return {
    total: rows.length,
    new: rows.filter((r) => r.status === "Nuevo").length,
    inProgress: rows.filter((r) => r.status === "En Proceso").length,
    completed: rows.filter((r) => r.status === "Completado").length,
  };
}
