"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/supabase";
import { ChevronDown } from "lucide-react";

const statusBadge = {
  new: "bg-orange-100 text-orange-700",
  contacted: "bg-blue-100 text-blue-700",
  closed: "bg-gray-100 text-gray-600",
};
const statusLabel = { new: "Nuevo", contacted: "Contactado", closed: "Cerrado" };

export default function LeadRow({
  lead,
  typeLabel,
}: {
  lead: Lead & { vehicles?: { brand: string; model: string } | null };
  typeLabel: Record<string, string>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [updating, setUpdating] = useState(false);

  const changeStatus = async (newStatus: string) => {
    setUpdating(true);
    await supabase.from("leads").update({ status: newStatus }).eq("id", lead.id);
    setStatus(newStatus as Lead["status"]);
    setUpdating(false);
    router.refresh();
  };

  const vehicleName = lead.vehicles
    ? `${lead.vehicles.brand} ${lead.vehicles.model}`
    : lead.vehicle_info
    ? `${(lead.vehicle_info as Record<string,string>).brand} ${(lead.vehicle_info as Record<string,string>).model}`
    : "—";

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3">
        <p className="font-semibold text-gray-900">{lead.name}</p>
        <p className="text-xs text-gray-400">{lead.email}</p>
        {lead.phone && <p className="text-xs text-gray-400">{lead.phone}</p>}
      </td>
      <td className="px-5 py-3 text-gray-600 text-xs">{typeLabel[lead.type] ?? lead.type}</td>
      <td className="px-5 py-3 text-gray-600 text-xs hidden md:table-cell">{vehicleName}</td>
      <td className="px-5 py-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge[status]}`}>
          {statusLabel[status]}
        </span>
      </td>
      <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
        {new Date(lead.created_at).toLocaleDateString("es-ES")}
      </td>
      <td className="px-5 py-3">
        <div className="relative">
          <select
            value={status}
            disabled={updating}
            onChange={(e) => changeStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-accent appearance-none cursor-pointer disabled:opacity-60"
          >
            <option value="new">Nuevo</option>
            <option value="contacted">Contactado</option>
            <option value="closed">Cerrado</option>
          </select>
          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </td>
    </tr>
  );
}
