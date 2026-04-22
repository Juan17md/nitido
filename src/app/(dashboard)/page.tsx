"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickAction } from "@/components/dashboard/QuickAction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Scissors, 
  Waves, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  PlusCircle, 
  ClipboardList,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Components
import { RegistrarVentaDialog } from "@/components/barberia/RegistrarVentaDialog";
import { NuevoAlquilerDialog } from "@/components/lavanderia/NuevoAlquilerDialog";

// Services
import { subscribeHistorial as subBarberia, subscribeInventario, subscribeServicios as subServiciosBarberia } from "@/lib/barberia-service";
import { subscribeAlquileresLavanderia as subLavanderia, subscribeMaquinas, subscribeServiciosLavanderia as subServiciosLavanderia } from "@/lib/lavanderia-service";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [datosBarberia, setDatosBarberia] = useState<any[]>([]);
  const [datosLavanderia, setDatosLavanderia] = useState<any[]>([]);
  const [inventario, setInventario] = useState<any[]>([]);
  const [maquinas, setMaquinas] = useState<any[]>([]);
  const [serviciosBarberia, setServiciosBarberia] = useState<any[]>([]);
  const [serviciosLavanderia, setServiciosLavanderia] = useState<any[]>([]);

  useEffect(() => {
    const unsubBarberia = subBarberia(setDatosBarberia);
    const unsubLavanderia = subLavanderia(setDatosLavanderia);
    const unsubInventario = subscribeInventario(setInventario);
    const unsubMaquinas = subscribeMaquinas(setMaquinas);
    const unsubServiciosB = subServiciosBarberia(setServiciosBarberia);
    const unsubServiciosL = subServiciosLavanderia(setServiciosLavanderia);
    
    return () => {
      unsubBarberia();
      unsubLavanderia();
      unsubInventario();
      unsubMaquinas();
      unsubServiciosB();
      unsubServiciosL();
    };
  }, []);

  // Cálculos Inteligentes
  const hoy = new Date().setHours(0, 0, 0, 0);
  
  const ingresosHoy = datosBarberia
    .filter(s => s.fecha && s.fecha.toDate().getTime() >= hoy)
    .reduce((acc: number, curr: any) => acc + curr.precio, 0) + 
    datosLavanderia
    .filter((p) => p.fechaEntrada && p.fechaEntrada.toDate().getTime() >= hoy)
    .reduce((acc: number, curr: any) => acc + curr.precio, 0);
  
  const stockBajo = inventario.filter(item => item.status === 'low').length;
  const maquinasOcupadas = maquinas.filter(m => m.estado === 'ocupada').length;
  const pedidosPendientes = datosLavanderia.filter((p) => !p.fechaRecibida).length;

  return (
    <div className="expansive-container mx-auto py-6 md:py-12 px-6 md:px-0 space-y-6 md:space-y-16">
      {/* Background Decor */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-slate-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-slate-100/30 blur-[120px]" />
      </div>

      <div className="absolute inset-0 z-0 opacity-[0.015] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Header Section */}
      <motion.section 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 md:pb-8 border-b border-slate-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-200">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-tight">
                  Vista <span className="italic font-light text-slate-400">General</span>
                </h2>
              </div>
            </div>
            <p className="text-[10px] md:text-xs font-medium text-slate-400 max-w-[260px] md:max-w-md ml-1 leading-relaxed">
              Bienvenido, <span className="text-slate-900 font-bold">{user?.email?.split("@")[0] || "Admin"}</span>. Resumen unificado de tu ecosistema de negocios.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Sesión Activa</span>
              <span className="text-[10px] font-bold text-slate-900">{user?.email || "Invitado"}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 bg-slate-50 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl border border-slate-100 shadow-sm">
              <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 text-slate-400" />
              <span>{new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '')}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <RegistrarVentaDialog servicios={serviciosBarberia} />
        <NuevoAlquilerDialog servicios={serviciosLavanderia} />
      </motion.section>

      {/* Stats Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          title="Ingresos Hoy"
          value={`$${ingresosHoy.toFixed(2)}`}
          description="Ecosistema total"
          icon={DollarSign}
        />
        <StatCard
          title="Servicios Pendientes"
          value={pedidosPendientes.toString()}
          description="Lavandería"
          icon={Waves}
        />
        <StatCard
          title="Alertas de Stock"
          value={stockBajo.toString()}
          description={stockBajo > 0 ? "Reponer productos" : "Inventario OK"}
          icon={Scissors}
          className={cn(stockBajo > 0 && "ring-2 ring-red-100")}
        />
        <StatCard
          title="Máquinas en Uso"
          value={maquinasOcupadas.toString()}
          description={`De ${maquinas.length} unidades`}
          icon={TrendingUp}
        />
      </motion.section>

      {/* Business Selectors */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2"
      >
        {/* Barbería Card */}
        <Card className="group overflow-hidden border border-slate-100 bg-white transition-all md:hover:shadow-[0_15px_50px_rgba(0,0,0,0.04)]">
          <CardHeader className="pb-4 pt-6 md:pt-8 px-6 md:px-8">
            <div className="flex items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 md:group-hover:bg-slate-900 md:group-hover:text-white transition-all duration-500">
                  <Scissors className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <CardTitle className="text-sm md:text-xl font-bold tracking-tight text-slate-900 uppercase">Gestión Barbería</CardTitle>
              </div>
            </div>
            <CardDescription className="text-[11px] md:text-xs font-medium text-slate-400 mt-2">
              Control integral de servicios, agenda de clientes e inventario.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 md:pb-8 space-y-6 md:space-y-8">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <QuickAction label="Corte" icon={PlusCircle} onClick={() => router.push('/barberia')} />
              <QuickAction label="Inventario" icon={ClipboardList} onClick={() => router.push('/barberia/inventario')} />
              <QuickAction label="Reporte" icon={TrendingUp} onClick={() => router.push('/barberia/finanzas')} />
            </div>
            <Link href="/barberia" className={cn(buttonVariants({ variant: "default" }), "group w-full h-11 md:h-12 bg-slate-900 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]")}>
              Entrar al Módulo
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform md:group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Lavandería Card */}
        <Card className="group overflow-hidden border border-slate-100 bg-white transition-all md:hover:shadow-[0_15px_50px_rgba(0,0,0,0.04)]">
          <CardHeader className="pb-4 pt-6 md:pt-8 px-6 md:px-8">
            <div className="flex items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 md:group-hover:bg-slate-900 md:group-hover:text-white transition-all duration-500">
                  <Waves className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <CardTitle className="text-sm md:text-xl font-bold tracking-tight text-slate-900 uppercase">Gestión Lavandería</CardTitle>
              </div>
            </div>
            <CardDescription className="text-[11px] md:text-xs font-medium text-slate-400 mt-2">
              Administración de equipos, control de insumos y finanzas.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6 md:pb-8 space-y-6 md:space-y-8">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <QuickAction label="Alquiler" icon={PlusCircle} onClick={() => router.push('/lavanderia')} />
              <QuickAction label="Equipos" icon={ClipboardList} onClick={() => router.push('/lavanderia/maquinas')} />
              <QuickAction label="Finanzas" icon={DollarSign} onClick={() => router.push('/lavanderia/finanzas')} />
            </div>
            <Link href="/lavanderia" className={cn(buttonVariants({ variant: "default" }), "group w-full h-11 md:h-12 bg-slate-900 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]")}>
              Entrar al Módulo
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform md:group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </motion.section>

      <footer className="py-8 md:py-12 text-center relative z-10">
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-slate-200">
          Nítido &copy; {new Date().getFullYear()} • Management
        </p>
      </footer>
    </div>
  );
}
