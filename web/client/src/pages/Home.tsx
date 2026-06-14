import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Shield, RotateCcw, Star, Phone, CheckCircle, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

/* ---- Animated counter hook ---- */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StatItem({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCounter(value, 1800, start);
  return (
    <div style={{ textAlign: "center" }}>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

const BRANDS = ["Mercedes", "BMW", "Audi", "Peugeot", "Jaguar", "Ford", "Volvo", "Lexus", "Toyota", "Volkswagen", "Seat", "Renault", "Opel", "Hyundai", "Kia"];
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
  padding: "0.55rem 2rem 0.55rem 0.75rem",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#1D1D1F",
  outline: "none",
  appearance: "none",
  cursor: "pointer",
};

export default function Home() {
  const statsRef = useInView(0.3);
  const [, navigate] = useLocation();
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [fuel, setFuel] = useState("");

  const { data: vehiclesData } = trpc.vehicle.list.useQuery({ status: "Disponible" });
  const vehicles = (vehiclesData ?? []).slice(0, 8);

  const handleSearch = () => {
    navigate("/catalogo");
  };

  const testimonials = [
    { name: "Carlos M.", location: "Oviedo", text: "Compré un BMW 325D hace seis meses y no puedo estar más satisfecho. El equipo fue transparente desde el primer momento, sin letra pequeña ni sorpresas.", rating: 5 },
    { name: "Laura F.", location: "Gijón", text: "Vendí mi coche en menos de 48 horas. Me hicieron la mejor tasación que encontré en Asturias y gestionaron todo el papeleo ellos. Profesionalidad total.", rating: 5 },
    { name: "Andrés P.", location: "Avilés", text: "Buscaba un SUV por encargo y lo encontraron en dos semanas. Precio justo, ITV al día, transferencia incluida. No voy a comprar en ningún otro sitio.", rating: 5 },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
      <Navigation />

      {/* ================================================================
          HERO — Filter above the fold
          ================================================================ */}
      <section style={{ background: "#FFFFFF", padding: "4rem 0 3rem" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.75rem" }}>
              Oviedo, Asturias
            </p>
            <h1
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: "700",
                color: "#1D1D1F",
                lineHeight: 1.1,
                margin: "0 auto 1rem",
                letterSpacing: "-0.03em",
                maxWidth: "640px",
              }}
            >
              Encuentra tu coche
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#6E6E73", margin: "0 auto", maxWidth: "480px", lineHeight: 1.6 }}>
              Elige marca, precio o tipo de combustible y encuentra el vehículo perfecto para ti.
            </p>
          </div>

          {/* Search widget */}
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              background: "#FFFFFF",
              border: "1px solid #E8E8ED",
              borderRadius: "20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
              padding: "1.5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: "0",
              alignItems: "center",
            }}
            className="search-widget"
          >
            {/* Marca */}
            <div style={{ position: "relative", borderRight: "1px solid #E8E8ED", paddingRight: "0.5rem" }}>
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#86868B", padding: "0 0.75rem", marginBottom: "2px" }}>Marca</label>
              <div style={{ position: "relative" }}>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} style={SELECT_STYLE}>
                  <option value="">Todas las marcas</option>
                  {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <svg style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Precio */}
            <div style={{ position: "relative", borderRight: "1px solid #E8E8ED", padding: "0 0.5rem" }}>
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#86868B", padding: "0 0.75rem", marginBottom: "2px" }}>Precio</label>
              <div style={{ position: "relative" }}>
                <select value={price} onChange={(e) => setPrice(e.target.value)} style={SELECT_STYLE}>
                  <option value="">Cualquier precio</option>
                  {PRICE_RANGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <svg style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Combustible */}
            <div style={{ position: "relative", paddingLeft: "0.5rem" }}>
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#86868B", padding: "0 0.75rem", marginBottom: "2px" }}>Combustible</label>
              <div style={{ position: "relative" }}>
                <select value={fuel} onChange={(e) => setFuel(e.target.value)} style={SELECT_STYLE}>
                  <option value="">Todos</option>
                  {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <svg style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#0071E3",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                padding: "0.9rem 1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
                whiteSpace: "nowrap",
                marginLeft: "1rem",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#0077ED")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#0071E3")}
            >
              <Search size={16} />
              BUSCAR
            </button>
          </div>

          {/* Guarantee pills */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem", marginTop: "1.75rem" }}>
            {["Transferencia incluida", "ITV al día", "Garantía incluida", "Precio final, sin sorpresas"].map((item) => (
              <div key={item} className="guarantee-pill">
                <CheckCircle size={11} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SHOWROOM — Vehicle grid
          ================================================================ */}
      <section style={{ background: "#F5F5F7", padding: "4rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#1D1D1F", margin: 0, letterSpacing: "-0.02em" }}>
                Showroom
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#6E6E73", margin: "4px 0 0" }}>
                Estos son los modelos que tenemos en venta
              </p>
            </div>
            <Link href="/catalogo">
              <a className="btn-outline" style={{ flexShrink: 0 }}>
                Ver todos
                <ArrowRight size={14} />
              </a>
            </Link>
          </div>

          {vehicles.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {vehicles.map((v) => (
                <Link key={v.id} href={`/vehiculo/${v.id}`}>
                  <a
                    style={{
                      display: "block",
                      textDecoration: "none",
                      background: "#FFFFFF",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #E8E8ED",
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ position: "relative", aspectRatio: "16/10", background: "#F5F5F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="80" height="40" viewBox="0 0 80 40" fill="none" opacity="0.3">
                        <rect x="10" y="18" width="60" height="14" rx="4" fill="#0071E3" />
                        <rect x="18" y="8" width="36" height="14" rx="4" fill="#0071E3" />
                        <circle cx="20" cy="34" r="6" fill="#0071E3" />
                        <circle cx="60" cy="34" r="6" fill="#0071E3" />
                      </svg>
                      <div style={{ position: "absolute", top: "10px", left: "10px", background: "#1D1D1F", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: "700", padding: "4px 10px", borderRadius: "6px" }}>
                        {v.price.toLocaleString("es-ES")}€
                      </div>
                    </div>
                    <div style={{ padding: "1rem 1.1rem 1.25rem" }}>
                      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: "600", color: "#1D1D1F", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                        {v.brand} {v.model}
                      </h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#86868B", margin: 0 }}>
                        {v.year} · {v.km.toLocaleString("es-ES")} km · {v.fuel}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            /* Fallback sample cards while loading */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {[
                { name: "Mercedes GLE 250D", year: 2016, price: 26900, km: 276000, fuel: "Diésel" },
                { name: "Mercedes SLK 300", year: 2010, price: 18500, km: 145000, fuel: "Gasolina" },
                { name: "Peugeot 3008 2.0HDI", year: 2014, price: 12900, km: 33000, fuel: "Diésel" },
                { name: "Jaguar XF R-Sport", year: 2017, price: 20900, km: 162000, fuel: "Diésel" },
                { name: "BMW 325D GT", year: 2017, price: 23500, km: 157000, fuel: "Diésel" },
                { name: "Audi Q5 2.0TDI", year: 2015, price: 21500, km: 180000, fuel: "Diésel" },
              ].map((v, i) => (
                <Link key={i} href="/catalogo">
                  <a
                    style={{
                      display: "block",
                      textDecoration: "none",
                      background: "#FFFFFF",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #E8E8ED",
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ position: "relative", aspectRatio: "16/10", background: "#F5F5F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="80" height="40" viewBox="0 0 80 40" fill="none" opacity="0.25">
                        <rect x="10" y="18" width="60" height="14" rx="4" fill="#0071E3" />
                        <rect x="18" y="8" width="36" height="14" rx="4" fill="#0071E3" />
                        <circle cx="20" cy="34" r="6" fill="#0071E3" />
                        <circle cx="60" cy="34" r="6" fill="#0071E3" />
                      </svg>
                      <div style={{ position: "absolute", top: "10px", left: "10px", background: "#1D1D1F", color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: "700", padding: "4px 10px", borderRadius: "6px" }}>
                        {v.price.toLocaleString("es-ES")}€
                      </div>
                    </div>
                    <div style={{ padding: "1rem 1.1rem 1.25rem" }}>
                      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: "600", color: "#1D1D1F", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                        {v.name}
                      </h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#86868B", margin: 0 }}>
                        {v.year} · {v.km.toLocaleString("es-ES")} km · {v.fuel}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          STATS BAR
          ================================================================ */}
      <section ref={statsRef.ref} style={{ background: "#0071E3", padding: "3.5rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem" }}>
            <StatItem value={200} suffix="+" label="Vehículos vendidos" start={statsRef.inView} />
            <StatItem value={15} suffix="" label="Años de experiencia" start={statsRef.inView} />
            <StatItem value={98} suffix="%" label="Clientes satisfechos" start={statsRef.inView} />
            <StatItem value={4.9} suffix="★" label="Valoración media" start={statsRef.inView} />
          </div>
        </div>
      </section>

      {/* ================================================================
          TRUST STRIP
          ================================================================ */}
      <section style={{ background: "#FFFFFF", padding: "4rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "center" }}>
            {[
              { icon: <Shield size={20} color="#0071E3" />, title: "Garantía incluida", desc: "Todos nuestros coches llevan garantía desde el primer día." },
              { icon: <CheckCircle size={20} color="#0071E3" />, title: "ITV al día", desc: "Entregamos cada vehículo con la inspección técnica en vigor." },
              { icon: <RotateCcw size={20} color="#0071E3" />, title: "Transfer incluido", desc: "Los gastos de transferencia ya están en el precio marcado." },
              { icon: <Star size={20} color="#0071E3" />, title: "100% revisados", desc: "Revisión mecánica y estética completa antes de la entrega." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(0,113,227,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: "700", fontSize: "0.9rem", color: "#1D1D1F", marginBottom: "3px" }}>{item.title}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#6E6E73", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      <section style={{ background: "#F5F5F7", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.5rem" }}>
              Reputación
            </p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: "700", color: "#1D1D1F", margin: 0, letterSpacing: "-0.02em" }}>
              Lo que Dicen Nuestros Clientes
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "16px", padding: "1.75rem" }}>
                <div style={{ color: "#0071E3", fontSize: "1rem", marginBottom: "1rem" }}>{"★".repeat(t.rating)}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#6E6E73", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,113,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: "700", color: "#0071E3" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: "700", color: "#1D1D1F", margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#86868B", margin: 0 }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA — SELL YOUR CAR
          ================================================================ */}
      <section style={{ background: "linear-gradient(135deg, #0071E3 0%, #0055B3 100%)", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "0.5rem" }}>
                ¿Quieres vender?
              </p>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: "700", color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
                Compramos tu Coche al Mejor Precio
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", maxWidth: "480px", lineHeight: 1.65, margin: 0 }}>
                Tasación gratuita sin compromiso, pago inmediato y gestión de cambio de titularidad incluida.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}>
              <Link href="/compramos-tu-coche">
                <a style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#FFFFFF", color: "#0071E3", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "700", padding: "0.75rem 1.75rem", borderRadius: "980px", textDecoration: "none", whiteSpace: "nowrap" }}>
                  Tasar mi Vehículo
                  <ArrowRight size={16} />
                </a>
              </Link>
              <a href="tel:984180450" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", justifyContent: "center" }}>
                <Phone size={13} />
                984 180 450
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          LOCATION / MAP
          ================================================================ */}
      <section style={{ background: "#F5F5F7", padding: "4rem 0 0" }}>
        <div className="container" style={{ paddingBottom: "3rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.5rem" }}>
              Dónde estamos
            </p>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "700", color: "#1D1D1F", margin: "0 0 1rem", letterSpacing: "-0.02em" }}>
              Encuéntranos en Oviedo
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#6E6E73" }}>
              <span>📍 Oviedo, Asturias</span>
              <a href="tel:984180450" style={{ color: "#0071E3", textDecoration: "none", fontWeight: "500" }}>📞 984 180 450</a>
              <span>⏰ Lun–Vie: 10:00–13:30 / 16:00–20:00</span>
            </div>
          </div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.2!2d-5.8448!3d43.3614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDIxJzQxLjAiTiA1wrA1MCc0MS4zIlc!5e0!3m2!1ses!2ses!4v1"
            width="100%"
            height="380"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Astur Ocasión"
          />
        </div>
      </section>

      <Footer />

      <a href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Contactar por WhatsApp">
        <svg viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>

      <style>{`
        @media (max-width: 768px) {
          .search-widget {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .search-widget > div {
            border-right: none !important;
            border-bottom: 1px solid #E8E8ED;
            padding: 0 !important;
          }
          .search-widget button {
            margin-left: 0 !important;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
