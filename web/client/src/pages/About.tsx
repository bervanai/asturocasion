import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const VALUES = [
  {
    number: "01",
    title: "Transparencia total",
    desc: "El precio que ves es el precio final. Transferencia, garantía y revisión ya están incluidos. Sin letra pequeña, sin sorpresas.",
  },
  {
    number: "02",
    title: "Calidad garantizada",
    desc: "Cada vehículo supera un riguroso proceso de revisión mecánica y estética antes de entrar a nuestro stock.",
  },
  {
    number: "03",
    title: "Trato personal y cercano",
    desc: "Somos un equipo pequeño y comprometido. Nuestra relación con cada cliente va mucho más allá del momento de la venta.",
  },
  {
    number: "04",
    title: "Financiación flexible",
    desc: "Trabajamos con los mejores socios financieros para ofrecerte las condiciones más competitivas del mercado asturiano.",
  },
];

const FEATURES = [
  "Amplia selección de vehículos de todos los segmentos",
  "Vehículos por encargo con asesoramiento personalizado",
  "Tasaciones gratuitas sin compromiso",
  "Pago inmediato en compra de vehículos",
  "Gestión de cambio de titularidad incluida",
  "Garantía en todos nuestros vehículos",
  "ITV al día en todas las entregas",
  "Financiación adaptada a cada cliente",
];

const TIMELINE = [
  { year: "Inicio", event: "Apertura del concesionario en Oviedo con una selección inicial de vehículos premium." },
  { year: "Crecimiento", event: "Ampliamos nuestro stock e incorporamos el servicio de vehículos por encargo." },
  { year: "Innovación", event: "Lanzamos la tasación online y el servicio de compra directa a particulares." },
  { year: "Hoy", event: "Más de 200 vehículos vendidos, +200 familias asturianas satisfechas cada año." },
];

