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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Vehículo</h1>
        <p className="text-gray-500 text-sm">{vehicle.brand} {vehicle.model}</p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </DashboardLayout>
  );
}
