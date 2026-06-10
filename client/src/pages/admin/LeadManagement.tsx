import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Eye, Trash2, Check } from "lucide-react";

export default function LeadManagement() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Juan García",
      email: "juan@example.com",
      phone: "600123456",
      type: "Tasación",
      vehicle: "Mercedes GLE",
      status: "Nuevo",
      date: "2026-06-10",
    },
    {
      id: 2,
      name: "María López",
      email: "maria@example.com",
      phone: "600234567",
      type: "Contacto",
      vehicle: "-",
      status: "En Proceso",
      date: "2026-06-09",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      phone: "600345678",
      type: "Financiación",
      vehicle: "Audi Q5",
      status: "Completado",
      date: "2026-06-08",
    },
  ]);

  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nuevo":
        return "bg-blue-100 text-blue-700";
      case "En Proceso":
        return "bg-yellow-100 text-yellow-700";
      case "Completado":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Tasación":
        return "bg-purple-100 text-purple-700";
      case "Contacto":
        return "bg-blue-100 text-blue-700";
      case "Financiación":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = (leadId: number, newStatus: string) => {
    setLeads(
      leads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const handleDelete = (leadId: number) => {
    setLeads(leads.filter((lead) => lead.id !== leadId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gestión de Leads
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra y realiza seguimiento de los leads de clientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {lead.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {lead.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            lead.type
                          )}`}
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {lead.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
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
          </Card>
        </div>

        {/* Lead Details */}
        <div className="lg:col-span-1">
          {selectedLead ? (
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">
                Detalles del Lead
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                  <p className="font-medium text-foreground">
                    {selectedLead.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                  <p className="font-medium text-foreground">
                    {selectedLead.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vehículo</p>
                  <p className="font-medium text-foreground">
                    {selectedLead.vehicle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Estado</p>
                  <select
                    value={selectedLead.status}
                    onChange={(e) =>
                      handleStatusChange(selectedLead.id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option>Nuevo</option>
                    <option>En Proceso</option>
                    <option>Completado</option>
                  </select>
                </div>
                <Button className="w-full" onClick={() => setSelectedLead(null)}>
                  <Check className="w-4 h-4 mr-2" />
                  Cerrar
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>Selecciona un lead para ver detalles</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
