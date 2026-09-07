/**
 * Post-build SEO generator.
 *
 * The site is a client-rendered React SPA: every route is served the same
 * index.html, so a crawler that doesn't run JS sees the homepage's title,
 * description and canonical on EVERY url. That makes /catalogo, /contacto,
 * etc. look like duplicates of the homepage.
 *
 * This script runs after `vite build` and, for each known route, writes a
 * physical `dist/public/<route>/index.html` whose <title>, description,
 * canonical, Open Graph tags and JSON-LD already match what useSEO() sets at
 * runtime. Static hosts (Netlify / Vercel) serve these files before applying
 * the SPA catch-all, so crawlers get correct per-page metadata on the first
 * pass while the React app still hydrates normally for users.
 *
 * It also fetches published vehicles from Supabase (when build-time env vars
 * are present) to pre-render each vehicle detail page with real content +
 * schema.org/Car data, and regenerates sitemap.xml with every url.
 *
 * The script is defensive: any failure (missing Supabase env, network error,
 * unexpected HTML) is logged and skipped — it must never break the build.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist/public");
const BASE_URL = "https://www.asturocasion.es";
const SITE_NAME = "Astur Ocasión";
const DEFAULT_IMAGE = `${BASE_URL}/showroom.jpg`;
const TODAY = new Date().toISOString().slice(0, 10);

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Static routes, mirroring each page's useSEO() call. */
const ROUTES = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "daily",
    title: "Comprar Coche de Segunda Mano en Oviedo | Coches de Ocasión Asturias",
    description:
      "Compra tu próximo coche de segunda mano en Oviedo. Astur Ocasión: concesionario de coches usados en Asturias con garantía y transferencia incluidas. Mercedes, BMW, Audi, Volkswagen y más. Llama ahora: 629 574 957.",
  },
  {
    path: "/catalogo",
    priority: "0.9",
    changefreq: "daily",
    title: "Coches de Segunda Mano en Oviedo | Catálogo Astur Ocasión",
    description:
      "Catálogo de coches de segunda mano en Oviedo y Asturias. Mercedes, BMW, Audi, Volkswagen, Jaguar y más. Todos revisados, con garantía y transferencia incluidas. Busca tu coche ideal en Astur Ocasión.",
  },
  {
    path: "/compramos-tu-coche",
    priority: "0.8",
    changefreq: "monthly",
    title: "Vender Coche en Oviedo | Tasación Gratuita — Astur Ocasión",
    description:
      "¿Quieres vender tu coche en Oviedo o Asturias? Te lo compramos al mejor precio. Tasación online gratuita, respuesta en 24h y pago inmediato. Sin trámites, sin complicaciones. Astur Ocasión, Oviedo.",
  },
  {
    path: "/sobre-nosotros",
    priority: "0.7",
    changefreq: "monthly",
    title: "Concesionario Coches Segunda Mano Oviedo | Quiénes Somos — Astur Ocasión",
    description:
      "Astur Ocasión es tu concesionario de coches de segunda mano en Oviedo, Asturias. Más de 100 reseñas positivas, garantía incluida y atención personalizada. C. José Manuel Fuente, 2 — Oviedo.",
  },
  {
    path: "/contacto",
    priority: "0.7",
    changefreq: "monthly",
    title: "Contacto — Astur Ocasión Oviedo",
    description:
      "Contacta con Astur Ocasión en Oviedo. Llámanos al 629 574 957 o escríbenos por WhatsApp. Horario: lunes a viernes de 10:00 a 13:30 y de 16:00 a 20:00. Sábados de 10:00 a 13:30.",
  },
  {
    path: "/preguntas-frecuentes",
    priority: "0.6",
    changefreq: "monthly",
    title: "Preguntas Frecuentes | Coches de Ocasión en Oviedo — Astur Ocasión",
    description:
      "Resolvemos tus dudas sobre comprar coche de segunda mano en Oviedo: garantía, transferencia, financiación, tasación y más. Astur Ocasión, Oviedo (Asturias).",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        ["¿Dónde está Astur Ocasión?", "Estamos en C. José Manuel Fuente «El Tarangu», 2, 33002 Oviedo (Asturias). Puedes visitarnos sin cita en nuestro horario de apertura o llamarnos al 629 574 957."],
        ["¿Los coches llevan garantía?", "Sí. Todos nuestros vehículos de ocasión se entregan revisados y con garantía incluida, además de la transferencia a tu nombre. Compras con total tranquilidad."],
        ["¿La transferencia está incluida en el precio?", "Sí, la transferencia del vehículo a tu nombre va incluida. Nos encargamos de todos los trámites para que solo tengas que recoger tu coche."],
        ["¿Ofrecéis financiación?", "Sí, disponemos de financiación a medida para la compra de tu coche de segunda mano. Cuéntanos tu caso y te preparamos una propuesta sin compromiso."],
        ["¿Compráis mi coche usado?", "Sí. Tasamos y compramos tu coche al mejor precio. Puedes pedir una tasación online gratuita y te damos respuesta en 24 horas, con pago inmediato y sin trámites para ti."],
        ["¿Qué marcas de coches tenéis?", "Trabajamos con una amplia selección de marcas premium y generalistas: Mercedes-Benz, BMW, Audi, Volkswagen, Jaguar, Land Rover y muchas más. Consulta el catálogo actualizado en nuestra web."],
        ["¿Puedo reservar o ver un coche antes de comprarlo?", "Por supuesto. Puedes venir a verlo y probarlo a nuestras instalaciones de Oviedo, o contactarnos por teléfono y WhatsApp al 629 574 957 para resolver cualquier duda antes de decidirte."],
      ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  },
  {
    path: "/politica-de-privacidad",
    priority: "0.3",
    changefreq: "yearly",
    title: "Política de Privacidad",
    description:
      "Política de privacidad de Astur Ocasión del Automóvil. Información sobre el tratamiento de datos personales conforme al RGPD.",
  },
];

