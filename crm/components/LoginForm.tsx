"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-tertiary transition-all"
          placeholder="admin@asturocasion.com"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-tertiary transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="bg-error-container border border-error/20 rounded-lg px-3 py-2">
          <p className="text-error text-xs">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF5733] hover:brightness-110 text-white font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-60 text-xs uppercase tracking-widest mt-2"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
