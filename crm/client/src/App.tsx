import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  Car,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import AdminDashboard from "./pages/admin/Dashboard";
import VehicleManagement from "./pages/admin/VehicleManagement";
import LeadManagement from "./pages/admin/LeadManagement";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "";
const AUTH_KEY = "astur_crm_auth";
const AUTH_TS_KEY = "astur_crm_auth_ts";

function useSimpleAuth() {
  const [authed, setAuthed] = useState(() => {
    if (localStorage.getItem(AUTH_KEY) !== "1") return false;
    const ts = Number(localStorage.getItem(AUTH_TS_KEY) ?? "0");
    const EIGHT_HOURS = 8 * 60 * 60 * 1000;
    if (Date.now() - ts > EIGHT_HOURS) {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_TS_KEY);
      return false;
    }
    return true;
  });

  const login = (pwd: string) => {
    if (pwd === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "1");
      localStorage.setItem(AUTH_TS_KEY, String(Date.now()));
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TS_KEY);
    setAuthed(false);
  };

  return { authed, login, logout };
}

const NAV_ITEMS = [
  { href: "/",          icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vehiculos", icon: Car,              label: "Vehículos"  },
  { href: "/leads",     icon: FileText,         label: "Leads"      },
];

function LoginScreen({ onLogin }: { onLogin: (pwd: string) => boolean }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(pwd)) { setError(true); setPwd(""); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0b" }}>
      <div style={{ width: "100%", maxWidth: "360px", padding: "0 1rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg,#e8a020,#f0c060)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Lock style={{ width: "22px", height: "22px", color: "#0a0a0b" }} />
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.375rem", fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.03em" }}>Astur Ocasión CRM</h1>
          <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: "0.25rem" }}>Introduce la contraseña de administrador</p>
        </div>
        {ADMIN_PASSWORD === "" && (
          <p style={{ fontSize: "0.75rem", color: "#f59e0b", background: "#1c1a10", border: "1px solid #92400e", borderRadius: "8px", padding: "0.625rem 0.875rem", marginBottom: "1rem", textAlign: "center" }}>
            Configura VITE_ADMIN_PASSWORD en las variables de entorno de Vercel.
          </p>
        )}
        <form onSubmit={handleSubmit} style={{ background: "#141416", border: "1px solid #1f1f23", borderRadius: "12px", padding: "1.75rem" }}>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type={show ? "text" : "password"}
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(false); }}
              placeholder="Contraseña"
              autoFocus
              style={{ width: "100%", background: "#0a0a0b", border: `1px solid ${error ? "#ef4444" : "#1f1f23"}`, borderRadius: "8px", padding: "0.625rem 2.5rem 0.625rem 0.875rem", fontSize: "0.875rem", color: "#f0f0f0", outline: "none", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}>
              {show ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
            </button>
          </div>
          {error && <p style={{ fontSize: "0.75rem", color: "#ef4444", marginBottom: "0.75rem" }}>Contraseña incorrecta</p>}
          <button type="submit" style={{ width: "100%", background: "#e8a020", color: "#0a0a0b", border: "none", borderRadius: "8px", padding: "0.625rem", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ open, onClose, onLogout }: { open: boolean; onClose: () => void; onLogout: () => void }) {
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
              A
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
                Administrador
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
                admin@asturocasion.es
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
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

function Layout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />

      {/* Main content area */}
      <div className="lg:pl-60">
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


function Router() {
  const { authed, login, logout } = useSimpleAuth();

  if (!authed) return <LoginScreen onLogin={login} />;

  return (
    <Layout onLogout={logout}>
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
