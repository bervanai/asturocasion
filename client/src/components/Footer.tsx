import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#0d0f14",
        color: "#f8f6f2",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container" style={{ padding: "4rem 1.25rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#e8a020",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: "700",
                  fontSize: "0.8rem",
                  color: "#0d0f14",
                }}
              >
                AO
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  color: "#f8f6f2",
                }}
              >
                Astur Ocasión
              </span>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(248,246,242,0.45)",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
              }}
            >
              Concesionario de vehículos de ocasión premium en Oviedo. Calidad, transparencia y trato personal desde hace más de 15 años.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a
                href="https://facebook.com/asturocasion"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  width: "34px",
                  height: "34px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(248,246,242,0.4)",
                  transition: "border-color 0.2s, color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e8a020";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#e8a020";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,242,0.4)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/asturocasion"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  width: "34px",
                  height: "34px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(248,246,242,0.4)",
                  transition: "border-color 0.2s, color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e8a020";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#e8a020";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,242,0.4)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://wa.me/34629574957"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{
                  width: "34px",
                  height: "34px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(248,246,242,0.4)",
                  transition: "border-color 0.2s, color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#25d366";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#25d366";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,242,0.4)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: "600",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(248,246,242,0.3)",
                marginBottom: "1.25rem",
              }}
            >
              Navegación
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo de Vehículos" },
                { href: "/compramos-tu-coche", label: "Compramos tu Coche" },
                { href: "/sobre-nosotros", label: "Sobre Nosotros" },
                { href: "/contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.85rem",
                        color: "rgba(248,246,242,0.45)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#e8a020")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,242,0.45)")}
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: "600",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(248,246,242,0.3)",
                marginBottom: "1.25rem",
              }}
            >
              Contacto
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(248,246,242,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Teléfono</p>
                <a href="tel:984180450" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#e8a020", textDecoration: "none" }}>984 180 450</a>
              </li>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(248,246,242,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>WhatsApp</p>
                <a href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(248,246,242,0.55)", textDecoration: "none" }}>629 574 957</a>
              </li>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(248,246,242,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</p>
                <a href="mailto:info@asturocasion.es" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(248,246,242,0.55)", textDecoration: "none" }}>info@asturocasion.es</a>
              </li>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(248,246,242,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ubicación</p>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(248,246,242,0.55)" }}>Oviedo, Asturias</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: "600",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(248,246,242,0.3)",
                marginBottom: "1.25rem",
              }}
            >
              Horario
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: "500", color: "rgba(248,246,242,0.7)", marginBottom: "2px" }}>Lunes — Viernes</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(248,246,242,0.4)" }}>10:00 – 13:30</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(248,246,242,0.4)" }}>16:00 – 20:00</p>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(232,160,32,0.1)",
                    border: "1px solid rgba(232,160,32,0.2)",
                    borderRadius: "100px",
                    padding: "4px 12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.72rem",
                    color: "#e8a020",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e8a020", display: "inline-block" }} />
                  Atención personalizada
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "rgba(248,246,242,0.3)",
            }}
          >
            &copy; {currentYear} Astur Ocasión del Automóvil. Todos los derechos reservados.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {["Política de Privacidad", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(248,246,242,0.25)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,242,0.6)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,242,0.25)")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
