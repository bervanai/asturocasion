import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Link, Route, Switch } from "wouter";
import { Car, Users, FileText, Plus } from "lucide-react";
import VehicleManagement from "./VehicleManagement";
import LeadManagement from "./LeadManagement";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Acceso Denegado
          </h1>
          <p className="text-muted-foreground mb-6">
            No tienes permiso para acceder a esta área
          </p>
          <Link href="/">
            <a>
              <Button>Volver al Inicio</Button>
            </a>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Switch>
        <Route path="/admin" component={AdminHome} />
        <Route path="/admin/vehiculos" component={VehicleManagement} />
        <Route path="/admin/leads" component={LeadManagement} />
      </Switch>
    </DashboardLayout>
  );
}

function AdminHome() {
  const stats = [
    {
      icon: Car,
      label: "Vehículos en Inventario",
      value: "16",
      color: "text-blue-600",
    },
    {
      icon: FileText,
      label: "Leads Pendientes",
      value: "8",
      color: "text-green-600",
    },
    {
      icon: Users,
      label: "Clientes Registrados",
      value: "42",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido al panel de control de Astur Ocasión
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/vehiculos">
            <a>
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Añadir Nuevo Vehículo
              </Button>
            </a>
          </Link>
          <Link href="/admin/leads">
            <a>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Ver Leads
              </Button>
            </a>
          </Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="text-foreground font-medium">
                  Nuevo lead de tasación
                </p>
                <p className="text-sm text-muted-foreground">
                  Hace 2 horas
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Nuevo
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
