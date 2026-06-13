"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/", icon: "dashboard", label: "Panel de Control" },
  { href: "/vehiculos", icon: "directions_car", label: "Inventario" },
  { href: "/leads", icon: "person_search", label: "Leads" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      const dest = pathname.startsWith("/leads") ? "/leads" : "/vehiculos";
      router.push(`${dest}?q=${encodeURIComponent(search.trim())}`);
    }
    if (e.key === "Escape") setSearch("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Buscar vehículos o leads... (Enter)"
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-tertiary transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 ml-6">
          <Link
            href="/vehiculos/nuevo"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container-high border border-outline-variant px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Nuevo
          </Link>
          <div className="h-6 w-px bg-outline-variant" />
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-on-surface leading-none">Admin</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Gerente</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FF5733] flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-surface-container-low border border-outline-variant rounded-xl shadow-2xl shadow-black/50 py-1 z-50">
                <div className="px-4 py-3 border-b border-outline-variant">
                  <p className="text-xs font-semibold text-on-surface">Admin</p>
                  <p className="text-[11px] text-on-surface-variant">Gerente · Astur Ocasión</p>
                </div>
                <Link
                  href="/vehiculos/nuevo"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Nuevo vehículo
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors w-full text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Cerrar sesión
                </button>
              </div>
            )}
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
