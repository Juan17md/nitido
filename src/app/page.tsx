"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickAction } from "@/components/dashboard/QuickAction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-3xl border-4 border-primary border-t-transparent shadow-2xl shadow-primary/20" />
            <div className="absolute inset-0 flex items-center justify-center font-black italic text-primary">N</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 animate-pulse">Nítido</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sincronizando Sistema</p>
          </div>
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
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
              Panel <span className="text-gradient italic">General</span>
            </h2>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              Bienvenido de nuevo, <span className="text-slate-900 font-black">{user.email?.split("@")[0]}</span> 
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
            <Calendar className="h-3 w-3 text-primary" />
            <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
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
              <Link href="/barberia" className={cn(buttonVariants({ variant: "default" }), "w-full bg-blue-600 hover:bg-blue-700 font-bold h-12 shadow-lg shadow-blue-200")}>
                Entrar a Barbería
              </Link>
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
              <Link href="/lavanderia" className={cn(buttonVariants({ variant: "default" }), "w-full bg-indigo-600 hover:bg-indigo-700 font-bold h-12 shadow-lg shadow-indigo-200")}>
                Entrar a Lavandería
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