/** Replace the first tag matching `re` (or insert `replacement` before </head>). */
function replaceOrInsert(html, re, replacement) {
  return re.test(html) ? html.replace(re, replacement) : html.replace(/<\/head>/i, `    ${replacement}\n  </head>`);
}

/** Rewrite the head of the built index.html for a given page. */
function renderHead(template, { title, description, url, image, type, jsonLd, bodyContent }) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(fullTitle)}</title>`);

  html = replaceOrInsert(
    html,
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${esc(description)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${esc(url)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${esc(fullTitle)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${esc(description)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${esc(url)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:image"[^>]*>/i,
    `<meta property="og:image" content="${esc(image)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:type"[^>]*>/i,
    `<meta property="og:type" content="${esc(type)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${esc(fullTitle)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:image"[^>]*>/i,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  );

  if (jsonLd) {
    const block = `<script type="application/ld+json" data-page-jsonld="true">${JSON.stringify(jsonLd)}</script>`;
    html = html.replace(/<\/head>/i, `    ${block}\n  </head>`);
  }

  // Inject crawl-visible content inside #root. React's createRoot().render()
  // replaces the children of #root on hydration, so users never see this — it
  // exists purely so a non-JS crawl still gets real content on the first pass.
  if (bodyContent) {
    html = html.replace(
      /(<div id="root">)/i,
      `$1\n      <div id="seo-prerender">${bodyContent}</div>`,
    );
  }

  return html;
}

async function writeRoute(routePath, html) {
  const outDir = routePath === "/" ? DIST : path.join(DIST, routePath.replace(/^\//, ""));
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html, "utf8");
}

async function fetchVehicles() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("[seo] Supabase env vars not set — skipping vehicle pre-render, sitemap will list static routes only.");
    return [];
  }
  const select =
    "id,brand,model,year,price,km,fuel_type,transmission,color,power_cv,description,images,status,created_at";
  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/vehicles?select=${select}&status=eq.available&order=created_at.desc`;
  try {
    const res = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      console.warn(`[seo] Supabase returned ${res.status} — skipping vehicle pre-render.`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[seo] Failed to fetch vehicles from Supabase:", err.message);
    return [];
  }
}

