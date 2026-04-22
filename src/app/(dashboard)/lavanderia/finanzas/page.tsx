"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Waves, PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { subscribeAlquileresLavanderia, subscribeGastosLavanderia, registrarGastoLavanderia, eliminarGastoLavanderia, type AlquilerLavanderia, type GastoLavanderia } from "@/lib/lavanderia-service";
import { useFinanzasData } from "@/hooks/use-finanzas-data";
import { FinanzasChart } from "@/components/dashboard/FinanzasChart";
import { RegistrarGastoDialog } from "@/components/dashboard/RegistrarGastoDialog";
import { toast } from "sonner";

export default function LavanderiaFinanzasPage() {
  const [alquileres, setAlquileres] = useState<AlquilerLavanderia[]>([]);
  const [gastos, setGastos] = useState<GastoLavanderia[]>([]);

  useEffect(() => {
    const unsubAlquileres = subscribeAlquileresLavanderia(setAlquileres);
    const unsubGastos = subscribeGastosLavanderia(setGastos);
    return () => {
      unsubAlquileres();
      unsubGastos();
    };
  }, []);

  const metrics = useFinanzasData(alquileres, gastos, { isLavanderia: true });

  const handleDeleteGasto = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este gasto?")) {
      try {
        await eliminarGastoLavanderia(id);
        toast.success("Gasto eliminado");
      } catch (error) {
        toast.error("Error al eliminar el gasto");
      }
    }
  };

  return (
    <div className="expansive-container mx-auto py-8 md:py-12 px-4 md:px-0 space-y-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-xl shadow-blue-100 transition-transform hover:rotate-3">
                <Waves className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                Control <span className="italic font-light text-slate-400">Financiero</span>
              </h2>
            </div>
          </div>

          <RegistrarGastoDialog onSave={registrarGastoLavanderia} variant="lavanderia" />
        </div>
      </motion.div>


      <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Ingresos Hoy"
          value={`$${metrics.hoy.toFixed(2)}`}
          description="Total diario"
          icon={TrendingUp}
        />
        <StatCard
          title="Semana"
          value={`$${metrics.semana.toFixed(2)}`}
          description="Últimos 7 días"
          icon={Wallet}
        />
        <StatCard
          title="Mes"
          value={`$${metrics.mes.toFixed(2)}`}
          description="Total acumulado"
          icon={TrendingUp}
        />
        <StatCard
          title="Gastos"
          value={`$${metrics.gastos.toFixed(2)}`}
          description="Mes actual"
          icon={TrendingDown}
        />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Análisis de Rendimiento</CardTitle>
              <CardDescription className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">Flujo de caja - Últimos 7 días</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                 <div className="h-2 w-2 rounded-full bg-blue-900" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Ingresos</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="h-2 w-2 rounded-full bg-blue-100" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Gastos</span>
               </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
             <FinanzasChart data={metrics.chartData} />
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Gastos Recientes</CardTitle>
            <CardDescription className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">Últimos egresos registrados</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
             <div className="divide-y divide-slate-50">
               {gastos.slice(0, 10).map((gasto) => (
                 <div key={gasto.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                   <div className="space-y-1">
                     <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{gasto.descripcion}</p>
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">{gasto.categoria}</span>
                       <span className="text-[10px] text-slate-400">•</span>
                       <span className="text-[10px] font-medium uppercase tabular-nums text-slate-600">
                         {gasto.fecha.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                       </span>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="text-[11px] font-bold text-red-500 tabular-nums">-${gasto.monto.toFixed(2)}</span>
                     <button 
                        onClick={() => handleDeleteGasto(gasto.id!)}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-all"
                     >
                       <Trash2 className="h-3.5 w-3.5" />
                     </button>
                   </div>
                 </div>
               ))}
               {gastos.length === 0 && (
                 <div className="py-20 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">No hay gastos registrados</p>
                 </div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
