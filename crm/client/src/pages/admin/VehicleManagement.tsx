import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
} from "@/lib/supabase";
import { useRef, useState } from "react";
import {
  Plus, Edit2, Trash2, X, Check, Car, Search, Settings2,
  ImagePlus, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, Eye,
} from "lucide-react";
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
  images: string[];
  color: string;
  doors: string;
  powerCv: string;
  isFeatured: boolean;
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
  images: [],
  color: "",
  doors: "5",
  powerCv: "",
  isFeatured: false,
};

const STATUS_TO_API: Record<string, string> = {
  Disponible: "available",
  Reservado: "reserved",
  Vendido: "sold",
};
const STATUS_FROM_API: Record<string, string> = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
};

/* ── Fuel badge ─────────────────────────────────────────────────────────────── */
const FUEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Gasolina:  { bg: "rgba(232,160,32,0.1)",  color: "#e8a020", border: "rgba(232,160,32,0.2)"  },
  "Diésel":  { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", border: "rgba(59,130,246,0.2)"  },
  "Híbrido": { bg: "rgba(34,197,94,0.1)",   color: "#22c55e", border: "rgba(34,197,94,0.2)"   },
  Eléctrico: { bg: "rgba(168,85,247,0.1)",  color: "#a855f7", border: "rgba(168,85,247,0.2)"  },
  GLP:       { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", border: "rgba(245,158,11,0.2)"  },
};

function FuelBadge({ fuel }: { fuel: string }) {
  const c = FUEL_COLORS[fuel] ?? FUEL_COLORS.Gasolina;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.55rem", borderRadius: "99px", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.02em", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {fuel}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label: Record<string, string> = {
    available: "Disponible", reserved: "Reservado", sold: "Vendido",
  };
  const cls: Record<string, string> = {
    available: "badge badge-disponible", reserved: "badge badge-reservado", sold: "badge badge-vendido",
  };
  return <span className={cls[status] ?? "badge badge-vendido"}>{label[status] ?? status}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="crm-label">{label}</label>
      {children}
    </div>
  );
}

