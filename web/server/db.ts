import { ENV } from "./_core/env";

const BASE = () => {
  // Acepta tanto los nombres manuales como los que crea la integración oficial de Supabase en Vercel
  let url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  // Las API keys de Supabase (JWT o sb_*) nunca llevan espacios; quitamos cualquier
  // espacio/salto de línea interno que se cuele al pegarlas en Vercel y rompa la cabecera HTTP.
  const key = (
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).replace(/\s/g, "");
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY not set");
  // Normaliza la URL: añade protocolo si falta y quita la barra final.
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, "");
  return { url, key };
};

async function sb(
  table: string,
  method: string,
  params?: string,
  body?: unknown
): Promise<unknown> {
  const { url, key } = BASE();
  const endpoint = `${url}/rest/v1/${table}${params ? `?${params}` : ""}`;
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: method === "POST" ? "return=representation" : "return=minimal",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Supabase fetch failed (${method} ${table}): ${detail} | host=${url.replace(/^https?:\/\//, "").slice(0, 32)} keyLen=${key.length}`
    );
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${method} ${table}: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Row = Record<string, unknown>;

function mapVehicle(v: Row) {
  return {
    id: v.id as string,
    brand: v.brand as string,
    model: v.model as string,
    year: v.year as number,
    price: String(v.price),
    km: v.km as number,
    fuelType: v.fuel_type as string,
    transmission: v.transmission as string,
    color: (v.color ?? null) as string | null,
    doors: (v.doors ?? null) as number | null,
    powerCv: (v.power_cv ?? null) as number | null,
    status: v.status as string,
    description: (v.description ?? null) as string | null,
    features: (v.features ?? null) as string[] | null,
    images: (v.images ?? null) as string[] | null,
    isFeatured: Boolean(v.is_featured),
    createdAt: v.created_at as string,
    updatedAt: v.updated_at as string,
  };
}

function mapLead(l: Row) {
  return {
    id: l.id as string,
    type: (l.type ?? "Contacto") as string,
    name: l.name as string,
    email: l.email as string,
    phone: (l.phone ?? null) as string | null,
    vehicleId: (l.vehicle_id ?? null) as string | null,
    vehicleInfo: (l.vehicle_info ?? null) as Row | null,
    message: (l.message ?? null) as string | null,
    notes: (l.notes ?? null) as string | null,
    status: l.status as string,
    createdAt: l.created_at as string,
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: string;
  lastSignedIn?: string;
}): Promise<void> {
  const role = user.openId === ENV.ownerOpenId ? "admin" : (user.role ?? "user");
  const now = new Date().toISOString();
  await sb("users", "POST", undefined, {
    open_id: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    login_method: user.loginMethod ?? null,
    role,
    last_signed_in: user.lastSignedIn ?? now,
    updated_at: now,
  });
}

export async function getUserByOpenId(openId: string) {
  const rows = (await sb("users", "GET", `open_id=eq.${encodeURIComponent(openId)}&limit=1`)) as Row[];
  if (!rows || rows.length === 0) return undefined;
  const d = rows[0];
  return {
    id: d.id as string,
    openId: d.open_id as string,
    name: d.name as string | null,
    email: d.email as string | null,
    loginMethod: d.login_method as string | null,
    role: d.role as string,
    lastSignedIn: d.last_signed_in as string,
    createdAt: d.created_at as string,
    updatedAt: d.updated_at as string,
  };
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export async function listVehicles(statusFilter?: string) {
  let params = "order=created_at.desc";
  if (statusFilter && statusFilter !== "all") {
    params += `&status=eq.${encodeURIComponent(statusFilter)}`;
  }
  const rows = (await sb("vehicles", "GET", params)) as Row[];
  return (rows ?? []).map(mapVehicle);
}

export async function getVehicleById(id: string) {
  const rows = (await sb("vehicles", "GET", `id=eq.${encodeURIComponent(id)}&limit=1`)) as Row[];
  if (!rows || rows.length === 0) return undefined;
  return mapVehicle(rows[0]);
}

export async function createVehicle(data: {
  brand: string; model: string; year: number; price: string; km: number;
  fuelType: string; transmission: string; color?: string | null;
  doors?: number | null; powerCv?: number | null; status?: string;
  description?: string | null; features?: string[] | null;
  images?: string[] | null; isFeatured?: boolean;
}) {
  const rows = (await sb("vehicles", "POST", "select=id", {
    brand: data.brand, model: data.model, year: data.year,
    price: data.price, km: data.km, fuel_type: data.fuelType,
    transmission: data.transmission, color: data.color ?? null,
    doors: data.doors ?? null, power_cv: data.powerCv ?? null,
    status: data.status ?? "available", description: data.description ?? null,
    features: data.features ?? null, images: data.images ?? null,
    is_featured: data.isFeatured ?? false,
  })) as Row[];
  return { id: rows[0].id as string };
}

export async function updateVehicle(id: string, data: Partial<{
  brand: string; model: string; year: number; price: string; km: number;
  fuelType: string; transmission: string; color: string | null;
  doors: number | null; powerCv: number | null; status: string;
  description: string | null; features: string[] | null;
  images: string[] | null; isFeatured: boolean;
}>) {
  const update: Row = { updated_at: new Date().toISOString() };
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
  await sb("vehicles", "PATCH", `id=eq.${encodeURIComponent(id)}`, update);
}

export async function deleteVehicle(id: string) {
  await sb("vehicles", "DELETE", `id=eq.${encodeURIComponent(id)}`);
}

export async function countVehicles() {
  const rows = (await sb("vehicles", "GET", "select=status")) as Row[];
  const r = rows ?? [];
  return {
    total: r.length,
    available: r.filter((v) => v.status === "available").length,
    reserved: r.filter((v) => v.status === "reserved").length,
    sold: r.filter((v) => v.status === "sold").length,
  };
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function listLeads(statusFilter?: string) {
  let params = "order=created_at.desc";
  if (statusFilter && statusFilter !== "all") {
    params += `&status=eq.${encodeURIComponent(statusFilter)}`;
  }
  const rows = (await sb("leads", "GET", params)) as Row[];
  return (rows ?? []).map(mapLead);
}

export async function getLeadById(id: string) {
  const rows = (await sb("leads", "GET", `id=eq.${encodeURIComponent(id)}&limit=1`)) as Row[];
  if (!rows || rows.length === 0) return undefined;
  return mapLead(rows[0]);
}

export async function createLead(data: {
  name: string; email: string; phone?: string | null; type?: string | null;
  vehicleId?: string | null; vehicleInfo?: Row | null;
  message?: string | null; notes?: string | null; status?: string;
}) {
  const rows = (await sb("leads", "POST", "select=id", {
    name: data.name, email: data.email, phone: data.phone ?? null,
    type: data.type ?? "Contacto",
    vehicle_id: data.vehicleId ?? null, vehicle_info: data.vehicleInfo ?? null,
    message: data.message ?? null, notes: data.notes ?? null,
    status: data.status ?? "Nuevo",
  })) as Row[];
  return { id: rows[0].id as string };
}

export async function updateLead(id: string, data: Partial<{
  name: string; email: string; phone: string | null; type: string | null;
  vehicleId: string | null; vehicleInfo: Row | null;
  message: string | null; notes: string | null; status: string;
}>) {
  const update: Row = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email;
  if (data.phone !== undefined) update.phone = data.phone;
  if (data.type !== undefined) update.type = data.type;
  if (data.vehicleId !== undefined) update.vehicle_id = data.vehicleId;
  if (data.vehicleInfo !== undefined) update.vehicle_info = data.vehicleInfo;
  if (data.message !== undefined) update.message = data.message;
  if (data.notes !== undefined) update.notes = data.notes;
  if (data.status !== undefined) update.status = data.status;
  await sb("leads", "PATCH", `id=eq.${encodeURIComponent(id)}`, update);
}

export async function deleteLead(id: string) {
  await sb("leads", "DELETE", `id=eq.${encodeURIComponent(id)}`);
}

export async function countLeads() {
  const rows = (await sb("leads", "GET", "select=status")) as Row[];
  const r = rows ?? [];
  return {
    total: r.length,
    new: r.filter((l) => l.status === "Nuevo").length,
    inProgress: r.filter((l) => l.status === "En Proceso").length,
    completed: r.filter((l) => l.status === "Completado").length,
  };
}
