import { Link } from "wouter";
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Astur Ocasión</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Concesionario de vehículos de ocasión premium en Oviedo. Amplia selección de coches 100% revisados.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/asturocasion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/asturocasion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Inicio
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/catalogo">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Catálogo
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/compramos-tu-coche">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Tasación
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contacto">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Contacto
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Oviedo, Asturias</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="tel:984180450"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  984 180 450
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="tel:629574957"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  629 574 957
                </a>
              </li>
            </ul>
          </div>

          {/* Horario */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Horario</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p>Lunes a Viernes</p>
                  <p>10:00 - 13:30</p>
                  <p>16:00 - 20:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Astur Ocasión del Automóvil. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Política de Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
