import Link from "next/link";
import { Car, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <div className="bg-white/20 rounded-lg p-1.5">
                <Car size={20} />
              </div>
              Astur Ocasión
            </div>
            <p className="text-white/70 text-sm">
              Tu concesionario de confianza en Asturias. Vehículos revisados con garantía.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              {[
                { href: "/catalogo", label: "Catálogo" },
                { href: "/tasacion", label: "Tasación gratuita" },
                { href: "/sobre-nosotros", label: "Sobre Nosotros" },
                { href: "/contacto", label: "Contacto" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} />
                <span>+34 985 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} />
                <span>info@asturocasion.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Oviedo, Asturias</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/50 text-xs">
          © {new Date().getFullYear()} Astur Ocasión. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