function vehicleSeo(v) {
  const price = Number(v.price);
  const priceStr = Number.isFinite(price) ? price.toLocaleString("es-ES") : v.price;
  const km = Number(v.km);
  const kmStr = Number.isFinite(km) ? km.toLocaleString("es-ES") : v.km;
  const title = `${v.brand} ${v.model} ${v.year} — ${priceStr}€`;
  const description = `${v.brand} ${v.model} (${v.year}) en venta en Oviedo, Asturias. ${kmStr} km · ${v.fuel_type} · ${v.transmission}. Precio: ${priceStr}€. Garantía y transferencia incluidas.`;
  const url = `${BASE_URL}/vehiculo/${v.id}`;
  const image = (v.images && v.images[0]) || DEFAULT_IMAGE;

  const carLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${v.brand} ${v.model}`,
    brand: { "@type": "Brand", name: v.brand },
    model: v.model,
    vehicleModelDate: String(v.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.km, unitCode: "KMT" },
    fuelType: v.fuel_type,
    vehicleTransmission: v.transmission,
    ...(v.power_cv
      ? {
          vehicleEngine: {
            "@type": "EngineSpecification",
            enginePower: { "@type": "QuantitativeValue", value: v.power_cv, unitCode: "BHP" },
          },
        }
      : {}),
    ...(v.color ? { color: v.color } : {}),
    ...(v.description ? { description: v.description } : {}),
    image,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: v.price,
      availability: v.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "AutoDealer", name: SITE_NAME, url: BASE_URL },
    },
    url,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${BASE_URL}/catalogo` },
      { "@type": "ListItem", position: 3, name: `${v.brand} ${v.model}`, item: url },
    ],
  };

  const bodyContent =
    `<nav aria-label="Ruta"><a href="/">Inicio</a> › <a href="/catalogo">Catálogo</a> › ${esc(v.brand)} ${esc(v.model)}</nav>` +
    `<h1>${esc(v.brand)} ${esc(v.model)} ${esc(v.year)}</h1>` +
    `<p>${esc(description)}</p>` +
    (v.description ? `<p>${esc(v.description)}</p>` : "");

  const images = (v.images || []).filter(Boolean);
  return { title, description, url, image, type: "product", jsonLd: [carLd, breadcrumbLd], bodyContent, images };
}

