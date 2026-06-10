import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRoute } from "wouter";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";

export default function VehicleDetail() {
  const [route, params] = useRoute("/vehiculo/:id");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - En producción, esto vendría de la API
  const vehicle = {
    id: params?.id,
    name: "Mercedes GLE 250D",
    brand: "Mercedes",
    model: "GLE",
    year: 2016,
    price: 26900,
    km: 276000,
    fuel: "Diésel",
    transmission: "Automático",
    color: "Gris Metalizado",
    seats: 5,
    doors: 5,
    power: "204 CV",
    description: `UN SOLO TITULAR, TODAS LAS REVISIONES EN MERCEDES, AMG INTERIOR Y EXTERIOR, NAVEGADOR COMAND, FAROS LED, KEY LESS START, SUSPENSIÓN NEUMATICA, CAMBIO AUTOMATICO DE 9 VELOCIDADES, ESPEJOS RETRACTILES, CONTROL DE VELOCIDAD, LLANTAS EN 20", TECHO PANORAMICO, MUY BUEN ESTADO.

Vehículo en perfecto estado de funcionamiento. Todos los servicios realizados en taller oficial Mercedes. Documentación completa y al día. Cambio de titularidad incluido en el precio.`,
    features: [
      "Navegador COMAND",
      "Faros LED",
      "Suspensión Neumática",
      "Cambio Automático",
      "Techo Panorámico",
      "Llantas de Aleación 20\"",
      "Espejos Retractiles",
      "Control de Velocidad",
      "Asientos de Cuero",
      "Climatizador Automático",
    ],
    images: [
      "https://via.placeholder.com/800x600?text=Mercedes+GLE+1",
      "https://via.placeholder.com/800x600?text=Mercedes+GLE+2",
      "https://via.placeholder.com/800x600?text=Mercedes+GLE+3",
      "https://via.placeholder.com/800x600?text=Mercedes+GLE+4",
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              <div className="relative bg-muted rounded-lg overflow-hidden h-96 md:h-[500px]">
                <img
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.name} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {vehicle.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Descripción
              </h2>
              <p className="text-muted-foreground whitespace-pre-line mb-6">
                {vehicle.description}
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-4">
                Características
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="text-4xl font-bold text-primary mb-2">
                {vehicle.price.toLocaleString()}€
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Transferencia y garantía incluidas
              </p>
            </Card>

            {/* Vehicle Info */}
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">
                Información del Vehículo
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Marca</span>
                  <span className="font-medium text-foreground">
                    {vehicle.brand}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Modelo</span>
                  <span className="font-medium text-foreground">
                    {vehicle.model}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Año</span>
                  <span className="font-medium text-foreground">
                    {vehicle.year}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Kilómetros</span>
                  <span className="font-medium text-foreground">
                    {vehicle.km.toLocaleString()} km
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Combustible</span>
                  <span className="font-medium text-foreground">
                    {vehicle.fuel}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Cambio</span>
                  <span className="font-medium text-foreground">
                    {vehicle.transmission}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-medium text-foreground">
                    {vehicle.color}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Potencia</span>
                  <span className="font-medium text-foreground">
                    {vehicle.power}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Puertas</span>
                  <span className="font-medium text-foreground">
                    {vehicle.doors}
                  </span>
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            <Card className="p-6 mb-6 border-accent/20 bg-accent/5">
              <h3 className="font-semibold text-foreground mb-4">
                ¿Te interesa este vehículo?
              </h3>
              <div className="space-y-3">
                <a href="tel:984180450">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                </a>
                <a href="mailto:info@asturocasion.es">
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </a>
              </div>
            </Card>

            {/* Additional Info */}
            <Card className="p-6 bg-muted/30">
              <h4 className="font-semibold text-foreground mb-2">
                Información Importante
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ 100% revisado y en perfecto estado</li>
                <li>✓ ITV al día</li>
                <li>✓ Cambio de titularidad incluido</li>
                <li>✓ Garantía incluida</li>
                <li>✓ Financiación disponible</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
