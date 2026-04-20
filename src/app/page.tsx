"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickAction } from "@/components/dashboard/QuickAction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Scissors, 
  Waves, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  PlusCircle, 
  ClipboardList 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Sincronizando con Nítido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8 space-y-8">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Panel <span className="text-primary italic">General</span>
            </h2>
            <p className="text-muted-foreground font-medium">
              Bienvenido, <span className="text-slate-900 font-bold">{user.email?.split("@")[0]}</span>. Gestiona tus emprendimientos desde un solo lugar.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-white px-3 py-1.5 rounded-full shadow-sm border">
            <Calendar className="h-3 w-3" />
            <span>Domingo, 19 de Abril 2026</span>
          </div>
        </section>

        {/* Global Stats Grid */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Ingresos Totales"
            value="$1,240.00"
            description="vs. mes pasado"
            icon={DollarSign}
            trend={{ value: "+12.5%", positive: true }}
          />
          <StatCard
            title="Servicios Realizados"
            value="142"
            description="esta semana"
            icon={ClipboardList}
            trend={{ value: "+8%", positive: true }}
          />
          <StatCard
            title="Clientes Nuevos"
            value="24"
            description="últimos 7 días"
            icon={Users}
            trend={{ value: "+4%", positive: true }}
          />
          <StatCard
            title="Rendimiento"
            value="94%"
            description="eficiencia operativa"
            icon={TrendingUp}
            trend={{ value: "+2%", positive: true }}
          />
        </section>

        {/* Business Selectors */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Barbería Card */}
          <Card className="group overflow-hidden border-none shadow-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="h-2 w-full bg-blue-500" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform">
                  <Scissors className="h-8 w-8" />
                </div>
                <Badge variant="outline" className="text-blue-500 border-blue-200">Activo</Badge>
              </div>
              <CardTitle className="text-2xl pt-4">Barbería</CardTitle>
              <CardDescription>
                Gestión de cortes, barba, inventario de productos y finanzas detalladas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <QuickAction label="Corte" icon={PlusCircle} variant="barber" />
                <QuickAction label="Inventario" icon={ClipboardList} variant="barber" />
                <QuickAction label="Reporte" icon={TrendingUp} variant="barber" />
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-12 shadow-lg shadow-blue-200">
                <Link href="/barberia">Entrar a Barbería</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Lavandería Card */}
          <Card className="group overflow-hidden border-none shadow-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="h-2 w-full bg-indigo-500" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform">
                  <Waves className="h-8 w-8" />
                </div>
                <Badge variant="outline" className="text-indigo-500 border-indigo-200">Activo</Badge>
              </div>
              <CardTitle className="text-2xl pt-4">Lavandería</CardTitle>
              <CardDescription>
                Control de alquiler de lavadoras, disponibilidad de equipos e insumos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <QuickAction label="Alquiler" icon={PlusCircle} variant="laundry" />
                <QuickAction label="Equipos" icon={ClipboardList} variant="laundry" />
                <QuickAction label="Finanzas" icon={DollarSign} variant="laundry" />
              </div>
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold h-12 shadow-lg shadow-indigo-200">
                <Link href="/lavanderia">Entrar a Lavandería</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Badge({ children, variant = "default", className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
      variant === "outline" ? "border" : "bg-primary text-primary-foreground",
      className
    )}>
      {children}
    </span>
  );
}
