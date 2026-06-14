import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { Filter, X, ArrowRight, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

const SELECT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #D2D2D7",
  padding: "0.5rem 0",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.875rem",
  color: "#1D1D1F",
  outline: "none",
  appearance: "none",
  cursor: "pointer",
};

export default function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    priceMin: 0,
    priceMax: 50000,
    fuel: "",
    transmission: "",
  });

  const { data: vehiclesData, isLoading, isError } = trpc.vehicle.list.useQuery({ status: "available" });
  const allVehicles = vehiclesData ?? [];

  const filteredVehicles = allVehicles.filter((v) => {
    if (filters.brand && v.brand !== filters.brand) return false;
    if (v.price < filters.priceMin || v.price > filters.priceMax) return false;
    if (filters.fuel && v.fuelType !== filters.fuel) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    return true;
  });

  const brands = Array.from(new Set(allVehicles.map((v) => v.brand)));
  const fuels = Array.from(new Set(allVehicles.map((v) => v.fuelType)));
  const transmissions = Array.from(new Set(allVehicles.map((v) => v.transmission)));

  const resetFilters = () =>
    setFilters({ brand: "", priceMin: 0, priceMax: 50000, fuel: "", transmission: "" });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F5F5F7" }}>
      <Navigation />

      {/* Page header */}
      <section
        style={{
          background: "#0071E3",
          padding: "4rem 0 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0,85,179,0.4) 0%, transparent 70%)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Catálogo</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "600",
              color: "#FFFFFF",
              margin: "0 0 0.75rem 0",
            }}
          >
            Nuestros Vehículos
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.65)",
              margin: 0,
            }}
          >
            {allVehicles.length} vehículos disponibles — todos con garantía y transferencia incluidas
          </p>
        </div>
      </section>

      <div className="container" style={{ flex: 1, padding: "2.5rem 1.25rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
          className="catalog-grid"
        >
          {/* Sidebar Filters */}
          <aside
            style={{
              position: "sticky",
              top: "88px",
            }}
            className={showFilters ? "block" : "hidden lg:block"}
          >
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8ED",
                borderRadius: "16px",
                padding: "1.75rem",
                boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1D1D1F",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Filter size={15} color="#0071E3" />
                  Filtros
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{ background: "none", border: "none", color: "#6E6E73", cursor: "pointer" }}
                  className="lg:hidden"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Brand */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E6E73", display: "block", marginBottom: "0.5rem" }}>
                    Marca
                  </label>
                  <div style={{ position: "relative" }}>
                    <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} style={SELECT_STYLE}>
                      <option value="">Todas las marcas</option>
                      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#6E6E73", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E6E73", display: "block", marginBottom: "0.5rem" }}>
                    Precio máximo: <span style={{ color: "#0071E3" }}>{filters.priceMax.toLocaleString("es-ES")} €</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#0071E3" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#86868B", marginTop: "4px" }}>
                    <span>0 €</span><span>50.000 €</span>
                  </div>
                </div>

                {/* Fuel */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E6E73", display: "block", marginBottom: "0.5rem" }}>
                    Combustible
                  </label>
                  <div style={{ position: "relative" }}>
                    <select value={filters.fuel} onChange={(e) => setFilters({ ...filters, fuel: e.target.value })} style={SELECT_STYLE}>
                      <option value="">Todos</option>
                      {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#6E6E73", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E6E73", display: "block", marginBottom: "0.5rem" }}>
                    Cambio
                  </label>
                  <div style={{ position: "relative" }}>
                    <select value={filters.transmission} onChange={(e) => setFilters({ ...filters, transmission: e.target.value })} style={SELECT_STYLE}>
                      <option value="">Todos</option>
                      {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#6E6E73", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={resetFilters}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "1px solid #D2D2D7",
                    borderRadius: "980px",
                    padding: "0.6rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.82rem",
                    color: "#6E6E73",
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                    marginTop: "0.5rem",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0071E3"; (e.currentTarget as HTMLButtonElement).style.color = "#0071E3"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#D2D2D7"; (e.currentTarget as HTMLButtonElement).style.color = "#6E6E73"; }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Vehicles grid */}
          <div>
            {/* Mobile filter toggle + count */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#6E6E73", margin: 0 }}>
                <strong style={{ color: "#1D1D1F" }}>{filteredVehicles.length}</strong> vehículos encontrados
              </p>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "1px solid #D2D2D7",
                  borderRadius: "980px",
                  padding: "0.5rem 1rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  color: "#1D1D1F",
                  cursor: "pointer",
                }}
              >
                <Filter size={13} />
                Filtros
              </button>
            </div>

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#6E6E73" }}>Cargando vehículos...</p>
              </div>
            ) : isError ? (
              <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "16px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#6E6E73" }}>Error al cargar los vehículos. Inténtalo de nuevo.</p>
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {filteredVehicles.map((vehicle) => (
                  <Link key={vehicle.id} href={`/vehiculo/${vehicle.id}`}>
                    <a
                      style={{
                        display: "block",
                        textDecoration: "none",
                        background: "#FFFFFF",
                        borderRadius: "18px",
                        overflow: "hidden",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.14)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)";
                      }}
                    >
                      {/* Image */}
                      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#F5F5F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
                          <rect x="10" y="18" width="60" height="14" rx="4" fill="rgba(0,113,227,0.08)" />
                          <rect x="18" y="8" width="36" height="14" rx="4" fill="rgba(0,113,227,0.12)" />
                          <circle cx="20" cy="34" r="6" fill="rgba(0,113,227,0.15)" />
                          <circle cx="60" cy="34" r="6" fill="rgba(0,113,227,0.15)" />
                        </svg>
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "#0071E3",
                            color: "#FFFFFF",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.78rem",
                            fontWeight: "700",
                            padding: "4px 12px",
                            borderRadius: "980px",
                          }}
                        >
                          {vehicle.price.toLocaleString("es-ES")} €
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: "1.1rem 1.25rem" }}>
                        <h3
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#1D1D1F",
                            margin: "0 0 0.6rem 0",
                            lineHeight: 1.3,
                          }}
                        >
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 1rem" }}>
                          {[
                            ["Año", vehicle.year],
                            ["Km", vehicle.km.toLocaleString("es-ES")],
                            ["Combustible", vehicle.fuel],
                            ["Cambio", vehicle.transmission],
                          ].map(([k, v]) => (
                            <div key={String(k)} style={{ display: "flex", gap: "4px" }}>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.73rem", color: "#86868B" }}>{k}:</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.73rem", color: "#1D1D1F", fontWeight: "500" }}>{String(v)}</span>
                            </div>
                          ))}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "1rem",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.78rem",
                            color: "#0071E3",
                          }}
                        >
                          Ver ficha completa
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "5rem 2rem",
                  background: "#FFFFFF",
                  border: "1px solid #E8E8ED",
                  borderRadius: "16px",
                }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#6E6E73", marginBottom: "1.5rem" }}>
                  No se encontraron vehículos con los filtros seleccionados.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-width catalog grid style override for mobile */}
      <style>{`
        @media (max-width: 1023px) {
          .catalog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/34629574957"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
