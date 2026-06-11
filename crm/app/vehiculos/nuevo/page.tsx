import DashboardLayout from "@/components/DashboardLayout";
import VehicleForm from "@/components/VehicleForm";

export default function NuevoVehiculoPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Vehículo</h1>
        <p className="text-gray-500 text-sm">Añade un vehículo al catálogo</p>
      </div>
      <VehicleForm />
    </DashboardLayout>
  );
}
