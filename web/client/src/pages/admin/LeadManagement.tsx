import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Eye, Trash2, Search, X } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  Nuevo: "bg-blue-100 text-blue-700",
  "En Proceso": "bg-yellow-100 text-yellow-700",
  Completado: "bg-green-100 text-green-700",
  Descartado: "bg-gray-100 text-gray-500",
};

const typeColors: Record<string, string> = {
  Tasación: "bg-purple-100 text-purple-700",
  Contacto: "bg-sky-100 text-sky-700",
  Financiación: "bg-emerald-100 text-emerald-700",
};

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  vehicleId: string | null;
  vehicleInfo: Record<string, unknown> | null;
  message: string | null;
  status: string;
  createdAt: Date;
};

export default function LeadManagement() {
  const utils = trpc.useUtils();
  const { data: leads = [], isLoading } = trpc.lead.list.useQuery();

  const updateMutation = trpc.lead.update.useMutation({
    onSuccess: () => {
      utils.lead.list.invalidate();
      utils.lead.stats.invalidate();
      toast.success("Lead actualizado");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.lead.delete.useMutation({
    onSuccess: () => {
      utils.lead.list.invalidate();
      utils.lead.stats.invalidate();
      setSelectedLead(null);
      toast.success("Lead eliminado");
    },
    onError: (err) => toast.error(err.message),
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone ?? "").includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (leadId: number, newStatus: string) => {
    updateMutation.mutate({
      id: leadId as unknown as string,
      status: newStatus as "Nuevo" | "En Proceso" | "Completado" | "Descartado",
    });
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Leads</h1>
        <p className="text-muted-foreground mt-1">
          Seguimiento de clientes potenciales · {leads.length} en total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
        >
          <option value="all">Todos los estados</option>
          <option value="Nuevo">Nuevo</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
          <option value="Descartado">Descartado</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Cargando...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay leads que coincidan
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cliente</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                          selectedLead?.id === (lead.id as unknown as number) ? "bg-muted/70" : ""
                        }`}
                        onClick={() => setSelectedLead(lead as unknown as Lead)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[lead.type] ?? "bg-gray-100 text-gray-600"}`}>
                            {lead.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedLead(lead as unknown as Lead)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar lead de ${lead.name}?`)) {
                                  deleteMutation.mutate({ id: lead.id });
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

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedLead ? (
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Detalles del Lead</h3>
                <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Nombre</p>
                  <p className="font-medium text-foreground">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline font-medium text-sm">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Teléfono</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-primary hover:underline font-medium text-sm">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Tipo</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[selectedLead.type] ?? ""}`}>
                    {selectedLead.type}
                  </span>
                </div>
                {selectedLead.vehicleInfo && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Vehículo</p>
                    <p className="font-medium text-foreground text-sm">
                      {String((selectedLead.vehicleInfo as Record<string,unknown>)?.brand ?? "")} {String((selectedLead.vehicleInfo as Record<string,unknown>)?.model ?? "")}
                    </p>
                  </div>
                )}
                {selectedLead.message && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Mensaje</p>
                    <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">{selectedLead.message}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Estado</p>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option>Nuevo</option>
                    <option>En Proceso</option>
                    <option>Completado</option>
                    <option>Descartado</option>
                  </select>
                </div>
                <div className="pt-2 flex gap-2">
                  <a href={`tel:${selectedLead.phone}`} className="flex-1">
                    <Button variant="outline" className="w-full text-sm">Llamar</Button>
                  </a>
                  <a href={`https://wa.me/34${(selectedLead.phone ?? "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex-1">
                    <Button className="w-full text-sm bg-[#25D366] hover:bg-[#1fbd5a] text-white border-0">WhatsApp</Button>
                  </a>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Selecciona un lead para ver detalles</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
