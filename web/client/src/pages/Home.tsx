import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, Shield, RotateCcw, Star, Phone, CheckCircle, Search, Fuel, Gauge, Calendar, Car, ScanSearch, Banknote, CreditCard, MapPin, Clock } from "lucide-react";
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
  status: string;
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
          {/* Estado badge — solo si Reservado o Vendido */}
          {v.status !== "available" && (
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              background: v.status === "sold" ? "rgba(30,30,30,0.82)" : "rgba(200,120,0,0.88)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem", fontWeight: "700",
              padding: "4px 10px", borderRadius: "50px",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {v.status === "sold" ? "Vendido" : "Reservado"}
            </div>
          )}
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

  const { data: dbVehicles, isLoading } = useQuery({
    queryKey: ["vehicles", "all"],
    queryFn: () => fetchVehicles(),
  });
  const vehicles = (dbVehicles ?? []).map((v) => toCard({
    id: v.id, brand: v.brand, model: v.model, year: v.year,
    price: v.price, km: v.km, fuelType: v.fuel_type,
    transmission: v.transmission, images: v.images, status: v.status,
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
    { name: "Jose Ulpiano Antón González", location: "Oviedo", text: "Un concesionario de vehículos de ocasión muy recomendable, buén asesoramiento y un trato muy amable por parte de Tito y de su hijo Pelayo, es la primera vez que les compro un vehiculo y estoy muy satisfecho tanto con el vehiculo como con el trato y asesoramiento recibido, cien por cien recomendable.", rating: 5, initials: "JA" },
    { name: "Manu", location: "Oviedo", text: "Cuando encuentras una persona que hace lo imposible en su negocio para que uno quede satisfecho con su compra hay que decirlo, esa persona es Tito, me ha dejado el coche impoluto, además de ser un tío agradable y cumplidor. No puedo estar más contento con el coche. Gracias Tito.", rating: 5, initials: "M" },
    { name: "Jose Luis Maseda Monterrubio", location: "Oviedo", text: "Compré dos coches en cosa de 4 meses, los dos decir que Tito es una gran persona y muy transparente, estoy contentísimo con los dos coches. Aconsejo a quien quiera comprase un coche que pase por allí, el trato excelente.", rating: 5, initials: "JL" },
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
              Oviedo, Asturias
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
              Coches de ocasión y segunda mano seleccionados a mano en Oviedo, Asturias. Garantía, ITV al día y transferencia incluida — con la atención de un trato cercano.
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
              { num: "+200", label: "Familias satisfechas" },
              { num: "4.6/5", label: "107 reseñas Google" },
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

      {/* ── SHOWROOM ────────────────────────────────────────────────────────────── */}
      <section className="reveal" style={{ background: "#F5F5F7", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.6rem", display: "flex", alignItems: "center" }}><span className="lux-hairline" style={{ color: "#0071E3" }} />Stock actual</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.8vw, 2.9rem)", fontWeight: "500", color: "#1D1D1F", margin: 0, letterSpacing: "-0.015em" }}>
                Coches de Ocasión en Oviedo
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
            {isLoading ? (
              Array.from({length: 6}).map((_, i) => (
                <div key={i} style={{ borderRadius: "20px", overflow: "hidden", background: "#F5F5F7", aspectRatio: "4/3", animation: "pulse 1.5s ease-in-out infinite" }} />
              ))
            ) : vehicles.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "#6E6E73", fontFamily: "'DM Sans', sans-serif" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>Stock en actualización</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Contacta con nosotros para conocer la disponibilidad actual.</p>
              </div>
            ) : vehicles.map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ───────────────────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF", padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 3.5rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0071E3", marginBottom: "0.75rem" }}>Astur Ocasión del Automóvil</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: "500", color: "#1D1D1F", margin: "0 0 1.25rem", letterSpacing: "-0.015em" }}>
              Vehículos de Segunda Mano y Ocasión 100% Revisados
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.97rem", color: "#6E6E73", lineHeight: 1.75, margin: 0 }}>
              Todos nuestros vehículos se entregan con la <strong style={{ color: "#1D1D1F" }}>ITV al día</strong> y el <strong style={{ color: "#1D1D1F" }}>cambio de propietario incluido</strong> en el precio. Recogemos su vehículo como parte del pago y le ofrecemos financiación a su medida.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: <Car size={22} color="#0071E3" />, title: "Variedad de Vehículos", desc: "Le ofrecemos vehículos de todos los segmentos: compactos, SUV, berlinas, familiares, deportivos y más." },
              { icon: <ScanSearch size={22} color="#0071E3" />, title: "Vehículos por Encargo", desc: "Asesoramiento personalizado y búsqueda de vehículos por encargo. Encontramos el coche que busca." },
              { icon: <Banknote size={22} color="#0071E3" />, title: "Compra a Particulares", desc: "Le compramos su vehículo con la mejor tasación del mercado asturiano. Pago inmediato." },
              { icon: <CreditCard size={22} color="#0071E3" />, title: "Financiación", desc: "Le ofrecemos la financiación que mejor se adapte a sus necesidades. Condiciones a medida." },
            ].map((s) => (
              <div key={s.title} style={{ background: "#F5F5F7", borderRadius: "18px", padding: "1.75rem", border: "1px solid #E8E8ED", transition: "box-shadow 0.2s" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(0,113,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: "700", color: "#1D1D1F", margin: "0 0 0.5rem", letterSpacing: "-0.01em" }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "#6E6E73", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
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
              Nuestro concesionario de ocasión en Oviedo, Asturias, reúne una selección permanente de vehículos revisados. Ven a verlos, pruébalos y déjate asesorar sin compromiso.
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
              <a href="tel:629574957" className="lux-underline" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>
                <Phone size={15} /> 629 574 957
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
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.8vw, 2.7rem)", fontWeight: "500", color: "#1D1D1F", margin: 0, letterSpacing: "-0.015em" }}>Compra un Coche de Ocasión con Total Seguridad</h2>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({length: t.rating}).map((_, j) => <Star key={j} size={14} fill="#F5A623" color="#F5A623" />)}
                  </div>
                  {/* Google logo */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#3D3D3F", lineHeight: 1.75, margin: "0 0 1.5rem", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid #F0F0F5", paddingTop: "1.25rem" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#0071E3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: "700", fontSize: "0.85rem", color: "#fff", flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: "700", color: "#1D1D1F", margin: 0 }}>{t.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#86868B", margin: "2px 0 0" }}>Reseña en Google</p>
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
              Vendemos tu coche de segunda mano<br />al mejor precio en Asturias
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, margin: "0 0 2.5rem" }}>
              Tasación gratuita en 24h, pago inmediato y gestión de cambio de titularidad incluida sin coste. El concesionario de ocasión en Oviedo que compra tu coche sin complicaciones.
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
              <a href="tel:629574957" style={{
                display: "flex", alignItems: "center", gap: "8px",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                color: "rgba(255,255,255,0.75)", textDecoration: "none",
              }}>
                <Phone size={15} /> 629 574 957
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
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} color="#0071E3" /> José Manuel Fuente, 2 · 33002 Oviedo, Asturias</span>
              <a href="tel:629574957" style={{ color: "#0071E3", textDecoration: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}><Phone size={14} /> 629 574 957</a>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} color="#0071E3" /> Lun–Vie: 10:00–13:30 / 16:00–20:00 · Sáb: 10:00–13:30</span>
            </div>
          </div>
        </div>
        <iframe
          src="https://maps.google.com/maps?q=Astur+Ocasi%C3%B3n+del+Autom%C3%B3vil+Oviedo&output=embed&hl=es"
          width="100%" height="400"
          style={{ border: 0, display: "block" }}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Astur Ocasión"
        />
      </section>

      <Footer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
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
