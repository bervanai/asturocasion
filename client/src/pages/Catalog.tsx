import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";
import { Filter, X } from "lucide-react";

export default function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    priceMin: 0,
    priceMax: 50000,
    fuel: "",
    transmission: "",
  });

  const vehicles = [
    {
      id: 1,
      name: "Mercedes GLE 250D",
      brand: "Mercedes",
      year: 2016,
      price: 26900,
      km: 276000,
      fuel: "Diésel",
      transmission: "Automático",
      image: "https://via.placeholder.com/400x300?text=Mercedes+GLE",
    },
    {
      id: 2,
      name: "Mercedes SLK 300",
      brand: "Mercedes",
      year: 2010,
      price: 18500,
      km: 145000,
      fuel: "Gasolina",
      transmission: "Automático",
      image: "https://via.placeholder.com/400x300?text=Mercedes+SLK",
    },
    {
      id: 3,
      name: "Peugeot 3008 2.0HDI",
      brand: "Peugeot",
      year: 2014,
      price: 12900,
      km: 33000,
      fuel: "Diésel",
      transmission: "Manual",
      image: "https://via.placeholder.com/400x300?text=Peugeot+3008",
    },
    {
      id: 4,
      name: "Jaguar XF RSport",
      brand: "Jaguar",
      year: 2017,
      price: 20900,
      km: 162000,
      fuel: "Diésel",
      transmission: "Automático",
      image: "https://via.placeholder.com/400x300?text=Jaguar+XF",
    },
    {
      id: 5,
      name: "BMW 325D GT",
      brand: "BMW",
      year: 2017,
      price: 23500,
      km: 157000,
      fuel: "Diésel",
      transmission: "Automático",
      image: "https://via.placeholder.com/400x300?text=BMW+325D",
    },
    {
      id: 6,
      name: "Audi Q5 2.0TDI",
      brand: "Audi",
      year: 2015,
      price: 21500,
      km: 180000,
      fuel: "Diésel",
      transmission: "Automático",
      image: "https://via.placeholder.com/400x300?text=Audi+Q5",
    },
  ];

  const filteredVehicles = vehicles.filter((v) => {
    if (filters.brand && v.brand !== filters.brand) return false;
    if (v.price < filters.priceMin || v.price > filters.priceMax) return false;
    if (filters.fuel && v.fuel !== filters.fuel) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    return true;
  });

  const brands = Array.from(new Set(vehicles.map((v) => v.brand)));
  const fuels = Array.from(new Set(vehicles.map((v) => v.fuel)));
  const transmissions = Array.from(new Set(vehicles.map((v) => v.transmission)));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Catálogo de Vehículos
          </h1>
          <p className="text-muted-foreground">
            Encuentra el vehículo perfecto entre nuestras {vehicles.length} opciones disponibles
          </p>
        </div>
      </section>

      <div className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
              <div className="flex items-center justify-between mb-6 lg:mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Marca
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) =>
                      setFilters({ ...filters, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="">Todas las marcas</option>
                          {brands.length > 0 && brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Precio: {filters.priceMin.toLocaleString()}€ - {filters.priceMax.toLocaleString()}€
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={filters.priceMin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceMin: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={filters.priceMax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceMax: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Fuel Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Combustible
                  </label>
                  <select
                    value={filters.fuel}
                    onChange={(e) =>
                      setFilters({ ...filters, fuel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="">Todos</option>
                    {fuels.length > 0 && fuels.map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transmission Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cambio
                  </label>
                  <select
                    value={filters.transmission}
                    onChange={(e) =>
                      setFilters({ ...filters, transmission: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="">Todos</option>
                    {transmissions.length > 0 && transmissions.map((transmission) => (
                      <option key={transmission} value={transmission}>
                        {transmission}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setFilters({
                      brand: "",
                      priceMin: 0,
                      priceMax: 50000,
                      fuel: "",
                      transmission: "",
                    })
                  }
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <p className="text-sm text-muted-foreground">
                {filteredVehicles.length} vehículos encontrados
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Link key={vehicle.id} href={`/vehiculo/${vehicle.id}`}>
                    <Card className="overflow-hidden card-hover h-full">
                        <div className="relative overflow-hidden bg-muted h-48">
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {vehicle.price.toLocaleString()}€
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-3">
                            {vehicle.name}
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <p>Año: {vehicle.year}</p>
                            <p>Km: {vehicle.km.toLocaleString()}</p>
                            <p>Combustible: {vehicle.fuel}</p>
                            <p>Cambio: {vehicle.transmission}</p>
                          </div>
                        </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No se encontraron vehículos con los filtros seleccionados
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      brand: "",
                      priceMin: 0,
                      priceMax: 50000,
                      fuel: "",
                      transmission: "",
                    })
                  }
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
