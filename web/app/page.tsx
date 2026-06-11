import Link from "next/link";
import { supabase } from "@/lib/supabase";
import VehicleCard from "@/components/VehicleCard";
import { ArrowRight, Shield, Award, PhoneCall, Search } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const { data: featured } = await supabase
    .from("vehicles")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "available")
    .limit(6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Encuentra tu coche ideal en Asturias
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Vehículos de ocasión revisados y con garantía. Financiación a medida y tasación gratuita de tu coche.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/catalogo"
              className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Ver catálogo
            </Link>
            <Link
              href="/tasacion"
              className="bg-accent text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Tasar mi coche
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Vehículos Revisados", desc: "Todos nuestros coches pasan una revisión de 100 puntos antes de la venta." },
              { icon: Award, title: "Garantía Incluida", desc: "Cada vehículo incluye garantía mecánica y posibilidad de extensión." },
              { icon: PhoneCall, title: "Atención Personalizada", desc: "Nuestro equipo te asesora sin compromiso para encontrar tu coche ideal." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-accent" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured vehicles */}
      {featured && featured.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Vehículos Destacados</h2>
                <p className="text-gray-500 mt-1">Las mejores ofertas de la semana</p>
              </div>
              <Link href="/catalogo" className="text-accent font-semibold text-sm flex items-center gap-1 hover:underline">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA tasación */}
      <section className="py-14 bg-accent px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-3">¿Quieres vender tu coche?</h2>
          <p className="text-white/80 mb-6">
            Tasamos tu vehículo gratis y sin compromiso. Recibe una oferta en menos de 24 horas.
          </p>
          <Link
            href="/tasacion"
            className="bg-white text-accent font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Pide tu tasación gratuita
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
