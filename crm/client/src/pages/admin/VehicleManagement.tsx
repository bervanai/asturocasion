import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Car, Search, Fuel, Settings2 } from "lucide-react";
import { toast } from "sonner";

/* ── Types ──────────────────────────────────────────────────────────────────── */
type VehicleForm = {
  brand: string;
  model: string;
  year: string;
  price: string;
  km: string;
  fuel: string;
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
  fuel: "Gasolina",
  transmission: "Manual",
  status: "Disponible",
  description: "",
};

type FuelType = "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico" | "GLP";
type TransType = "Manual" | "Automático";
type VehicleStatus = "Disponible" | "Reservado" | "Vendido";

/* ── Fuel badge ─────────────────────────────────────────────────────────────── */
const FUEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Gasolina:  { bg: "rgba(232,160,32,0.1)",   color: "#e8a020", border: "rgba(232,160,32,0.2)"  },
  "Diésel":  { bg: "rgba(59,130,246,0.1)",   color: "#3b82f6", border: "rgba(59,130,246,0.2)"  },
  "Híbrido": { bg: "rgba(34,197,94,0.1)",    color: "#22c55e", border: "rgba(34,197,94,0.2)"   },
  Eléctrico: { bg: "rgba(168,85,247,0.1)",   color: "#a855f7", border: "rgba(168,85,247,0.2)"  },
  GLP:       { bg: "rgba(245,158,11,0.1)",   color: "#f59e0b", border: "rgba(245,158,11,0.2)"  },
};

function FuelBadge({ fuel }: { fuel: string }) {
  const c = FUEL_COLORS[fuel] ?? FUEL_COLORS.Gasolina;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      padding: "0.2rem 0.55rem",
      borderRadius: "99px",
      fontSize: "0.6875rem",
      fontWeight: 600,
      letterSpacing: "0.02em",
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {fuel}
    </span>
  );
}

