import LoginForm from "@/components/LoginForm";
import { Car } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white font-bold text-xl mb-2">
            <div className="bg-accent rounded-lg p-2">
              <Car size={20} />
            </div>
            Astur Ocasión
          </div>
          <p className="text-white/50 text-sm">Panel de Administración</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-5">Iniciar sesión</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