function buildSitemap(urls) {
  const body = urls
    .map((u) => {
      const imgs = (u.images || [])
        .slice(0, 20)
        .map((i) => `    <image:image><image:loc>${esc(i)}</image:loc></image:image>`)
        .join("\n");
      return `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>${imgs ? "\n" + imgs : ""}\n  </url>`;
    })
    .join("\n\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n${body}\n\n</urlset>\n`;
}

function fmtPrice(p) {
  const n = Number(p);
  return Number.isFinite(n) ? n.toLocaleString("es-ES") : String(p);
}

/** Crawl-visible list of every vehicle with a real <a href> to its page.
 *  Static HTML links help Google discover and index all vehicle pages
 *  without needing to run JS. */
function vehicleListHtml(vehicles) {
  return vehicles
    .filter((v) => v && v.id)
    .map((v) => {
      const km = Number(v.km);
      const kmStr = Number.isFinite(km) ? km.toLocaleString("es-ES") : v.km;
      return `<li><a href="/vehiculo/${esc(v.id)}">${esc(v.brand)} ${esc(v.model)} ${esc(v.year)} — ${esc(fmtPrice(v.price))} € · ${esc(kmStr)} km · ${esc(v.fuel_type)}</a></li>`;
    })
    .join("");
}

function catalogBody(vehicles) {
  return (
    `<h1>Coches de segunda mano y ocasión en Oviedo, Asturias</h1>` +
    `<p>Catálogo de ${vehicles.length} vehículos de ocasión revisados, con garantía y transferencia incluidas, en Astur Ocasión (Oviedo).</p>` +
    `<ul>${vehicleListHtml(vehicles)}</ul>`
  );
}

function homeBody(vehicles) {
  const featured = vehicles.slice(0, 8);
  return (
    `<h1>Astur Ocasión — Coches de Ocasión y Segunda Mano en Oviedo</h1>` +
    `<p>Concesionario de coches de segunda mano en Oviedo, Asturias. ${vehicles.length} vehículos disponibles ` +
    `de marcas como Mercedes-Benz, BMW, Audi, Volkswagen, Porsche y más, todos con garantía y transferencia incluidas. ` +
    `Teléfono: 629 574 957.</p>` +
    `<p><a href="/catalogo">Ver todo el catálogo de vehículos</a></p>` +
    `<ul>${vehicleListHtml(featured)}</ul>`
  );
}

function catalogItemListLd(vehicles) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de vehículos de ocasión — Astur Ocasión",
    numberOfItems: vehicles.length,
    itemListElement: vehicles.filter((v) => v && v.id).map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/vehiculo/${v.id}`,
      name: `${v.brand} ${v.model} ${v.year}`,
    })),
  };
}

async function main() {
  const indexPath = path.join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn(`[seo] ${indexPath} not found — did vite build run? Skipping.`);
    return;
  }
  const template = await readFile(indexPath, "utf8");

  const sitemapUrls = [];

  // Fetch vehicles first so the home and catalogue pages can list them as
  // crawl-visible links (and the catalogue can carry an ItemList schema).
  const vehicles = (await fetchVehicles()).filter((v) => v && v.id);

  // 1) Static routes
  for (const route of ROUTES) {
    const url = route.path === "/" ? `${BASE_URL}/` : `${BASE_URL}${route.path}`;
    let bodyContent, jsonLd = route.jsonLd;
    if (route.path === "/catalogo" && vehicles.length) {
      bodyContent = catalogBody(vehicles);
      jsonLd = catalogItemListLd(vehicles);
    } else if (route.path === "/" && vehicles.length) {
      bodyContent = homeBody(vehicles);
    }
    const html = renderHead(template, {
      title: route.title,
      description: route.description,
      url,
      image: DEFAULT_IMAGE,
      type: "website",
      jsonLd,
      bodyContent,
    });
    await writeRoute(route.path, html);
    sitemapUrls.push({ loc: url, lastmod: TODAY, changefreq: route.changefreq, priority: route.priority });
  }
  console.log(`[seo] Wrote ${ROUTES.length} static route pages (home + catálogo con ${vehicles.length} coches).`);

  // 2) Vehicle detail pages
  let vehicleCount = 0;
  for (const v of vehicles) {
    if (!v || !v.id) continue;
    const seo = vehicleSeo(v);
    const html = renderHead(template, seo);
    await writeRoute(`/vehiculo/${v.id}`, html);
    const lastmod = (v.created_at || TODAY).slice(0, 10);
    sitemapUrls.push({ loc: seo.url, lastmod, changefreq: "weekly", priority: "0.8", images: seo.images });
    vehicleCount++;
  }
  if (vehicleCount) console.log(`[seo] Pre-rendered ${vehicleCount} vehicle pages.`);

  // 3) Sitemap
  await writeFile(path.join(DIST, "sitemap.xml"), buildSitemap(sitemapUrls), "utf8");
  console.log(`[seo] Wrote sitemap.xml with ${sitemapUrls.length} urls.`);
}

main().catch((err) => {
  // Never fail the build over SEO generation.
  console.warn("[seo] generate-seo failed (non-fatal):", err);
});