/* ── Status badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Disponible: "badge badge-disponible",
    Reservado:  "badge badge-reservado",
    Vendido:    "badge badge-vendido",
  };
  return <span className={map[status] ?? "badge badge-vendido"}>{status}</span>;
}

/* ── Form field wrapper ─────────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="crm-label">{label}</label>
      {children}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<VehicleForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      fuel: v.fuel,
      transmission: v.transmission,
      status: v.status,
      description: v.description ?? "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      brand: formData.brand,
      model: formData.model,
      year: Number(formData.year),
      price: Number(formData.price),
      km: Number(formData.km),
      fuel: formData.fuel as FuelType,
      transmission: formData.transmission as TransType,
      status: formData.status as VehicleStatus,
      description: formData.description || undefined,
    };
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      String(v.year).includes(q);
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* ── Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Gestión de Vehículos</h1>
          <p className="page-subtitle">
            Inventario del concesionario · {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); }}
        >
          <Plus style={{ width: "15px", height: "15px" }} />
          Añadir Vehículo
        </button>
      </div>

      {/* ── Add / Edit form */}
      {showForm && (
        <div className="glass-card" style={{ padding: "1.5rem", overflow: "hidden" }}>
          {/* Form header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #1f1f23",
            }}
          >
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.02em" }}>
                {editingId !== null ? "Editar Vehículo" : "Nuevo Vehículo"}
              </p>
              <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.125rem" }}>
                {editingId !== null ? "Modifica los datos del vehículo seleccionado" : "Añade un nuevo vehículo al inventario"}
              </p>
            </div>
            <button className="btn-icon" onClick={handleCancel}>
              <X style={{ width: "15px", height: "15px" }} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Fields grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <Field label="Marca *">
                <input className="crm-input" name="brand" value={formData.brand} onChange={handleChange} placeholder="p.ej. Mercedes" required />
              </Field>
              <Field label="Modelo *">
                <input className="crm-input" name="model" value={formData.model} onChange={handleChange} placeholder="p.ej. GLE 250D" required />
              </Field>
              <Field label="Año *">
                <input className="crm-input" type="number" name="year" value={formData.year} onChange={handleChange} placeholder="2018" min="1990" max="2099" required />
              </Field>
              <Field label="Precio (€) *">
                <input className="crm-input" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="26900" min="0" required />
              </Field>
              <Field label="Kilómetros *">
                <input className="crm-input" type="number" name="km" value={formData.km} onChange={handleChange} placeholder="75000" min="0" required />
              </Field>
              <Field label="Combustible *">
                <select className="crm-select" name="fuel" value={formData.fuel} onChange={handleChange} required>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="GLP">GLP</option>
                </select>
              </Field>
              <Field label="Cambio *">
                <select className="crm-select" name="transmission" value={formData.transmission} onChange={handleChange} required>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                </select>
              </Field>
              <Field label="Estado">
                <select className="crm-select" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </Field>
            </div>

            <Field label="Descripción / Extras">
              <textarea
                className="crm-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Equipamiento, extras, observaciones…"
              />
            </Field>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.25rem" }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={isPending}
                style={{ opacity: isPending ? 0.6 : 1 }}
              >
                <Check style={{ width: "14px", height: "14px" }} />
                {isPending ? "Guardando…" : editingId !== null ? "Actualizar" : "Guardar Vehículo"}
              </button>
              <button type="button" className="btn-ghost" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filters row */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
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
            placeholder="Buscar por marca, modelo o año…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="crm-select"
          style={{ minWidth: "160px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Reservado">Reservado</option>
          <option value="Vendido">Vendido</option>
        </select>
        {/* Quick stat pills */}
        {(["Disponible", "Reservado", "Vendido"] as const).map((s) => {
          const count = vehicles.filter((v) => v.status === s).length;
          const dotClass =
            s === "Disponible" ? "#22c55e" : s === "Reservado" ? "#f59e0b" : "#6b7280";
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0 0.875rem",
                height: "36px",
                background: statusFilter === s ? "rgba(232,160,32,0.1)" : "#141416",
                border: `1px solid ${statusFilter === s ? "rgba(232,160,32,0.3)" : "#1f1f23"}`,
                borderRadius: "var(--radius)",
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: statusFilter === s ? "#e8a020" : "#6b7280",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dotClass, flexShrink: 0 }} />
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280", fontSize: "0.8125rem" }}>
            Cargando inventario…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3.5rem", textAlign: "center" }}>
            <Car style={{ width: "36px", height: "36px", color: "#2a2a2e", margin: "0 auto 0.75rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>
              {vehicles.length === 0
                ? "No hay vehículos en el inventario todavía"
                : "No hay vehículos que coincidan con la búsqueda"}
            </p>
            {vehicles.length === 0 && (
              <button
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus style={{ width: "14px", height: "14px" }} />
                Añadir el primero
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Vehículo</th>
                  <th>Año</th>
                  <th>Precio</th>
                  <th>Km</th>
                  <th>Combustible</th>
                  <th>Cambio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#1a1a1e",
                            border: "1px solid #1f1f23",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Car style={{ width: "14px", height: "14px", color: "#6b7280" }} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "#f0f0f0", fontSize: "0.8125rem" }}>
                            {v.brand} {v.model}
                          </p>
                          {v.description && (
                            <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.1rem", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {v.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#a1a1aa", fontVariantNumeric: "tabular-nums" }}>{v.year}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#f0f0f0", fontVariantNumeric: "tabular-nums" }}>
                        {v.price.toLocaleString("es-ES")}
                        <span style={{ color: "#e8a020", marginLeft: "1px" }}>€</span>
                      </span>
                    </td>
                    <td style={{ color: "#a1a1aa", fontVariantNumeric: "tabular-nums", fontSize: "0.6875rem" }}>
                      {v.km.toLocaleString("es-ES")} km
                    </td>
                    <td><FuelBadge fuel={v.fuel} /></td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6875rem", color: "#a1a1aa" }}>
                        <Settings2 style={{ width: "11px", height: "11px", flexShrink: 0 }} />
                        {v.transmission}
                      </span>
                    </td>
                    <td><StatusBadge status={v.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(v)}
                          title="Editar"
                        >
                          <Edit2 style={{ width: "13px", height: "13px" }} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => {
                            if (confirm(`¿Eliminar ${v.brand} ${v.model}?`)) {
                              deleteMutation.mutate({ id: v.id });
                            }
                          }}
                          title="Eliminar"
                        >
                          <Trash2 style={{ width: "13px", height: "13px" }} />
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

      {/* ── Footer count */}
      {filtered.length > 0 && (
        <p style={{ fontSize: "0.6875rem", color: "#3f3f46", textAlign: "right" }}>
          Mostrando {filtered.length} de {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
