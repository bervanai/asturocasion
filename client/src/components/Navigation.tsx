import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/compramos-tu-coche", label: "Tasación" },
    { href: "/sobre-nosotros", label: "Sobre Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white text-sm font-bold">
              AO
            </div>
            <span className="hidden sm:inline">Astur Ocasión</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className="text-foreground hover:text-primary transition-colors text-sm font-medium">
                {link.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin">
                  <a>
                    <Button variant="outline" size="sm">
                      Panel Admin
                    </Button>
                  </a>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
              >
                Salir
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Acceso Admin
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className="text-foreground hover:text-primary transition-colors text-sm font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
