import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Fuel, Gauge, Calendar, Cog, Palette, DoorOpen, Zap, ArrowLeft, Phone } from "lucide-react";
import ContactVehicleForm from "@/components/ContactVehicleForm";
import ImageGallery from "@/components/ImageGallery";

export const revalidate = 60;

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);
}

const statusLabel: Record<string, { label: string; color: string }> = {
  available: { label: "Disponible", color: "bg-green-100 text-green-700" },
  reserved: { label: "Reservado", color: "bg-yellow-100 text-yellow-700" },
  sold: { label: "Vendido", color: "bg-red-100 text-red-700" },
};

export default async function VehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: vehicle } = await supabase.from("vehicles").select("*").eq("id", id).single();

  if (!vehicle) notFound();

  const st = statusLabel[vehicle.status] ?? statusLabel.available;

  const specs = [
    { icon: Calendar, label: "Año", value: vehicle.year },
    { icon: Gauge, label: "Kilómetros", value: new Intl.NumberFormat("es-ES").format(vehicle.km) + " km" },
    { icon: Fuel, label: "Combustible", value: vehicle.fuel_type },
    { icon: Cog, label: "Cambio", value: vehicle.transmission },
    vehicle.color && { icon: Palette, label: "Color", value: vehicle.color },
    vehicle.doors && { icon: DoorOpen, label: "Puertas", value: vehicle.doors },
    vehicle.power_cv && { icon: Zap, label: "Potencia", value: vehicle.power_cv + " CV" },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string | number }[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent mb-6">
        <ArrowLeft size={14} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Galería */}
        <div>
          <ImageGallery images={vehicle.images ?? []} alt={`${vehicle.brand} ${vehicle.model}`} />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>
              {st.label}
            </span>
          </div>

          <p className="text-4xl font-extrabold text-accent mb-6">{formatPrice(vehicle.price)}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <Icon size={16} className="text-accent shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {vehicle.description && (
            <p className="text-gray-600 text-sm mb-6">{vehicle.description}</p>
          )}

          <a
            href="tel:+34985000000"
            className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors mb-3"
          >
            <Phone size={18} />
            Llamar ahora
          </a>
        </div>
      </div>

      {/* Contact form */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">¿Te interesa este vehículo?</h2>
        <ContactVehicleForm vehicleId={vehicle.id} vehicleName={`${vehicle.brand} ${vehicle.model}`} />
      </div>
    </div>
  );
}
