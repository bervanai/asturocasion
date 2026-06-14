import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ArrowRight, Shield, RotateCcw, Star, Phone, CheckCircle, Search, Fuel, Gauge, Calendar } from "lucide-react";

// ─── Demo vehicles (hardcoded for demo, replaced by DB data when connected) ───
const DEMO_VEHICLES = [
  {
    id: "1",
    brand: "Mercedes-Benz",
    model: "GLE 250D 4Matic",
    year: 2016,
    price: "26900",
    km: 276000,
    fuelType: "Diésel",
    transmission: "Automático",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    brand: "BMW",
    model: "325D GT Gran Turismo",
    year: 2017,
    price: "23500",
    km: 157000,
    fuelType: "Diésel",
    transmission: "Automático",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    brand: "Audi",
    model: "Q5 2.0 TDI quattro S-line",
    year: 2015,
    price: "21500",
    km: 180000,
    fuelType: "Diésel",
    transmission: "Automático",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    brand: "Jaguar",
    model: "XF R-Sport 2.0D AWD",
    year: 2017,
    price: "20900",
    km: 162000,
    fuelType: "Diésel",
    transmission: "Automático",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    brand: "Peugeot",
    model: "3008 2.0 HDI Allure",
    year: 2014,
    price: "12900",
    km: 33000,
    fuelType: "Diésel",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    brand: "Volvo",
    model: "XC60 D4 Inscription",
    year: 2019,
    price: "29900",
    km: 75000,
    fuelType: "Diésel",
    transmission: "Automático",
    image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80",
  },
];

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

function VehicleCard({ v }: { v: typeof DEMO_VEHICLES[0] }) {
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
  const [, navigate] = useLocation();
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [fuel, setFuel] = useState("");

  const handleSearch = () => navigate("/catalogo");

  const testimonials = [
    { name: "Carlos M.", location: "Oviedo", text: "Compré un BMW 325D hace seis meses y no puedo estar más satisfecho. El equipo fue transparente desde el primer momento, sin letra pequeña ni sorpresas.", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    { name: "Laura F.", location: "Gijón", text: "Vendí mi coche en menos de 48 horas. Me hicieron la mejor tasación que encontré en Asturias y gestionaron todo el papeleo ellos. Profesionalidad total.", rating: 5, photo: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=80&h=80&fit=crop&crop=face" },
    { name: "Andrés P.", location: "Avilés", text: "Buscaba un SUV por encargo y lo encontraron en dos semanas. Precio justo, ITV al día, transferencia incluida. No voy a comprar en ningún otro sitio.", rating: 5, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
      <Navigation />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "600px", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background car image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,20,0.88) 0%, rgba(10,10,20,0.55) 60%, rgba(10,10,20,0.15) 100%)" }} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "5rem 1.25rem 4rem" }}>
          <div style={{ maxWidth: "640px" }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: "700",
              letterSpacing: "0.15em", textTransform: "uppercase", color: "#4DA3FF",
              marginBottom: "1rem",
            }}>
              Oviedo, Asturias — Desde 2010
            </p>
            <h1 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: "800",
              color: "#FFFFFF",
              lineHeight: 1.08,
              margin: "0 0 1.25rem",
              letterSpacing: "-0.035em",
            }}>
              Tu Próximo Coche<br />
              <span style={{ color: "#4DA3FF" }}>te está esperando</span>
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem",
              color: "rgba(255,255,255,0.72)", lineHeight: 1.65, margin: "0 0 2.5rem",
              maxWidth: "460px",
            }}>
              Vehículos de ocasión premium con garantía, ITV al día y transferencia incluida. Sin letra pequeña.
            </p>

            {/* Search widget */}
            <div style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              borderRadius: "18px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
              padding: "1.25rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: "0",
              alignItems: "center",
              maxWidth: "700px",
            }} className="hero-search">
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.5rem" }}>
              {["Garantía incluida", "ITV al día", "Transferencia incluida", "Sin gastos ocultos"].map((item) => (
                <div key={item} style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem", fontWeight: "500", padding: "5px 12px", borderRadius: "50px",
                }}>
                  <CheckCircle size={10} color="#4DA3FF" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#0071E3", padding: "1.5rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
            {[
              { num: "+200", label: "Coches vendidos" },
              { num: "+15 años", label: "De experiencia" },
              { num: "4.9★", label: "Valoración media" },
              { num: "48h", label: "Tasación express" },
            ].map((s) => (
              <div key={s.num}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.03em" }}>{s.num}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWROOM ────────────────────────────────────────────────────────────── */}
      <section style={{ background: "#F5F5F7", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.4rem" }}>Stock actual</p>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: "800", color: "#1D1D1F", margin: 0, letterSpacing: "-0.03em" }}>
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
            {DEMO_VEHICLES.map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        </div>
      </section>

      {/* ── TRUST ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.5rem" }}>¿Por qué elegirnos?</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: "800", color: "#1D1D1F", margin: 0, letterSpacing: "-0.03em" }}>Compra con total seguridad</h2>
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
      <section style={{ background: "#F5F5F7", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.5rem" }}>Opiniones reales</p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: "800", color: "#1D1D1F", margin: 0, letterSpacing: "-0.03em" }}>Lo que dicen nuestros clientes</h2>
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
      <section style={{ position: "relative", overflow: "hidden", padding: "6rem 0" }}>
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

      <a href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>

      <style>{`
        @media (max-width: 680px) {
          .hero-search { grid-template-columns: 1fr !important; }
          .hero-search > div { border-right: none !important; border-bottom: 1px solid #E8E8ED; padding: 0.25rem 0 !important; }
          .hero-search button { margin-left: 0 !important; justify-content: center; margin-top: 0.25rem; }
        }
        @media (max-width: 500px) {
          .container > div[style*="repeat(4"] { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
