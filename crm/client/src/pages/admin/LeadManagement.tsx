import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllLeads, updateLead, deleteLead, insertLead } from "@/lib/supabase";
import { useState } from "react";
import { Eye, Trash2, Search, X, Phone, MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";

/* ── Types ──────────────────────────────────────────────────────────────────── */
type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  vehicle_info: Record<string, unknown> | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

type Status = "new" | "contacted" | "closed" | "discarded";
const ALL_STATUSES: Status[] = ["new", "contacted", "closed", "discarded"];

const STATUS_LABELS: Record<Status, string> = {
  new: "Nuevo",
  contacted: "En Proceso",
  closed: "Completado",
  discarded: "Descartado",
};

/* ── Badge helpers ──────────────────────────────────────────────────────────── */
function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    new:       "badge badge-nuevo",
    contacted: "badge badge-proceso",
    closed:    "badge badge-completado",
    discarded: "badge badge-descartado",
  };
  return map[status] ?? "badge badge-descartado";
}

function typeBadgeClass(type: string) {
  const map: Record<string, string> = {
    contact:          "badge badge-contacto",
    valuation:        "badge badge-tasacion",
    vehicle_inquiry:  "badge badge-financiacion",
  };
  return map[type] ?? "badge badge-contacto";
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    contact:         "Contacto",
    valuation:       "Tasación",
    vehicle_inquiry: "Interés vehículo",
  };
  return map[type] ?? type;
}

/* ── Kanban column ──────────────────────────────────────────────────────────── */
const COLUMN_META: Record<Status, { color: string; dim: string }> = {
  new:       { color: "#3b82f6", dim: "rgba(59,130,246,0.12)"  },
  contacted: { color: "#e8a020", dim: "rgba(232,160,32,0.12)"  },
  closed:    { color: "#22c55e", dim: "rgba(34,197,94,0.12)"   },
  discarded: { color: "#6b7280", dim: "rgba(107,114,128,0.12)" },
};

type KanbanCardProps = {
  lead: Lead;
  onSelect: (l: Lead) => void;
  onChangeStatus: (id: string, status: Status) => void;
};

