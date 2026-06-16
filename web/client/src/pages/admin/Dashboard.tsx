import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Link, Route, Switch } from "wouter";
import { Car, Users, FileText, Plus, TrendingUp } from "lucide-react";
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
            <Button>Volver al Inicio</Button>
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
  const { data: vehicleStats } = trpc.vehicle.stats.useQuery();
  const { data: leadStats } = trpc.lead.stats.useQuery();
  const { data: recentLeads } = trpc.lead.list.useQuery({ status: "Nuevo" });

  const stats = [
    {
      icon: Car,
      label: "Vehículos Disponibles",
      value: vehicleStats?.available ?? "—",
      sub: `${vehicleStats?.total ?? 0} en total`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: FileText,
      label: "Leads Nuevos",
      value: leadStats?.new ?? "—",
      sub: `${leadStats?.total ?? 0} en total`,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: TrendingUp,
      label: "En Proceso",
      value: leadStats?.inProgress ?? "—",
      sub: `${leadStats?.completed ?? 0} completados`,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Users,
      label: "Reservados/Vendidos",
      value: (vehicleStats?.reserved ?? 0) + (vehicleStats?.sold ?? 0),
      sub: `${vehicleStats?.sold ?? 0} vendidos`,
      color: "text-purple-600",
      bg: "bg-purple-50",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </div>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
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
            <Button className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Gestionar Vehículos
            </Button>
          </Link>
          <Link href="/admin/leads">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Ver Leads
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Leads */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Leads Nuevos
        </h2>
        {!recentLeads || recentLeads.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay leads nuevos</p>
        ) : (
          <div className="space-y-3">
            {recentLeads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-foreground font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.phone} · {lead.type}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
