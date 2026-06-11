import DashboardLayout from "@/components/DashboardLayout";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";

export const revalidate = 0;

const statusBadge = {
  available: "bg-green-100 text-green-700",
  reserved: "bg-yellow-100 text-yellow-700",
  sold: "bg-red-100 text-red-700",
};
const statusLabel = { available: "Disponible", reserved: "Reservado", sold: "Vendido" };

export default async function VehiculosPage() {
  const admin = createAdminClient();
  const { data: vehicles } = await admin
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-500 text-sm">{vehicles?.length ?? 0} vehículos en total</p>
        </div>
        <Link
          href="/vehiculos/nuevo"
          className="bg-accent text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo vehículo
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Vehículo</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Año</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Precio</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Km</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vehicles?.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-semibold text-gray-900">
                  {v.brand} {v.model}
                </td>
                <td className="px-5 py-3 text-gray-500">{v.year}</td>
                <td className="px-5 py-3 font-semibold text-gray-900">
                  {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v.price)}
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {new Intl.NumberFormat("es-ES").format(v.km)} km
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge[v.status as keyof typeof statusBadge] ?? "bg-gray-100 text-gray-600"}`}>
                    {statusLabel[v.status as keyof typeof statusLabel] ?? v.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/vehiculos/${v.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <Link
                      href={`/vehiculos/${v.id}/preview`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Eye size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!vehicles || vehicles.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🚗</p>
            <p className="font-semibold">No hay vehículos todavía</p>
            <Link href="/vehiculos/nuevo" className="text-accent text-sm hover:underline mt-1 inline-block">
              Añadir el primero
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