function KanbanCard({ lead, onSelect, onChangeStatus }: KanbanCardProps) {
  const vehicleName = lead.vehicle_info
    ? `${lead.vehicle_info.brand ?? ""} ${lead.vehicle_info.model ?? ""}`.trim()
    : null;

  return (
    <div
      onClick={() => onSelect(lead)}
      style={{
        background: "#141416",
        border: "1px solid #1f1f23",
        borderRadius: "8px",
        padding: "0.875rem 1rem",
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.15s",
        marginBottom: "0.5rem",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(232,160,32,0.3)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1f1f23";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f0f0f0", marginBottom: "0.25rem" }}>
        {lead.name}
      </p>
      <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
        {lead.phone}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className={typeBadgeClass(lead.type)}>{typeLabel(lead.type)}</span>
        <span style={{ fontSize: "0.625rem", color: "#3f3f46" }}>
          {new Date(lead.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
        </span>
      </div>
      {vehicleName && (
        <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.375rem", fontStyle: "italic" }}>
          {vehicleName}
        </p>
      )}
    </div>
  );
}

function KanbanColumn({
  status,
  leads,
  onSelect,
  onChangeStatus,
}: {
  status: Status;
  leads: Lead[];
  onSelect: (l: Lead) => void;
  onChangeStatus: (id: string, s: Status) => void;
}) {
  const meta = COLUMN_META[status];
  return (
    <div style={{ minWidth: "240px", flex: "1 1 240px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 0.875rem",
          background: meta.dim,
          border: `1px solid ${meta.color}25`,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
        <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: meta.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {STATUS_LABELS[status]}
        </span>
        <span style={{ marginLeft: "auto", background: meta.color, color: "#0a0a0b", borderRadius: "99px", fontSize: "0.625rem", fontWeight: 700, padding: "0.1rem 0.45rem" }}>
          {leads.length}
        </span>
      </div>
      <div
        style={{
          background: "rgba(20,20,22,0.5)",
          border: "1px solid #1f1f23",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          padding: "0.75rem",
          minHeight: "120px",
        }}
      >
        {leads.length === 0 ? (
          <p style={{ fontSize: "0.6875rem", color: "#3f3f46", textAlign: "center", padding: "1.5rem 0" }}>Sin leads</p>
        ) : (
          leads.map((l) => (
            <KanbanCard key={l.id} lead={l} onSelect={onSelect} onChangeStatus={onChangeStatus} />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function LeadManagement() {
  const queryClient = useQueryClient();
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchAllLeads(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; status?: string; notes?: string | null }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead actualizado");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedLead(null);
      toast.success("Lead eliminado");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Notes state
  const [notesValue, setNotesValue] = useState<string>("");
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesValue(lead.notes ?? "");
  };
  const handleSaveNotes = () => {
    if (!selectedLead) return;
    updateMutation.mutate({ id: selectedLead.id, notes: notesValue });
    setSelectedLead((prev) => prev ? { ...prev, notes: notesValue } : null);
  };

  // New lead modal state
  const [showNewLead, setShowNewLead] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: "", email: "", phone: "", type: "contact", message: "" });
  const [newLeadPending, setNewLeadPending] = useState(false);

  const handleNewLeadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLeadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewLeadPending(true);
    try {
      await insertLead({
        name: newLeadForm.name,
        email: newLeadForm.email,
        phone: newLeadForm.phone || undefined,
        type: newLeadForm.type,
        message: newLeadForm.message || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead creado correctamente");
      setShowNewLead(false);
      setNewLeadForm({ name: "", email: "", phone: "", type: "contact", message: "" });
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Error al crear lead");
    } finally {
      setNewLeadPending(false);
    }
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone ?? "").includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateMutation.mutate({ id: leadId, status: newStatus });
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const grouped = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((l) => l.status === s);
    return acc;
  }, {} as Record<Status, Lead[]>);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* ── Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Gestión de Leads</h1>
          <p className="page-subtitle">
            Seguimiento de clientes potenciales · {leads.length} en total
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
          <button className="btn-primary" onClick={() => setShowNewLead(true)}>
            <Plus style={{ width: "15px", height: "15px" }} />
            Nuevo Lead
          </button>
        <div style={{ display: "flex", gap: "0.375rem", background: "#141416", border: "1px solid #1f1f23", borderRadius: "8px", padding: "0.25rem" }}>
          {(["table", "kanban"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: "0.35rem 0.875rem",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                background: viewMode === mode ? "#e8a020" : "transparent",
                color: viewMode === mode ? "#0a0a0b" : "#6b7280",
              }}
            >
              {mode === "table" ? "Tabla" : "Kanban"}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* ── Filters */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#6b7280", pointerEvents: "none" }} />
          <input
            className="crm-input"
            style={{ paddingLeft: "2.25rem" }}
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ position: "relative", minWidth: "160px" }}>
          <select className="crm-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos los estados</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "0 0.875rem", background: "#141416", border: "1px solid #1f1f23", borderRadius: "var(--radius)", fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Content */}
      <div style={{ display: "grid", gridTemplateColumns: selectedLead ? "1fr 300px" : "1fr", gap: "1rem", alignItems: "start" }}>

        {/* Table view */}
        {viewMode === "table" && (
          <div className="glass-card" style={{ overflow: "hidden" }}>
            {isLoading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280", fontSize: "0.8125rem" }}>Cargando leads…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280", fontSize: "0.8125rem" }}>
                No hay leads que coincidan con la búsqueda
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Vehículo</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => {
                      const vehicleName = lead.vehicle_info
                        ? `${lead.vehicle_info.brand ?? ""} ${lead.vehicle_info.model ?? ""}`.trim()
                        : null;
                      return (
                        <tr
                          key={lead.id}
                          className={selectedLead?.id === lead.id ? "row-selected" : ""}
                          onClick={() => handleSelectLead(lead)}
                        >
                          <td>
                            <p style={{ fontWeight: 600, color: "#f0f0f0" }}>{lead.name}</p>
                            <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.1rem" }}>{lead.email}</p>
                          </td>
                          <td>
                            <span className={typeBadgeClass(lead.type)}>{typeLabel(lead.type)}</span>
                          </td>
                          <td>
                            <span className={statusBadgeClass(lead.status)}>{STATUS_LABELS[lead.status as Status] ?? lead.status}</span>
                          </td>
                          <td>
                            {vehicleName ? (
                              <span style={{ fontSize: "0.75rem", color: "#f0f0f0", fontWeight: 500 }}>{vehicleName}</span>
                            ) : (
                              <span style={{ color: "#3f3f46", fontStyle: "italic", fontSize: "0.75rem" }}>—</span>
                            )}
                          </td>
                          <td style={{ color: "#6b7280", fontSize: "0.6875rem" }}>
                            {new Date(lead.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "2-digit" })}
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button className="btn-icon" onClick={() => handleSelectLead(lead)} title="Ver detalles">
                                <Eye style={{ width: "14px", height: "14px" }} />
                              </button>
                              <button
                                className="btn-icon danger"
                                onClick={() => { if (confirm(`¿Eliminar lead de ${lead.name}?`)) deleteMutation.mutate(lead.id); }}
                                title="Eliminar"
                              >
                                <Trash2 style={{ width: "14px", height: "14px" }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Kanban view */}
        {viewMode === "kanban" && (
          <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", minWidth: "900px" }}>
              {ALL_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  leads={grouped[status]}
                  onSelect={(l) => handleSelectLead(l)}
                  onChangeStatus={handleStatusChange}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Detail panel */}
        {selectedLead && (
          <div className="glass-card" style={{ padding: "1.25rem", position: "sticky", top: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.01em" }}>Detalles del Lead</p>
              <button className="btn-icon" onClick={() => setSelectedLead(null)}>
                <X style={{ width: "14px", height: "14px" }} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1f1f23, #2a2a2e)", border: "1px solid #2f2f35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, color: "#e8a020", flexShrink: 0 }}>
                {selectedLead.name[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0f0f0" }}>{selectedLead.name}</p>
                <span className={typeBadgeClass(selectedLead.type)} style={{ marginTop: "0.25rem" }}>
                  {typeLabel(selectedLead.type)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <p className="crm-label">Email</p>
                <a href={`mailto:${selectedLead.email}`} style={{ fontSize: "0.8125rem", color: "#e8a020", textDecoration: "none", fontWeight: 500 }}>
                  {selectedLead.email}
                </a>
              </div>

              {selectedLead.phone && (
                <div>
                  <p className="crm-label">Teléfono</p>
                  <a href={`tel:${selectedLead.phone}`} style={{ fontSize: "0.8125rem", color: "#e8a020", textDecoration: "none", fontWeight: 500 }}>
                    {selectedLead.phone}
                  </a>
                </div>
              )}

              {selectedLead.vehicle_info && (
                <div>
                  <p className="crm-label">Vehículo de Interés</p>
                  <p style={{ fontSize: "0.8125rem", color: "#f0f0f0", fontWeight: 600, marginTop: "0.25rem" }}>
                    {`${selectedLead.vehicle_info.brand ?? ""} ${selectedLead.vehicle_info.model ?? ""}`.trim()}
                  </p>
                </div>
              )}

              {selectedLead.message && (
                <div>
                  <p className="crm-label">Mensaje</p>
                  <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", background: "#1a1a1e", border: "1px solid #1f1f23", borderRadius: "8px", padding: "0.625rem 0.75rem", lineHeight: 1.6 }}>
                    {selectedLead.message}
                  </p>
                </div>
              )}

              <div>
                <p className="crm-label">Estado</p>
                <select
                  className="crm-select"
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                >
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>

              <div className="crm-divider" style={{ margin: "0.25rem 0" }} />

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {selectedLead.phone && (
                  <a href={`tel:${selectedLead.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                    <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", gap: "0.375rem" }}>
                      <Phone style={{ width: "13px", height: "13px" }} />
                      Llamar
                    </button>
                  </a>
                )}
                {selectedLead.phone && (
                  <a href={`https://wa.me/34${selectedLead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                    <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", padding: "0.5rem 0.75rem", background: "#25D366", color: "#fff", border: "none", borderRadius: "var(--radius)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer" }}>
                      <MessageCircle style={{ width: "13px", height: "13px" }} />
                      WhatsApp
                    </button>
                  </a>
                )}
              </div>

              {/* Notes */}
              <div>
                <p className="crm-label">Notas internas</p>
                <textarea
                  className="crm-textarea"
                  rows={3}
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Añade notas internas sobre este lead..."
                  style={{ marginBottom: "0.375rem" }}
                />
                <button
                  className="btn-ghost"
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                  onClick={handleSaveNotes}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Guardando…" : "Guardar nota"}
                </button>
              </div>

              <div className="crm-divider" style={{ margin: "0.25rem 0" }} />

              <button
                className="btn-icon danger"
                style={{ width: "100%", height: "auto", padding: "0.4rem 0.75rem", fontSize: "0.75rem", gap: "0.375rem", borderRadius: "var(--radius)" }}
                onClick={() => { if (confirm(`¿Eliminar lead de ${selectedLead.name}?`)) deleteMutation.mutate(selectedLead.id); }}
              >
                <Trash2 style={{ width: "13px", height: "13px" }} />
                Eliminar lead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── New Lead Modal */}
      {showNewLead && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowNewLead(false); }}
        >
          <div className="glass-card" style={{ width: "100%", maxWidth: "480px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.02em" }}>
                Nuevo Lead
              </p>
              <button className="btn-icon" onClick={() => setShowNewLead(false)}>
                <X style={{ width: "15px", height: "15px" }} />
              </button>
            </div>
            <form onSubmit={handleNewLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div>
                <label className="crm-label">Nombre *</label>
                <input className="crm-input" name="name" value={newLeadForm.name} onChange={handleNewLeadChange} placeholder="Nombre completo" required />
              </div>
              <div>
                <label className="crm-label">Email *</label>
                <input className="crm-input" type="email" name="email" value={newLeadForm.email} onChange={handleNewLeadChange} placeholder="correo@ejemplo.com" required />
              </div>
              <div>
                <label className="crm-label">Teléfono</label>
                <input className="crm-input" name="phone" value={newLeadForm.phone} onChange={handleNewLeadChange} placeholder="600 000 000" />
              </div>
              <div>
                <label className="crm-label">Tipo</label>
                <select className="crm-select" name="type" value={newLeadForm.type} onChange={handleNewLeadChange}>
                  <option value="contact">Contacto</option>
                  <option value="valuation">Tasación</option>
                  <option value="purchase">Compra</option>
                </select>
              </div>
              <div>
                <label className="crm-label">Mensaje / Descripción</label>
                <textarea className="crm-textarea" name="message" value={newLeadForm.message} onChange={handleNewLeadChange} rows={3} placeholder="Información adicional..." />
              </div>
              <div style={{ display: "flex", gap: "0.625rem", paddingTop: "0.25rem" }}>
                <button type="submit" className="btn-primary" disabled={newLeadPending} style={{ opacity: newLeadPending ? 0.6 : 1 }}>
                  {newLeadPending ? "Guardando…" : "Crear Lead"}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowNewLead(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
