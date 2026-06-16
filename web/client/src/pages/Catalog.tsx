import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { Filter, X, ArrowRight, ChevronDown, Fuel, Gauge, Calendar, Settings2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicles } from "@/lib/supabase";
import { useSEO } from "@/hooks/useSEO";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";

// Normaliza un vehículo de la base de datos al formato que usan las tarjetas
function toCard(v: {
  id: string; brand: string; model: string; year: number; price: string;
  km: number; fuelType: string; transmission: string; images: string[] | null; status: string;
}) {
  return {
    id: v.id, brand: v.brand, model: v.model, year: v.year,
    price: v.price, km: v.km, fuelType: v.fuelType, transmission: v.transmission,
    image: (v.images && v.images[0]) || FALLBACK_IMG,
    status: v.status,
  };
}

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  km: number;
  fuelType: string;
  transmission: string;
  image: string;
  status: string;
};

const SELECT_STYLE: React.CSSProperties = {
  width: "100%", background: "transparent", border: "none",
  borderBottom: "1.5px solid #E0E0E8", padding: "0.5rem 0",
  fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
  color: "#1D1D1F", outline: "none", appearance: "none", cursor: "pointer",
};

function VehicleCard({ v }: { v: Vehicle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/vehiculo/${v.id}`}>
      <a
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block", textDecoration: "none", background: "#FFFFFF",
          borderRadius: "20px", overflow: "hidden",
          boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.07)",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Photo */}
        <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#F0F0F5" }}>
          <img
            src={v.image}
            alt={`${v.brand} ${v.model}`}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)" }} />
          <div style={{
            position: "absolute", bottom: "14px", left: "14px",
            background: "#0071E3", color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: "800",
            padding: "6px 16px", borderRadius: "50px", letterSpacing: "-0.02em",
          }}>
            {Number(v.price).toLocaleString("es-ES")} €
          </div>
          {v.status !== "available" && (
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              background: v.status === "sold" ? "rgba(30,30,30,0.82)" : "rgba(200,120,0,0.88)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.65rem", fontWeight: "800",
              padding: "4px 10px", borderRadius: "50px",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {v.status === "sold" ? "Vendido" : "Reservado"}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "1.1rem 1.25rem 1.4rem" }}>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: "700", color: "#1D1D1F", margin: "0 0 0.85rem", lineHeight: 1.3 }}>
            {v.brand} {v.model}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 0.75rem" }}>
            {[
              { icon: <Calendar size={11} color="#0071E3" />, label: "Año", val: v.year },
              { icon: <Gauge size={11} color="#0071E3" />, label: "Km", val: v.km.toLocaleString("es-ES") },
              { icon: <Fuel size={11} color="#0071E3" />, label: "Comb.", val: v.fuelType },
              { icon: <Settings2 size={11} color="#0071E3" />, label: "Cambio", val: v.transmission },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {icon}
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#6E6E73" }}>{label}:</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#1D1D1F", fontWeight: "600" }}>{String(val)}</span>
              </div>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "4px", marginTop: "1rem",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#0071E3", fontWeight: "600",
          }}>
            Ver ficha completa <ArrowRight size={12} />
          </div>
        </div>
      </a>
    </Link>
  );
}

export default function Catalog() {
  useSEO({
    title: "Catálogo de Coches de Ocasión en Oviedo",
    description: "Explora nuestro catálogo de vehículos de ocasión en Oviedo: Mercedes, BMW, Audi, Jaguar, Land Rover, Lexus y más. Filtros por marca, precio y combustible. Todos con garantía incluida.",
    path: "/catalogo",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Pre-populate filters from URL query params (e.g. from home page search)
  const [filters, setFilters] = useState(() => {
    const p = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    return {
      brand:        p.get("marca")       ?? "",
      priceMax:     p.get("precio")      ? parseInt(p.get("precio")!) : 50000,
      fuel:         p.get("combustible") ?? "",
      transmission: p.get("cambio")      ?? "",
    };
  });

  const { data: dbVehicles, isLoading } = useQuery({
    queryKey: ["vehicles", "all"],
    queryFn: () => fetchVehicles(),
  });
  const vehicles = (dbVehicles ?? []).map((v) => toCard({
    id: v.id, brand: v.brand, model: v.model, year: v.year,
    price: v.price, km: v.km, fuelType: v.fuel_type,
    transmission: v.transmission, images: v.images, status: v.status,
  }));

  const brands = Array.from(new Set(vehicles.map((v) => v.brand)));
  const fuels = Array.from(new Set(vehicles.map((v) => v.fuelType)));
  const transmissions = Array.from(new Set(vehicles.map((v) => v.transmission)));

  const filtered = vehicles.filter((v) => {
    if (filters.brand && v.brand !== filters.brand) return false;
    if (Number(v.price) > filters.priceMax) return false;
    if (filters.fuel && v.fuelType !== filters.fuel) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    return true;
  });

  const resetFilters = () => setFilters({ brand: "", priceMax: 50000, fuel: "", transmission: "" });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F5F5F7" }}>
      <Navigation />

      {/* Header */}
      <section style={{ background: "#06080F", padding: "5rem 0 4rem", position: "relative", overflow: "hidden" }}>
        <img src="/showroom.jpg" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", opacity: 0.5, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(6,8,15,0.88) 0%, rgba(10,26,58,0.7) 55%, rgba(0,90,200,0.45) 100%)", zIndex: 1 }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.6rem" }}>Catálogo</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: "500", color: "#FFFFFF", margin: "0 0 0.75rem", letterSpacing: "-0.015em" }}>
            Nuestros Vehículos
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
            {filtered.length} vehículos disponibles — garantía y transferencia incluidas
          </p>
        </div>
      </section>

      <div className="container" style={{ flex: 1, padding: "2.5rem 1.25rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem", alignItems: "start" }} className="catalog-grid">

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: "88px" }} className={showFilters ? "sidebar-open" : "sidebar-closed"}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: "700", color: "#1D1D1F", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Filter size={15} color="#0071E3" /> Filtros
                </h3>
                <button onClick={() => setShowFilters(false)} style={{ background: "none", border: "none", color: "#6E6E73", cursor: "pointer" }} className="sidebar-close">
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                {/* Marca */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868B", display: "block", marginBottom: "0.6rem" }}>Marca</label>
                  <div style={{ position: "relative" }}>
                    <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} style={SELECT_STYLE}>
                      <option value="">Todas las marcas</option>
                      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#86868B", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868B", display: "block", marginBottom: "0.6rem" }}>
                    Precio máximo: <span style={{ color: "#0071E3" }}>{filters.priceMax.toLocaleString("es-ES")} €</span>
                  </label>
                  <input type="range" min="5000" max="50000" step="500"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#0071E3" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#86868B", marginTop: "4px" }}>
                    <span>5.000 €</span><span>50.000 €</span>
                  </div>
                </div>

                {/* Combustible */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868B", display: "block", marginBottom: "0.6rem" }}>Combustible</label>
                  <div style={{ position: "relative" }}>
                    <select value={filters.fuel} onChange={(e) => setFilters({ ...filters, fuel: e.target.value })} style={SELECT_STYLE}>
                      <option value="">Todos</option>
                      {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#86868B", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Cambio */}
                <div>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868B", display: "block", marginBottom: "0.6rem" }}>Cambio</label>
                  <div style={{ position: "relative" }}>
                    <select value={filters.transmission} onChange={(e) => setFilters({ ...filters, transmission: e.target.value })} style={SELECT_STYLE}>
                      <option value="">Todos</option>
                      {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#86868B", pointerEvents: "none" }} />
                  </div>
                </div>

                <button onClick={resetFilters} style={{
                  width: "100%", background: "none", border: "1.5px solid #D2D2D7",
                  borderRadius: "50px", padding: "0.65rem",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                  color: "#6E6E73", cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0071E3"; (e.currentTarget as HTMLButtonElement).style.color = "#0071E3"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#D2D2D7"; (e.currentTarget as HTMLButtonElement).style.color = "#6E6E73"; }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#6E6E73", margin: 0 }}>
                <strong style={{ color: "#1D1D1F" }}>{filtered.length}</strong> vehículos encontrados
              </p>
              <button onClick={() => setShowFilters(true)} className="filter-btn-mobile" style={{
                display: "none", alignItems: "center", gap: "6px",
                background: "none", border: "1.5px solid #D2D2D7", borderRadius: "50px",
                padding: "0.5rem 1rem", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem", color: "#1D1D1F", cursor: "pointer",
              }}>
                <Filter size={13} /> Filtros
              </button>
            </div>

            {isLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1.5rem" }}>
                {Array.from({length: 6}).map((_, i) => (
                  <div key={i} style={{ borderRadius: "20px", overflow: "hidden", background: "#E8E8ED", aspectRatio: "4/3", animation: "pulse 1.5s ease-in-out infinite" }} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1.5rem" }}>
                {filtered.map((v) => <VehicleCard key={v.id} v={v} />)}
              </div>
            ) : vehicles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "20px", fontFamily: "'DM Sans', sans-serif" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "#6E6E73" }}>Stock en actualización</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "#6E6E73" }}>Contacta con nosotros para conocer la disponibilidad actual.</p>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "20px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#6E6E73", marginBottom: "1.5rem" }}>
                  No se encontraron vehículos con los filtros seleccionados.
                </p>
                <button onClick={resetFilters} style={{
                  background: "#0071E3", color: "#fff", border: "none",
                  borderRadius: "50px", padding: "0.7rem 1.75rem",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                  fontWeight: "600", cursor: "pointer",
                }}>
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />



      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @media (max-width: 1023px) {
          .catalog-grid { grid-template-columns: 1fr !important; }
          .sidebar-closed { display: none; }
          .sidebar-open { display: block; }
          .filter-btn-mobile { display: flex !important; }
          .sidebar-close { display: block !important; }
        }
        @media (min-width: 1024px) {
          .sidebar-closed { display: block; }
          .sidebar-close { display: none !important; }
        }
      `}</style>
    </div>
  );
}
