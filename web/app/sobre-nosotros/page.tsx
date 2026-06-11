import { Users, Calendar, Car, Star } from "lucide-react";

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Sobre Nosotros</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Somos un concesionario de confianza en Asturias con más de 15 años de experiencia en la compraventa de vehículos de ocasión.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
        {[
          { icon: Calendar, stat: "15+", label: "Años de experiencia" },
          { icon: Car, stat: "500+", label: "Vehículos vendidos" },
          { icon: Users, stat: "2.000+", label: "Clientes satisfechos" },
          { icon: Star, stat: "4.9", label: "Valoración media" },
        ].map(({ icon: Icon, stat, label }) => (
          <div key={label} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
            <Icon className="text-accent mx-auto mb-2" size={24} />
            <p className="text-2xl font-extrabold text-gray-900">{stat}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary text-white rounded-2xl p-8 md:p-10">
        <h2 className="text-2xl font-bold mb-4">Nuestra historia</h2>
        <p className="text-white/80 leading-relaxed">
          Fundado en 2009, Astur Ocasión nació con el objetivo de ofrecer una alternativa de confianza en el mercado de vehículos de segunda mano en Asturias. Desde entonces, hemos crecido hasta convertirnos en uno de los concesionarios de referencia en la región, con un equipo de profesionales comprometidos con la satisfacción del cliente.
        </p>
        <p className="text-white/80 leading-relaxed mt-4">
          Todos nuestros vehículos pasan una revisión exhaustiva de 100 puntos antes de ser puestos a la venta, garantizando así la máxima seguridad y fiabilidad para nuestros clientes.
        </p>
      </div>
    </div>
  );
}
