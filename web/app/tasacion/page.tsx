import TasacionForm from "@/components/TasacionForm";
import { CheckCircle } from "lucide-react";

export default function TasacionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Tasación Gratuita</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Rellena el formulario y recibirás una oferta personalizada por tu vehículo en menos de 24 horas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <TasacionForm />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
            <h3 className="font-bold text-primary mb-3">¿Por qué elegirnos?</h3>
            {[
              "Oferta en menos de 24 horas",
              "Sin compromiso de venta",
              "Pago inmediato al cerrar",
              "Gestionamos los trámites",
              "Precio justo garantizado",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <CheckCircle size={15} className="text-green-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
