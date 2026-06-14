import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Eye, Trash2, Search, X, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";

/* ── Types ──────────────────────────────────────────────────────────────────── */
type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  vehicle: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
};

type Status = "Nuevo" | "En Proceso" | "Completado" | "Descartado";
const ALL_STATUSES: Status[] = ["Nuevo", "En Proceso", "Completado", "Descartado"];

/* ── Badge helpers ──────────────────────────────────────────────────────────── */
function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    "Nuevo":       "badge badge-nuevo",
    "En Proceso":  "badge badge-proceso",
    "Completado":  "badge badge-completado",
    "Descartado":  "badge badge-descartado",
  };
  return map[status] ?? "badge badge-descartado";
}

function typeBadgeClass(type: string) {
  const map: Record<string, string> = {
    "Tasación":    "badge badge-tasacion",
    "Contacto":    "badge badge-contacto",
    "Financiación":"badge badge-financiacion",
  };
  return map[type] ?? "badge badge-contacto";
}

/* ── Kanban column ──────────────────────────────────────────────────────────── */
const COLUMN_META: Record<Status, { color: string; dim: string }> = {
  "Nuevo":      { color: "#3b82f6", dim: "rgba(59,130,246,0.12)"  },
  "En Proceso": { color: "#e8a020", dim: "rgba(232,160,32,0.12)"  },
  "Completado": { color: "#22c55e", dim: "rgba(34,197,94,0.12)"   },
  "Descartado": { color: "#6b7280", dim: "rgba(107,114,128,0.12)" },
};

type KanbanCardProps = {
  lead: Lead;
  onSelect: (l: Lead) => void;
  onChangeStatus: (id: number, status: Status) => void;
};

