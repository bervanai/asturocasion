"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function VehicleActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markSold = async () => {
    if (!confirm("¿Marcar este vehículo como vendido?")) return;
    setLoading(true);
    await supabase.from("vehicles").update({ status: "sold" }).eq("id", id);
    setLoading(false);
    router.refresh();
  };

  const deleteVehicle = async () => {
    if (!confirm("¿Eliminar este vehículo? Esta acción no se puede deshacer.")) return;
    setLoading(true);
    await supabase.from("vehicles").delete().eq("id", id);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 justify-end">
      {status !== "sold" && (
        <button
          onClick={markSold}
          disabled={loading}
          title="Marcar como vendido"
          className="p-2 rounded-lg text-on-surface-variant hover:text-success-green hover:bg-success-green/10 transition-colors disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
        </button>
      )}
      <Link
        href={`/vehiculos/${id}`}
        title="Editar"
        className="p-2 rounded-lg text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
      </Link>
      <button
        onClick={deleteVehicle}
        disabled={loading}
        title="Eliminar"
        className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors disabled:opacity-40"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  );
}
