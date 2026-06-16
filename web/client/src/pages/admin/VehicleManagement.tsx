import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

type VehicleForm = {
  brand: string;
  model: string;
  year: string;
  price: string;
  km: string;
  fuelType: string;
  transmission: string;
  status: string;
  description: string;
};

const emptyForm: VehicleForm = {
  brand: "",
  model: "",
  year: "",
  price: "",
  km: "",
  fuelType: "Gasolina",
  transmission: "Manual",
  status: "Disponible",
  description: "",
};

const statusColors: Record<string, string> = {
  Disponible: "bg-green-100 text-green-700",
  Reservado: "bg-yellow-100 text-yellow-700",
  Vendido: "bg-gray-100 text-gray-500",
};

export default function VehicleManagement() {
  const utils = trpc.useUtils();
  const { data: vehicles = [], isLoading } = trpc.vehicle.list.useQuery();

  const createMutation = trpc.vehicle.create.useMutation({
    onSuccess: () => {
      utils.vehicle.list.invalidate();
      utils.vehicle.stats.invalidate();
      toast.success("Vehículo añadido correctamente");
      setShowForm(false);
      setFormData(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.vehicle.update.useMutation({
    onSuccess: () => {
      utils.vehicle.list.invalidate();
      utils.vehicle.stats.invalidate();
      toast.success("Vehículo actualizado");
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.vehicle.delete.useMutation({
    onSuccess: () => {
      utils.vehicle.list.invalidate();
      utils.vehicle.stats.invalidate();
      toast.success("Vehículo eliminado");
    },
    onError: (err) => toast.error(err.message),
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<VehicleForm>(emptyForm);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (v: (typeof vehicles)[0]) => {
    setEditingId(v.id);
    setFormData({
      brand: v.brand,
      model: v.model,
      year: String(v.year),
      price: String(v.price),
      km: String(v.km),
      fuelType: (v as unknown as { fuelType: string }).fuelType ?? "",
      transmission: v.transmission,
      status: v.status,
      description: v.description ?? "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      brand: formData.brand,
      model: formData.model,
      year: Number(formData.year),
      price: formData.price,
      km: Number(formData.km),
      fuelType: formData.fuelType as "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico" | "GLP",
      transmission: formData.transmission as "Manual" | "Automático",
      status: formData.status as "Disponible" | "Reservado" | "Vendido",
      description: formData.description || undefined,
    };

    if (editingId !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateMutation.mutate({ id: editingId, ...payload } as any);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation.mutate(payload as any);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Vehículos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra el inventario · {vehicles.length} vehículos
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); }}>
          <Plus className="w-4 h-4 mr-2" />
          Añadir Vehículo
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {editingId !== null ? "Editar Vehículo" : "Nuevo Vehículo"}
            </h2>
            <button onClick={handleCancel} className="p-1 hover:bg-muted rounded-lg">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Marca *</label>
                <Input name="brand" value={formData.brand} onChange={handleChange} placeholder="Mercedes" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Modelo *</label>
                <Input name="model" value={formData.model} onChange={handleChange} placeholder="GLE 250D" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Año *</label>
                <Input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="2016" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Precio (€) *</label>
                <Input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="26900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Kilómetros *</label>
                <Input type="number" name="km" value={formData.km} onChange={handleChange} placeholder="276000" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Combustible *</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground" required>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="GLP">GLP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Cambio *</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground" required>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                placeholder="Equipamiento, extras, observaciones..."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                <Check className="w-4 h-4 mr-2" />
                {editingId !== null ? "Actualizar" : "Guardar"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Cargando...</div>
        ) : vehicles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay vehículos en el inventario</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Añadir el primero
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Vehículo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Año</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Km</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Combustible</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {v.brand} {v.model}
                    </td>
                    <td className="px-6 py-4 text-foreground">{v.year}</td>
                    <td className="px-6 py-4 text-foreground font-medium">
                      {Number(v.price).toLocaleString("es-ES")}€
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {v.km.toLocaleString("es-ES")} km
                    </td>
                    <td className="px-6 py-4 text-foreground">{(v as unknown as {fuelType:string}).fuelType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[v.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(v)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar ${v.brand} ${v.model}?`)) {
                              deleteMutation.mutate({ id: v.id });
                            }
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Car(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 17H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="7" y="15" width="10" height="4" rx="2" />
      <path d="M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}
