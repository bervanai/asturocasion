import DashboardLayout from "@/components/DashboardLayout";
import { createAdminClient } from "@/lib/supabase";
import LeadRow from "@/components/LeadRow";

export const revalidate = 0;

const typeLabel: Record<string, string> = {
  contact: "Contacto General",
  valuation: "Tasación",
  vehicle_inquiry: "Consulta Vehículo",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("leads")
    .select("*, vehicles(brand, model)")
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  const { data: leads } = await query;

  const [
    { count: totalLeads },
    { count: newLeads },
    { count: contactedLeads },
  ] = await Promise.all([
    admin.from("leads").select("*", { count: "exact", head: true }),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    admin.from("leads").select("*", { count: "exact", head: true }).eq("status", "contacted"),
  ]);

  const filters = [
    { label: "Todos", value: "" },
    { label: "Nuevos", value: "new" },
    { label: "Contactados", value: "contacted" },
    { label: "Cerrados", value: "closed" },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-12 md:col-span-8">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Pipeline de Leads</h1>
          <p className="text-on-surface-variant text-sm mt-1">Gestiona y rastrea tus oportunidades desde el contacto inicial hasta el cierre.</p>
        </div>
        <div className="col-span-12 md:col-span-4 flex justify-end items-end gap-3">
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <a
                key={f.value}
                href={f.value ? `/leads?status=${f.value}` : "/leads"}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  (params.status ?? "") === f.value
                    ? "bg-tertiary text-on-tertiary"
                    : "border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
                }`}
              >
                {f.label}
              </a>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-high/70 backdrop-blur border border-outline-variant/50 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Leads Totales</span>
            <span className="text-tertiary bg-tertiary/10 px-2 py-0.5 rounded text-[10px] font-bold">Total</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">{totalLeads ?? 0}</div>
          <div className="mt-3 h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-tertiary" style={{ width: "75%" }} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-surface-container-high/70 backdrop-blur border border-outline-variant/50 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Leads Nuevos</span>
            <span className="text-error bg-error/10 px-2 py-0.5 rounded text-[10px] font-bold">Prioridad</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">{newLeads ?? 0}</div>
          <div className="mt-3 h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-error" style={{ width: `${totalLeads ? Math.round(((newLeads ?? 0) / totalLeads) * 100) : 0}%` }} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-surface-container-high/70 backdrop-blur border border-outline-variant/50 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Contactados</span>
            <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded text-[10px] font-bold">En progreso</span>
          </div>
          <div className="text-3xl font-bold text-on-surface">{contactedLeads ?? 0}</div>
          <div className="mt-3 h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: `${totalLeads ? Math.round(((contactedLeads ?? 0) / totalLeads) * 100) : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-high/70 backdrop-blur border border-outline-variant/50 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Vehículo</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {leads?.map((lead) => (
                <LeadRow key={lead.id} lead={lead} typeLabel={typeLabel} />
              ))}
            </tbody>
          </table>
        </div>

        {(!leads || leads.length === 0) && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">person_search</span>
            <p className="font-semibold">No hay leads todavía</p>
          </div>
        )}

        <div className="bg-surface-container px-6 py-3 border-t border-outline-variant">
          <p className="text-xs text-on-surface-variant">
            Mostrando <span className="text-on-surface font-semibold">{leads?.length ?? 0}</span> de <span className="text-on-surface font-semibold">{totalLeads ?? 0}</span> leads
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
