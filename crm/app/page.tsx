import DashboardLayout from "@/components/DashboardLayout";
import { createAdminClient } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 30;

export default async function DashboardPage() {
  const admin = createAdminClient();

  const [
    { count: totalVehicles },
    { count: availableVehicles },
    { count: soldVehicles },
    { count: totalLeads },
    { count: newLeads },
    { data: recentLeads },
  ] = await Promise.all([
    admin.from("vehicles").select("*", { count: "exact", head: true }),
    admin.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "available"),
    admin.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "sold"),
    admin.from("leads").select("*", { count: "exact", head: true }),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    admin.from("leads").select("*, vehicles(brand, model)").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    {
      icon: "directions_car",
      label: "Total Inventario",
      value: totalVehicles ?? 0,
      sub: "vehículos registrados",
      trend: null,
      color: "text-tertiary",
    },
    {
      icon: "check_circle",
      label: "Disponibles",
      value: availableVehicles ?? 0,
      sub: "listos para vender",
      trend: null,
      color: "text-success-green",
    },
    {
      icon: "person_search",
      label: "Leads Totales",
      value: totalLeads ?? 0,
      sub: "consultas recibidas",
      trend: null,
      color: "text-secondary",
    },
    {
      icon: "notifications_active",
      label: "Leads Nuevos",
      value: newLeads ?? 0,
      sub: "pendientes de contactar",
      trend: (newLeads ?? 0) > 0 ? "Prioridad" : null,
      color: "text-error",
    },
  ];

  const typeLabel: Record<string, string> = {
    contact: "Contacto General",
    valuation: "Tasación",
    vehicle_inquiry: "Consulta Vehículo",
  };

  const statusConfig: Record<string, { label: string; cls: string }> = {
    new: { label: "Nuevo", cls: "bg-error-container text-error border border-error/20" },
    contacted: { label: "Contactado", cls: "bg-secondary-container text-on-secondary-container border border-secondary/20" },
    closed: { label: "Cerrado", cls: "bg-surface-container-highest text-on-surface-variant border border-outline-variant" },
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">Panel de Control</h1>
        <p className="text-on-surface-variant text-sm mt-1">Resumen del estado actual del concesionario</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container-high border border-outline-variant rounded-xl p-5 hover:border-tertiary/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{s.label}</span>
              {s.trend && (
                <span className="text-[10px] font-bold text-error bg-error-container px-2 py-0.5 rounded">{s.trend}</span>
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-on-surface tabular-nums">{s.value}</p>
                <p className="text-on-surface-variant text-xs mt-1">{s.sub}</p>
              </div>
              <span className={`material-symbols-outlined text-[32px] opacity-60 ${s.color}`}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-high border border-outline-variant rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-tertiary">speed</span>
            <span className="text-[10px] font-bold text-success-green">Activo</span>
          </div>
          <p className="text-2xl font-bold text-on-surface">{soldVehicles ?? 0}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Vehículos Vendidos</p>
        </div>
        <div className="bg-surface-container-high border border-outline-variant rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-tertiary">trending_up</span>
            <span className="text-[10px] font-bold text-on-surface-variant">En tiempo real</span>
          </div>
          <p className="text-2xl font-bold text-on-surface">
            {totalVehicles ? Math.round(((availableVehicles ?? 0) / totalVehicles) * 100) : 0}%
          </p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Disponibilidad</p>
        </div>
        <div className="bg-surface-container-high border border-outline-variant rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-tertiary">ads_click</span>
            <span className="text-[10px] font-bold text-on-surface-variant">Leads</span>
          </div>
          <p className="text-2xl font-bold text-on-surface">
            {totalLeads ? Math.round(((totalLeads - (newLeads ?? 0)) / totalLeads) * 100) : 0}%
          </p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Tasa de Contacto</p>
        </div>
      </div>

      {/* Recent Leads */}
      {recentLeads && recentLeads.length > 0 && (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <h2 className="text-base font-semibold text-on-surface">Leads Recientes</h2>
            <Link href="/leads" className="text-xs font-bold text-tertiary hover:underline flex items-center gap-1">
              Ver todos
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-container-highest">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cliente</th>
                <th className="text-left px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tipo</th>
                <th className="text-left px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Estado</th>
                <th className="text-left px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {recentLeads.map((lead) => {
                const sc = statusConfig[lead.status] ?? statusConfig.new;
                return (
                  <tr key={lead.id} className="hover:bg-surface-variant/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-xs">
                          {lead.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-sm">{lead.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs">{typeLabel[lead.type] ?? lead.type}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {new Date(lead.created_at).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
