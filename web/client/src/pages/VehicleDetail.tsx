import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useRoute } from "wouter";
import { Phone, Mail, MessageCircle, CheckCircle, ArrowLeft, Shield, Gauge, Calendar, Fuel, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicleById } from "@/lib/supabase";
import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";

const BRAND_IMAGES: Record<string, string> = {
  "Mercedes": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  "Mercedes-Benz": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  "BMW": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
  "Audi": "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
  "Peugeot": "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80",
  "Jaguar": "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
  "Volkswagen": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
};

export default function VehicleDetail() {
  const [, params] = useRoute("/vehiculo/:id");
  const vehicleId = params?.id ?? "";

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchVehicleById(vehicleId),
    enabled: vehicleId.length > 0,
  });

  const [activeIdx, setActiveIdx] = useState(0);

  useSEO({
    title: vehicle
      ? `${vehicle.brand} ${vehicle.model} ${vehicle.year} — ${Number(vehicle.price).toLocaleString("es-ES")}€`
      : "Detalle de Vehículo",
    description: vehicle
      ? `${vehicle.brand} ${vehicle.model} (${vehicle.year}) en venta en Oviedo, Asturias. ${vehicle.km.toLocaleString("es-ES")} km · ${vehicle.fuel_type} · ${vehicle.transmission}. Precio: ${Number(vehicle.price).toLocaleString("es-ES")}€. Garantía y transferencia incluidas.`
      : "Ficha de vehículo de ocasión en Astur Ocasión, Oviedo.",
    image: vehicle?.images?.[0] ?? undefined,
    path: `/vehiculo/${vehicleId}`,
    type: "product",
    jsonLd: vehicle
      ? {
          "@context": "https://schema.org",
          "@type": "Car",
          "name": `${vehicle.brand} ${vehicle.model}`,
          "brand": { "@type": "Brand", "name": vehicle.brand },
          "model": vehicle.model,
          "vehicleModelDate": String(vehicle.year),
          "mileageFromOdometer": { "@type": "QuantitativeValue", "value": vehicle.km, "unitCode": "KMT" },
          "fuelType": vehicle.fuel_type,
          "vehicleTransmission": vehicle.transmission,
          ...(vehicle.power_cv ? { "vehicleEngine": { "@type": "EngineSpecification", "enginePower": { "@type": "QuantitativeValue", "value": vehicle.power_cv, "unitCode": "BHP" } } } : {}),
          "color": vehicle.color ?? undefined,
          "description": vehicle.description ?? undefined,
          "image": vehicle.images?.[0] ?? undefined,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": vehicle.price,
            "availability": vehicle.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": { "@type": "AutoDealer", "name": "Astur Ocasión", "url": "https://www.asturocasion.es" },
          },
          "url": `https://www.asturocasion.es/vehiculo/${vehicleId}`,
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f6f2" }}>
        <Navigation />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#6b6456" }}>Cargando vehículo...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f6f2" }}>
        <Navigation />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#6b6456" }}>Vehículo no encontrado.</p>
          <Link href="/catalogo"><a className="btn-primary">Volver al catálogo</a></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imgs = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : [BRAND_IMAGES[vehicle.brand] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"];
  const clampedIdx = Math.min(activeIdx, imgs.length - 1);

  const specRows = [
    { label: "Marca", value: vehicle.brand, icon: null },
    { label: "Modelo", value: vehicle.model, icon: null },
    { label: "Año", value: String(vehicle.year), icon: <Calendar size={13} /> },
    { label: "Kilómetros", value: `${vehicle.km.toLocaleString("es-ES")} km`, icon: <Gauge size={13} /> },
    { label: "Combustible", value: vehicle.fuel_type, icon: <Fuel size={13} /> },
    { label: "Cambio", value: vehicle.transmission, icon: null },
    ...(vehicle.power_cv ? [{ label: "Potencia", value: `${vehicle.power_cv} CV`, icon: null }] : []),
    ...(vehicle.color ? [{ label: "Color", value: vehicle.color, icon: null }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f6f2" }}>
      <Navigation />

      {/* ── HERO: foto a pantalla completa con overlay ── */}
      <div style={{ position: "relative", width: "100%", background: "#0d0f14" }}>
        {/* Imagen principal */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", minHeight: "280px", maxHeight: "600px", overflow: "hidden" }}>
          <img
            key={imgs[clampedIdx]}
            src={imgs[clampedIdx]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"; }}
          />
          {/* Gradiente oscuro encima de la foto */}
          <div className="hero-gradient" style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 40%, rgba(13,15,20,0.85) 100%)",
          }} />

          {/* Botón volver (esquina superior izquierda) */}
          <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
            <Link href="/catalogo">
              <a style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: "500",
                color: "rgba(255,255,255,0.85)", textDecoration: "none",
                background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "99px", padding: "0.4rem 0.9rem",
              }}>
                <ArrowLeft size={13} /> Volver al catálogo
              </a>
            </Link>
          </div>

          {/* Contador de fotos */}
          {imgs.length > 1 && (
            <div style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
              borderRadius: "99px", padding: "0.25rem 0.7rem",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)",
            }}>
              {clampedIdx + 1} / {imgs.length}
            </div>
          )}

          {/* Flechas prev/next */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
              ><ChevronLeft size={20} /></button>
              <button
                onClick={() => setActiveIdx((i) => (i + 1) % imgs.length)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
              ><ChevronRight size={20} /></button>
            </>
          )}

          {/* Overlay inferior: nombre + precio + botones — SOLO DESKTOP */}
          <div className="hero-overlay" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem" }}>
            <div className="hero-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
              {/* Nombre del coche */}
              <h1 className="hero-title" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                fontWeight: "700",
                color: "#ffffff",
                margin: "0 0 0.5rem 0",
                lineHeight: 1.1,
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}>
                {vehicle.brand} {vehicle.model}
              </h1>

              {/* Tags rápidos */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {[String(vehicle.year), `${vehicle.km.toLocaleString("es-ES")} km`, vehicle.fuel_type, vehicle.transmission].map((tag) => (
                  <span key={tag} style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "500",
                    color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)", borderRadius: "99px", padding: "0.2rem 0.65rem",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>{tag}</span>
                ))}
              </div>

              {/* Precio + botones en la misma fila */}
              <div className="hero-cta" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  fontWeight: "700",
                  color: "#e8a020",
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}>
                  {Number(vehicle.price).toLocaleString("es-ES")} €
                </span>
                <div className="hero-buttons" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <a href="tel:629574957" className="btn-primary hero-btn" style={{ gap: "6px" }}>
                    <Phone size={14} /> Llamar
                  </a>
                  <a
                    href="https://wa.me/34629574957"
                    target="_blank" rel="noopener noreferrer"
                    className="hero-btn"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#25d366", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", padding: "0.6rem 1.1rem", borderRadius: "2px", textDecoration: "none" }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a
                    href="mailto:asturocasion@gmail.com"
                    className="hero-btn"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "500", padding: "0.6rem 1.1rem", borderRadius: "2px", textDecoration: "none", backdropFilter: "blur(4px)" }}
                  >
                    <Mail size={14} /> Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Miniaturas debajo del hero */}
        {imgs.length > 1 && (
          <div style={{ background: "#0d0f14", padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", overflowX: "auto" }}>
            {imgs.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveIdx(i)}
                style={{
                  flexShrink: 0, width: "80px", height: "54px",
                  borderRadius: "4px", overflow: "hidden",
                  border: `2px solid ${i === clampedIdx ? "#e8a020" : "transparent"}`,
                  cursor: "pointer", padding: 0, background: "#1a1c23",
                  opacity: i === clampedIdx ? 1 : 0.55, transition: "all 0.15s",
                }}
              >
                <img src={src} alt={`Vista ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=60"; }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Info móvil: nombre + precio + botones — SOLO MOBILE, fuera de la foto */}
        <div className="hero-mobile-info" style={{ display: "none" }}>
          <div style={{ padding: "1.1rem 1rem 0.25rem" }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: "700",
              color: "#fff", margin: "0 0 0.5rem 0", lineHeight: 1.15,
            }}>
              {vehicle.brand} {vehicle.model}
            </h1>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
              {[String(vehicle.year), `${vehicle.km.toLocaleString("es-ES")} km`, vehicle.fuel_type, vehicle.transmission].map((tag) => (
                <span key={tag} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: "500",
                  color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.12)",
                  borderRadius: "99px", padding: "0.18rem 0.6rem",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}>{tag}</span>
              ))}
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: "700", color: "#e8a020", margin: "0 0 1rem 0" }}>
              {Number(vehicle.price).toLocaleString("es-ES")} €
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", padding: "0 1rem 1rem" }}>
            <a href="tel:629574957" className="btn-primary" style={{ justifyContent: "center", gap: "6px" }}>
              <Phone size={14} /> Llamar
            </a>
            <a
              href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#25d366", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", padding: "0.65rem", borderRadius: "2px", textDecoration: "none" }}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href="mailto:asturocasion@gmail.com"
              style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "500", padding: "0.65rem", borderRadius: "2px", textDecoration: "none" }}
            >
              <Mail size={14} /> Enviar email
            </a>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL: columna única centrada ── */}
      <div style={{ flex: 1 }}>
        <div className="vd-body" style={{ maxWidth: "860px", margin: "0 auto", padding: "2.5rem 1.5rem 3rem" }}>

          {/* Ficha técnica */}
          <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "8px", overflow: "hidden", marginBottom: "1.5rem" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0ece4", display: "flex", alignItems: "center", gap: "8px" }}>
              <Gauge size={15} color="#e8a020" />
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6456", margin: 0 }}>
                Ficha Técnica
              </h2>
            </div>
            <div className="spec-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {specRows.map((row, i) => (
                <div key={row.label} style={{
                  display: "flex", flexDirection: "column", padding: "0.9rem 1.5rem",
                  borderBottom: i < specRows.length - 2 ? "1px solid #f0ece4" : "none",
                  borderRight: i % 2 === 0 ? "1px solid #f0ece4" : "none",
                }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", color: "#9a9080", display: "flex", alignItems: "center", gap: "4px", marginBottom: "0.2rem" }}>
                    {row.icon}{row.label}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: "600", color: "#0d0f14" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: "600", color: "#0d0f14", marginBottom: "1rem" }}>
              Descripción
            </h2>
            {vehicle.description ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#6b6456", lineHeight: 1.8, whiteSpace: "pre-line", margin: 0 }}>
                {vehicle.description}
              </p>
            ) : (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#9a9080", fontStyle: "italic", margin: 0 }}>
                Sin descripción disponible.
              </p>
            )}
          </div>

          {/* Incluido en el precio */}
          <div style={{ background: "rgba(232,160,32,0.05)", border: "1px solid rgba(232,160,32,0.25)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
              <Shield size={16} color="#e8a020" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: "700", color: "#0d0f14" }}>Incluido en el precio</span>
            </div>
            <div className="guarantees-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {["100% revisado, perfecto estado", "ITV al día", "Cambio de titularidad gratuito", "Garantía incluida", "Financiación disponible"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#6b6456" }}>
                  <CheckCircle size={13} color="#e8a020" style={{ flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* CTA final */}
          <div style={{ background: "#0d0f14", borderRadius: "8px", padding: "2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #e8a020, #c9a84c)" }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>¿Te interesa?</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: "600", color: "#fff", marginBottom: "1.5rem" }}>Contacta ahora y te lo reservamos</p>
            <div className="cta-buttons" style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:629574957" className="btn-primary" style={{ gap: "7px" }}>
                <Phone size={15} /> Llamar: 629 574 957
              </a>
              <a
                href="https://wa.me/34629574957"
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#25d366", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", padding: "0.7rem 1.25rem", borderRadius: "2px", textDecoration: "none" }}
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href="mailto:asturocasion@gmail.com"
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "500", padding: "0.7rem 1.25rem", borderRadius: "2px", textDecoration: "none" }}
              >
                <Mail size={15} /> Enviar email
              </a>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          /* Ocultar overlay dentro de la foto en móvil */
          .hero-overlay { display: none !important; }
          /* Mostrar bloque de info debajo de la foto */
          .hero-mobile-info { display: block !important; background: #0d0f14; }
          /* Foto sin gradiente oscuro en móvil (ya no hay texto encima) */
          .hero-gradient { opacity: 0 !important; }
          /* Spec grid en 1 columna */
          .spec-grid { grid-template-columns: 1fr !important; }
          .spec-grid > div { border-right: none !important; }
          .guarantees-grid { grid-template-columns: 1fr !important; }
          .cta-buttons { flex-direction: column !important; }
          .cta-buttons a { justify-content: center; }
          .vd-body { padding: 1.5rem 1rem 2rem !important; }
        }
        @media (min-width: 601px) {
          /* En desktop: overlay visible, bloque móvil oculto */
          .hero-overlay { display: block !important; }
          .hero-mobile-info { display: none !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
}
