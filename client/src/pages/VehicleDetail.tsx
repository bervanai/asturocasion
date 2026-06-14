import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useRoute } from "wouter";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Phone, Mail, MessageCircle, CheckCircle, ArrowLeft, Shield, Gauge, Calendar, Fuel } from "lucide-react";
import { Link } from "wouter";

export default function VehicleDetail() {
  const [, params] = useRoute("/vehiculo/:id");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const vehicle = {
    id: params?.id,
    name: "Mercedes GLE 250D",
    brand: "Mercedes",
    model: "GLE 250D",
    year: 2016,
    price: 26900,
    km: 276000,
    fuel: "Diésel",
    transmission: "Automático",
    color: "Gris Selenita Metalizado",
    seats: 5,
    doors: 5,
    power: "204 CV",
    description: `Un solo titular, todas las revisiones en concesionario oficial Mercedes. AMG Line interior y exterior, sistema de navegación COMAND, faros LED, Key-Less Start, suspensión neumática adaptativa, cambio automático de 9 velocidades, espejos retrovisores eléctricos y retráctiles, control de velocidad activo, llantas en 20", techo panorámico, climatizador bizona de serie.

Vehículo en perfecto estado de funcionamiento. Documentación completa y al día. El precio mostrado incluye el cambio de titularidad, sin ningún coste adicional.`,
    features: [
      "Navegador COMAND",
      "Faros LED",
      "Suspensión Neumática",
      "Cambio Auto 9vel.",
      "Techo Panorámico",
      "Llantas 20\"",
      "Key-Less Start",
      "Control Crucero Activo",
      "Asientos de Cuero",
      "Climatizador Bizona",
      "AMG Line Exterior",
      "AMG Line Interior",
    ],
    images: [
      { label: "Exterior frontal" },
      { label: "Exterior lateral" },
      { label: "Interior" },
      { label: "Motor" },
    ],
  };

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % vehicle.images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + vehicle.images.length) % vehicle.images.length);

  const BRAND_BG = "#1a1a1a";

  const specRows = [
    { label: "Marca", value: vehicle.brand, icon: null },
    { label: "Modelo", value: vehicle.model, icon: null },
    { label: "Año", value: String(vehicle.year), icon: <Calendar size={13} /> },
    { label: "Kilómetros", value: `${vehicle.km.toLocaleString("es-ES")} km`, icon: <Gauge size={13} /> },
    { label: "Combustible", value: vehicle.fuel, icon: <Fuel size={13} /> },
    { label: "Cambio", value: vehicle.transmission, icon: null },
    { label: "Color", value: vehicle.color, icon: null },
    { label: "Potencia", value: vehicle.power, icon: null },
    { label: "Puertas", value: String(vehicle.doors), icon: null },
    { label: "Plazas", value: String(vehicle.seats), icon: null },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f6f2" }}>
      <Navigation />

      {/* Breadcrumb */}
      <div
        style={{
          background: "#0d0f14",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0.75rem 0",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/catalogo">
            <a
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "rgba(248,246,242,0.45)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#e8a020")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,242,0.45)")}
            >
              <ArrowLeft size={12} />
              Volver al catálogo
            </a>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>/</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(248,246,242,0.3)" }}>
            {vehicle.name}
          </span>
        </div>
      </div>

      <div className="container" style={{ flex: 1, paddingTop: "2.5rem", paddingBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "2.5rem",
            alignItems: "start",
          }}
          className="vehicle-detail-grid"
        >
          {/* Left column */}
          <div>
            {/* Gallery */}
            <div
              style={{
                position: "relative",
                background: "#161a23",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
            >
              {/* Main image */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  background: `linear-gradient(135deg, ${BRAND_BG}cc 0%, #0d0f14 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <svg width="120" height="60" viewBox="0 0 80 40" fill="none">
                  <rect x="10" y="18" width="60" height="14" rx="4" fill="rgba(255,255,255,0.08)" />
                  <rect x="18" y="8" width="36" height="14" rx="4" fill="rgba(255,255,255,0.12)" />
                  <circle cx="20" cy="34" r="6" fill="rgba(255,255,255,0.15)" />
                  <circle cx="60" cy="34" r="6" fill="rgba(255,255,255,0.15)" />
                  <rect x="2" y="22" width="8" height="6" rx="2" fill="rgba(232,160,32,0.4)" />
                  <rect x="70" y="22" width="8" height="6" rx="2" fill="rgba(232,160,32,0.4)" />
                </svg>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {vehicle.images[currentImageIndex].label}
                </span>

                {/* Nav buttons */}
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "50%", width: "40px", height: "40px", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#f8f6f2",
                    cursor: "pointer", transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(232,160,32,0.8)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)")}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "50%", width: "40px", height: "40px", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#f8f6f2",
                    cursor: "pointer", transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(232,160,32,0.8)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)")}
                >
                  <ChevronRight size={18} />
                </button>

                <div
                  style={{
                    position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.6)", borderRadius: "100px",
                    padding: "3px 12px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#f8f6f2",
                  }}
                >
                  {currentImageIndex + 1} / {vehicle.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div style={{ display: "flex", gap: "6px", padding: "0.75rem" }}>
                {vehicle.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    style={{
                      flex: 1,
                      aspectRatio: "16/10",
                      background: `linear-gradient(135deg, ${BRAND_BG}cc 0%, #0d0f14 100%)`,
                      border: i === currentImageIndex ? "2px solid #e8a020" : "2px solid transparent",
                      borderRadius: "3px",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e8e4dc",
                borderRadius: "4px",
                padding: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  color: "#0d0f14",
                  marginBottom: "1.25rem",
                }}
              >
                Descripción
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem",
                  color: "#6b6456",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                  marginBottom: "2rem",
                }}
              >
                {vehicle.description}
              </p>

              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6b6456",
                  marginBottom: "1rem",
                }}
              >
                Equipamiento destacado
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "0.6rem",
                }}
              >
                {vehicle.features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem",
                      color: "#0d0f14",
                    }}
                  >
                    <CheckCircle size={13} color="#e8a020" style={{ flexShrink: 0 }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            {/* Price */}
            <div
              style={{
                background: "#0d0f14",
                borderRadius: "4px",
                padding: "1.75rem",
                marginBottom: "1rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, #e8a020, #c9a84c)",
                }}
              />
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(248,246,242,0.4)",
                  marginBottom: "0.4rem",
                }}
              >
                Precio de venta
              </p>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.8rem",
                  fontWeight: "700",
                  color: "#e8a020",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {vehicle.price.toLocaleString("es-ES")} €
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(248,246,242,0.35)",
                  marginBottom: "1.5rem",
                }}
              >
                Transferencia y garantía incluidas en el precio
              </p>

              <a href="tel:984180450" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: "0.75rem", display: "flex" }}>
                <Phone size={15} />
                Llamar: 984 180 450
              </a>
              <a
                href="https://wa.me/34629574957"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#25d366",
                  color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  padding: "0.75rem",
                  borderRadius: "2px",
                  textDecoration: "none",
                  transition: "background 0.2s",
                  marginBottom: "0.75rem",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#20b858")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#25d366")}
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
              <a
                href="mailto:info@asturocasion.es"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(248,246,242,0.7)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  padding: "0.75rem",
                  borderRadius: "2px",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,160,32,0.4)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)")}
              >
                <Mail size={15} />
                Enviar email
              </a>
            </div>

            {/* Specs */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e8e4dc",
                borderRadius: "4px",
                padding: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6b6456",
                  marginBottom: "1.25rem",
                }}
              >
                Ficha Técnica
              </h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {specRows.map((row, i) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.6rem 0",
                      borderBottom: i < specRows.length - 1 ? "1px solid #f0ece4" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem",
                        color: "#9a9080",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {row.icon}
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem",
                        fontWeight: "500",
                        color: "#0d0f14",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div
              style={{
                background: "rgba(232,160,32,0.05)",
                border: "1px solid rgba(232,160,32,0.2)",
                borderRadius: "4px",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <Shield size={15} color="#e8a020" />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: "600", color: "#0d0f14" }}>Incluido en el precio</span>
              </div>
              {[
                "100% revisado, perfecto estado",
                "ITV al día",
                "Cambio de titularidad gratuito",
                "Garantía incluida",
                "Financiación disponible",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#6b6456" }}>
                  <CheckCircle size={12} color="#e8a020" style={{ flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .vehicle-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />

      <a href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
