import DashboardLayout from "@/components/DashboardLayout";
import VehicleForm from "@/components/VehicleForm";
import { createAdminClient } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: vehicle } = await admin.from("vehicles").select("*").eq("id", id).single();

  if (!vehicle) notFound();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">Editar Vehículo</h1>
        <p className="text-on-surface-variant text-sm mt-1">{vehicle.brand} {vehicle.model}</p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </DashboardLayout>
  );
}
