import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

/** Preguntas frecuentes. El contenido y el JSON-LD (FAQPage) se mantienen en
 *  sincronía a partir de esta misma lista, para que Google pueda mostrar los
 *  desplegables de resultados enriquecidos. */
const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Dónde está Astur Ocasión?",
    a: "Estamos en C. José Manuel Fuente «El Tarangu», 2, 33002 Oviedo (Asturias). Puedes visitarnos sin cita en nuestro horario de apertura o llamarnos al 629 574 957.",
  },
  {
    q: "¿Los coches llevan garantía?",
    a: "Sí. Todos nuestros vehículos de ocasión se entregan revisados y con garantía incluida, además de la transferencia a tu nombre. Compras con total tranquilidad.",
  },
  {
    q: "¿La transferencia está incluida en el precio?",
    a: "Sí, la transferencia del vehículo a tu nombre va incluida. Nos encargamos de todos los trámites para que solo tengas que recoger tu coche.",
  },
  {
    q: "¿Ofrecéis financiación?",
    a: "Sí, disponemos de financiación a medida para la compra de tu coche de segunda mano. Cuéntanos tu caso y te preparamos una propuesta sin compromiso.",
  },
  {
    q: "¿Compráis mi coche usado?",
    a: "Sí. Tasamos y compramos tu coche al mejor precio. Puedes pedir una tasación online gratuita y te damos respuesta en 24 horas, con pago inmediato y sin trámites para ti.",
  },
  {
    q: "¿Qué marcas de coches tenéis?",
    a: "Trabajamos con una amplia selección de marcas premium y generalistas: Mercedes-Benz, BMW, Audi, Volkswagen, Jaguar, Land Rover y muchas más. Consulta el catálogo actualizado en nuestra web.",
  },
  {
    q: "¿Puedo reservar o ver un coche antes de comprarlo?",
    a: "Por supuesto. Puedes venir a verlo y probarlo a nuestras instalaciones de Oviedo, o contactarnos por teléfono y WhatsApp al 629 574 957 para resolver cualquier duda antes de decidirte.",
  },
];

export default function FAQ() {
  useSEO({
    title: "Preguntas Frecuentes | Coches de Ocasión en Oviedo — Astur Ocasión",
    description:
      "Resolvemos tus dudas sobre comprar coche de segunda mano en Oviedo: garantía, transferencia, financiación, tasación y más. Astur Ocasión, Oviedo (Asturias).",
    path: "/preguntas-frecuentes",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F5F5F7" }}>
      <Navigation />

      {/* Header */}
      <section style={{ background: "#06080F", padding: "4rem 0 3rem" }}>
        <div className="container">
          <div className="section-eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Ayuda</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "500", color: "#FFFFFF", margin: "0.5rem 0 0", lineHeight: 1.1 }}>
            Preguntas Frecuentes
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="container" style={{ flex: 1, paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: "760px", background: "#FFFFFF", borderRadius: "18px", padding: "clamp(1.5rem, 5vw, 3rem)", border: "1px solid #E8E8ED", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
          <p style={BODY}>
            Todo lo que necesitas saber sobre comprar tu coche de segunda mano en <strong>Astur Ocasión</strong>, tu concesionario de vehículos de ocasión en Oviedo, Asturias.
          </p>

          {FAQS.map((f) => (
            <div key={f.q} style={{ marginTop: "2rem" }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: "700", color: "#1D1D1F", margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>{f.q}</h2>
              <p style={BODY}>{f.a}</p>
            </div>
          ))}

          <p style={{ ...BODY, marginTop: "2.5rem", borderTop: "1px solid #E8E8ED", paddingTop: "1.5rem" }}>
            ¿Tienes otra pregunta? Llámanos al{" "}
            <a href="tel:629574957" style={{ color: "#0071E3" }}>629 574 957</a> o escríbenos por{" "}
            <a href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" style={{ color: "#0071E3" }}>WhatsApp</a>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const BODY: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#3D3D3F",
  lineHeight: 1.75,
  margin: "0 0 0.75rem",
};
