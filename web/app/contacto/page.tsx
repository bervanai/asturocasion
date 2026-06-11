import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Contacto</h1>
        <p className="text-gray-500">Estamos para ayudarte. Escríbenos o llámanos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: Phone, label: "Teléfono", value: "+34 985 000 000" },
            { icon: Mail, label: "Email", value: "info@asturocasion.com" },
            { icon: MapPin, label: "Dirección", value: "Calle Mayor 1, Oviedo, Asturias" },
            { icon: Clock, label: "Horario", value: "Lun–Vie 9:00–19:00\nSáb 9:00–14:00" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm text-gray-800 whitespace-pre-line">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
