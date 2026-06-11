"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle } from "lucide-react";

export default function ContactVehicleForm({
  vehicleId,
  vehicleName,
}: {
  vehicleId: string;
  vehicleName: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("leads").insert({
      type: "vehicle_inquiry",
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message || `Interesado en: ${vehicleName}`,
      vehicle_id: vehicleId,
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
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircle className="text-green-500 mx-auto mb-2" size={36} />
        <p className="font-bold text-green-800">¡Mensaje enviado!</p>
        <p className="text-sm text-green-600 mt-1">
          Nos pondremos en contacto contigo en menos de 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="tu@email.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="+34 600 000 000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          placeholder={`Estoy interesado en el ${vehicleName}...`}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}
