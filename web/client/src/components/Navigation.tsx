import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/compramos-tu-coche", label: "Tasación" },
    { href: "/sobre-nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          background: scrolled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.08)" : "none",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

          {/* Logo */}
          <Link href="/">
            <a style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "#0071E3",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "800",
                  fontSize: "0.85rem",
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  flexShrink: 0,
                }}
              >
                AO
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    color: "#1D1D1F",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Astur Ocasión
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.6rem",
                    color: "#86868B",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: "500",
                  }}
                >
                  del Automóvil
                </span>
              </div>
            </a>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                  style={{ color: isActive(link.href) ? "#0071E3" : "#1D1D1F" }}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <a
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        color: "#6E6E73",
                        textDecoration: "none",
                        padding: "6px 12px",
                        border: "1px solid #D2D2D7",
                        borderRadius: "980px",
                        transition: "border-color 0.2s, color 0.2s",
                      }}
                      className="hidden md:inline-flex"
                    >
                      Admin
                    </a>
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "#86868B",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="hidden md:inline"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link href="/catalogo">
                <a className="btn-primary hidden md:inline-flex" style={{ padding: "0.55rem 1.25rem", fontSize: "0.82rem" }}>
                  Ver Catálogo
                </a>
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#1D1D1F",
                padding: "6px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label="Menú"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 49,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Drawer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "280px",
            background: "#FFFFFF",
            borderLeft: "1px solid #E8E8ED",
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: "5rem 2rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "none",
              border: "none",
              color: "#86868B",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>

          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1rem",
                  fontWeight: "500",
                  color: isActive(link.href) ? "#0071E3" : "#1D1D1F",
                  textDecoration: "none",
                  padding: "0.85rem 0",
                  borderBottom: "1px solid #F5F5F7",
                }}
              >
                {link.label}
                <ChevronRight size={16} style={{ opacity: 0.3 }} />
              </a>
            </Link>
          ))}

          <div style={{ marginTop: "2rem" }}>
            <a
              href="tel:984180450"
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                fontWeight: "600",
                color: "#0071E3",
                textDecoration: "none",
                marginBottom: "0.5rem",
              }}
            >
              984 180 450
            </a>
            <a
              href="https://wa.me/34629574957"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "#6E6E73",
                textDecoration: "none",
              }}
            >
              WhatsApp: 629 574 957
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
