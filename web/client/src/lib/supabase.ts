// Acceso a Supabase con peticiones REST directas (PostgREST).
// La web pública solo lee vehículos y guarda leads, así que no carga el cliente completo
// de @supabase/supabase-js (auth, realtime, storage…), que pesaba cientos de KB.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...HEADERS, ...init.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Error ${res.status} al consultar la base de datos`);
  }
  return res.status === 201 || res.status === 204 ? (null as T) : res.json();
}

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

// Vendidos que se enseñan en el catálogo como prueba de ventas ("Vendido" en amarillo).
// El resto de vendidos se conserva en la base de datos (y en el CRM), pero no se muestra.
const VISIBLE_SOLD = 2;

export async function fetchVehicles(status?: string): Promise<Vehicle[]> {
  if (status && status !== "all") {
    return (await rest<Vehicle[]>(
      `vehicles?select=*&order=created_at.desc&status=eq.${encodeURIComponent(status)}`,
    )) ?? [];
  }
  const [available, sold] = await Promise.all([
    rest<Vehicle[]>("vehicles?select=*&order=created_at.desc&status=neq.sold"),
    rest<Vehicle[]>(
      `vehicles?select=*&order=sold_at.desc.nullslast,created_at.desc&status=eq.sold&limit=${VISIBLE_SOLD}`,
    ),
  ]);
  return [...(available ?? []), ...(sold ?? [])];
}

export async function fetchVehicleById(id: string): Promise<Vehicle | null> {
  try {
    const rows = await rest<Vehicle[]>(`vehicles?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
    return rows?.[0] ?? null;
  } catch {
    return null;
  }
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
  await rest("leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? null,
      type: lead.type,
      message: lead.message ?? null,
      vehicle_id: lead.vehicle_id ?? null,
      vehicle_info: lead.vehicle_info ?? null,
      status: "new",
    }),
  });

  // Reenvío automático del lead por email (no bloquea el formulario; errores silenciados).
  try {
    void fetch("/api/notify-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }).catch(() => {});
  } catch {
    /* noop */
  }
}