/* ── Image uploader component ───────────────────────────────────────────────── */
function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map((f) => uploadVehicleImage(f))
      );
      onChange([...images, ...uploads]);
      toast.success(`${uploads.length} foto${uploads.length > 1 ? "s" : ""} subida${uploads.length > 1 ? "s" : ""}`);
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Error al subir fotos");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async (url: string) => {
    try {
      await deleteVehicleImage(url);
      onChange(images.filter((u) => u !== url));
    } catch {
      // Remove from UI anyway even if delete fails
      onChange(images.filter((u) => u !== url));
    }
  };

  return (
    <div>
      <label className="crm-label">Fotos del vehículo</label>

      {/* Grid of images */}
      {images.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          {images.map((url, i) => (
            <div
              key={url}
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                aspectRatio: "4/3",
                background: "#1a1a1e",
                border: i === 0 ? "2px solid #e8a020" : "1px solid #1f1f23",
              }}
            >
              <img
                src={url}
                alt={`Foto ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Principal badge */}
              {i === 0 && (
                <div style={{ position: "absolute", top: "0.25rem", left: "0.25rem", background: "#e8a020", color: "#0a0a0b", fontSize: "0.5rem", fontWeight: 700, padding: "0.1rem 0.35rem", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Principal
                </div>
              )}
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemove(url)}
                style={{
                  position: "absolute",
                  top: "0.25rem",
                  right: "0.25rem",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.7)",
                  border: "none",
                  color: "#f0f0f0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
              >
                <X style={{ width: "11px", height: "11px" }} />
              </button>
              {/* Move to first (if not already) */}
              {i > 0 && (
                <button
                  type="button"
                  title="Establecer como principal"
                  onClick={() => {
                    const reordered = [url, ...images.filter((u) => u !== url)];
                    onChange(reordered);
                  }}
                  style={{
                    position: "absolute",
                    bottom: "0.25rem",
                    right: "0.25rem",
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    background: "rgba(0,0,0,0.7)",
                    border: "none",
                    color: "#f0f0f0",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  ★ Principal
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        className="btn-ghost"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{ gap: "0.5rem", opacity: uploading ? 0.6 : 1 }}
      >
        {uploading ? (
          <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />
        ) : (
          <ImagePlus style={{ width: "14px", height: "14px" }} />
        )}
        {uploading ? "Subiendo…" : "Añadir fotos"}
      </button>
      {images.length > 0 && (
        <p style={{ fontSize: "0.6375rem", color: "#3f3f46", marginTop: "0.375rem" }}>
          La primera foto es la imagen principal · {images.length} foto{images.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function VehicleManagement() {
  const queryClient = useQueryClient();
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchAllVehicles,
  });

  const createMutation = useMutation({
    mutationFn: (v: Parameters<typeof createVehicle>[0]) => createVehicle(v),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehículo añadido correctamente");
      setShowForm(false);
      setFormData(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateVehicle>[1]) =>
      updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehículo actualizado");
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehículo eliminado");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<VehicleForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minKm, setMinKm] = useState("");
  const [maxKm, setMaxKm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [detailVehicle, setDetailVehicle] = useState<(typeof vehicles)[0] | null>(null);

  const PAGE_SIZE_V = 15;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (v: (typeof vehicles)[0]) => {
    setEditingId(v.id);
    setFormData({
      brand: v.brand,
      model: v.model,
      year: String(v.year),
      price: String(v.price),
      km: String(v.km),
      fuel: v.fuel_type,
      transmission: v.transmission,
      status: STATUS_FROM_API[v.status] ?? "Disponible",
      description: v.description ?? "",
      images: v.images ?? [],
      color: v.color ?? "",
      doors: v.doors != null ? String(v.doors) : "5",
      powerCv: v.power_cv != null ? String(v.power_cv) : "",
      isFeatured: v.is_featured ?? false,
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
      price: formData.price,
      km: Number(formData.km),
      fuel_type: formData.fuel,
      transmission: formData.transmission,
      status: STATUS_TO_API[formData.status] ?? "available",
      ...(STATUS_TO_API[formData.status] === "sold" ? { sold_at: new Date().toISOString() } : {}),
      description: formData.description || null,
      images: formData.images.length > 0 ? formData.images : null,
      color: formData.color || null,
      doors: formData.doors ? Number(formData.doors) : null,
      power_cv: formData.powerCv ? Number(formData.powerCv) : null,
      is_featured: formData.isFeatured,
    };
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...(payload as any) });
    } else {
      createMutation.mutate(payload as any);
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
    const price = Number(v.price);
    const matchMinPrice = !minPrice || price >= Number(minPrice);
    const matchMaxPrice = !maxPrice || price <= Number(maxPrice);
    const matchMinKm = !minKm || v.km >= Number(minKm);
    const matchMaxKm = !maxKm || v.km <= Number(maxKm);
    return matchSearch && matchStatus && matchMinPrice && matchMaxPrice && matchMinKm && matchMaxKm;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE_V, page * PAGE_SIZE_V);

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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #1f1f23" }}>
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
              <Field label="Color">
                <input className="crm-input" name="color" value={formData.color} onChange={handleChange} placeholder="Ej: Negro, Blanco, Gris..." />
              </Field>
              <Field label="Puertas">
                <select className="crm-select" name="doors" value={formData.doors} onChange={handleChange}>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </Field>
              <Field label="Potencia (CV)">
                <input className="crm-input" type="number" name="powerCv" value={formData.powerCv} onChange={handleChange} placeholder="Ej: 150" min="0" />
              </Field>
            </div>

            {/* Destacar en portada */}
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                style={{ width: "16px", height: "16px", accentColor: "#e8a020", cursor: "pointer" }}
              />
              <label htmlFor="isFeatured" style={{ fontSize: "0.8125rem", color: "#f0f0f0", cursor: "pointer", fontWeight: 500 }}>
                Destacar en portada
              </label>
            </div>

            <div style={{ marginBottom: "1rem" }}>
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
            </div>

            {/* Image uploader */}
            <div style={{ padding: "1.25rem", background: "#0e0e10", borderRadius: "8px", border: "1px solid #1f1f23", marginBottom: "1.25rem" }}>
              <ImageUploader
                images={formData.images}
                onChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.625rem" }}>
              <button type="submit" className="btn-primary" disabled={isPending} style={{ opacity: isPending ? 0.6 : 1 }}>
                <Check style={{ width: "14px", height: "14px" }} />
                {isPending ? "Guardando…" : editingId !== null ? "Actualizar" : "Guardar Vehículo"}
              </button>
              <button type="button" className="btn-ghost" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filters row */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#6b7280", pointerEvents: "none" }} />
          <input className="crm-input" style={{ paddingLeft: "2.25rem" }} placeholder="Buscar por marca, modelo o año…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="crm-select" style={{ minWidth: "160px" }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">Todos los estados</option>
          <option value="available">Disponible</option>
          <option value="reserved">Reservado</option>
          <option value="sold">Vendido</option>
        </select>
        <button
          className="btn-ghost"
          onClick={() => setShowFilters((p) => !p)}
          style={{ gap: "0.375rem", background: showFilters ? "rgba(232,160,32,0.1)" : undefined, borderColor: showFilters ? "rgba(232,160,32,0.4)" : undefined, color: showFilters ? "#e8a020" : undefined }}
        >
          <SlidersHorizontal style={{ width: "13px", height: "13px" }} />
          Filtros
        </button>
        {(["available", "reserved", "sold"] as const).map((s) => {
          const count = vehicles.filter((v) => v.status === s).length;
          const label = s === "available" ? "Disponible" : s === "reserved" ? "Reservado" : "Vendido";
          const dotColor = s === "available" ? "#22c55e" : s === "reserved" ? "#f59e0b" : "#6b7280";
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(statusFilter === s ? "all" : s); setPage(1); }}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0 0.875rem", height: "36px", background: statusFilter === s ? "rgba(232,160,32,0.1)" : "#141416", border: `1px solid ${statusFilter === s ? "rgba(232,160,32,0.3)" : "#1f1f23"}`, borderRadius: "var(--radius)", fontSize: "0.6875rem", fontWeight: 600, color: statusFilter === s ? "#e8a020" : "#6b7280", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Extended filters (price + km) */}
      {showFilters && (
        <div className="glass-card" style={{ padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Filtros avanzados</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            <div>
              <label className="crm-label">Precio mínimo (€)</label>
              <input className="crm-input" type="number" placeholder="0" min="0" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
            </div>
            <div>
              <label className="crm-label">Precio máximo (€)</label>
              <input className="crm-input" type="number" placeholder="Sin límite" min="0" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
            </div>
            <div>
              <label className="crm-label">Km mínimos</label>
              <input className="crm-input" type="number" placeholder="0" min="0" value={minKm} onChange={(e) => { setMinKm(e.target.value); setPage(1); }} />
            </div>
            <div>
              <label className="crm-label">Km máximos</label>
              <input className="crm-input" type="number" placeholder="Sin límite" min="0" value={maxKm} onChange={(e) => { setMaxKm(e.target.value); setPage(1); }} />
            </div>
          </div>
          {(minPrice || maxPrice || minKm || maxKm) && (
            <button
              className="btn-ghost"
              style={{ marginTop: "0.75rem", fontSize: "0.75rem" }}
              onClick={() => { setMinPrice(""); setMaxPrice(""); setMinKm(""); setMaxKm(""); setPage(1); }}
            >
              <X style={{ width: "12px", height: "12px" }} />
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── Table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: "3.5rem", textAlign: "center", color: "#6b7280", fontSize: "0.8125rem" }}>Cargando vehículos…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3.5rem", textAlign: "center" }}>
            <Car style={{ width: "36px", height: "36px", color: "#2a2a2e", margin: "0 auto 0.75rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>
              {vehicles.length === 0 ? "No hay vehículos en el inventario todavía" : "No hay vehículos que coincidan con la búsqueda"}
            </p>
            {vehicles.length === 0 && (
              <button className="btn-primary" onClick={() => setShowForm(true)}>
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
                  <th>Fotos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div style={{ width: "56px", height: "40px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#1a1a1e", border: "1px solid #1f1f23" }}>
                          {v.images && v.images[0] ? (
                            <img src={v.images[0]} alt={v.brand} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Car style={{ width: "14px", height: "14px", color: "#6b7280" }} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "#f0f0f0", fontSize: "0.8125rem" }}>{v.brand} {v.model}</p>
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
                        {Number(v.price).toLocaleString("es-ES")}
                        <span style={{ color: "#e8a020", marginLeft: "1px" }}>€</span>
                      </span>
                    </td>
                    <td style={{ color: "#a1a1aa", fontVariantNumeric: "tabular-nums", fontSize: "0.6875rem" }}>
                      {v.km.toLocaleString("es-ES")} km
                    </td>
                    <td><FuelBadge fuel={v.fuel_type} /></td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6875rem", color: "#a1a1aa" }}>
                        <Settings2 style={{ width: "11px", height: "11px", flexShrink: 0 }} />
                        {v.transmission}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        color: v.images && v.images.length > 0 ? "#22c55e" : "#3f3f46",
                      }}>
                        {v.images?.length ?? 0} foto{(v.images?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td><StatusBadge status={v.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button className="btn-icon" onClick={() => setDetailVehicle(v)} title="Ver detalle">
                          <Eye style={{ width: "13px", height: "13px" }} />
                        </button>
                        <button className="btn-icon" onClick={() => handleEdit(v)} title="Editar">
                          <Edit2 style={{ width: "13px", height: "13px" }} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => { if (confirm(`¿Eliminar ${v.brand} ${v.model}?`)) deleteMutation.mutate(v.id); }}
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

      {filtered.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ fontSize: "0.6875rem", color: "#3f3f46" }}>
            Mostrando {Math.min((page - 1) * PAGE_SIZE_V + 1, filtered.length)}–{Math.min(page * PAGE_SIZE_V, filtered.length)} de {filtered.length} vehículo{filtered.length !== 1 ? "s" : ""}
          </p>
          {/* Pagination */}
          {Math.ceil(filtered.length / PAGE_SIZE_V) > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <button className="btn-icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft style={{ width: "14px", height: "14px" }} />
              </button>
              {Array.from({ length: Math.ceil(filtered.length / PAGE_SIZE_V) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600,
                    border: "1px solid", cursor: "pointer",
                    background: p === page ? "#e8a020" : "#141416",
                    color: p === page ? "#0a0a0b" : "#6b7280",
                    borderColor: p === page ? "#e8a020" : "#1f1f23",
                  }}
                >
                  {p}
                </button>
              ))}
              <button className="btn-icon" disabled={page === Math.ceil(filtered.length / PAGE_SIZE_V)} onClick={() => setPage(page + 1)}>
                <ChevronRight style={{ width: "14px", height: "14px" }} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Vehicle detail modal */}
      {detailVehicle && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setDetailVehicle(null); }}
        >
          <div className="glass-card" style={{ width: "100%", maxWidth: "680px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #1f1f23" }}>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.0625rem", fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.03em" }}>
                  {detailVehicle.brand} {detailVehicle.model}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem", alignItems: "center" }}>
                  <StatusBadge status={detailVehicle.status} />
                  <FuelBadge fuel={detailVehicle.fuel_type} />
                  <span style={{ fontSize: "0.6875rem", color: "#6b7280" }}>{detailVehicle.year}</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setDetailVehicle(null)}>
                <X style={{ width: "15px", height: "15px" }} />
              </button>
            </div>

            {/* Content */}
            <div style={{ overflowY: "auto", flex: 1, padding: "1.25rem 1.5rem" }}>
              {/* Photo gallery */}
              {detailVehicle.images && detailVehicle.images.length > 0 ? (
                <div>
                  {/* Main image */}
                  <div style={{ borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9", background: "#1a1a1e", marginBottom: "0.625rem", border: "1px solid #1f1f23" }}>
                    <img
                      src={detailVehicle.images[0]}
                      alt={`${detailVehicle.brand} ${detailVehicle.model}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  {/* Thumbnails */}
                  {detailVehicle.images.length > 1 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem", marginBottom: "1.25rem" }}>
                      {detailVehicle.images.slice(1).map((url, i) => (
                        <div key={url} style={{ borderRadius: "6px", overflow: "hidden", aspectRatio: "4/3", background: "#1a1a1e", border: "1px solid #1f1f23" }}>
                          <img src={url} alt={`Foto ${i + 2}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ borderRadius: "10px", background: "#1a1a1e", border: "1px solid #1f1f23", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <Car style={{ width: "48px", height: "48px", color: "#2a2a2e" }} />
                </div>
              )}

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {[
                  { label: "Precio", value: `${Number(detailVehicle.price).toLocaleString("es-ES")} €` },
                  { label: "Kilómetros", value: `${detailVehicle.km.toLocaleString("es-ES")} km` },
                  { label: "Combustible", value: detailVehicle.fuel_type },
                  { label: "Cambio", value: detailVehicle.transmission },
                  { label: "Color", value: detailVehicle.color ?? "—" },
                  { label: "Puertas", value: detailVehicle.doors ? String(detailVehicle.doors) : "—" },
                  { label: "Potencia", value: detailVehicle.power_cv ? `${detailVehicle.power_cv} CV` : "—" },
                  { label: "Destacado", value: detailVehicle.is_featured ? "Sí" : "No" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#141416", borderRadius: "8px", padding: "0.75rem", border: "1px solid #1f1f23" }}>
                    <p style={{ fontSize: "0.625rem", color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{label}</p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f0f0f0" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {detailVehicle.description && (
                <div>
                  <p className="crm-label">Descripción</p>
                  <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", background: "#141416", border: "1px solid #1f1f23", borderRadius: "8px", padding: "0.875rem 1rem", lineHeight: 1.7 }}>
                    {detailVehicle.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1f1f23", display: "flex", gap: "0.625rem" }}>
              <button className="btn-primary" onClick={() => { handleEdit(detailVehicle); setDetailVehicle(null); }}>
                <Edit2 style={{ width: "13px", height: "13px" }} />
                Editar vehículo
              </button>
              <button className="btn-ghost" onClick={() => setDetailVehicle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
