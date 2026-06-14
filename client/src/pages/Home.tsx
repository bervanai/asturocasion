import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Shield, RotateCcw, Star, Phone, CheckCircle } from "lucide-react";

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

/* ---- Intersection observer hook ---- */
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

/* ---- Sample vehicles ---- */
const VEHICLES = [
  { id: 1, name: "Mercedes GLE 250D", year: 2016, price: 26900, km: 276000, fuel: "Diésel", transmission: "Auto", brand: "Mercedes" },
  { id: 2, name: "Mercedes SLK 300", year: 2010, price: 18500, km: 145000, fuel: "Gasolina", transmission: "Auto", brand: "Mercedes" },
  { id: 3, name: "Peugeot 3008 2.0HDI", year: 2014, price: 12900, km: 33000, fuel: "Diésel", transmission: "Manual", brand: "Peugeot" },
  { id: 4, name: "Jaguar XF R-Sport", year: 2017, price: 20900, km: 162000, fuel: "Diésel", transmission: "Auto", brand: "Jaguar" },
  { id: 5, name: "BMW 325D GT", year: 2017, price: 23500, km: 157000, fuel: "Diésel", transmission: "Auto", brand: "BMW" },
  { id: 6, name: "Audi Q5 2.0TDI", year: 2015, price: 21500, km: 180000, fuel: "Diésel", transmission: "Auto", brand: "Audi" },
];

/* ---- Car placeholder SVG by brand colour ---- */
const BRAND_COLORS: Record<string, string> = {
  Mercedes: "#1a1a1a",
  BMW: "#1c69d4",
  Audi: "#bb0a30",
  Jaguar: "#0a5f38",
  Peugeot: "#003189",
};

function CarPlaceholder({ brand, name }: { brand: string; name: string }) {
  const bg = BRAND_COLORS[brand] ?? "#1e2330";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${bg}cc 0%, #0d0f14 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
        <rect x="10" y="18" width="60" height="14" rx="4" fill="rgba(255,255,255,0.08)" />
        <rect x="18" y="8" width="36" height="14" rx="4" fill="rgba(255,255,255,0.12)" />
        <circle cx="20" cy="34" r="6" fill="rgba(255,255,255,0.15)" />
        <circle cx="60" cy="34" r="6" fill="rgba(255,255,255,0.15)" />
        <rect x="2" y="22" width="8" height="6" rx="2" fill="rgba(232,160,32,0.4)" />
        <rect x="70" y="22" width="8" height="6" rx="2" fill="rgba(232,160,32,0.4)" />
      </svg>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {name}
      </span>
    </div>
  );
}