export default function About() {
  useSEO({
    title: "Quiénes Somos — Concesionario de Ocasión en Oviedo",
    description: "Conoce Astur Ocasión: concesionario familiar en Oviedo especializado en vehículos de ocasión premium. Transparencia, garantía y atención personalizada desde el primer día.",
    path: "/sobre-nosotros",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F5F5F7" }}>
      <Navigation />

      {/* ---- Hero ---- */}
      <section
        style={{
          background: "#06080F",
          padding: "6rem 0 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/showroom.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 55%",
            opacity: 0.5,
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(6,8,15,0.9) 0%, rgba(10,26,58,0.72) 55%, rgba(0,90,200,0.4) 100%)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "3px",
            background: "rgba(255,255,255,0.3)",
            zIndex: 2,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="section-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Quiénes somos</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5vw, 3.9rem)",
              fontWeight: "500",
              color: "#FFFFFF",
              lineHeight: 1.07,
              maxWidth: "740px",
              margin: "0 0 1.5rem 0",
              letterSpacing: "-0.015em",
            }}
          >
            Más de 15 Años de Concesionario de Ocasión en <em style={{ fontStyle: "italic", color: "#4DA3FF" }}>Oviedo, Asturias</em>
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.75)",
              maxWidth: "560px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            En Astur Ocasión somos algo más que un concesionario de coches de segunda mano. Somos un equipo apasionado por el automóvil comprometido con ayudar a familias de Oviedo y toda Asturias a encontrar el vehículo de ocasión que necesitan, al precio que merecen.
          </p>
        </div>
      </section>

      {/* ---- Story + Timeline ---- */}
      <section style={{ background: "#FFFFFF", padding: "6rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5rem",
              alignItems: "start",
            }}
            className="about-two-col"
          >
            {/* Story */}
            <div>
              <div className="section-eyebrow">Nuestra historia</div>
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                  fontWeight: "700",
                  color: "#1D1D1F",
                  lineHeight: 1.15,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Nacidos en Oviedo, Comprometidos con Asturias
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  color: "#6E6E73",
                  lineHeight: 1.75,
                  marginBottom: "1.25rem",
                }}
              >
                Astur Ocasión nació con una idea simple: vender coches de ocasión y segunda mano en Oviedo con el mismo rigor y la misma honestidad que uno esperaría de un concesionario oficial, pero a precios de particular.
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  color: "#6E6E73",
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                }}
              >
                Con el tiempo, hemos ido ampliando nuestros servicios: desde la búsqueda de vehículos por encargo hasta la compra directa de coches a particulares, siempre con el mismo principio rector: la transparencia total.
              </p>
              <Link href="/contacto">
                <a className="btn-primary">
                  Contactar con nosotros
                  <ArrowRight size={15} />
                </a>
              </Link>
            </div>

            {/* Timeline */}
            <div>
              <div style={{ position: "relative", paddingLeft: "2rem" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "16px",
                    bottom: "16px",
                    width: "1.5px",
                    background: "linear-gradient(to bottom, #0071E3, #D2D2D7)",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                  {TIMELINE.map((item) => (
                    <div key={item.year} style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "-1.6rem",
                          top: "4px",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "#0071E3",
                          border: "3px solid #FFFFFF",
                          boxShadow: "0 0 0 1.5px #0071E3",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "1rem",
                          fontWeight: "800",
                          color: "#0071E3",
                          marginBottom: "4px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.year}
                      </div>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.88rem",
                          color: "#6E6E73",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {item.event}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Values ---- */}
      <section style={{ background: "#F5F5F7", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-eyebrow">Nuestros valores</div>
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                fontWeight: "700",
                color: "#1D1D1F",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Lo que Nos Define
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {VALUES.map((v) => (
              <div
                key={v.number}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E8ED",
                  borderRadius: "16px",
                  padding: "2rem",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "rgba(0,113,227,0.12)",
                    lineHeight: 1,
                    marginBottom: "1rem",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {v.number}
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: "700",
                    color: "#1D1D1F",
                    marginBottom: "0.6rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.875rem",
                    color: "#6E6E73",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features checklist ---- */}
      <section style={{ background: "#FFFFFF", padding: "6rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5rem",
              alignItems: "center",
            }}
            className="about-two-col"
          >
            <div>
              <div className="section-eyebrow">Todo incluido</div>
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                  fontWeight: "700",
                  color: "#1D1D1F",
                  lineHeight: 1.15,
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Compramos tu Coche de Segunda Mano, Vendemos sin Sorpresas
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  color: "#6E6E73",
                  lineHeight: 1.7,
                }}
              >
                Cada servicio que ofrecemos está diseñado para ser claro, rápido y sin fricciones. Nos encargamos de todo el papeleo para que tú solo te preocupes de disfrutar el coche.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {FEATURES.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "1rem",
                    background: "#F5F5F7",
                    border: "1px solid #E8E8ED",
                    borderRadius: "12px",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <CheckCircle size={15} color="#0071E3" style={{ flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#1D1D1F", lineHeight: 1.4, fontWeight: "500" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section
        style={{
          background: "linear-gradient(135deg, #0071E3 0%, #0055B3 100%)",
          padding: "5rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: "700",
              color: "#FFFFFF",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Visítanos en Oviedo
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2.5rem",
              maxWidth: "420px",
              margin: "0 auto 2.5rem",
            }}
          >
            Lunes a Viernes de 10:00 a 13:30 y de 16:00 a 20:00. Sábados de 10:00 a 13:30. José Manuel Fuente, 2 · 33002 Oviedo. Te esperamos sin cita previa.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/catalogo">
              <a
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#FFFFFF",
                  color: "#0071E3",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  padding: "0.72rem 1.75rem",
                  borderRadius: "980px",
                  textDecoration: "none",
                }}
              >
                Ver catálogo
                <ArrowRight size={15} />
              </a>
            </Link>
            <Link href="/contacto">
              <a
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.15)",
                  color: "#FFFFFF",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  padding: "0.72rem 1.75rem",
                  borderRadius: "980px",
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                }}
              >
                Contactar
              </a>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-two-col { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>

      <Footer />


    </div>
  );
}
