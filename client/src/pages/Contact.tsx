import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const createLead = trpc.lead.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    },
    onError: (err) => toast.error("Error al enviar: " + err.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "Sin teléfono",
      type: "Contacto",
      message: [formData.subject, formData.message].filter(Boolean).join(" — "),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Contacto
          </h1>
          <p className="text-muted-foreground">
            Nos encantaría saber de ti. Ponte en contacto con nosotros
          </p>
        </div>
      </section>

      <div className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Envíanos un Mensaje
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-muted-foreground">
                    Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nombre *
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ej: 600123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Asunto *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos más..."
                      rows={6}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={createLead.isPending}>
                    {createLead.isPending ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ubicación</h3>
                  <p className="text-sm text-muted-foreground">
                    Oviedo, Asturias
                  </p>
                </div>
              </div>

              <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2918.4976651652347!2d-5.8343!3d43.3614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd366f5e5e5e5e5e5%3A0x0!2sOviedo%2C%20Asturias!5e0!3m2!1ses!2ses!4v1234567890"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Card>

            {/* Phone */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Teléfono</h3>
                  <div className="space-y-2">
                    <a
                      href="tel:984180450"
                      className="block text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      984 180 450
                    </a>
                    <a
                      href="tel:629574957"
                      className="block text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      629 574 957
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Email */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <a
                    href="mailto:info@asturocasion.es"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    info@asturocasion.es
                  </a>
                </div>
              </div>
            </Card>

            {/* Hours */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Horario</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Lunes a Viernes</span>
                      <br />
                      10:00 - 13:30
                      <br />
                      16:00 - 20:00
                    </p>
                  </div>
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
