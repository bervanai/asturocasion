import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import {
  Car,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import AdminDashboard from "./pages/admin/Dashboard";
import VehicleManagement from "./pages/admin/VehicleManagement";
import LeadManagement from "./pages/admin/LeadManagement";

const NAV_ITEMS = [
  { href: "/",          icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vehiculos", icon: Car,              label: "Vehículos"  },
  { href: "/leads",     icon: FileText,         label: "Leads"      },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        style={{
          background: "#0e0e10",
          borderRight: "1px solid #1f1f23",
          width: "240px",
        }}
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo / Brand */}
        <div
          style={{ borderBottom: "1px solid #1f1f23" }}
          className="px-5 py-5 flex items-center justify-between flex-shrink-0"
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.625rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#e8a020",
                fontWeight: 600,
              }}
            >
              Panel CRM
            </p>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.0625rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f0f0f0",
                lineHeight: 1.2,
                marginTop: "0.125rem",
              }}
            >
              Astur Ocasión
            </h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden btn-icon"
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#3f3f46",
              fontWeight: 600,
              padding: "0 0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Navegación
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`nav-item${isActive ? " active" : ""}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {isActive && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "#e8a020",
                      flexShrink: 0,
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* User footer */}
        <div
          style={{ borderTop: "1px solid #1f1f23" }}
          className="px-4 py-4 flex-shrink-0"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e8a020, #f0c060)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0a0b",
                fontWeight: 700,
                fontSize: "0.75rem",
                flexShrink: 0,
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#f0f0f0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name ?? "Administrador"}
              </p>
              <p
                style={{
                  fontSize: "0.6875rem",
                  color: "#6b7280",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email ?? ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.75rem",
              color: "#6b7280",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
              borderRadius: "var(--radius-sm)",
              transition: "color 0.15s",
              width: "100%",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#f0f0f0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#6b7280")
            }
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div style={{ paddingLeft: 0 }} className="lg:pl-60">
        {/* Mobile top bar */}
        <header
          style={{
            background: "rgba(10,10,11,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1f1f23",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
          className="lg:hidden px-4 py-3 flex items-center gap-3"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-icon"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9375rem",
              letterSpacing: "-0.02em",
              color: "#f0f0f0",
            }}
          >
            Astur Ocasión CRM
          </span>
        </header>

        <main
          style={{
            padding: "1.75rem 1.5rem",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
          className="lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0b",
      }}
    >
      <div
        className="glass-card"
        style={{ padding: "2.5rem", textAlign: "center", maxWidth: "360px" }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <X className="w-6 h-6" style={{ color: "#ef4444" }} />
        </div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "#f0f0f0",
            marginBottom: "0.5rem",
          }}
        >
          Acceso Denegado
        </h1>
        <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
          Solo los administradores pueden acceder al CRM.
        </p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0b",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "2px solid #1f1f23",
          borderTopColor: "#e8a020",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>Cargando CRM…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user || user.role !== "admin") return <AccessDenied />;

  return (
    <Layout>
      <Switch>
        <Route path="/"          component={AdminDashboard}   />
        <Route path="/vehiculos" component={VehicleManagement} />
        <Route path="/leads"     component={LeadManagement}    />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster position="top-right" richColors={false} />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );
}
