import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, Users, Award, Zap } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Users,
      title: "Trato Personal y Cercano",
      description: "Nos relacionamos con nuestros clientes de manera cercana y personalizada, no solo en el momento de la venta, sino durante toda la garantía.",
    },
    {
      icon: Award,
      title: "Transferencia y Garantía Incluidas",
      description: "Los gastos derivados de la tramitación del cambio de titularidad y los gastos de garantía ya están incluidos en nuestros precios.",
    },
    {
      icon: Zap,
      title: "100% Revisados",
      description: "Todos nuestros vehículos son 100% revisados y se entregan con la ITV al día y el cambio de propietario incluido en el precio.",
    },
  ];

  const features = [
    "Amplia selección de vehículos de todos los segmentos",
    "Vehículos por encargo con asesoramiento personalizado",
    "Compra a particulares con mejor tasación del mercado",
    "Financiación adaptada a tus necesidades",
    "Pago inmediato en tasaciones",
    "Gestión de cambio de titularidad gratuita",
    "Garantía en todos nuestros vehículos",
    "ITV al día en todos los coches",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            ¿Por qué Astur Ocasión?
          </h1>
          <p className="text-muted-foreground">
            Descubre qué nos hace diferentes en el mercado de vehículos de ocasión
          </p>
        </div>
      </section>

      <div className="flex-1 container py-12">
        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nuestra Propuesta de Valor
            </h2>
            <p className="text-lg text-muted-foreground">
              En Astur Ocasión del Automóvil, nos diferenciamos por nuestro compromiso con la calidad, la transparencia y el trato personalizado. Cada vehículo que ofrecemos es 100% revisado y garantizado, con transferencia incluida en el precio.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Lo que Ofrecemos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Por Qué Elegirnos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Calidad Garantizada
              </h3>
              <p className="text-muted-foreground">
                Todos nuestros vehículos pasan por un riguroso proceso de revisión mecánica y estética. Garantizamos que cada coche está en perfecto estado de funcionamiento.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Transparencia Total
              </h3>
              <p className="text-muted-foreground">
                No ocultamos nada. Todos nuestros precios incluyen transferencia y garantía. No hay sorpresas ni gastos ocultos. Lo que ves es lo que pagas.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Atención Personalizada
              </h3>
              <p className="text-muted-foreground">
                Nos tomamos tiempo para entender tus necesidades. Nuestro equipo te asesorará para encontrar el vehículo perfecto para ti, no solo el más caro.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Financiación Flexible
              </h3>
              <p className="text-muted-foreground">
                Ofrecemos opciones de financiación adaptadas a tu situación económica. Trabajamos con los mejores partners para conseguirte las mejores condiciones.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Lo que Dicen Nuestros Clientes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Excelente atención y profesionalidad. El vehículo en perfecto estado y todo el proceso muy rápido. Muy recomendable."
                </p>
                <p className="font-semibold text-foreground">Cliente Satisfecho</p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
