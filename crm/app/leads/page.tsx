import DashboardLayout from "@/components/DashboardLayout";
import { createAdminClient } from "@/lib/supabase";
import LeadRow from "@/components/LeadRow";

export const revalidate = 0;

const typeLabel: Record<string, string> = {
  contact: "Contacto",
  valuation: "Tasación",
  vehicle_inquiry: "Consulta vehículo",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("leads")
    .select("*, vehicles(brand, model)")
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);
  if (params.type) query = query.eq("type", params.type);

  const { data: leads } = await query;

  const filters = [
    { label: "Todos", value: "" },
    { label: "Nuevos", value: "new" },
    { label: "Contactados", value: "contacted" },
    { label: "Cerrados", value: "closed" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 text-sm">{leads?.length ?? 0} registros</p>
      </div>

      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <a
            key={f.value}
            href={f.value ? `/leads?status=${f.value}` : "/leads"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (params.status ?? "") === f.value
                ? "bg-accent text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Contacto</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Vehículo</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads?.map((lead) => (
              <LeadRow key={lead.id} lead={lead} typeLabel={typeLabel} />
            ))}
          </tbody>
        </table>

        {(!leads || leads.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📬</p>
            <p className="font-semibold">No hay leads todavía</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
