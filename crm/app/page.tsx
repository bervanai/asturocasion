import DashboardLayout from "@/components/DashboardLayout";
import { createAdminClient } from "@/lib/supabase";
import { Car, MessageSquare, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

export default async function DashboardPage() {
  const admin = createAdminClient();

  const [
    { count: totalVehicles },
    { count: availableVehicles },
    { count: totalLeads },
    { count: newLeads },
    { data: recentLeads },
  ] = await Promise.all([
    admin.from("vehicles").select("*", { count: "exact", head: true }),
    admin.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "available"),
    admin.from("leads").select("*", { count: "exact", head: true }),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    admin.from("leads").select("*, vehicles(brand, model)").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { icon: Car, label: "Total vehículos", value: totalVehicles ?? 0, color: "bg-blue-50 text-blue-600" },
    { icon: TrendingUp, label: "Disponibles", value: availableVehicles ?? 0, color: "bg-green-50 text-green-600" },
    { icon: MessageSquare, label: "Total leads", value: totalLeads ?? 0, color: "bg-purple-50 text-purple-600" },
    { icon: Clock, label: "Leads nuevos", value: newLeads ?? 0, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen del estado actual</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {recentLeads && recentLeads.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Últimos leads</h2>
            <Link href="/leads" className="text-xs text-accent hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    lead.status === "new" ? "bg-orange-100 text-orange-700" :
                    lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {lead.status === "new" ? "Nuevo" : lead.status === "contacted" ? "Contactado" : "Cerrado"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(lead.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
