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
          className="footer-grid"
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
              Concesionario de vehículos de ocasión premium en Oviedo. Calidad, transparencia y trato personal.
            </p>
            <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
              {/* WhatsApp */}
              <a
                href="https://wa.me/34629574957"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{
                  width: "44px", height: "44px",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#25D366",
                  color: "#FFFFFF",
                  transition: "transform 0.2s, opacity 0.2s",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(37,211,102,0.35)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/search/top?q=astur%20ocasi%C3%B3n%20oviedo"
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
                href="https://www.instagram.com/explore/search/keyword/?q=asturocasion"
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
          className="footer-bottom"
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
            <a
              href="/politica-de-privacidad"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(245,245,247,0.25)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,247,0.6)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,247,0.25)")}
            >
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
