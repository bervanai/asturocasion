import DashboardLayout from "@/components/DashboardLayout";
import VehicleForm from "@/components/VehicleForm";

export default function NuevoVehiculoPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">Nuevo Vehículo</h1>
        <p className="text-on-surface-variant text-sm mt-1">Añade un vehículo al catálogo</p>
      </div>
      <VehicleForm />
    </DashboardLayout>
  );
}
