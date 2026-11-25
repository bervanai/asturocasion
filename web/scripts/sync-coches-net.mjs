// Sincroniza el catálogo de Supabase con el stock publicado en coches.net.
//
// Reglas:
//   - Coche nuevo en coches.net (con fotos)  -> se añade con fotos, descripción y datos.
//   - Coche en ambos con precio distinto     -> se actualiza el precio.
//   - Coche vendido que vuelve a coches.net  -> se reactiva como disponible.
//   - Coche en stock que ya no está          -> se marca "sold" (etiqueta "Vendido").
//   - "En stock" = disponible o reservado (los reservados en el CRM se respetan, no se tocan de estado).
//   - Nunca se borra ningún coche: los vendidos se conservan en la base de datos y en el CRM;
//     la web pública solo muestra los 2 vendidos más recientes (ver client/src/lib/supabase.ts).
//
// Seguridad: si la lectura de coches.net falla o parece incompleta, no se modifica nada.
//
// Uso:  node scripts/sync-coches-net.mjs [--dry-run]
// Env opcional: SUPABASE_URL, SUPABASE_ANON_KEY (si faltan, se leen del bundle público de la web).
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const DEALER_URL = "https://www.coches.net/concesionario/asturocasiondelautomovil/";
const SITE_URL = "https://www.asturocasion.es/";
const MAX_PHOTOS = 30;
const DRY_RUN = process.argv.includes("--dry-run");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const MAKE = {
  "MERCEDES-BENZ": "Mercedes-Benz", "LAND-ROVER": "Land-Rover", BMW: "BMW", MINI: "Mini",
  SEAT: "Seat", KIA: "Kia", DS: "DS", MG: "MG",
};
const TRANS = { "common.transmission_manual": "Manual", "common.transmission_automatic": "Automático" };
const COLOR = {
  BLACK: "Negro", WHITE: "Blanco", GREY: "Gris", GRAY: "Gris", SILVER: "Gris Plata", BLUE: "Azul",
  RED: "Rojo", GREEN: "Verde", BROWN: "Marrón", BEIGE: "Beige", YELLOW: "Amarillo",
  ORANGE: "Naranja", GOLD: "Dorado", PURPLE: "Morado", GRANATE: "Granate", OTHER: "Otro",
};

const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])\S/g, (m) => m.toUpperCase());
const brandOf = (make) => MAKE[make] ?? titleCase(make);
const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
const colorOf = (c) => {
  if (!c) return null;
  const k = String(c).replace(/^COMMON\.COLOR_/i, "").toUpperCase();
  return COLOR[k] ?? (String(c).startsWith("COMMON.") ? null : c);
};

// --- Supabase -------------------------------------------------------------
async function supabaseCreds() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) return { url, key };
  // La clave anon es pública: va embebida en el bundle de la web.
  const html = await (await fetch(SITE_URL)).text();
  const js = html.match(/\/assets\/[^"]+\.js/)?.[0];
  if (!js) throw new Error("No encuentro el bundle de la web para leer las credenciales");
  const src = await (await fetch(new URL(js, SITE_URL))).text();
  const u = src.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0];
  const k = src.match(/eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+/)?.[0];
  if (!u || !k) throw new Error("No encuentro las credenciales de Supabase en el bundle");
  return { url: u, key: k };
}

