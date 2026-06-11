"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export default function TasacionForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    brand: "",
    model: "",
    year: "",
    km: "",
    fuel_type: "",
    transmission: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("leads").insert({
      type: "valuation",
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message || null,
      vehicle_info: {
        brand: form.brand,
        model: form.model,
        year: parseInt(form.year),
        km: parseInt(form.km),
        fuel_type: form.fuel_type,
        transmission: form.transmission,
      },
    });

    setLoading(false);
    if (err) {
      setError("Error al enviar. Por favor inténtalo de nuevo.");
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
        <p className="font-bold text-green-800 text-xl">¡Solicitud recibida!</p>
        <p className="text-sm text-green-600 mt-2">
          Revisaremos los datos de tu vehículo y te enviaremos una oferta en menos de 24 horas.
        </p>
      </div>
    );
  }

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
      <div>
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Tus datos de contacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Nombre *" value={form.name} onChange={(v) => set("name", v)} placeholder="Tu nombre" required />
          <InputField label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="tu@email.com" required />
        </div>
        <div className="mt-4">
          <InputField label="Teléfono" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+34 600 000 000" />
        </div>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 mb-4 text-lg">Datos del vehículo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Marca *" value={form.brand} onChange={(v) => set("brand", v)} placeholder="Ej: Toyota" required />
          <InputField label="Modelo *" value={form.model} onChange={(v) => set("model", v)} placeholder="Ej: Corolla" required />
          <SelectField label="Año *" value={form.year} onChange={(v) => set("year", v)} required>
            <option value="">Selecciona el año</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </SelectField>
          <InputField label="Kilómetros *" type="number" value={form.km} onChange={(v) => set("km", v)} placeholder="Ej: 120000" required />
          <SelectField label="Combustible *" value={form.fuel_type} onChange={(v) => set("fuel_type", v)} required>
            <option value="">Selecciona</option>
            {["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"].map((f) => <option key={f}>{f}</option>)}
          </SelectField>
          <SelectField label="Cambio *" value={form.transmission} onChange={(v) => set("transmission", v)} required>
            <option value="">Selecciona</option>
            <option>Manual</option>
            <option>Automático</option>
          </SelectField>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            placeholder="Estado del vehículo, extras, etc."
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Solicitar tasación gratuita"}
      </button>
    </form>
  );
}

function InputField({
  label, value, onChange, placeholder, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, children, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  children: React.ReactNode; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {children}
      </select>
    </div>
  );
}
