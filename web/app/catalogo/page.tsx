import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import VehicleCard from "@/components/VehicleCard";
import VehicleFilters from "@/components/VehicleFilters";
import type { Vehicle } from "@/lib/supabase";

export const revalidate = 30;

type SearchParams = {
  brand?: string;
  fuel?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
};

async function getVehicles(params: SearchParams): Promise<Vehicle[]> {
  let query = supabase.from("vehicles").select("*").order("created_at", { ascending: false });

  if (params.brand) query = query.eq("brand", params.brand);
  if (params.fuel) query = query.eq("fuel_type", params.fuel);
  if (params.transmission) query = query.eq("transmission", params.transmission);
  if (params.minPrice) query = query.gte("price", parseInt(params.minPrice));
  if (params.maxPrice) query = query.lte("price", parseInt(params.maxPrice));

  const { data } = await query;
  return (data as Vehicle[]) ?? [];
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const vehicles = await getVehicles(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Catálogo de Vehículos</h1>
        <p className="text-gray-500 mt-1">
          Encuentra el vehículo perfecto entre nuestras {vehicles.length} opciones disponibles
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0">
          <Suspense fallback={<div className="h-96 bg-gray-50 rounded-2xl animate-pulse" />}>
            <VehicleFilters total={vehicles.length} />
          </Suspense>
        </aside>

        <div className="flex-1">
          {vehicles.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🚗</p>
              <p className="font-semibold text-gray-600">No hay vehículos con esos filtros</p>
              <p className="text-sm mt-1">Prueba a cambiar los criterios de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
