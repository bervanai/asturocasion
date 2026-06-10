import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Zap, Users, Handshake, CreditCard } from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: Zap,
      title: "Variedad de Vehículos",
      description: "Amplia selección de coches de todos los segmentos, 100% revisados y en perfecto estado.",
    },
    {
      icon: Users,
      title: "Vehículos por Encargo",
      description: "Asesoramiento personalizado para encontrar el vehículo que buscas.",
    },
    {
      icon: Handshake,
      title: "Compra a Particulares",
      description: "Te compramos tu coche con la mejor tasación del mercado.",
    },
    {
      icon: CreditCard,
      title: "Financiación",
      description: "Opciones de financiación adaptadas a tus necesidades.",
    },
  ];

  const recentVehicles = [
    {
      id: 1,
      name: "Mercedes GLE 250D",
      year: 2016,
      price: 26900,
      km: 276000,
      image: "https://via.placeholder.com/400x300?text=Mercedes+GLE",
    },
    {
      id: 2,
      name: "Mercedes SLK 300",
      year: 2010,
      price: 18500,
      km: 145000,
      image: "https://via.placeholder.com/400x300?text=Mercedes+SLK",
    },
    {
      id: 3,
      name: "Peugeot 3008 2.0HDI",
      year: 2014,
      price: 12900,
      km: 33000,
      image: "https://via.placeholder.com/400x300?text=Peugeot+3008",
    },
    {
      id: 4,
      name: "Jaguar XF RSport",
      year: 2017,
      price: 20900,
      km: 162000,
      image: "https://via.placeholder.com/400x300?text=Jaguar+XF",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Encuentra tu coche perfecto en <span className="gradient-text">Astur Ocasión</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Concesionario premium de vehículos de ocasión en Oviedo. Amplia selección de coches 100% revisados con garantía incluida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/catalogo">
                  <Button size="lg" className="w-full sm:w-auto">
                    Ver Catálogo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contactar
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-3xl"></div>
              <img
                src="https://via.placeholder.com/500x400?text=Premium+Car"
                alt="Vehículo Premium"
                className="relative w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">
              Ofrecemos soluciones completas para todas tus necesidades de automoción
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-6 card-hover">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Vehicles Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">Últimos Vehículos Publicados</h2>
              <p className="section-subtitle">
                Descubre nuestras incorporaciones más recientes
              </p>
            </div>
            <Link href="/catalogo">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentVehicles.map((vehicle) => (
              <Link key={vehicle.id} href={`/vehiculo/${vehicle.id}`}>
                <Card className="overflow-hidden card-hover">
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
                      <h3 className="font-semibold text-foreground mb-2">{vehicle.name}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Año: {vehicle.year}</p>
                        <p>Km: {vehicle.km.toLocaleString()}</p>
                      </div>
                    </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Quieres vender tu coche?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Te ofrecemos la mejor tasación del mercado con pago inmediato y gestión de cambio de titularidad incluida.
          </p>
          <Link href="/compramos-tu-coche">
            <Button size="lg" variant="secondary">
              Tasar mi Vehículo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
