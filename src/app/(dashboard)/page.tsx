"use client";

import { useState, useEffect, useMemo } from "react";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeekSelector } from "@/components/dashboard/WeekSelector";
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
import { useFinanzasData } from "@/hooks/use-finanzas-data";

// Components
import { RegistrarCorteDialog } from "@/components/barberia/RegistrarCorteDialog";
import { NuevoAlquilerDialog } from "@/components/lavanderia/NuevoAlquilerDialog";
import { ComprarDolaresDialog } from "@/components/finanzas/ComprarDolaresDialog";

// Services
import { subscribeHistorial as subBarberia, subscribeInventario, subscribeServicios as subServiciosBarberia } from "@/lib/barberia-service";
import { subscribeAlquileresLavanderia as subLavanderia, subscribeMaquinas, subscribeServiciosLavanderia as subServiciosLavanderia } from "@/lib/lavanderia-service";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  // Usamos useMemo o una referencia estable para evitar que el array vacío cree una nueva referencia en cada render.
  const emptyGastos = useMemo(() => [], []);
  
  const finanzasBarberia = useFinanzasData(datosBarberia, emptyGastos, { selectedDate });
  const finanzasLavanderia = useFinanzasData(datosLavanderia, emptyGastos, { isLavanderia: true, selectedDate });

  const ingresosBrutosSemana = finanzasBarberia.ingresosBrutosSemana + finanzasLavanderia.ingresosBrutosSemana;
  const ingresosUsuarioSemana = finanzasBarberia.ingresosUsuarioSemana + finanzasLavanderia.ingresosUsuarioSemana;
  const ingresosEmprendimientoSemana = finanzasBarberia.ingresosEmprendimientoSemana + finanzasLavanderia.ingresosEmprendimientoSemana;
  const ingresosBrutosMes = finanzasBarberia.ingresosBrutosMes + finanzasLavanderia.ingresosBrutosMes;
  const ingresosUsuarioMes = finanzasBarberia.ingresosUsuarioMes + finanzasLavanderia.ingresosUsuarioMes;
  const ingresosEmprendimientoMes = finanzasBarberia.ingresosEmprendimientoMes + finanzasLavanderia.ingresosEmprendimientoMes;

  const startW = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endW = endOfWeek(selectedDate, { weekStartsOn: 1 });

  const barberiaSemana = datosBarberia.filter(item => {
    const f = item.fecha?.toDate();
    if (!f) return false;
    return isWithinInterval(f, { start: startW, end: endW });
  });

  const lavanderiaSemana = datosLavanderia.filter(item => {
    const f = item.fechaEntrada?.toDate();
    if (!f) return false;
    return isWithinInterval(f, { start: startW, end: endW });
  });

  const ingresosBrutosBarberia = barberiaSemana.reduce((acc: number, curr: any) => acc + (curr.precio || 0), 0);
  const ingresosBrutosLavanderia = lavanderiaSemana.reduce((acc: number, curr: any) => acc + (curr.precio || 0), 0);
  const ingresosUsuarioBarberia = ingresosBrutosBarberia * 0.6;
  const ingresosUsuarioLavanderia = ingresosBrutosLavanderia * 0.6;
  const ingresosEmprendimientoBarberia = ingresosBrutosBarberia * 0.4;
  const ingresosEmprendimientoLavanderia = ingresosBrutosLavanderia * 0.4;
  
  const serviciosBarberiaCount = barberiaSemana.length;
  const alquileresLavanderiaCount = lavanderiaSemana.length;

  const allDates = [
    ...datosBarberia.map(d => d.fecha?.toDate()).filter(Boolean),
    ...datosLavanderia.map(d => d.fechaEntrada?.toDate()).filter(Boolean)
  ] as Date[];

  const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map(d => d.getTime()))) : new Date();
  const maxDate = new Date(); // Asumimos que no deberíamos navegar al futuro más allá de la semana actual.

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
            <p className="ml-1 max-w-[260px] text-[11px] font-medium leading-relaxed text-slate-500 md:max-w-md md:text-xs">
              Bienvenido, <span className="text-slate-900 font-bold">{user?.email?.split("@")[0] || "Admin"}</span>. Resumen unificado de tu ecosistema de negocios.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Sesión Activa</span>
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
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <RegistrarCorteDialog servicios={serviciosBarberia} />
        <NuevoAlquilerDialog servicios={serviciosLavanderia} />
        <ComprarDolaresDialog />
      </motion.section>

      {/* Stats Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-4 md:space-y-6"
      >
        <WeekSelector 
          selectedDate={selectedDate} 
          onChange={setSelectedDate} 
          minDate={minDate} 
          maxDate={maxDate} 
        />
        
        <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Ingreso Personal Semana"
            value={`$${ingresosUsuarioSemana.toFixed(2)}`}
            icon={TrendingUp}
            className="border-emerald-200/80 bg-emerald-50/40"
          />
          <StatCard
            title="Ingreso Personal Mes"
            value={`$${ingresosUsuarioMes.toFixed(2)}`}
            icon={DollarSign}
            className="border-emerald-200/80 bg-emerald-50/40"
          />
          <StatCard
            title="Ingreso Completo Semana"
            value={`$${ingresosBrutosSemana.toFixed(2)}`}
            icon={DollarSign}
            className="border-blue-200/80 bg-blue-50/45"
          />
          <StatCard
            title="Ingreso Completo Mes"
            value={`$${ingresosBrutosMes.toFixed(2)}`}
            icon={DollarSign}
            className="border-blue-200/80 bg-blue-50/45"
          />
          <StatCard
            title="Ingreso Personal Barbería"
            value={`$${ingresosUsuarioBarberia.toFixed(2)}`}
            icon={Scissors}
            className="border-violet-200/80 bg-violet-50/40"
          />
          <StatCard
            title="Ingreso Personal Lavandería"
            value={`$${ingresosUsuarioLavanderia.toFixed(2)}`}
            icon={Waves}
            className="border-cyan-200/80 bg-cyan-50/45"
          />
          <StatCard
            title="Ingreso Completo Barbería"
            value={`$${ingresosBrutosBarberia.toFixed(2)}`}
            icon={Scissors}
            className="border-violet-200/80 bg-violet-50/40"
          />
          <StatCard
            title="Ingreso Completo Lavandería"
            value={`$${ingresosBrutosLavanderia.toFixed(2)}`}
            icon={Waves}
            className="border-cyan-200/80 bg-cyan-50/45"
          />
          <StatCard
            title="Ingreso Para la Barbería"
            value={`$${ingresosEmprendimientoBarberia.toFixed(2)}`}
            icon={Scissors}
            className="border-amber-200/90 bg-amber-50/50"
          />
          <StatCard
            title="Ingreso Para la Lavandería"
            value={`$${ingresosEmprendimientoLavanderia.toFixed(2)}`}
            icon={Waves}
            className="border-amber-200/90 bg-amber-50/50"
          />
          <StatCard
            title="Servicios Barbería Semana"
            value={serviciosBarberiaCount.toString()}
            icon={Scissors}
            className="border-slate-200/90 bg-slate-50/70"
          />
          <StatCard
            title="Alquileres Lavandería Semana"
            value={alquileresLavanderiaCount.toString()}
            icon={Waves}
            className="border-slate-200/90 bg-slate-50/70"
          />
        </div>
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
            <CardDescription className="mt-2 text-[11px] font-medium text-slate-500 md:text-xs">
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
            <CardDescription className="mt-2 text-[11px] font-medium text-slate-500 md:text-xs">
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
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 md:text-[11px]">
          Nítido &copy; {new Date().getFullYear()} • Management
        </p>
      </footer>
    </div>
  );
}
