import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, Shield, RotateCcw, Star, Phone, CheckCircle, Search, Fuel, Gauge, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicles } from "@/lib/supabase";
import { useSEO } from "@/hooks/useSEO";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";

// Normaliza un vehículo de la base de datos al formato que usan las tarjetas
function toCard(v: {
  id: string; brand: string; model: string; year: number; price: string;
  km: number; fuelType: string; transmission: string; images: string[] | null;
}) {
  return {
    id: v.id, brand: v.brand, model: v.model, year: v.year,
    price: v.price, km: v.km, fuelType: v.fuelType, transmission: v.transmission,
    image: (v.images && v.images[0]) || FALLBACK_IMG,
  };
}

function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
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
};

const BRANDS = ["Mercedes-Benz", "BMW", "Audi", "Peugeot", "Jaguar", "Ford", "Volvo", "Lexus", "Toyota", "Volkswagen", "Seat", "Renault", "Opel", "Hyundai", "Kia"];
const FUELS = ["Diésel", "Gasolina", "Híbrido", "Eléctrico"];
const PRICE_RANGES = [
  { label: "Hasta 10.000 €", value: "10000" },
  { label: "Hasta 15.000 €", value: "15000" },
  { label: "Hasta 20.000 €", value: "20000" },
  { label: "Hasta 30.000 €", value: "30000" },
  { label: "Más de 30.000 €", value: "50000" },
];

const SELECT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  padding: "0.5rem 2rem 0.5rem 0.5rem",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#1D1D1F",
  outline: "none",
  appearance: "none",
  cursor: "pointer",
};

