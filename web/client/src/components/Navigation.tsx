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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
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
          transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          background: scrolled ? "rgba(13,15,20,0.97)" : "#0d0f14",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

          {/* Logo */}
          <Link href="/">
            <a
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  background: "#e8a020",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  color: "#0d0f14",
                  letterSpacing: "-0.02em",
                  flexShrink: 0,
                  boxShadow: "0 2px 10px rgba(232,160,32,0.35)",
                }}
              >
                AO
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "#f8f6f2",
                    letterSpacing: "0.01em",
                  }}
                >
                  Astur Ocasión
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.62rem",
                    color: "rgba(248,246,242,0.4)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  del Automóvil
                </span>
              </div>
            </a>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2.25rem" }} className="hidden md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                  style={{ color: isActive(link.href) ? "#e8a020" : "rgba(248,246,242,0.75)" }}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <a
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        color: "rgba(248,246,242,0.6)",
                        textDecoration: "none",
                        padding: "6px 12px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "3px",
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
                    color: "rgba(248,246,242,0.5)",
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
                <a className="btn-primary hidden md:inline-flex" style={{ padding: "0.6rem 1.4rem", fontSize: "0.82rem" }}>
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
                color: "#f8f6f2",
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
            background: "rgba(0,0,0,0.6)",
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
            background: "#0d0f14",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
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
              color: "rgba(248,246,242,0.5)",
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
                  color: isActive(link.href) ? "#e8a020" : "rgba(248,246,242,0.8)",
                  textDecoration: "none",
                  padding: "0.85rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {link.label}
                <ChevronRight size={16} style={{ opacity: 0.4 }} />
              </a>
            </Link>
          ))}

          <div style={{ marginTop: "2rem" }}>
            <a
              href="tel:984180450"
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "#e8a020",
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
                color: "rgba(248,246,242,0.5)",
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
