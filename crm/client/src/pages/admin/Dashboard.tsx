import { useQuery } from "@tanstack/react-query";
import { fetchAllVehicles, fetchAllLeads } from "@/lib/supabase";
import { Link } from "wouter";
import {
  Car,
  FileText,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Animated counter hook ─────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!target) { setCount(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

/* ── KPI Card ───────────────────────────────────────────────────────────────── */
type KpiProps = {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub: string;
  accent: string;
  accentDim: string;
};

function KpiCard({ icon: Icon, label, value, sub, accent, accentDim }: KpiProps) {
  const numericValue = typeof value === "number" ? value : 0;
  const animated = useCountUp(numericValue);
  const displayValue = typeof value === "number" ? animated : value;

  return (
    <div className="kpi-card" style={{ padding: "1.25rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.6875rem", color: "#6b7280", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            {label}
          </p>
          <p
            className="animate-count"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#f0f0f0",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {displayValue}
          </p>
          <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.5rem" }}>{sub}</p>
        </div>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: accentDim,
            border: `1px solid ${accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: "17px", height: "17px", color: accent }} />
        </div>
      </div>
    </div>
  );
}

/* ── CSS Bar Chart ──────────────────────────────────────────────────────────── */
type BarChartProps = { rows: { label: string; value: number; max: number; color: string }[] };

function BarChart({ rows }: BarChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {rows.map((r) => (
        <div key={r.label} className="bar-chart-row">
          <span className="bar-chart-label">{r.label}</span>
          <div className="bar-chart-track">
            <div
              className="bar-chart-fill"
              style={{
                width: mounted ? `${(r.value / r.max) * 100}%` : "0%",
                background: r.color,
              }}
            />
          </div>
          <span className="bar-chart-value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Lead status helpers ────────────────────────────────────────────────────── */
const LEAD_STATUS_LABEL: Record<string, string> = {
  new:       "Nuevo",
  contacted: "En Proceso",
  closed:    "Completado",
  discarded: "Descartado",
};

function leadDotClass(status: string) {
  if (status === "closed")    return "green";
  if (status === "contacted") return "orange";
  if (status === "discarded") return "gray";
  return "blue";
}

/* ── Dashboard ──────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { data: allVehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: fetchAllVehicles });
  const { data: allLeadsData = [] } = useQuery({ queryKey: ["leads"], queryFn: () => fetchAllLeads() });
  const { data: newLeadsData = [] } = useQuery({ queryKey: ["leads", "new"], queryFn: () => fetchAllLeads("new") });

  const recentLeads = newLeadsData.length > 0 ? newLeadsData : [];
  const allLeads = allLeadsData.length > 0 ? allLeadsData : undefined;

  const availableCount  = allVehicles.filter((v) => v.status === "available").length;
  const totalVehicles   = allVehicles.length;
  const soldCount       = allVehicles.filter((v) => v.status === "sold").length;
  const reservedCount   = allVehicles.filter((v) => v.status === "reserved").length;
  const newLeads        = allLeadsData.filter((l) => l.status === "new").length;
  const totalLeads      = allLeadsData.length;
  const inProgress      = allLeadsData.filter((l) => l.status === "contacted").length;
  const completedLeads  = allLeadsData.filter((l) => l.status === "closed").length;

  const kpis: KpiProps[] = [
    {
      icon:       Car,
      label:      "Vehículos Disponibles",
      value:      availableCount,
      sub:        `${totalVehicles} en inventario`,
      accent:     "#3b82f6",
      accentDim:  "rgba(59,130,246,0.12)",
    },
    {
      icon:       FileText,
      label:      "Leads Nuevos",
      value:      newLeads,
      sub:        `${totalLeads} leads en total`,
      accent:     "#e8a020",
      accentDim:  "rgba(232,160,32,0.12)",
    },
    {
      icon:       TrendingUp,
      label:      "En Proceso",
      value:      inProgress,
      sub:        `${completedLeads} completados`,
      accent:     "#22c55e",
      accentDim:  "rgba(34,197,94,0.12)",
    },
    {
      icon:       Users,
      label:      "Reservados / Vendidos",
      value:      reservedCount + soldCount,
      sub:        `${soldCount} vendidos este período`,
      accent:     "#a855f7",
      accentDim:  "rgba(168,85,247,0.12)",
    },
  ];

  /* Fuel distribution (from vehicles if available) */
  const fuelRows = [
    { label: "Gasolina", value: 0, max: 1, color: "#e8a020" },
    { label: "Diésel",   value: 0, max: 1, color: "#3b82f6" },
    { label: "Híbrido",  value: 0, max: 1, color: "#22c55e" },
    { label: "Eléctrico",value: 0, max: 1, color: "#a855f7" },
  ];

  /* Lead funnel chart data */
  const funnelMax = Math.max(newLeads, inProgress, completedLeads, 1);
  const leadFunnelRows = [
    { label: "Nuevos",      value: newLeads,       max: funnelMax, color: "#3b82f6" },
    { label: "En Proceso",  value: inProgress,     max: funnelMax, color: "#e8a020" },
    { label: "Completados", value: completedLeads, max: funnelMax, color: "#22c55e" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* ── Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Panel de control — Astur Ocasión</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/vehiculos">
            <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.4rem 0.875rem" }}>
              <Car style={{ width: "14px", height: "14px" }} />
              Vehículos
            </button>
          </Link>
          <Link href="/leads">
            <button className="btn-primary" style={{ fontSize: "0.75rem", padding: "0.4rem 0.875rem" }}>
              <FileText style={{ width: "14px", height: "14px" }} />
              Gestionar Leads
            </button>
          </Link>
        </div>
      </div>

      {/* ── KPI grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1rem",
        }}
      >
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      {/* ── Charts + recent leads row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
        className="lg:grid-cols-2 grid-cols-1"
      >
        {/* Lead funnel */}
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f0f0f0", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
            Embudo de Leads
          </p>
          <BarChart rows={leadFunnelRows} />
          <div className="crm-divider" />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "#6b7280" }}>
            <span>Total: <strong style={{ color: "#f0f0f0" }}>{totalLeads}</strong></span>
            <span>Tasa cierre: <strong style={{ color: "#22c55e" }}>
              {totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0}%
            </strong></span>
          </div>
        </div>

        {/* Vehicle status */}
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f0f0f0", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
            Estado del Inventario
          </p>
          <BarChart
            rows={[
              { label: "Disponible", value: availableCount, max: Math.max(totalVehicles, 1), color: "#22c55e" },
              { label: "Reservado",  value: reservedCount,  max: Math.max(totalVehicles, 1), color: "#f59e0b" },
              { label: "Vendido",    value: soldCount,       max: Math.max(totalVehicles, 1), color: "#6b7280" },
            ]}
          />
          <div className="crm-divider" />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "#6b7280" }}>
            <span>Total stock: <strong style={{ color: "#f0f0f0" }}>{totalVehicles}</strong></span>
            <span>Ocupación: <strong style={{ color: "#e8a020" }}>
              {totalVehicles > 0 ? Math.round(((reservedCount + soldCount) / totalVehicles) * 100) : 0}%
            </strong></span>
          </div>
        </div>
      </div>

      {/* ── Recent leads feed */}
      <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.01em" }}>
            Leads Recientes — Nuevos
          </p>
          <Link href="/leads">
            <button className="btn-ghost" style={{ fontSize: "0.6875rem", padding: "0.25rem 0.625rem", gap: "0.25rem" }}>
              Ver todos
              <ArrowRight style={{ width: "11px", height: "11px" }} />
            </button>
          </Link>
        </div>

        {!recentLeads || recentLeads.length === 0 ? (
          <div style={{ padding: "2rem 0", textAlign: "center" }}>
            <Circle style={{ width: "28px", height: "28px", color: "#3f3f46", margin: "0 auto 0.5rem" }} />
            <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>No hay leads nuevos por ahora</p>
          </div>
        ) : (
          <div>
            {recentLeads.slice(0, 8).map((lead, idx) => (
              <div
                key={lead.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom: idx < Math.min(recentLeads.length, 8) - 1 ? "1px solid #1f1f23" : "none",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
                  <span className={`activity-dot ${leadDotClass(lead.status)}`} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f0f0f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lead.name}
                    </p>
                    <p style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.1rem" }}>
                      {lead.phone}
                      {lead.type ? ` · ${lead.type}` : ""}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: "0.5625rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      padding: "0.175rem 0.5rem",
                      borderRadius: "99px",
                      background: "rgba(232,160,32,0.12)",
                      color: "#e8a020",
                      border: "1px solid rgba(232,160,32,0.2)",
                    }}
                  >
                    {LEAD_STATUS_LABEL[lead.status] ?? lead.status}
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "#3f3f46", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock style={{ width: "11px", height: "11px" }} />
                    {new Date(lead.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick actions */}
      <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f0f0f0", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
          Acciones Rápidas
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          <Link href="/vehiculos">
            <button className="btn-ghost">
              <Car style={{ width: "14px", height: "14px" }} />
              Añadir Vehículo
            </button>
          </Link>
          <Link href="/leads">
            <button className="btn-ghost">
              <FileText style={{ width: "14px", height: "14px" }} />
              Ver Leads
            </button>
          </Link>
          <Link href="/leads">
            <button className="btn-ghost">
              <CheckCircle2 style={{ width: "14px", height: "14px" }} />
              Leads en Proceso
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
