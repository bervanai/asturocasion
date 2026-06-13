import DashboardLayout from "@/components/DashboardLayout";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import VehicleActions from "@/components/VehicleActions";

export const revalidate = 0;

const statusConfig = {
  available: { label: "Disponible", cls: "border border-success-green/40 text-success-green bg-success-green/5" },
  reserved: { label: "Reservado", cls: "border border-warning-yellow/40 text-warning-yellow bg-warning-yellow/5" },
  sold: { label: "Vendido", cls: "border border-outline-variant text-on-surface-variant bg-surface-container-highest" },
};

export default async function VehiculosPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const admin = createAdminClient();
  let query = admin.from("vehicles").select("*").order("created_at", { ascending: false });
  if (q) {
    query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%,color.ilike.%${q}%`);
  }
  const { data: vehicles } = await query;

  const total = vehicles?.length ?? 0;
  const available = vehicles?.filter((v) => v.status === "available").length ?? 0;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Inventario de Vehículos</h1>
          <div className="flex items-center gap-3 mt-1">
            {q ? (
              <span className="text-tertiary text-sm">Resultados para &quot;{q}&quot; — {total} encontrados</span>
            ) : (
              <>
                <span className="text-on-surface-variant text-sm">{total} unidades totales</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                <span className="text-on-surface-variant text-sm">{available} disponibles</span>
              </>
            )}
          </div>
        </div>
        <Link
          href="/vehiculos/nuevo"
          className="flex items-center gap-2 bg-[#FF5733] hover:brightness-110 text-white text-xs font-bold px-5 py-3 rounded-lg transition-all active:scale-95 uppercase tracking-wider shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Añadir Vehículo
        </Link>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-2xl shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-highest border-b border-outline-variant">
              <tr>
                <th className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest w-20">Foto</th>
                <th className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest min-w-[220px]">Vehículo</th>
                <th className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Año</th>
                <th className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Precio</th>
                <th className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Km</th>
                <th className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Estado</th>
                <th className="px-5 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {vehicles?.map((v) => {
                const sc = statusConfig[v.status as keyof typeof statusConfig] ?? statusConfig.available;
                return (
                  <tr key={v.id} className="hover:bg-surface-variant/40 transition-colors group">
                    <td className="px-5 py-3">
                      {v.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.images[0]}
                          alt={`${v.brand} ${v.model}`}
                          className="w-16 h-12 object-cover rounded border border-outline-variant"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center text-xl">🚗</div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-on-surface text-[15px]">{v.brand} {v.model}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{v.fuel_type} · {v.transmission}</p>
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant text-sm">{v.year}</td>
                    <td className="px-5 py-3 text-right font-semibold text-on-surface text-[15px]">
                      {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v.price)}
                    </td>
                    <td className="px-5 py-3 text-right text-on-surface-variant text-sm">
                      {new Intl.NumberFormat("es-ES").format(v.km)} km
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <VehicleActions id={v.id} status={v.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(!vehicles || vehicles.length === 0) && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">directions_car</span>
            <p className="font-semibold">No hay vehículos todavía</p>
            <Link href="/vehiculos/nuevo" className="text-tertiary text-sm hover:underline mt-1 inline-block">Añadir el primero</Link>
          </div>
        )}

        <div className="bg-surface-container-low border-t border-outline-variant px-5 py-3">
          <p className="text-xs text-on-surface-variant">
            Mostrando <span className="text-on-surface font-semibold">{total}</span> vehículos
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
