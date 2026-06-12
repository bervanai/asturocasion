"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/supabase";

const statusConfig: Record<string, { label: string; cls: string }> = {
  new: { label: "Nuevo", cls: "bg-error-container text-error border border-error/20" },
  contacted: { label: "Contactado", cls: "bg-secondary-container text-on-secondary-container border border-secondary/20" },
  closed: { label: "Cerrado", cls: "bg-surface-container-highest text-on-surface-variant border border-outline-variant" },
};

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
    ? `${(lead.vehicle_info as Record<string, string>).brand} ${(lead.vehicle_info as Record<string, string>).model}`
    : "—";

  const sc = statusConfig[status] ?? statusConfig.new;
  const initials = lead.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <tr className="hover:bg-surface-variant transition-colors group cursor-pointer">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-on-surface text-sm">{lead.name}</p>
            <p className="text-[11px] text-on-surface-variant">{lead.email}</p>
            {lead.phone && <p className="text-[11px] text-on-surface-variant">{lead.phone}</p>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-on-surface-variant text-xs">{typeLabel[lead.type] ?? lead.type}</td>
      <td className="px-6 py-4 text-on-surface-variant text-xs hidden md:table-cell">{vehicleName}</td>
      <td className="px-6 py-4 text-center">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${sc.cls}`}>
          {sc.label}
        </span>
      </td>
      <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
        {new Date(lead.created_at).toLocaleDateString("es-ES")}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <select
            value={status}
            disabled={updating}
            onChange={(e) => changeStatus(e.target.value)}
            className="text-xs bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-tertiary cursor-pointer disabled:opacity-60"
          >
            <option value="new">Nuevo</option>
            <option value="contacted">Contactado</option>
            <option value="closed">Cerrado</option>
          </select>
        </div>
      </td>
    </tr>
  );
}