function KanbanCard({ lead, onSelect, onChangeStatus }: KanbanCardProps) {
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
        <span className={typeBadgeClass(lead.type)}>{lead.type}</span>
        <span style={{ fontSize: "0.625rem", color: "#3f3f46" }}>
          {new Date(lead.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
        </span>
      </div>
      {lead.vehicle && (
        <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.375rem", fontStyle: "italic" }}>
          {lead.vehicle}
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
  onChangeStatus: (id: number, s: Status) => void;
}) {
  const meta = COLUMN_META[status];
  return (
    <div style={{ minWidth: "240px", flex: "1 1 240px" }}>
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 0.875rem",
          background: meta.dim,
          border: `1px solid ${meta.color}25`,
          borderRadius: "8px 8px 0 0",
          marginBottom: "0",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: meta.color,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: meta.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {status}
        </span>
        <span
          style={{
            marginLeft: "auto",
            background: meta.color,
            color: "#0a0a0b",
            borderRadius: "99px",
            fontSize: "0.625rem",
            fontWeight: 700,
            padding: "0.1rem 0.45rem",
          }}
        >
          {leads.length}
        </span>
      </div>
      {/* Cards area */}
      <div
        style={{
          background: "rgba(20,20,22,0.5)",
          border: `1px solid #1f1f23`,
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          padding: "0.75rem",
          minHeight: "120px",
        }}
      >
        {leads.length === 0 ? (
          <p style={{ fontSize: "0.6875rem", color: "#3f3f46", textAlign: "center", padding: "1.5rem 0" }}>
            Sin leads
          </p>
        ) : (
          leads.map((l) => (
            <KanbanCard
              key={l.id}
              lead={l}
              onSelect={onSelect}
              onChangeStatus={onChangeStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function LeadManagement() {
  const utils = trpc.useUtils();
  const DEMO_LEADS = [
    { id: "dl-1", name: "Carlos Martínez", email: "carlos@email.com", phone: "654 321 098", type: "Compra", vehicle: "BMW 325D GT", message: "Me interesa el BMW, ¿está disponible para verlo este fin de semana?", status: "Nuevo", createdAt: new Date(Date.now() - 1000*60*30) },
    { id: "dl-2", name: "Laura Fernández", email: "laura.f@gmail.com", phone: "622 111 333", type: "Venta", vehicle: null, message: "Quiero tasar mi Volkswagen Golf 2018, 45.000 km.", status: "En Proceso", createdAt: new Date(Date.now() - 1000*60*60*3) },
    { id: "dl-3", name: "Andrés Pérez", email: "andres.p@hotmail.com", phone: "699 876 543", type: "Compra", vehicle: "Audi Q5 S-line", message: "Busco un SUV automático, presupuesto hasta 25.000€.", status: "En Proceso", createdAt: new Date(Date.now() - 1000*60*60*24) },
    { id: "dl-4", name: "María González", email: "mgonzalez@empresa.es", phone: "984 123 456", type: "Tasación", vehicle: null, message: "Necesito tasar un Mercedes Clase C 2017 para empresa.", status: "Completado", createdAt: new Date(Date.now() - 1000*60*60*48) },
    { id: "dl-5", name: "Roberto Álvarez", email: "roberto.a@gmail.com", phone: "636 555 444", type: "Compra", vehicle: "Jaguar XF R-Sport", message: "Vi el Jaguar en la web, ¿cuánto es la entrada mínima?", status: "Nuevo", createdAt: new Date(Date.now() - 1000*60*90) },
  ];
  const { data: rawLeads = [], isLoading } = trpc.lead.list.useQuery();
  const leads = rawLeads.length > 0 ? rawLeads : (isLoading ? [] : DEMO_LEADS as unknown as typeof rawLeads);

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
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (leadId: number, newStatus: string) => {
    updateMutation.mutate({
      id: leadId,
      status: newStatus as Status,
    });
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  /* Group leads by status for kanban */
  const grouped = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((l) => l.status === s) as Lead[];
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
        {/* View toggle */}
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

      {/* ── Filters */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <Search
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "14px",
              height: "14px",
              color: "#6b7280",
              pointerEvents: "none",
            }}
          />
          <input
            className="crm-input"
            style={{ paddingLeft: "2.25rem" }}
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Status filter */}
        <div style={{ position: "relative", minWidth: "160px" }}>
          <select
            className="crm-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* Count pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "0 0.875rem",
          background: "#141416",
          border: "1px solid #1f1f23",
          borderRadius: "var(--radius)",
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "#6b7280",
          whiteSpace: "nowrap",
        }}>
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Content */}
      <div style={{ display: "grid", gridTemplateColumns: selectedLead ? "1fr 300px" : "1fr", gap: "1rem", alignItems: "start" }}>

        {/* Table view */}
        {viewMode === "table" && (
          <div className="glass-card" style={{ overflow: "hidden" }}>
            {isLoading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280", fontSize: "0.8125rem" }}>
                Cargando leads…
              </div>
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
                    {filtered.map((lead) => (
                      <tr
                        key={lead.id}
                        className={selectedLead?.id === lead.id ? "row-selected" : ""}
                        onClick={() => setSelectedLead(lead as Lead)}
                      >
                        <td>
                          <p style={{ fontWeight: 600, color: "#f0f0f0" }}>{lead.name}</p>
                          <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.1rem" }}>{lead.email}</p>
                        </td>
                        <td>
                          <span className={typeBadgeClass(lead.type)}>{lead.type}</span>
                        </td>
                        <td>
                          <span className={statusBadgeClass(lead.status)}>{lead.status}</span>
                        </td>
                        <td style={{ color: lead.vehicle ? "#f0f0f0" : "#3f3f46", fontStyle: lead.vehicle ? "normal" : "italic" }}>
                          {lead.vehicle ?? "—"}
                        </td>
                        <td style={{ color: "#6b7280", fontSize: "0.6875rem" }}>
                          {new Date(lead.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "2-digit" })}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", gap: "0.25rem" }}>
                            <button
                              className="btn-icon"
                              onClick={() => setSelectedLead(lead as Lead)}
                              title="Ver detalles"
                            >
                              <Eye style={{ width: "14px", height: "14px" }} />
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => {
                                if (confirm(`¿Eliminar lead de ${lead.name}?`)) {
                                  deleteMutation.mutate({ id: lead.id });
                                }
                              }}
                              title="Eliminar"
                            >
                              <Trash2 style={{ width: "14px", height: "14px" }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                  onSelect={(l) => setSelectedLead(l)}
                  onChangeStatus={handleStatusChange}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Detail panel */}
        {selectedLead && (
          <div
            className="glass-card"
            style={{ padding: "1.25rem", position: "sticky", top: "5rem" }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.01em" }}>
                Detalles del Lead
              </p>
              <button
                className="btn-icon"
                onClick={() => setSelectedLead(null)}
              >
                <X style={{ width: "14px", height: "14px" }} />
              </button>
            </div>

            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1f1f23, #2a2a2e)",
                  border: "1px solid #2f2f35",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#e8a020",
                  flexShrink: 0,
                }}
              >
                {selectedLead.name[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f0f0f0" }}>{selectedLead.name}</p>
                <span className={typeBadgeClass(selectedLead.type)} style={{ marginTop: "0.25rem" }}>
                  {selectedLead.type}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Email */}
              <div>
                <p className="crm-label">Email</p>
                <a
                  href={`mailto:${selectedLead.email}`}
                  style={{ fontSize: "0.8125rem", color: "#e8a020", textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  {selectedLead.email}
                </a>
              </div>

              {/* Phone */}
              <div>
                <p className="crm-label">Teléfono</p>
                <a
                  href={`tel:${selectedLead.phone}`}
                  style={{ fontSize: "0.8125rem", color: "#e8a020", textDecoration: "none", fontWeight: 500 }}
                >
                  {selectedLead.phone}
                </a>
              </div>

              {/* Vehicle */}
              {selectedLead.vehicle && (
                <div>
                  <p className="crm-label">Vehículo de Interés</p>
                  <p style={{ fontSize: "0.8125rem", color: "#f0f0f0", fontWeight: 500 }}>{selectedLead.vehicle}</p>
                </div>
              )}

              {/* Message */}
              {selectedLead.message && (
                <div>
                  <p className="crm-label">Mensaje</p>
                  <p style={{
                    fontSize: "0.8125rem",
                    color: "#a1a1aa",
                    background: "#1a1a1e",
                    border: "1px solid #1f1f23",
                    borderRadius: "8px",
                    padding: "0.625rem 0.75rem",
                    lineHeight: 1.6,
                  }}>
                    {selectedLead.message}
                  </p>
                </div>
              )}

              {/* Status change */}
              <div>
                <p className="crm-label">Estado</p>
                <select
                  className="crm-select"
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                >
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="crm-divider" style={{ margin: "0.25rem 0" }} />

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a href={`tel:${selectedLead.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                  <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", gap: "0.375rem" }}>
                    <Phone style={{ width: "13px", height: "13px" }} />
                    Llamar
                  </button>
                </a>
                <a
                  href={`https://wa.me/34${selectedLead.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ flex: 1, textDecoration: "none" }}
                >
                  <button
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.375rem",
                      padding: "0.5rem 0.75rem",
                      background: "#25D366",
                      color: "#fff",
                      border: "none",
                      borderRadius: "var(--radius)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1fbd5a")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#25D366")}
                  >
                    <MessageCircle style={{ width: "13px", height: "13px" }} />
                    WhatsApp
                  </button>
                </a>
              </div>

              {/* Delete */}
              <button
                className="btn-icon danger"
                style={{ width: "100%", height: "auto", padding: "0.4rem 0.75rem", fontSize: "0.75rem", gap: "0.375rem", borderRadius: "var(--radius)" }}
                onClick={() => {
                  if (confirm(`¿Eliminar lead de ${selectedLead.name}?`)) {
                    deleteMutation.mutate({ id: selectedLead.id });
                  }
                }}
              >
                <Trash2 style={{ width: "13px", height: "13px" }} />
                Eliminar lead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
