"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const BRANDS = ["Todas las marcas", "Audi", "BMW", "Ford", "Mercedes-Benz", "Peugeot", "Seat", "Toyota", "Volkswagen"];
const FUELS = ["Todos", "Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP"];
const TRANSMISSIONS = ["Todos", "Manual", "Automático"];
const MAX_PRICE = 100000;

export default function VehicleFilters({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const brand = params.get("brand") ?? "";
  const fuel = params.get("fuel") ?? "";
  const transmission = params.get("transmission") ?? "";
  const maxPrice = parseInt(params.get("maxPrice") ?? String(MAX_PRICE));
  const minPrice = parseInt(params.get("minPrice") ?? "0");

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      if (!value || value === "Todas las marcas" || value === "Todos") {
        p.delete(key);
      } else {
        p.set(key, value);
      }
      router.push(`/catalogo?${p.toString()}`, { scroll: false });
    },
    [params, router]
  );

  const hasFilters = brand || fuel || transmission || minPrice > 0 || maxPrice < MAX_PRICE;

  const clear = () => router.push("/catalogo", { scroll: false });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-accent" />
          Filtros
        </h2>
        {hasFilters && (
          <button
            onClick={clear}
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            <X size={12} />
            Limpiar
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-4">{total} vehículos encontrados</p>

      {/* Marca */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca</label>
        <select
          value={brand || "Todas las marcas"}
          onChange={(e) => update("brand", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {BRANDS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Precio: {new Intl.NumberFormat("es-ES").format(minPrice)}€ – {new Intl.NumberFormat("es-ES").format(maxPrice)}€
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={500}
            value={minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full accent-accent"
          />
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={500}
            value={maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full accent-accent"
          />
        </div>
      </div>

      {/* Combustible */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Combustible</label>
        <select
          value={fuel || "Todos"}
          onChange={(e) => update("fuel", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {FUELS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Cambio */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cambio</label>
        <select
          value={transmission || "Todos"}
          onChange={(e) => update("transmission", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {TRANSMISSIONS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clear}
          className="w-full mt-2 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpiar Filtros
        </button>
      )}
    </div>
  );
}
