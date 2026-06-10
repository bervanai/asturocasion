import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: "Mercedes GLE 250D",
      brand: "Mercedes",
      year: 2016,
      price: 26900,
      km: 276000,
      status: "Disponible",
    },
    {
      id: 2,
      name: "Mercedes SLK 300",
      brand: "Mercedes",
      year: 2010,
      price: 18500,
      km: 145000,
      status: "Disponible",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    km: "",
    fuel: "",
    transmission: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vehicle form submitted:", formData);
    setShowForm(false);
    setFormData({
      brand: "",
      model: "",
      year: "",
      price: "",
      km: "",
      fuel: "",
      transmission: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Vehículos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra el inventario de vehículos
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Añadir Vehículo
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Nuevo Vehículo
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Marca *
                </label>
                <Input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Mercedes"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Modelo *
                </label>
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="GLE 250D"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Año *
                </label>
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2016"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Precio *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="26900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Kilómetros *
                </label>
                <Input
                  type="number"
                  name="km"
                  value={formData.km}
                  onChange={handleChange}
                  placeholder="276000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Combustible *
                </label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  required
                >
                  <option value="">Selecciona</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cambio *
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  required
                >
                  <option value="">Selecciona</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Guardar Vehículo</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Vehicles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Km
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-foreground">{vehicle.name}</td>
                  <td className="px-6 py-4 text-foreground">{vehicle.year}</td>
                  <td className="px-6 py-4 text-foreground">
                    {vehicle.price.toLocaleString()}€
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {vehicle.km.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
