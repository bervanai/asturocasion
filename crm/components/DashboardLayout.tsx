"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/", icon: "dashboard", label: "Panel de Control" },
  { href: "/vehiculos", icon: "directions_car", label: "Inventario" },
  { href: "/leads", icon: "person_search", label: "Leads" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-low border-r border-outline-variant flex flex-col py-6 z-50">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-bold text-on-surface tracking-tight">AsturCRM</h1>
          <p className="text-[10px] text-on-surface-variant mt-0.5 tracking-widest uppercase opacity-70">Astur Ocasión</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-tertiary bg-surface-container-highest border-l-4 border-tertiary"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-3 pt-6 border-t border-outline-variant space-y-0.5">
          <Link
            href="/vehiculos/nuevo"
            className="flex items-center justify-center gap-2 w-full bg-[#FF5733] hover:brightness-110 text-white text-xs font-bold py-3 rounded-lg transition-all active:scale-95 mb-3 uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Añadir Vehículo
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant text-sm transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Top bar */}
      <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-6 z-40">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            placeholder="Buscar inventario, leads o clientes..."
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-tertiary transition-all"
          />
        </div>
        <div className="flex items-center gap-3 ml-6">
          <button className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-6 w-px bg-outline-variant" />
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="text-right">
              <p className="text-xs font-semibold text-on-surface leading-none">Admin</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Gerente</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
