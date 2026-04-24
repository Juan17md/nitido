"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Scissors, 
  ClipboardList, 
  TrendingUp, 
  DollarSign,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import { startOfWeek, startOfMonth, isAfter } from "date-fns";

// Importar servicios reales
import { 
  subscribeServicios, 
  subscribeHistorial, 
  subscribeInventario,
  eliminarVenta,
  type Servicio,
  type HistorialServicio,
  type Producto 
} from "@/lib/barberia-service";
import { toast } from "sonner";

// Importar nuevos diálogos
import { RegistrarCorteDialog } from "@/components/barberia/RegistrarCorteDialog";
import { NuevoServicioDialog } from "@/components/barberia/NuevoServicioDialog";
import { AjustarStockDialog } from "@/components/barberia/AjustarStockDialog";
import { EditarVentaDialog } from "@/components/barberia/EditarVentaDialog";

export default function BarberiaPage() {
  // Estado real de datos
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [historial, setHistorial] = useState<HistorialServicio[]>([]);
  const [inventario, setInventario] = useState<Producto[]>([]);

  // Suscripciones en tiempo real
  useEffect(() => {
    const unsubServicios = subscribeServicios(setServicios);
    const unsubHistorial = subscribeHistorial(setHistorial);
    const unsubInventario = subscribeInventario(setInventario);

    return () => {
      unsubServicios();
      unsubHistorial();
      unsubInventario();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      try {
        await eliminarVenta(id);
        toast.success("Registro eliminado");
      } catch (error) {
        console.error(error);
        toast.error("Error al eliminar el registro");
      }
    }
  };

  // Cálculos dinámicos con filtros temporales reales
  const now = new Date();
  const semanaStart = startOfWeek(now, { weekStartsOn: 1 });
  const mesStart = startOfMonth(now);

  const ingresosSemana = historial
    .filter(item => item.fecha && isAfter(item.fecha.toDate(), semanaStart))
    .reduce((acc, curr) => acc + curr.precio, 0);

  const ingresosMensuales = historial
    .filter(item => item.fecha && isAfter(item.fecha.toDate(), mesStart))
    .reduce((acc, curr) => acc + curr.precio, 0);

  const serviciosMensuales = historial
    .filter(item => item.fecha && isAfter(item.fecha.toDate(), mesStart))
    .length;

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
                <Scissors className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                Panel de <span className="italic font-light text-slate-400">Control</span>
              </h2>
            </div>
          </div>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 md:space-y-8"
      >
        {/* Stats Grid */}
        <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3">
          <StatCard
            title="Semana"
            value={`$${ingresosSemana.toFixed(2)}`}
            description="Semana actual"
            icon={DollarSign}
          />
          <StatCard
            title="Mes"
            value={`$${ingresosMensuales.toFixed(2)}`}
            description="Mes actual"
            icon={TrendingUp}
          />
          <StatCard
            title="Servicios"
            value={serviciosMensuales.toString()}
            description="este mes"
            icon={ClipboardList}
            className="col-span-2 md:col-span-1"
          />
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
          {/* Quick Actions */}
          <Card className="md:col-span-1 border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="bg-slate-50/50 pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Acciones Rápidas</CardTitle>
              <CardDescription className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">Operaciones frecuentes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid gap-3">
              <RegistrarCorteDialog servicios={servicios} />
              <NuevoServicioDialog />
              <AjustarStockDialog productos={inventario} />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-2 border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Actividad Reciente</CardTitle>
                <CardDescription className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">Últimos registros</CardDescription>
              </div>
              <Link href="/barberia/historial">
                <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Ver Todos</Button>
              </Link>
            </CardHeader>
            <CardContent className="px-0 md:px-6">
              {historial.length === 0 ? (
                <div className="py-10 text-center px-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">No hay registros hoy</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Vista Móvil */}
                  <div className="md:hidden divide-y divide-slate-50">
                    {historial.slice(0, 5).map((row) => (
                      <div key={row.id} className="p-4 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{row.nombreServicio}</span>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-900 text-[9px] font-bold border-none px-2 py-0.5">
                            ${row.precio.toFixed(2)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.12em]">{row.cliente}</span>
                          <div className="flex items-center gap-1">
                            <EditarVentaDialog venta={row} servicios={servicios} />
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(row.id!)} title="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vista Escritorio */}
                  <div className="hidden md:block overflow-x-auto scrollbar-hide">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-50 hover:bg-transparent px-4">
                          <TableHead className="whitespace-nowrap pl-6 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 md:pl-4">Servicio</TableHead>
                          <TableHead className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Cliente</TableHead>
                          <TableHead className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Monto</TableHead>
                          <TableHead className="whitespace-nowrap pr-6 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 md:pr-4">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historial.slice(0, 5).map((row) => (
                          <TableRow key={row.id} className="border-slate-50 md:hover:bg-slate-50/50 transition-colors group">
                            <TableCell className="py-4 pl-6 md:pl-4">
                              <span className="text-[11px] font-bold text-slate-900 whitespace-nowrap">{row.nombreServicio}</span>
                            </TableCell>
                            <TableCell>
                              <span className="whitespace-nowrap text-[11px] font-medium text-slate-600">{row.cliente}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-900 text-[9px] font-bold border-none">
                                ${row.precio.toFixed(2)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6 md:pr-4">
                              <div className="flex justify-end items-center gap-1">
                                <EditarVentaDialog venta={row} servicios={servicios} />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 transition-colors md:hover:bg-red-50 md:hover:text-red-500" onClick={() => handleDelete(row.id!)} title="Eliminar">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
