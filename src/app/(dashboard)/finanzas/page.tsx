"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Wallet, History, Trash2, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { subscribeHistorial as subBarberia } from "@/lib/barberia-service";
import { subscribeAlquileresLavanderia as subLavanderia } from "@/lib/lavanderia-service";
import { subscribeComprasDolares, eliminarCompraDolares, type CompraDolares } from "@/lib/dolares-service";
import { useFinanzasData } from "@/hooks/use-finanzas-data";
import { ComprarDolaresDialog } from "@/components/finanzas/ComprarDolaresDialog";
import { toast } from "sonner";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { WeekSelector } from "@/components/dashboard/WeekSelector";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function FinanzasGlobalesPage() {
  const [datosBarberia, setDatosBarberia] = useState<any[]>([]);
  const [datosLavanderia, setDatosLavanderia] = useState<any[]>([]);
  const [comprasDolares, setComprasDolares] = useState<CompraDolares[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubBarberia = subBarberia(setDatosBarberia);
    const unsubLavanderia = subLavanderia(setDatosLavanderia);
    const unsubCompras = subscribeComprasDolares(setComprasDolares);
    return () => {
      unsubBarberia();
      unsubLavanderia();
      unsubCompras();
    };
  }, []);

  const emptyGastos = useMemo(() => [], []);
  const finanzasBarberia = useFinanzasData(datosBarberia, emptyGastos, { selectedDate });
  const finanzasLavanderia = useFinanzasData(datosLavanderia, emptyGastos, { isLavanderia: true, selectedDate });

  const ingresosBrutosSemana = finanzasBarberia.ingresosBrutosSemana + finanzasLavanderia.ingresosBrutosSemana;
  const ingresosUsuarioSemana = finanzasBarberia.ingresosUsuarioSemana + finanzasLavanderia.ingresosUsuarioSemana;
  const ingresosEmprendimientoSemana = finanzasBarberia.ingresosEmprendimientoSemana + finanzasLavanderia.ingresosEmprendimientoSemana;

  const ingresosBrutosMes = finanzasBarberia.ingresosBrutosMes + finanzasLavanderia.ingresosBrutosMes;
  const ingresosUsuarioMes = finanzasBarberia.ingresosUsuarioMes + finanzasLavanderia.ingresosUsuarioMes;
  const ingresosEmprendimientoMes = finanzasBarberia.ingresosEmprendimientoMes + finanzasLavanderia.ingresosEmprendimientoMes;

  const handleDeleteCompra = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await eliminarCompraDolares(itemToDelete);
      toast.success("Compra eliminada");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar la compra");
    } finally {
      setIsDeleting(false);
    }
  };

  const allDates = [
    ...datosBarberia.map(d => d.fecha?.toDate()).filter(Boolean),
    ...datosLavanderia.map(d => d.fechaEntrada?.toDate()).filter(Boolean)
  ] as Date[];

  const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map(d => d.getTime()))) : new Date();
  const maxDate = new Date();

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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-200 transition-transform hover:rotate-3">
                <Wallet className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                Finanzas <span className="italic font-light text-slate-400">Globales</span>
              </h2>
            </div>
          </div>

          <ComprarDolaresDialog />
        </div>
      </motion.div>

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

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <StatCard
            title="Fondos Personales"
            value={`$${ingresosUsuarioSemana.toFixed(2)}`}
            description="Barbería + Lavandería (60%)"
            icon={TrendingUp}
            className="border-emerald-200/80 bg-emerald-50/40"
          />
          <StatCard
            title="Fondos Barbería"
            value={`$${finanzasBarberia.ingresosEmprendimientoSemana.toFixed(2)}`}
            description="Emprendimiento (40%)"
            icon={Wallet}
            className="border-violet-200/80 bg-violet-50/40"
          />
          <StatCard
            title="Fondos Lavandería"
            value={`$${finanzasLavanderia.ingresosEmprendimientoSemana.toFixed(2)}`}
            description="Emprendimiento (40%)"
            icon={Wallet}
            className="border-cyan-200/80 bg-cyan-50/45"
          />
        </div>
      </motion.section>

      {/* Historial de Dólares */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <Card className="border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <History className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Historial de Compras de Dólares</CardTitle>
                <CardDescription className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">Registro de adquisición de divisas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {comprasDolares.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {comprasDolares.map((compra) => (
                  <div key={compra.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Comprado a: {compra.aQuien}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium uppercase tabular-nums text-slate-500">
                          {compra.fecha.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600">
                          Tasa: Bs. {compra.tasa.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-slate-900 tabular-nums">${compra.cantidad.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setItemToDelete(compra.id!);
                          setDeleteConfirmOpen(true);
                        }}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">No hay compras registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteCompra}
        loading={isDeleting}
        title="Eliminar Registro"
        description="¿Estás seguro de eliminar este registro de compra de dólares? Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  );
}
