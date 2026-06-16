import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { insertLead } from "@/lib/supabase";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { CheckCircle, ArrowRight, Phone, MessageCircle, Send, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const BRANDS = [
  "Mercedes", "BMW", "Audi", "Peugeot", "Jaguar", "Ford", "Volvo", "Lexus",
  "Toyota", "Volkswagen", "Seat", "Renault", "Opel", "Hyundai", "Kia", "Otro",
];

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.72rem",
  fontWeight: "600",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#6E6E73",
  display: "block",
  marginBottom: "0.5rem",
};

const INPUT_BASE_STYLE: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #D2D2D7",
  borderRadius: 0,
  padding: "0.6rem 0",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#1D1D1F",
  outline: "none",
  width: "100%",
  boxShadow: "none",
};

const SELECT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #D2D2D7",
  padding: "0.6rem 0",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#1D1D1F",
  outline: "none",
  appearance: "none",
  cursor: "pointer",
};

const PROCESS_STEPS = [
  { num: "01", title: "Rellena el formulario", desc: "Indícanos la marca, modelo, año y kilometraje de tu vehículo." },
  { num: "02", title: "Valoración en 24h", desc: "Nuestro equipo analiza tu coche y te contacta con una oferta real." },
  { num: "03", title: "Visita y confirmación", desc: "Quedamos en nuestras instalaciones en Oviedo para verificar el vehículo." },
  { num: "04", title: "Pago inmediato", desc: "Cobras en el acto. Gestionamos el cambio de titularidad nosotros." },
];