function VehicleCard({ v }: { v: Vehicle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/vehiculo/${v.id}`}>
      <a
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block",
          textDecoration: "none",
          background: "#FFFFFF",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.16)" : "0 4px 20px rgba(0,0,0,0.07)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
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
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
          {/* Price badge */}
          <div style={{
            position: "absolute", bottom: "14px", left: "14px",
            background: "#0071E3", color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: "700",
            padding: "6px 16px", borderRadius: "50px",
            letterSpacing: "-0.02em",
          }}>
            {Number(v.price).toLocaleString("es-ES")} €
          </div>
          {/* Disponible badge */}
          <div style={{
            position: "absolute", top: "12px", right: "12px",
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
            color: "#1a8a4a", fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.7rem", fontWeight: "700",
            padding: "4px 10px", borderRadius: "50px",
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            Disponible
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "1.1rem 1.25rem 1.4rem" }}>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: "700",
            color: "#1D1D1F", margin: "0 0 0.8rem", lineHeight: 1.3,
          }}>
            {v.brand} {v.model}
          </h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#6E6E73" }}>
              <Calendar size={12} color="#0071E3" />{v.year}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#6E6E73" }}>
              <Gauge size={12} color="#0071E3" />{v.km.toLocaleString("es-ES")} km
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#6E6E73" }}>
              <Fuel size={12} color="#0071E3" />{v.fuelType}
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "4px",
            marginTop: "1rem", fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.78rem", color: "#0071E3", fontWeight: "600",
          }}>
            Ver ficha completa <ArrowRight size={12} />
          </div>
        </div>
      </a>
    </Link>
  );
}

export default function Home() {
  useSEO({
    title: "Coches de Ocasión Premium en Oviedo, Asturias",
    description: "Astur Ocasión — Concesionario de vehículos de ocasión en Oviedo. Mercedes, BMW, Audi, Jaguar, Land Rover y más. Todos revisados, con garantía y transferencia incluidas. Sin letra pequeña.",
    path: "/",
  });

  const [, navigate] = useLocation();
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [fuel, setFuel] = useState("");
  useScrollReveal();

  const { data: dbVehicles } = useQuery({
    queryKey: ["vehicles", "available"],
    queryFn: () => fetchVehicles("available"),
  });
  const vehicles = (dbVehicles ?? []).map((v) => toCard({
    id: v.id, brand: v.brand, model: v.model, year: v.year,
    price: v.price, km: v.km, fuelType: v.fuel_type,
    transmission: v.transmission, images: v.images,
  }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand) params.set("marca", brand);
    if (price) params.set("precio", price);
    if (fuel)  params.set("combustible", fuel);
    const qs = params.toString();
    navigate(qs ? `/catalogo?${qs}` : "/catalogo");
  };

  const testimonials = [
    { name: "Carlos M.", location: "Oviedo", text: "Compré un BMW 325D hace seis meses y no puedo estar más satisfecho. El equipo fue transparente desde el primer momento, sin letra pequeña ni sorpresas.", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    { name: "Laura F.", location: "Gijón", text: "Vendí mi coche en menos de 48 horas. Me hicieron la mejor tasación que encontré en Asturias y gestionaron todo el papeleo ellos. Profesionalidad total.", rating: 5, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
    { name: "Andrés P.", location: "Avilés", text: "Buscaba un SUV por encargo y lo encontraron en dos semanas. Precio justo, ITV al día, transferencia incluida. No voy a comprar en ningún otro sitio.", rating: 5, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
      <Navigation />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#06080F" }}>
        {/* Background car image with slow cinematic pan */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <img
            className="lux-hero-pan"
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=90"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%" }}
          />
          {/* Layered cinematic gradients */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(6,8,15,0.92) 0%, rgba(6,8,15,0.65) 52%, rgba(6,8,15,0.2) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,8,15,0.85) 0%, transparent 45%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 20% 40%, rgba(0,90,200,0.18) 0%, transparent 70%)" }} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "6rem 1.25rem 5rem" }}>
          <div style={{ maxWidth: "680px" }}>
            <p className="lux-fade-up" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600",
              letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)",
              marginBottom: "1.5rem", display: "flex", alignItems: "center",
            }}>
              <span className="lux-hairline" style={{ color: "#4DA3FF" }} />
              Oviedo, Asturias — Desde 2010
            </p>
            <h1 className="lux-fade-up lux-delay-1" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              fontWeight: "500",
              color: "#FFFFFF",
              lineHeight: 1.04,
              margin: "0 0 1.5rem",
              letterSpacing: "-0.02em",
            }}>
              El coche que mereces,<br />
              <em style={{ fontStyle: "italic", color: "#4DA3FF", fontWeight: "500" }}>sin concesiones</em>
            </h1>
            <p className="lux-fade-up lux-delay-2" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem",
              color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 2.75rem",
              maxWidth: "480px", fontWeight: 300,
            }}>
              Vehículos de ocasión seleccionados a mano. Garantía, ITV al día y transferencia incluida — con la atención de un trato cercano.
            </p>

            {/* Search widget */}
            <div className="hero-search lux-scale-in lux-delay-3" style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
              padding: "1.25rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: "0",
              alignItems: "center",
              maxWidth: "720px",
            }}>
              <div style={{ position: "relative", borderRight: "1px solid #E8E8ED", paddingRight: "0.5rem" }}>
                <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.63rem", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868B", padding: "0 0.5rem", marginBottom: "1px" }}>Marca</label>
                <div style={{ position: "relative" }}>
                  <select value={brand} onChange={(e) => setBrand(e.target.value)} style={SELECT_STYLE}>
                    <option value="">Todas</option>
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <svg style={{ position: "absolute", right: "0.4rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div style={{ position: "relative", borderRight: "1px solid #E8E8ED", padding: "0 0.5rem" }}>
                <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.63rem", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868B", padding: "0 0.5rem", marginBottom: "1px" }}>Precio</label>
                <div style={{ position: "relative" }}>
                  <select value={price} onChange={(e) => setPrice(e.target.value)} style={SELECT_STYLE}>
                    <option value="">Cualquiera</option>
                    {PRICE_RANGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <svg style={{ position: "absolute", right: "0.4rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div style={{ position: "relative", paddingLeft: "0.5rem" }}>
                <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.63rem", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868B", padding: "0 0.5rem", marginBottom: "1px" }}>Combustible</label>
                <div style={{ position: "relative" }}>
                  <select value={fuel} onChange={(e) => setFuel(e.target.value)} style={SELECT_STYLE}>
                    <option value="">Todos</option>
                    {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <svg style={{ position: "absolute", right: "0.4rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleSearch}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "#0071E3", color: "#FFFFFF", border: "none",
                  borderRadius: "12px", padding: "0.85rem 1.4rem",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "700",
                  cursor: "pointer", whiteSpace: "nowrap", marginLeft: "1rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#005BBF")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#0071E3")}
              >
                <Search size={15} /> Buscar
              </button>
            </div>

            {/* Pills */}
            <div className="lux-fade-up lux-delay-4" style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.75rem" }}>
              {["Garantía incluida", "ITV al día", "Transferencia incluida", "Sin gastos ocultos"].map((item) => (
                <div key={item} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.88)", fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.73rem", fontWeight: "400", padding: "6px 14px", borderRadius: "50px",
                }}>
                  <CheckCircle size={11} color="#4DA3FF" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(120deg, #06080F 0%, #0A1A3A 50%, #0071E3 140%)", padding: "2.25rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
            {[
              { num: "+200", label: "Coches vendidos" },
              { num: "+15 años", label: "De experiencia" },
              { num: "4.9★", label: "Valoración media" },
              { num: "48h", label: "Tasación express" },
            ].map((s, i) => (
              <div key={s.num} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2.1rem)", fontWeight: "500", color: "#FFFFFF", letterSpacing: "-0.01em" }}>{s.num}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 300, letterSpacing: "0.04em", color: "rgba(255,255,255,0.6)", marginTop: "4px", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ───────────────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF", padding: "2.75rem 0", borderBottom: "1px solid #F0F0F5" }}>
        <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", color: "#86868B", margin: "0 0 1.75rem" }}>
          Trabajamos las mejores marcas
        </p>
        <div className="lux-marquee-wrap" style={{ position: "relative", overflow: "hidden", maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)" }}>
          <div className="lux-marquee-track" style={{ display: "flex", alignItems: "center", gap: "3.5rem", width: "max-content" }}>
            {[...BRANDS.slice(0, 12), ...BRANDS.slice(0, 12)].map((b, i) => (
              <span key={i} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: "500", color: "#1D1D1F", opacity: 0.55, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWROOM ────────────────────────────────────────────────────────────── */}
      <section className="reveal" style={{ background: "#F5F5F7", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.6rem", display: "flex", alignItems: "center" }}><span className="lux-hairline" style={{ color: "#0071E3" }} />Stock actual</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.8vw, 2.9rem)", fontWeight: "500", color: "#1D1D1F", margin: 0, letterSpacing: "-0.015em" }}>
                Nuestro Showroom
              </h2>
            </div>
            <Link href="/catalogo">
              <a style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: "600",
                color: "#0071E3", textDecoration: "none",
                border: "1.5px solid #0071E3", borderRadius: "50px",
                padding: "0.55rem 1.25rem",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#0071E3"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#0071E3"; }}
              >
                Ver catálogo completo <ArrowRight size={13} />
              </a>
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {vehicles.map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        </div>
      </section>

      {/* ── PHYSICAL SHOWROOM ───────────────────────────────────────────────────── */}
      <section className="reveal" style={{ background: "#06080F", padding: "0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }} className="lux-split">
          {/* Image */}
          <div style={{ position: "relative", minHeight: "440px", overflow: "hidden" }}>
            <img
              src="/showroom.jpg"
              alt="Exposición de Astur Ocasión en Oviedo"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(6,8,15,0.6) 100%)" }} />
          </div>
          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(3rem, 6vw, 6rem)" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1.25rem", display: "flex", alignItems: "center" }}>
              <span className="lux-hairline" style={{ color: "#4DA3FF" }} />Visítanos en persona
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: "500", color: "#FFFFFF", lineHeight: 1.1, margin: "0 0 1.5rem", letterSpacing: "-0.015em" }}>
              Una exposición<br /><em style={{ fontStyle: "italic", color: "#4DA3FF" }}>a tu disposición</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.02rem", fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 2.25rem", maxWidth: "440px" }}>
              Nuestras instalaciones en Oviedo reúnen una selección permanente de vehículos revisados. Ven a verlos, pruébalos y déjate asesorar sin compromiso.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <a href="https://maps.google.com/?q=Astur+Ocasion+Oviedo" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#0071E3", color: "#FFFFFF", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: "600",
                padding: "0.85rem 1.75rem", borderRadius: "50px", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#005BBF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#0071E3")}
              >
                Cómo llegar <ArrowRight size={15} />
              </a>
              <a href="tel:984180450" className="lux-underline" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>
                <Phone size={15} /> 984 180 450
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST ───────────────────────────────────────────────────────────────── */}
      <section className="reveal" style={{ background: "#FFFFFF", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.6rem" }}>¿Por qué elegirnos?</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.8vw, 2.7rem)", fontWeight: "500", color: "#1D1D1F", margin: 0, letterSpacing: "-0.015em" }}>Compra con total seguridad</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: <Shield size={22} color="#0071E3" />, title: "Garantía incluida", desc: "Todos nuestros vehículos llevan garantía desde el primer día, sin coste adicional." },
              { icon: <CheckCircle size={22} color="#0071E3" />, title: "ITV al día", desc: "Entregamos cada coche con la inspección técnica en vigor y sin defectos." },
              { icon: <RotateCcw size={22} color="#0071E3" />, title: "Transferencia incluida", desc: "Los gastos de transferencia ya están en el precio. Tú solo recoges las llaves." },
              { icon: <Star size={22} color="#0071E3" />, title: "100% revisados", desc: "Revisión mecánica y estética completa antes de cada entrega. Sin sorpresas." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#F5F5F7", borderRadius: "20px", padding: "2rem 1.75rem",
                border: "1px solid rgba(0,0,0,0.05)",
              }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(0,113,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: "700", fontSize: "0.95rem", color: "#1D1D1F", margin: "0 0 0.5rem" }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "#6E6E73", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────────── */}
      <section className="reveal" style={{ background: "#F5F5F7", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.6rem" }}>Opiniones reales</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.8vw, 2.7rem)", fontWeight: "500", color: "#1D1D1F", margin: 0, letterSpacing: "-0.015em" }}>Lo que dicen nuestros clientes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "20px", padding: "2rem" }}>
                <div style={{ color: "#F5A623", fontSize: "1rem", marginBottom: "1rem" }}>{"★".repeat(t.rating)}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", color: "#3D3D3F", lineHeight: 1.75, margin: "0 0 1.5rem", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid #F0F0F5", paddingTop: "1.25rem" }}>
                  <img src={t.photo} alt={t.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "700", color: "#1D1D1F", margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#86868B", margin: "2px 0 0" }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SELL ────────────────────────────────────────────────────────────── */}
      <section className="reveal" style={{ position: "relative", overflow: "hidden", padding: "6rem 0" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,50,120,0.92) 0%, rgba(0,100,220,0.75) 100%)" }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "560px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem" }}>¿Quieres vender tu coche?</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "800", color: "#FFFFFF", margin: "0 0 1rem", letterSpacing: "-0.03em" }}>
              Compramos tu coche<br />al mejor precio
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, margin: "0 0 2.5rem" }}>
              Tasación gratuita en 24h, pago inmediato y gestión de cambio de titularidad incluida sin coste.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/compramos-tu-coche">
                <a style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "#FFFFFF", color: "#0071E3",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: "700",
                  padding: "0.85rem 2rem", borderRadius: "50px", textDecoration: "none",
                }}>
                  Tasar mi vehículo <ArrowRight size={16} />
                </a>
              </Link>
              <a href="tel:984180450" style={{
                display: "flex", alignItems: "center", gap: "8px",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                color: "rgba(255,255,255,0.75)", textDecoration: "none",
              }}>
                <Phone size={15} /> 984 180 450
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ─────────────────────────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF", padding: "5rem 0 0" }}>
        <div className="container" style={{ paddingBottom: "3rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.5rem" }}>Dónde estamos</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "800", color: "#1D1D1F", margin: "0 0 1rem", letterSpacing: "-0.03em" }}>Encuéntranos en Oviedo</h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#6E6E73" }}>
              <span>📍 Oviedo, Asturias</span>
              <a href="tel:984180450" style={{ color: "#0071E3", textDecoration: "none", fontWeight: "600" }}>📞 984 180 450</a>
              <span>⏰ Lun–Vie: 10:00–13:30 / 16:00–20:00</span>
            </div>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.2!2d-5.8448!3d43.3614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDIxJzQxLjAiTiA1wrA1MCc0MS4zIlc!5e0!3m2!1ses!2ses!4v1"
          width="100%" height="400"
          style={{ border: 0, display: "block" }}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Astur Ocasión"
        />
      </section>

      <Footer />

      <style>{`
        @media (max-width: 680px) {
          .hero-search { grid-template-columns: 1fr !important; }
          .hero-search > div { border-right: none !important; border-bottom: 1px solid #E8E8ED; padding: 0.25rem 0 !important; }
          .hero-search button { margin-left: 0 !important; justify-content: center; margin-top: 0.25rem; }
        }
        @media (max-width: 500px) {
          .container > div[style*="repeat(4"] { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 860px) {
          .lux-split { grid-template-columns: 1fr !important; }
          .lux-split > div:first-child { min-height: 300px !important; }
        }
      `}</style>
    </div>
  );
}
