import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function TradeIn() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    km: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const createLead = trpc.lead.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ brand: "", model: "", year: "", km: "", name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    },
    onError: (err) => toast.error("Error al enviar: " + err.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleStr = [formData.brand, formData.model, formData.year, formData.km ? `${formData.km} km` : ""].filter(Boolean).join(" ");
    createLead.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: "Tasación",
      vehicle: vehicleStr || undefined,
      message: formData.message || undefined,
    });
  };

  const brands = ["Mercedes", "BMW", "Audi", "Peugeot", "Jaguar", "Ford", "Volvo", "Lexus"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Compramos tu Coche
          </h1>
          <p className="text-muted-foreground">
            Te ofrecemos la mejor tasación del mercado con pago inmediato
          </p>
        </div>
      </section>

      <div className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Tasación Gratuita
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    ¡Solicitud Enviada!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Nos pondremos en contacto contigo en breve para ofrecerte la mejor tasación.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Vehicle Info */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Información del Vehículo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Marca *
                        </label>
                        <select
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                        >
                          <option value="">Selecciona una marca</option>
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Modelo *
                        </label>
                        <Input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          placeholder="Ej: GLE 250D"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Año *
                        </label>
                        <Input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="Ej: 2016"
                          min="1990"
                          max={new Date().getFullYear()}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Kilómetros *
                        </label>
                        <Input
                          type="number"
                          name="km"
                          value={formData.km}
                          onChange={handleChange}
                          placeholder="Ej: 150000"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">
                      Tus Datos de Contacto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nombre Completo *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Teléfono *
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Ej: 600123456"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Comentarios Adicionales
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos más sobre el estado del vehículo..."
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={createLead.isPending}>
                    Solicitar Tasación Gratuita
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Benefits */}
            <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-4">Ventajas</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Tasación gratuita sin compromiso
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Mejor precio del mercado
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Pago inmediato
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Cambio de titularidad gratuito
                  </span>
                </li>
              </ul>
            </Card>

            {/* Contact Card */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold text-foreground mb-4">
                ¿Prefieres contactar directamente?
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Teléfono</p>
                  <a
                    href="tel:984180450"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    984 180 450
                  </a>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/34629574957"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    629 574 957
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