function db({ url, key }) {
  const h = { apikey: key, Authorization: `Bearer ${key}` };
  const call = async (path, opts = {}) => {
    const r = await fetch(`${url}${path}`, { ...opts, headers: { ...h, ...opts.headers } });
    if (!r.ok) throw new Error(`${opts.method ?? "GET"} ${path} -> ${r.status} ${await r.text()}`);
    return r.status === 204 ? null : r.json().catch(() => null);
  };
  return {
    list: () => call("/rest/v1/vehicles?select=id,brand,model,year,price,status,sold_at,images"),
    patch: (id, body) => call(`/rest/v1/vehicles?id=eq.${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(body),
    }),
    insert: async (row) => (await call("/rest/v1/vehicles", {
      method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(row),
    }))[0].id,
    hasObject: async (objectKey) =>
      (await fetch(`${url}/storage/v1/object/public/fotos/${objectKey}`, { method: "HEAD" })).ok,
    upload: async (bytes, objectKey = `vehicles/${randomUUID().replace(/-/g, "")}.jpg`) => {
      await call(`/storage/v1/object/fotos/${objectKey}`, {
        method: "POST", headers: { "Content-Type": "image/jpeg", "x-upsert": "true" }, body: bytes,
      });
      return `${url}/storage/v1/object/public/fotos/${objectKey}`;
    },
  };
}

// --- coches.net -----------------------------------------------------------
function hydration(html) {
  const key = "window.__staticRouterHydrationData = JSON.parse(";
  const k = html.indexOf(key);
  if (k < 0) return null;
  const i = html.indexOf('"', k + key.length);
  let j = i + 1, esc = false;
  for (; j < html.length; j++) {
    const c = html[j];
    if (esc) esc = false;
    else if (c === "\\") esc = true;
    else if (c === '"') break;
  }
  return JSON.parse(JSON.parse(html.slice(i, j + 1)));
}

function findVehiclesList(data) {
  let found = null;
  (function walk(o) {
    if (found || !o || typeof o !== "object") return;
    if (o.vehiclesList && Array.isArray(o.vehiclesList.items)) { found = o.vehiclesList; return; }
    for (const v of Object.values(o)) walk(v);
  })(data);
  return found;
}

function adDetails(data) {
  const out = {};
  (function walk(o) {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (v !== null && typeof v !== "object") {
        if (["description", "color", "doors"].includes(k) && out[k] === undefined) out[k] = v;
        if (k === "transmission" && typeof v === "string" && v.includes("transmission_")) out.transmission ??= v;
      }
      walk(v);
    }
  })(data);
  return out;
}

async function openPage(page, url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1500 + i * 2000);
      const data = hydration(await page.content());
      if (data) return data;
      lastErr = new Error("página sin datos de hidratación");
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`No se pudo leer ${url}: ${lastErr?.message}`);
}

// --- Miniaturas ------------------------------------------------------------
// Las tarjetas del catálogo cargan fotos/thumbs/<id>.jpg; si falta, bajan la foto grande.
const THUMB_WIDTH = 640;

async function makeThumb(page, src) {
  const res = await fetch(src, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`foto ${res.status}`);
  const b64 = Buffer.from(await res.arrayBuffer()).toString("base64");
  const out = await page.evaluate(async ({ b64, width }) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await img.decode();
    const w = Math.min(width, img.naturalWidth);
    const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.72).split(",")[1];
  }, { b64, width: THUMB_WIDTH });
  return Buffer.from(out, "base64");
}

// --- Emparejado coches.net <-> base de datos -------------------------------
function sameCar(cn, row) {
  if (row.brand !== brandOf(cn.make) || row.year !== cn.year) return false;
  const m = norm(cn.model), r = norm(row.model);
  return r === m || r.startsWith(m + " ");
}

// Entre varios candidatos iguales (mismo modelo y año), el de precio más cercano.
function bestMatch(cn, candidates) {
  return candidates
    .filter((r) => sameCar(cn, r))
    .sort((a, b) => Math.abs(Number(a.price) - cn.price) - Math.abs(Number(b.price) - cn.price))[0];
}

async function main() {
  const creds = await supabaseCreds();
  const api = db(creds);
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await (await browser.newContext({ userAgent: UA, locale: "es-ES" })).newPage();
  const summary = { added: [], price: [], sold: [], reactivated: [], skipped: [], thumbs: [] };

  try {
    let list = null;
    for (let i = 0; i < 3 && !list?.items?.length; i++) {
      list = findVehiclesList(await openPage(page, DEALER_URL));
    }
    const items = list?.items ?? [];
    const rows = await api.list();
    // En stock = todo lo que no está vendido (disponible o reservado desde el CRM).
    const available = rows.filter((r) => r.status !== "sold");

    // Seguridad: no seguir si la lectura parece rota.
    if (!items.length || list.totalResults !== items.length || (list.totalPages ?? 1) > 1) {
      throw new Error(`Lectura de coches.net no fiable (items=${items.length}, total=${list?.totalResults}, páginas=${list?.totalPages})`);
    }
    if (available.length >= 10 && items.length < available.length * 0.5) {
      throw new Error(`coches.net devuelve ${items.length} coches frente a ${available.length} en la web: abortado por seguridad`);
    }

    const matched = new Set();
    for (const cn of items) {
      const hit =
        bestMatch(cn, available.filter((r) => !matched.has(r.id))) ??
        bestMatch(cn, rows.filter((r) => r.status === "sold" && !matched.has(r.id)));
      const label = `${brandOf(cn.make)} ${cn.model} ${cn.year}`;

      if (hit) {
        matched.add(hit.id);
        if (hit.status === "sold") {
          summary.reactivated.push(label);
          if (!DRY_RUN) await api.patch(hit.id, { status: "available", sold_at: null, price: cn.price });
        } else if (Math.abs(Number(hit.price) - cn.price) >= 1) {
          summary.price.push(`${label}: ${Number(hit.price)} -> ${cn.price}`);
          if (!DRY_RUN) await api.patch(hit.id, { price: cn.price });
        }
        continue;
      }

      const photos = (cn.photos ?? []).slice(0, MAX_PHOTOS);
      if (!photos.length) { summary.skipped.push(`${label} (sin fotos en coches.net)`); continue; }
      summary.added.push(`${label} · ${cn.price}€ · ${photos.length} fotos`);
      if (DRY_RUN) continue;

      const det = adDetails(await openPage(page, `https://www.coches.net${cn.url}`));
      const images = [];
      for (const src of photos) {
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const res = await fetch(src, { headers: { "User-Agent": UA } });
            if (!res.ok) throw new Error(`foto ${res.status}`);
            images.push(await api.upload(Buffer.from(await res.arrayBuffer())));
            break;
          } catch (e) {
            if (attempt === 2) console.warn(`  foto fallida (${label}): ${e.message}`);
          }
        }
      }
      if (!images.length) {
        summary.added.pop();
        summary.skipped.push(`${label} (no se pudo descargar ninguna foto)`);
        continue;
      }
      const model = (cn.title ?? "").replace(new RegExp(`^\\s*${cn.make.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "").trim() || cn.model;
      await api.insert({
        brand: brandOf(cn.make), model, year: cn.year, price: cn.price, km: cn.km ?? null,
        fuel_type: cn.fuelType ?? null, transmission: TRANS[det.transmission] ?? null,
        color: colorOf(det.color), doors: det.doors ?? null, power_cv: cn.hp ?? null,
        description: det.description ?? "", features: null, images, status: "available", is_featured: false,
      });
    }

    // Disponibles que ya no están en coches.net -> vendidos.
    const now = new Date().toISOString();
    const newlySold = available.filter((r) => !matched.has(r.id));
    for (const r of newlySold) {
      summary.sold.push(`${r.brand} ${r.model} ${r.year}`);
      if (!DRY_RUN) await api.patch(r.id, { status: "sold", sold_at: now });
    }

    // Miniaturas que falten (incluidos los coches recién añadidos).
    await page.goto("about:blank");
    for (const r of await api.list()) {
      const first = r.images?.[0];
      if (!first || (await api.hasObject(`thumbs/${r.id}.jpg`))) continue;
      summary.thumbs.push(`${r.brand} ${r.model} ${r.year}`);
      if (DRY_RUN) continue;
      try {
        await api.upload(await makeThumb(page, first), `thumbs/${r.id}.jpg`);
      } catch (e) {
        summary.thumbs.pop();
        console.warn(`  miniatura fallida (${r.brand} ${r.model}): ${e.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  const final = DRY_RUN ? null : await api.list();
  console.log(JSON.stringify({
    dryRun: DRY_RUN,
    // true si cambió algo que afecta al sitemap o a las páginas SEO: hay que volver a publicar la web.
    needsRedeploy: ["added", "price", "sold", "reactivated"].some((k) => summary[k].length > 0),
    ...summary,
    final: final && {
      available: final.filter((r) => r.status === "available").length,
      reserved: final.filter((r) => r.status === "reserved").length,
      sold: final.filter((r) => r.status === "sold").length,
    },
  }, null, 2));
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
