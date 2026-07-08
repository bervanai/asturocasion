import { useEffect } from "react";

const SITE_NAME = "Astur Ocasión";
const BASE_URL = "https://www.asturocasion.es";
const DEFAULT_DESCRIPTION =
  "Concesionario de vehículos de ocasión premium en Oviedo, Asturias. Mercedes, BMW, Audi, Jaguar y más. Todos revisados, con garantía y transferencia incluidas.";
const DEFAULT_IMAGE = "https://www.asturocasion.es/showroom.jpg";

interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  /** Path only, e.g. "/catalogo". Defaults to current path. */
  path?: string;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, unknown>;
  /** Append site name to title? Default true */
  appendSiteName?: boolean;
}

function setMeta(selector: string, value: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const key = selector.match(/\[(?:name|property)="([^"]+)"\]/)?.[1] ?? "";
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path,
  type = "website",
  jsonLd,
  appendSiteName = true,
}: SEOOptions = {}) {
  useEffect(() => {
    const fullTitle = title
      ? appendSiteName
        ? `${title} | ${SITE_NAME}`
        : title
      : `${SITE_NAME} — Coches de Ocasión Premium en Oviedo, Asturias`;

    const currentPath =
      path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const fullUrl = `${BASE_URL}${currentPath}`;

    // ── Title
    document.title = fullTitle;

    // ── Standard meta
    setMeta('meta[name="description"]', description, "name");
    setMeta('meta[name="robots"]', "index, follow, max-snippet:-1, max-image-preview:large", "name");

    // ── Open Graph
    setMeta('meta[property="og:title"]',       fullTitle,    "property");
    setMeta('meta[property="og:description"]', description,  "property");
    setMeta('meta[property="og:url"]',         fullUrl,      "property");
    setMeta('meta[property="og:image"]',       image,        "property");
    setMeta('meta[property="og:type"]',        type,         "property");
    setMeta('meta[property="og:site_name"]',   SITE_NAME,    "property");
    setMeta('meta[property="og:locale"]',      "es_ES",      "property");

    // ── Twitter Card
    setMeta('meta[name="twitter:card"]',        "summary_large_image", "name");
    setMeta('meta[name="twitter:title"]',       fullTitle,             "name");
    setMeta('meta[name="twitter:description"]', description,           "name");
    setMeta('meta[name="twitter:image"]',       image,                 "name");

    // ── Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    // ── JSON-LD (page-specific, separate from the global LocalBusiness one)
    const ATTR = "data-page-jsonld";
    let script = document.querySelector<HTMLScriptElement>(`script[${ATTR}]`);
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute(ATTR, "true");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, image, path, type, jsonLd, appendSiteName]);
}
