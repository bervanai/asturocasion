import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
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
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "800",
                  fontSize: "1.15rem",
                  color: "#1D1D1F",
                  letterSpacing: "-0.03em",
                }}
              >
                Astur <span style={{ color: "#0071E3" }}>Ocasión</span>
              </span>
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

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                color: "#1D1D1F",
                fontSize: "1.4rem",
                lineHeight: 1,
              }}
              className="block md:hidden"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            paddingTop: "80px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: isActive(link.href) ? "#0071E3" : "#1D1D1F",
                    textDecoration: "none",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    display: "block",
                  }}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>
          {user && (
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              style={{
                marginTop: "1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "#86868B",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "0.5rem 0",
              }}
            >
              Salir
            </button>
          )}
        </div>
      )}
    </>
  );
}