export default function TradeIn() {
  useSEO({
    title: "Compramos Tu Coche — Tasación Gratuita en Oviedo",
    description: "¿Quieres vender tu coche en Oviedo? En Astur Ocasión te lo compramos al mejor precio. Tasación gratuita, respuesta en menos de 24h y pago inmediato. Sin complicaciones.",
    path: "/compramos-tu-coche",
  });

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const createLead = useMutation({
    mutationFn: (data: { name: string; email: string; phone?: string; type: "valuation"; message?: string }) =>
      insertLead(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ brand: "", model: "", year: "", km: "", name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (err: Error) => toast.error("Error al enviar: " + err.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleStr = [formData.brand, formData.model, formData.year, formData.km ? `${formData.km} km` : ""].filter(Boolean).join(" ");
    const message = [
      vehicleStr ? `Vehículo a tasar: ${vehicleStr}` : "",
      formData.message,
    ]
      .filter(Boolean)
      .join(" — ");
    createLead.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      type: "valuation",
      message: message || undefined,
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F5F5F7" }}>
      <Navigation />

      {/* Header */}
      <section
        style={{
          background: "#06080F",
          padding: "5rem 0 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/showroom.jpg"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", opacity: 0.5, zIndex: 0 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(6,8,15,0.88) 0%, rgba(10,26,58,0.7) 55%, rgba(0,90,200,0.45) 100%)",
            zIndex: 1,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="section-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Vendemos por ti</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "600",
              color: "#FFFFFF",
              margin: "0 0 0.75rem 0",
              lineHeight: 1.1,
            }}
          >
            Compramos tu Coche al{" "}
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>Mejor Precio</em>
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              maxWidth: "520px",
            }}
          >
            Tasación gratuita, pago inmediato, cambio de titularidad incluido. Sin intermediarios, sin esperas.
          </p>
        </div>
      </section>

      {/* Process steps */}
      <section style={{ background: "#FFFFFF", padding: "3.5rem 0", borderBottom: "1px solid #E8E8ED" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.5rem", background: "#F5F5F7", borderRadius: "14px" }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "#0071E3",
                  opacity: 0.5,
                  lineHeight: 1,
                }}>
                  {step.num}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#1D1D1F",
                      marginBottom: "4px",
                    }}
                  >
                    {step.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem",
                      color: "#6E6E73",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <div className="container" style={{ flex: 1, paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "2.5rem",
            alignItems: "start",
          }}
          className="tradein-grid"
        >
          {/* Form */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E8ED",
              borderRadius: "18px",
              padding: "2.5rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1D1D1F",
                marginBottom: "2rem",
              }}
            >
              Solicitar Tasación Gratuita
            </h2>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                <div
                  style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "rgba(0,113,227,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <CheckCircle size={28} color="#0071E3" />
                </div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.4rem", fontWeight: "600", color: "#1D1D1F", marginBottom: "0.75rem" }}>
                  Solicitud enviada
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#6E6E73" }}>
                  Analizaremos tu vehículo y te contactaremos en menos de 24 horas con nuestra oferta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

                {/* Vehicle section */}
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: "700",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#0071E3",
                      marginBottom: "1.5rem",
                      borderBottom: "1px solid #E8E8ED",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    Datos del vehículo
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem" }} className="form-two-col">
                    <div>
                      <label style={LABEL_STYLE}>Marca *</label>
                      <div style={{ position: "relative" }}>
                        <select name="brand" value={formData.brand} onChange={handleChange} required style={SELECT_STYLE}>
                          <option value="">Seleccionar marca</option>
                          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronDown size={13} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", color: "#6E6E73", pointerEvents: "none" }} />
                      </div>
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Modelo *</label>
                      <Input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Ej: GLE 250D" required style={INPUT_BASE_STYLE} />
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Año *</label>
                      <Input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Ej: 2016" min="1990" max={new Date().getFullYear()} required style={INPUT_BASE_STYLE} />
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Kilómetros *</label>
                      <Input type="number" name="km" value={formData.km} onChange={handleChange} placeholder="Ej: 150000" required style={INPUT_BASE_STYLE} />
                    </div>
                  </div>
                </div>

                {/* Contact section */}
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: "700",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#0071E3",
                      marginBottom: "1.5rem",
                      borderBottom: "1px solid #E8E8ED",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    Tus datos de contacto
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem" }} className="form-two-col">
                    <div>
                      <label style={LABEL_STYLE}>Nombre completo *</label>
                      <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" required style={INPUT_BASE_STYLE} />
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Email *</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" required style={INPUT_BASE_STYLE} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={LABEL_STYLE}>Teléfono *</label>
                      <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej: 600 123 456" required style={INPUT_BASE_STYLE} />
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label style={LABEL_STYLE}>Comentarios adicionales</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Estado del vehículo, reformas, historial de mantenimiento..."
                    rows={4}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #D2D2D7",
                      padding: "0.6rem 0",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem",
                      color: "#1D1D1F",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#0071E3")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#D2D2D7")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={createLead.isPending}
                  className="btn-primary"
                  style={{ alignSelf: "flex-start", opacity: createLead.isPending ? 0.7 : 1 }}
                >
                  {createLead.isPending ? "Enviando..." : (
                    <>
                      Solicitar tasación gratuita
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Benefits */}
            <div
              style={{
                background: "linear-gradient(135deg, #0071E3 0%, #0055B3 100%)",
                borderRadius: "18px",
                padding: "1.75rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  marginBottom: "1.25rem",
                }}
              >
                Por qué elegirnos
              </h3>
              {[
                "Tasación gratuita y sin compromiso",
                "Mejor precio del mercado asturiano",
                "Pago inmediato al cerrar el trato",
                "Cambio de titularidad incluido",
                "Sin comisiones ni intermediarios",
                "Gestión completa del papeleo",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <CheckCircle size={13} color="rgba(255,255,255,0.8)" style={{ flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>

            {/* Direct contact */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8ED",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#86868B",
                  marginBottom: "1rem",
                }}
              >
                Contacto directo
              </p>
              <a
                href="tel:984180450"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: "500",
                  color: "#1D1D1F", textDecoration: "none", marginBottom: "0.75rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0071E3")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#1D1D1F")}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,113,227,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3", flexShrink: 0 }}>
                  <Phone size={14} />
                </div>
                984 180 450
              </a>
              <a
                href="https://wa.me/34629574957"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: "500",
                  color: "#1D1D1F", textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#25d366")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#1D1D1F")}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(37,211,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#25d366", flexShrink: 0 }}>
                  <MessageCircle size={14} />
                </div>
                WhatsApp: 629 574 957
              </a>
            </div>

            {/* Catalog CTA */}
            <div
              style={{
                background: "rgba(0,113,227,0.06)",
                border: "1px solid rgba(0,113,227,0.15)",
                borderRadius: "16px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  color: "#6E6E73",
                  marginBottom: "1rem",
                  lineHeight: 1.5,
                }}
              >
                ¿Prefieres comprar un coche antes? Explora nuestro catálogo de vehículos disponibles.
              </p>
              <a
                href="/catalogo"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: "600",
                  color: "#0071E3", textDecoration: "none",
                  transition: "gap 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.gap = "10px")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.gap = "6px")}
              >
                Ver catálogo
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .tradein-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .form-two-col { grid-template-columns: 1fr !important; }
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
