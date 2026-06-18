import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

export default function PrivacyPolicy() {
  useSEO({
    title: "Política de Privacidad",
    description: "Política de privacidad de Astur Ocasión del Automóvil. Información sobre el tratamiento de datos personales conforme al RGPD.",
    path: "/politica-de-privacidad",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F5F5F7" }}>
      <Navigation />

      {/* Header */}
      <section style={{ background: "#06080F", padding: "4rem 0 3rem" }}>
        <div className="container">
          <div className="section-eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>Legal</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "500", color: "#FFFFFF", margin: "0.5rem 0 0", lineHeight: 1.1 }}>
            Política de Privacidad
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="container" style={{ flex: 1, paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: "760px", background: "#FFFFFF", borderRadius: "18px", padding: "clamp(1.5rem, 5vw, 3rem)", border: "1px solid #E8E8ED", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>

          <p style={BODY}>
            En cumplimiento del <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong>, le informamos sobre el tratamiento de sus datos personales.
          </p>

          <Section title="1. Responsable del Tratamiento">
            <p style={BODY}><strong>Denominación:</strong> Astur Ocasión del Automóvil</p>
            <p style={BODY}><strong>Dirección:</strong> José Manuel Fuente, 2 · 33002 Oviedo, Asturias</p>
            <p style={BODY}><strong>Teléfono:</strong> 629 574 957</p>
            <p style={BODY}><strong>Email:</strong> <a href="mailto:asturocasion@gmail.com" style={{ color: "#0071E3" }}>asturocasion@gmail.com</a></p>
          </Section>

          <Section title="2. Datos que Recogemos">
            <p style={BODY}>Recogemos los datos que usted nos facilita voluntariamente a través de:</p>
            <ul style={LIST}>
              <li>Formulario de contacto: nombre, email, teléfono y mensaje.</li>
              <li>Formulario de tasación: datos del vehículo y datos de contacto.</li>
              <li>Chat de asistencia: conversaciones iniciadas por el usuario.</li>
            </ul>
          </Section>

          <Section title="3. Finalidad y Base Legal">
            <p style={BODY}>Sus datos son tratados con las siguientes finalidades:</p>
            <ul style={LIST}>
              <li><strong>Atender su solicitud o consulta</strong> — base legal: ejecución de un contrato o medidas precontractuales (art. 6.1.b RGPD).</li>
              <li><strong>Gestión comercial</strong> (envío de información sobre vehículos de su interés) — base legal: interés legítimo (art. 6.1.f RGPD).</li>
              <li><strong>Comunicaciones comerciales</strong> — solo si ha dado su consentimiento expreso (art. 6.1.a RGPD).</li>
            </ul>
          </Section>

          <Section title="4. Conservación de Datos">
            <p style={BODY}>
              Conservamos sus datos durante el tiempo necesario para atender su solicitud y, una vez finalizada la relación, durante los plazos legales exigibles. Los datos de contacto comercial se conservan hasta que solicite su supresión.
            </p>
          </Section>

          <Section title="5. Destinatarios">
            <p style={BODY}>
              No cedemos sus datos a terceros salvo obligación legal. Utilizamos proveedores de servicios tecnológicos (alojamiento web, base de datos) que actúan como encargados del tratamiento bajo acuerdo de confidencialidad.
            </p>
          </Section>

          <Section title="6. Sus Derechos">
            <p style={BODY}>Puede ejercer en cualquier momento los siguientes derechos:</p>
            <ul style={LIST}>
              <li><strong>Acceso:</strong> conocer qué datos tratamos sobre usted.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
              <li><strong>Supresión:</strong> solicitar el borrado de sus datos.</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo.</li>
              <li><strong>Limitación:</strong> restringir el tratamiento en determinados supuestos.</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado.</li>
            </ul>
            <p style={BODY}>
              Para ejercer sus derechos, diríjase a <a href="mailto:asturocasion@gmail.com" style={{ color: "#0071E3" }}>asturocasion@gmail.com</a> indicando el derecho que desea ejercitar y aportando copia de su DNI. También puede presentar una reclamación ante la <strong>Agencia Española de Protección de Datos</strong> (www.aepd.es).
            </p>
          </Section>

          <Section title="7. Seguridad">
            <p style={BODY}>
              Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos frente a accesos no autorizados, pérdida o destrucción accidental, conforme a lo exigido por el RGPD.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p style={BODY}>
              Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento. No se utilizan cookies de seguimiento ni publicidad sin consentimiento previo. Puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envíe una cookie.
            </p>
          </Section>

          <p style={{ ...BODY, color: "#86868B", fontSize: "0.8rem", marginTop: "2.5rem", borderTop: "1px solid #E8E8ED", paddingTop: "1.5rem" }}>
            Última actualización: junio de 2026
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: "700", color: "#1D1D1F", margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>{title}</h2>
      {children}
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

const LIST: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem",
  color: "#3D3D3F",
  lineHeight: 1.75,
  paddingLeft: "1.25rem",
  margin: "0.5rem 0 0.75rem",
};
