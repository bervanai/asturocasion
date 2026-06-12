import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">AsturCRM</h1>
          <p className="text-on-surface-variant text-xs mt-1 tracking-widest uppercase opacity-70">Astur Ocasión · Panel de Administración</p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-xl shadow-2xl shadow-black/40 p-7">
          <h2 className="text-lg font-semibold text-on-surface mb-6">Iniciar sesión</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
