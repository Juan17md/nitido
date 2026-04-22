"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Waves, 
  Clock, 
  Settings, 
  TrendingUp, 
  DollarSign 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Firebase Services
import { 
  subscribeServiciosLavanderia, 
  subscribeAlquileresLavanderia, 
  subscribeMaquinas,
  type ServicioLavanderia,
  type AlquilerLavanderia,
  type Maquina
} from "@/lib/lavanderia-service";

// Components
import { NuevoAlquilerDialog } from "@/components/lavanderia/NuevoAlquilerDialog";

export default function LavanderiaPage() {
  // Estado real de datos
  const [servicios, setServicios] = useState<ServicioLavanderia[]>([]);
  const [alquileres, setAlquileres] = useState<AlquilerLavanderia[]>([]);
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);

  // Suscripciones en tiempo real
  useEffect(() => {
    const unsubServicios = subscribeServiciosLavanderia(setServicios);
    const unsubAlquileres = subscribeAlquileresLavanderia(setAlquileres);
    const unsubMaquinas = subscribeMaquinas(setMaquinas);

    return () => {
      unsubServicios();
      unsubAlquileres();
      unsubMaquinas();
    };
  }, []);

  // Ingresos del mes: cobro al registrar (fecha de entrada del pedido)
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const ingresosMensuales = alquileres
    .filter((p) => p.fechaEntrada && p.fechaEntrada.toDate() >= inicioMes)
    .reduce((acc, curr) => acc + curr.precio, 0);
  
  const alquileresActivos = alquileres.filter((p) => !p.fechaRecibida).length;
  const maquinasDisponibles = maquinas.filter(m => m.estado === 'disponible').length;

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
              <div className="flex flex-col">
                <Badge variant="outline" className="w-fit text-[8px] font-bold uppercase tracking-[0.2em] text-blue-400 border-blue-100 px-2 py-0.5 bg-white mb-1">
                  Módulo Lavandería
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                  Panel de <span className="italic font-light text-slate-400">Control</span>
                </h2>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400 max-w-md ml-1">
              Optimiza la gestión de alquileres, monitorea la disponibilidad de las máquinas y supervisa los ingresos de tu lavandería en tiempo real.
            </p>
          </div>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 md:space-y-8"
      >
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <StatCard
            title="Alquileres"
            value={alquileresActivos.toString()}
            description="Pendientes de recepción"
            icon={Clock}
            trend={{ value: "Pendientes", positive: true }}
          />
          <StatCard
            title="Ingresos"
            value={`$${ingresosMensuales.toFixed(2)}`}
            description="Mes (al registrar)"
            icon={TrendingUp}
            trend={{ value: "+0%", positive: true }}
          />
          <StatCard
            title="Máquinas"
            value={`${maquinasDisponibles}/${maquinas.length}`}
            description="Disponibles"
            icon={Settings}
            trend={{ value: "Estado OK", positive: true }}
            className="sm:col-span-2 md:col-span-1"
          />
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
          {/* Quick Actions */}
          <Card className="md:col-span-1 border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="bg-slate-50/50 pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Acciones Rápidas</CardTitle>
              <CardDescription className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">Gestión operativa</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid gap-3">
              <NuevoAlquilerDialog servicios={servicios} />
              <Link href="/lavanderia/maquinas">
                <Button variant="outline" className="w-full h-11 border-slate-100 text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  Estado Máquinas
                </Button>
              </Link>

            </CardContent>
          </Card>

          {/* Alquileres recientes */}
          <Card className="md:col-span-2 border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Alquileres Recientes</CardTitle>
                <CardDescription className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">Seguimiento</CardDescription>
              </div>
              <Link href="/lavanderia/historial">
                <Button variant="ghost" size="sm" className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Ver Todos</Button>
              </Link>
            </CardHeader>
            <CardContent className="px-0 md:px-6">
              {alquileres.length === 0 ? (
                <div className="py-10 text-center px-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">No hay alquileres activos</p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-50 hover:bg-transparent px-4">
                        <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 pl-6 md:pl-4 whitespace-nowrap">Cliente</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">Servicio</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">Recepción</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right pr-6 md:pr-4 whitespace-nowrap">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alquileres.slice(0, 5).map((row) => (
                        <TableRow key={row.id} className="border-slate-50 md:hover:bg-slate-50/50 transition-colors group">
                          <TableCell className="py-4 pl-6 md:pl-4">
                            <span className="text-[11px] font-bold text-slate-900 whitespace-nowrap">{row.cliente}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{row.nombreServicio}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[8px] font-bold uppercase tracking-tighter whitespace-nowrap",
                                !row.fechaRecibida && "bg-orange-50 text-orange-600 border-orange-100",
                                row.fechaRecibida && row.recepcionAutomatica && "bg-blue-50 text-blue-600 border-blue-100",
                                row.fechaRecibida && !row.recepcionAutomatica && "bg-green-50 text-green-600 border-green-100"
                              )}
                            >
                              {!row.fechaRecibida ? "Por recibir" : row.recepcionAutomatica ? "Recibida auto" : "Recibida manual"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6 md:pr-4">
                            <span className="text-[11px] font-bold text-slate-900 tabular-nums whitespace-nowrap">
                              ${row.precio.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

// Sub-components helpers
function StatCard({ title, value, description, icon: Icon, trend, className }: any) {
  return (
    <Card className={cn("border-slate-100 shadow-sm overflow-hidden group", className)}>
      <CardContent className="p-4 md:p-6 relative">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 md:group-hover:bg-slate-900 md:group-hover:text-white transition-all duration-300">
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className={cn(
            "text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 md:py-1 rounded-lg border",
            trend.positive ? "text-green-600 bg-green-50 border-green-100" : "text-slate-400 bg-slate-50 border-slate-100"
          )}>
            {trend.value}
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</h4>
          <div className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900">{value}</div>
          <p className="text-[9px] md:text-[10px] font-medium text-slate-400 uppercase tracking-wider line-clamp-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