/* ---- Vehicle Card ---- */
function VehicleCard({ vehicle }: { vehicle: typeof VEHICLES[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/vehiculo/${vehicle.id}`}>
      <a
        className="vehicle-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "block" }}
      >
        <div className="vehicle-card-image-wrap">
          <CarPlaceholder brand={vehicle.brand} name={vehicle.name} />
          <div className="vehicle-card-overlay" />
          <div className="vehicle-card-price">{vehicle.price.toLocaleString("es-ES")} €</div>
        </div>
        <div className="vehicle-card-body">
          <div className="vehicle-card-name">{vehicle.name}</div>
          <div className="vehicle-card-meta">
            <span>{vehicle.year}</span>
            <span>{vehicle.km.toLocaleString("es-ES")} km</span>
            <span>{vehicle.fuel}</span>
          </div>
        </div>
        <div
          className="vehicle-card-specs"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          <span>Cambio</span><strong>{vehicle.transmission}</strong>
          <span>Año</span><strong>{vehicle.year}</strong>
          <span>Km</span><strong>{vehicle.km.toLocaleString("es-ES")}</strong>
          <span>Combustible</span><strong>{vehicle.fuel}</strong>
        </div>
      </a>
    </Link>
  );
}

/* ---- Stat item ---- */
function StatItem({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCounter(value, 1800, start);
  return (
    <div style={{ textAlign: "center" }}>
      <div className="stat-number">
        {count}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Home() {
  const statsRef = useInView(0.3);

  const testimonials = [
    {
      name: "Carlos M.",
      location: "Oviedo",
      text: "Compré un BMW 325D hace seis meses y no puedo estar más satisfecho. El equipo fue transparente desde el primer momento, sin letra pequeña ni sorpresas. El coche llegó impecable.",
      rating: 5,
    },
    {
      name: "Laura F.",
      location: "Gijón",
      text: "Vendí mi coche en menos de 48 horas. Me hicieron la mejor tasación que encontré en Asturias y gestionaron todo el papeleo ellos. Profesionalidad total.",
      rating: 5,
    },
    {
      name: "Andrés P.",
      location: "Avilés",
      text: "Buscaba un SUV por encargo y lo encontraron en dos semanas. Precio justo, ITV al día, transferencia incluida. No voy a comprar en ningún otro sitio.",
      rating: 5,
    },
  ];

  const services = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      ),
      title: "Variedad de Vehículos",
      desc: "Amplia selección de coches de todos los segmentos, 100% revisados, con ITV al día y garantía incluida en el precio.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      ),
      title: "Vehículos por Encargo",
      desc: "¿No encuentras el coche que buscas? Lo localizamos nosotros con asesoramiento personalizado y sin coste adicional.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: "Compramos tu Coche",
      desc: "Tasación gratuita sin compromiso. Pago inmediato y gestión del cambio de titularidad totalmente incluida.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      title: "Financiación",
      desc: "Opciones de financiación adaptadas a tu presupuesto, con las mejores condiciones del mercado asturiano.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f6f2" }}>
      <Navigation />

      {/* ================================================================
          HERO
          ================================================================ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#0d0f14",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Grain */}
        <div className="grain-overlay" />

        {/* Background geometry */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 65% 50%, rgba(26,39,68,0.6) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(232,160,32,0.07) 0%, transparent 60%)",
          }}
        />

        {/* Orange accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent 0%, #e8a020 40%, #c9a84c 70%, transparent 100%)",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "8rem",
            paddingBottom: "8rem",
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <div className="section-eyebrow" style={{ marginBottom: "1.5rem" }}>
              Oviedo, Asturias — Premium Usado
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.6rem, 6vw, 5rem)",
                fontWeight: "600",
                color: "#f8f6f2",
                lineHeight: 1.1,
                marginBottom: "1.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              El Mejor Vehículo de{" "}
              <em className="hero-underline" style={{ fontStyle: "italic", color: "#e8a020" }}>
                Ocasión
              </em>{" "}
              en Asturias
            </h1>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.1rem",
                color: "rgba(248,246,242,0.6)",
                lineHeight: 1.7,
                maxWidth: "520px",
                marginBottom: "2.5rem",
              }}
            >
              Vehículos 100% revisados, garantía incluida, transferencia sin coste. Calidad que se percibe desde el primer vistazo.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "3rem" }}>
              <Link href="/catalogo">
                <a className="btn-primary">
                  Ver Catálogo Completo
                  <ArrowRight size={16} />
                </a>
              </Link>
              <a href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" className="btn-ghost-light">
                Escribir por WhatsApp
              </a>
            </div>

            {/* Guarantee pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["Transferencia incluida", "ITV al día", "Garantía incluida", "Precio final, sin sorpresas"].map((item) => (
                <div key={item} className="guarantee-pill">
                  <CheckCircle size={11} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <div className="scroll-indicator">
            <span />
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="rgba(248,246,242,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ================================================================
          STATS BAR
          ================================================================ */}
      <section
        ref={statsRef.ref}
        style={{
          background: "#161a23",
          padding: "4rem 0",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(232,160,32,0.3), transparent)",
          }}
        />
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "2rem",
            }}
          >
            <StatItem value={200} suffix="+" label="Vehículos vendidos" start={statsRef.inView} />
            <StatItem value={15} suffix="" label="Años de experiencia" start={statsRef.inView} />
            <StatItem value={98} suffix="%" label="Clientes satisfechos" start={statsRef.inView} />
            <StatItem value={4.9} suffix="★" label="Valoración media" start={statsRef.inView} />
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURED VEHICLES
          ================================================================ */}
      <section style={{ background: "#f8f6f2", padding: "6rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <div className="section-eyebrow">Nuestro Catálogo</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                  fontWeight: "600",
                  color: "#0d0f14",
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                Vehículos Destacados
              </h2>
            </div>
            <Link href="/catalogo">
              <a className="btn-outline" style={{ flexShrink: 0 }}>
                Ver todos
                <ArrowRight size={15} />
              </a>
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {VEHICLES.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SERVICES
          ================================================================ */}
      <section
        style={{
          background: "#0d0f14",
          padding: "6rem 0",
          position: "relative",
        }}
      >
        <div className="grain-overlay" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-eyebrow">Lo que hacemos</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                fontWeight: "600",
                color: "#f8f6f2",
                margin: "0 auto",
                maxWidth: "500px",
                lineHeight: 1.2,
              }}
            >
              Servicios a Tu Medida
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {services.map((s, i) => (
              <div
                key={i}
                className="service-card"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "4px",
                  padding: "2rem",
                  transition: "border-color 0.3s ease, background 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,160,32,0.3)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(232,160,32,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div
                  className="service-icon-ring"
                  style={{ color: "#e8a020" }}
                >
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#f8f6f2",
                    marginBottom: "0.75rem",
                    lineHeight: 1.25,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.875rem",
                    color: "rgba(248,246,242,0.5)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TRUST STRIP
          ================================================================ */}
      <section style={{ background: "#f8f6f2", padding: "4rem 0", borderBottom: "1px solid #e8e4dc" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {[
              { icon: <Shield size={20} color="#e8a020" />, title: "Garantía incluida", desc: "Todos nuestros coches llevan garantía desde el primer día." },
              { icon: <CheckCircle size={20} color="#e8a020" />, title: "ITV al día", desc: "Entregamos cada vehículo con la inspección técnica en vigor." },
              { icon: <RotateCcw size={20} color="#e8a020" />, title: "Transfer incluido", desc: "Los gastos de transferencia ya están en el precio marcado." },
              { icon: <Star size={20} color="#e8a020" />, title: "100% revisados", desc: "Revisión mecánica y estética completa antes de la entrega." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "rgba(232,160,32,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: "600", fontSize: "0.9rem", color: "#0d0f14", marginBottom: "3px" }}>{item.title}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#6b6456", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      <section style={{ background: "#161a23", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-eyebrow">Reputación</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                fontWeight: "600",
                color: "#f8f6f2",
                margin: 0,
              }}
            >
              Lo que Dicen Nuestros Clientes
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {"★".repeat(t.rating)}
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    color: "rgba(248,246,242,0.65)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(232,160,32,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#e8a020",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: "600", color: "#f8f6f2", margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(248,246,242,0.35)", margin: 0 }}>{t.location}</p>
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
      <section
        style={{
          background: "linear-gradient(135deg, #1a2744 0%, #0d0f14 100%)",
          padding: "6rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="section-eyebrow">¿Quieres vender?</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  fontWeight: "600",
                  color: "#f8f6f2",
                  lineHeight: 1.15,
                  margin: "0 0 1rem 0",
                }}
              >
                Compramos tu Coche al{" "}
                <span style={{ color: "#e8a020" }}>Mejor Precio</span>
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  color: "rgba(248,246,242,0.55)",
                  maxWidth: "480px",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Tasación gratuita sin compromiso, pago inmediato y gestión de cambio de titularidad incluida. Sin complicaciones.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}>
              <Link href="/compramos-tu-coche">
                <a className="btn-primary">
                  Tasar mi Vehículo
                  <ArrowRight size={16} />
                </a>
              </Link>
              <a href="tel:984180450" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "rgba(248,246,242,0.4)", textDecoration: "none", justifyContent: "center" }}>
                <Phone size={13} />
                984 180 450
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/34629574957"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
