"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@/lib/supabase";
import ImageUploader from "./ImageUploader";

type Props = { vehicle?: Vehicle };

export default function VehicleForm({ vehicle }: Props) {
  const router = useRouter();
  const isEdit = !!vehicle;

  const [form, setForm] = useState({
    brand: vehicle?.brand ?? "",
    model: vehicle?.model ?? "",
    year: vehicle?.year?.toString() ?? "",
    price: vehicle?.price?.toString() ?? "",
    km: vehicle?.km?.toString() ?? "",
    fuel_type: vehicle?.fuel_type ?? "Gasolina",
    transmission: vehicle?.transmission ?? "Manual",
    color: vehicle?.color ?? "",
    doors: vehicle?.doors?.toString() ?? "5",
    power_cv: vehicle?.power_cv?.toString() ?? "",
    description: vehicle?.description ?? "",
    status: vehicle?.status ?? "available",
    is_featured: vehicle?.is_featured ?? false,
    images: vehicle?.images ?? [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      brand: form.brand,
      model: form.model,
      year: parseInt(form.year),
      price: parseFloat(form.price),
      km: parseInt(form.km),
      fuel_type: form.fuel_type,
      transmission: form.transmission,
      color: form.color || null,
      doors: form.doors ? parseInt(form.doors) : null,
      power_cv: form.power_cv ? parseInt(form.power_cv) : null,
      description: form.description || null,
      status: form.status,
      is_featured: form.is_featured,
      images: form.images,
    };

    const { error: err } = isEdit
      ? await supabase.from("vehicles").update(payload).eq("id", vehicle.id)
      : await supabase.from("vehicles").insert(payload);

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      router.push("/vehiculos");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!vehicle || !confirm("¿Seguro que quieres eliminar este vehículo?")) return;
    await supabase.from("vehicles").delete().eq("id", vehicle.id);
    router.push("/vehiculos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Información básica */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-5">Información básica</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Marca *" value={form.brand} onChange={(v) => set("brand", v)} required />
          <Field label="Modelo *" value={form.model} onChange={(v) => set("model", v)} required />
          <Field label="Año *" type="number" value={form.year} onChange={(v) => set("year", v)} required />
          <Field label="Precio (€) *" type="number" value={form.price} onChange={(v) => set("price", v)} required />
          <Field label="Kilómetros *" type="number" value={form.km} onChange={(v) => set("km", v)} required />
          <Field label="Potencia (CV)" type="number" value={form.power_cv} onChange={(v) => set("power_cv", v)} />
          <Field label="Color" value={form.color} onChange={(v) => set("color", v)} />
          <Field label="Puertas" type="number" value={form.doors} onChange={(v) => set("doors", v)} />
        </div>
      </div>

      {/* Mecánica y estado */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-5">Mecánica y estado</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField label="Combustible *" value={form.fuel_type} onChange={(v) => set("fuel_type", v)}>
            {["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"].map((f) => <option key={f}>{f}</option>)}
          </SelectField>
          <SelectField label="Cambio *" value={form.transmission} onChange={(v) => set("transmission", v)}>
            <option>Manual</option>
            <option>Automático</option>
          </SelectField>
          <SelectField label="Estado *" value={form.status} onChange={(v) => set("status", v)}>
            <option value="available">Disponible</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
          </SelectField>
        </div>
      </div>

      {/* Descripción e imágenes */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-5">Descripción e imágenes</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Descripción</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-tertiary resize-none transition-all"
              placeholder="Descripción del vehículo..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Imágenes</label>
            <ImageUploader
              vehicleId={vehicle?.id}
              images={form.images as string[]}
              onChange={(urls) => setForm((f) => ({ ...f, images: urls }))}
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="rounded border-outline-variant bg-surface accent-tertiary w-4 h-4"
            />
            <span className="text-sm text-on-surface-variant">Destacar en la homepage</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-error-container border border-error/20 rounded-lg px-3 py-2">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF5733] hover:brightness-110 text-white font-bold px-6 py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-60 text-xs uppercase tracking-wider"
        >
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear vehículo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/vehiculos")}
          className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant text-xs font-bold uppercase tracking-wider hover:bg-surface-variant transition-colors"
        >
          Cancelar
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto px-4 py-2.5 rounded-lg text-error text-xs font-bold uppercase tracking-wider hover:bg-error/10 transition-colors border border-error/20"
          >
            Eliminar vehículo
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-tertiary transition-all"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, children }: {
  label: string; value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary transition-all"
      >
        {children}
      </select>
    </div>
  );
}
