"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Car } from "lucide-react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/tasacion", label: "Tasación" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="bg-primary text-white rounded-lg p-1.5">
              <Car size={20} />
            </div>
            Astur Ocasión
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-600 hover:text-primary font-medium transition-colors text-sm"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Contactar
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-700 font-medium py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
