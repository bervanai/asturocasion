"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Car, LayoutDashboard, MessageSquare, LogOut, Plus } from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vehiculos", icon: Car, label: "Vehículos" },
  { href: "/leads", icon: MessageSquare, label: "Leads" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-60 bg-sidebar min-h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold">
          <div className="bg-accent rounded-lg p-1.5">
            <Car size={18} />
          </div>
          Astur Ocasión
        </div>
        <p className="text-white/40 text-xs mt-0.5">Panel CRM</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              path === href
                ? "bg-accent text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}

        <div className="pt-4">
          <Link
            href="/vehiculos/nuevo"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Plus size={17} />
            Añadir vehículo
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors w-full"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
