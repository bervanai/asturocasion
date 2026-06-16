import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { insertLead } from "@/lib/supabase";
import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

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

const TEXTAREA_STYLE: React.CSSProperties = {
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
  minHeight: "120px",
  transition: "border-color 0.2s",
};

export default function Contact() {
  useSEO({
    title: "Contacto — Astur Ocasión Oviedo",
    description: "Contacta con Astur Ocasión en Oviedo. Llámanos al 984 180 450 o escríbenos por WhatsApp. Horario: lunes a viernes de 10:00 a 13:30 y de 16:00 a 20:00.",
    path: "/contacto",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const createLead = useMutation({
    mutationFn: (data: { name: string; email: string; phone?: string; type: "contact"; message?: string }) =>
      insertLead(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (err: Error) => toast.error("Error al enviar: " + err.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      type: "contact",
      message: [formData.subject, formData.message].filter(Boolean).join(" — ") || undefined,
    });
  };

  const contactInfo = [
    {
      icon: <Phone size={18} />,
      label: "Teléfono",
      lines: [
        <a key="1" href="tel:984180450" style={{ color: "#0071E3", textDecoration: "none", fontWeight: "500" }}>984 180 450</a>,
        <a key="2" href="tel:629574957" style={{ color: "#86868B", textDecoration: "none" }}>629 574 957</a>,
      ],
    },
    {
      icon: <MessageCircle size={18} />,
      label: "WhatsApp",
      lines: [
        <a key="1" href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" style={{ color: "#25d366", textDecoration: "none", fontWeight: "500" }}>629 574 957</a>,
      ],
    },
    {
      icon: <Mail size={18} />,
      label: "Email",
      lines: [
        <a key="1" href="mailto:info@asturocasion.es" style={{ color: "#0071E3", textDecoration: "none" }}>info@asturocasion.es</a>,
      ],
    },
    {
      icon: <MapPin size={18} />,
      label: "Ubicación",
      lines: [
        <span key="1" style={{ color: "#6E6E73" }}>Oviedo, Asturias</span>,
      ],
    },
    {
      icon: <Clock size={18} />,
      label: "Horario",
      lines: [
        <span key="1" style={{ color: "#6E6E73" }}>Lunes – Viernes</span>,
        <span key="2" style={{ color: "#6E6E73" }}>10:00 – 13:30 y 16:00 – 20:00</span>,
      ],
    },
  ];

  const inputBaseStyle: React.CSSProperties = {
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
          <div className="section-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Habla con nosotros</div>
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
            Estamos en Oviedo, <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>a tu Disposición</em>
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              maxWidth: "480px",
            }}
          >
            Tanto si quieres comprar un coche de ocasión, vender tu vehículo de segunda mano en Asturias, o simplemente hacernos una consulta, responderemos en menos de 24 horas.
          </p>
        </div>
      </section>

      <div className="container" style={{ flex: 1, paddingTop: "3rem", paddingBottom: "3.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "3rem",
            alignItems: "start",
          }}
          className="contact-grid"
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
              Envíanos un Mensaje
            </h2>

            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(0,113,227,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <CheckCircle size={28} color="#0071E3" />
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#1D1D1F",
                    marginBottom: "0.75rem",
                  }}
                >
                  Mensaje recibido
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#6E6E73" }}>
                  Gracias por escribirnos. Nos pondremos en contacto contigo en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem" }} className="form-two-col">
                  <div>
                    <label style={LABEL_STYLE}>Nombre *</label>
                    <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" required style={inputBaseStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Email *</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" required style={inputBaseStyle} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem" }} className="form-two-col">
                  <div>
                    <label style={LABEL_STYLE}>Teléfono</label>
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej: 600 123 456" style={inputBaseStyle} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Asunto *</label>
                    <Input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="¿En qué podemos ayudarte?" required style={inputBaseStyle} />
                  </div>
                </div>

                <div>
                  <label style={LABEL_STYLE}>Mensaje *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos con detalle..."
                    rows={5}
                    required
                    style={TEXTAREA_STYLE}
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
                      Enviar mensaje
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {contactInfo.map((item, i) => (
              <div key={i} className="contact-card">
                <div className="contact-card-icon">{item.icon}</div>
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.68rem",
                      fontWeight: "600",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#86868B",
                      marginBottom: "4px",
                    }}
                  >
                    {item.label}
                  </p>
                  {item.lines.map((line, j) => (
                    <div key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.5 }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Map */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8ED",
                borderRadius: "16px",
                overflow: "hidden",
                marginTop: "0.25rem",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid #F0F0F5" }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#86868B",
                    margin: 0,
                  }}
                >
                  Como llegar
                </p>
              </div>
              <div style={{ height: "200px", overflow: "hidden" }}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2918.4976651652347!2d-5.8343!3d43.3614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd366f5e5e5e5e5e5%3A0x0!2sOviedo%2C%20Asturias!5e0!3m2!1ses!2ses!4v1234567890"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Astur Ocasión Oviedo"
                  style={{ filter: "grayscale(20%)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />


    </div>
  );
}
