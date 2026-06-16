import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#1D1D1F",
        color: "#F5F5F7",
        borderTop: "none",
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
            <div style={{ marginBottom: "1.25rem" }}>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "800",
                  fontSize: "1.2rem",
                  color: "#F5F5F7",
                  letterSpacing: "-0.03em",
                }}
              >
                Astur <span style={{ color: "#0071E3" }}>Ocasión</span>
              </span>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(245,245,247,0.45)",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
              }}
            >
              Concesionario de vehículos de ocasión premium en Oviedo. Calidad, transparencia y trato personal desde hace más de 15 años.
            </p>
            <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
              {/* Facebook */}
              <a
                href="https://facebook.com/asturocasion"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  width: "44px", height: "44px",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#1877F2",
                  color: "#FFFFFF",
                  transition: "transform 0.2s, opacity 0.2s",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(24,119,242,0.35)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/asturocasion"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  width: "44px", height: "44px",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  color: "#FFFFFF",
                  transition: "transform 0.2s, opacity 0.2s",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(220,39,67,0.35)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,245,247,0.3)",
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
                        color: "rgba(245,245,247,0.45)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0071E3")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,247,0.45)")}
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
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,245,247,0.3)",
                marginBottom: "1.25rem",
              }}
            >
              Contacto
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(245,245,247,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Teléfono</p>
                <a href="tel:984180450" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#0071E3", textDecoration: "none", fontWeight: "600" }}>984 180 450</a>
              </li>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(245,245,247,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>WhatsApp</p>
                <a href="https://wa.me/34629574957" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(245,245,247,0.55)", textDecoration: "none" }}>629 574 957</a>
              </li>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(245,245,247,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</p>
                <a href="mailto:asturocasion@gmail.com" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(245,245,247,0.55)", textDecoration: "none" }}>asturocasion@gmail.com</a>
              </li>
              <li>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(245,245,247,0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ubicación</p>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(245,245,247,0.55)" }}>José Manuel Fuente, 2<br />33002 Oviedo, Asturias</span>
                <br />
                <a
                  href="https://maps.google.com/?q=Astur+Ocasion+Oviedo"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#0071E3", textDecoration: "none", fontWeight: "500" }}
                >
                  Ver en Google Maps →
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,245,247,0.3)",
                marginBottom: "1.25rem",
              }}
            >
              Horario
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: "600", color: "rgba(245,245,247,0.7)", marginBottom: "2px" }}>Lunes — Viernes</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(245,245,247,0.4)" }}>10:00 – 13:30</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(245,245,247,0.4)" }}>16:00 – 20:00</p>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: "600", color: "rgba(245,245,247,0.7)", marginBottom: "2px" }}>Sábados</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(245,245,247,0.4)" }}>10:00 – 13:30</p>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(0,113,227,0.15)",
                    border: "1px solid rgba(0,113,227,0.3)",
                    borderRadius: "100px",
                    padding: "4px 12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.72rem",
                    color: "#5AC8FA",
                    fontWeight: "500",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0071E3", display: "inline-block" }} />
                  Atención personalizada
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
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
              color: "rgba(245,245,247,0.3)",
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
                  color: "rgba(245,245,247,0.25)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,247,0.6)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,247,0.25)")}
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
