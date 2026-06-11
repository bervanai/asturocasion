"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@/lib/supabase";

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
    images: vehicle?.images?.join("\n") ?? "",
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
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
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
    <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Información básica</h2>
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

      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Mecánica y estado</h2>
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

      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Descripción e imágenes</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Descripción del vehículo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URLs de imágenes <span className="text-gray-400">(una por línea)</span>
            </label>
            <textarea
              rows={3}
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="rounded accent-accent"
            />
            <span className="text-sm font-medium text-gray-700">Destacar en la homepage</span>
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear vehículo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/vehiculos")}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto px-4 py-2.5 rounded-xl text-red-500 text-sm hover:bg-red-50 transition-colors"
          >
            Eliminar
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, children }: {
  label: string; value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {children}
      </select>
    </div>
  );
}
