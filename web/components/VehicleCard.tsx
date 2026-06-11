import Link from "next/link";
import { Fuel, Gauge, Calendar, Cog } from "lucide-react";
import type { Vehicle } from "@/lib/supabase";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatKm(km: number) {
  return new Intl.NumberFormat("es-ES").format(km) + " km";
}

const statusLabel: Record<string, { label: string; color: string }> = {
  available: { label: "Disponible", color: "bg-green-100 text-green-700" },
  reserved: { label: "Reservado", color: "bg-yellow-100 text-yellow-700" },
  sold: { label: "Vendido", color: "bg-red-100 text-red-700" },
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const st = statusLabel[vehicle.status] ?? statusLabel.available;
  const thumb = vehicle.images?.[0] ?? null;

  return (
    <Link href={`/vehiculo/${vehicle.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className="relative h-48 bg-gray-100">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-gray-400 text-4xl">🚗</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white font-bold text-sm px-3 py-1 rounded-full">
              {formatPrice(vehicle.price)}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${st.color}`}>
              {st.label}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {vehicle.brand} {vehicle.model}
          </h3>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-accent" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge size={13} className="text-accent" />
              <span>{formatKm(vehicle.km)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel size={13} className="text-accent" />
              <span>{vehicle.fuel_type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog size={13} className="text-accent" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
