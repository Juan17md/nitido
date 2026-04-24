"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves, Search, Filter, PackageCheck, Trash2, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  subscribeAlquileresLavanderia,
  subscribeServiciosLavanderia,
  type AlquilerLavanderia,
  type ServicioLavanderia,
  marcarAlquilerRecibido,
  eliminarAlquiler
} from "@/lib/lavanderia-service";
import { NuevoAlquilerDialog } from "@/components/lavanderia/NuevoAlquilerDialog";
import { EditarAlquilerDialog } from "@/components/lavanderia/EditarAlquilerDialog";
import { toast } from "sonner";

export default function LavanderiaHistorialPage() {
  const [alquileres, setAlquileres] = useState<AlquilerLavanderia[]>([]);
  const [servicios, setServicios] = useState<ServicioLavanderia[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubAlquileres = subscribeAlquileresLavanderia(setAlquileres);
    const unsubServicios = subscribeServiciosLavanderia(setServicios);
    return () => {
      unsubAlquileres();
      unsubServicios();
    };
  }, []);

  const filteredAlquileres = alquileres.filter((row) =>
    row.cliente.toLowerCase().includes(search.toLowerCase()) ||
    row.nombreServicio.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este alquiler?")) {
      try {
        await eliminarAlquiler(id);
        toast.success("Alquiler eliminado");
      } catch (error) {
        console.error(error);
        toast.error("Error al eliminar el alquiler");
      }
    }
  };

  const handleMarcarRecibida = async (row: AlquilerLavanderia) => {
    if (!row.id || row.fechaRecibida) return;
    try {
      await marcarAlquilerRecibido(row.id, row.maquinaId, false);
      toast.success("Alquiler marcado como recibido");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo marcar como recibido");
    }
  };

  return (
    <div className="expansive-container mx-auto py-8 md:py-12 px-4 md:px-0 space-y-10">
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
                Historial de <span className="italic font-light text-slate-400">Alquileres</span>
              </h2>
            </div>
          </div>

          <div className="shrink-0">
            <NuevoAlquilerDialog servicios={servicios} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-100 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
            <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-100 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 shrink-0 md:h-9">
              <Filter className="mr-2 h-3.5 w-3.5" />
              Filtrar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:hidden">
          {filteredAlquileres.map((row) => (
            <Card key={row.id} className="border-slate-100 shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600">
                    Entrada: {row.fechaEntrada.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{row.cliente}</h4>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
                    !row.fechaRecibida && "border-orange-200 text-orange-600 bg-orange-50/30",
                    row.fechaRecibida && row.recepcionAutomatica && "border-blue-200 text-blue-600 bg-blue-50/30",
                    row.fechaRecibida && !row.recepcionAutomatica && "border-green-200 text-green-600 bg-green-50/30"
                  )}
                >
                  {!row.fechaRecibida ? "Por recibir" : row.recepcionAutomatica ? "Recibida auto" : "Recibida manual"}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{row.nombreServicio} • ${row.precio.toFixed(2)}</span>
                <div className="flex items-center gap-1">
                  <EditarAlquilerDialog alquiler={row} servicios={servicios} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:bg-green-50 hover:text-green-500 md:h-8 md:w-8"
                    onClick={() => handleMarcarRecibida(row)}
                    title="Marcar recibida"
                    disabled={Boolean(row.fechaRecibida)}
                  >
                    {row.fechaRecibida ? <Clock3 className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-red-50 hover:text-red-500 md:h-8 md:w-8" onClick={() => handleDelete(row.id!)} title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredAlquileres.length === 0 && (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200 px-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Sin alquileres encontrados</p>
            </div>
          )}
        </div>

        <div className="hidden md:block">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Entrada</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Cliente</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Servicio</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Recepción</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlquileres.map((row) => (
                  <TableRow key={row.id} className="border-slate-50 md:hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="py-4 text-[11px] font-medium text-slate-600 tabular-nums">
                      {row.fechaEntrada.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-slate-900">{row.cliente}</TableCell>
                    <TableCell className="text-[11px] font-medium text-slate-600">{row.nombreServicio}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
                          !row.fechaRecibida && "border-orange-200 text-orange-600 bg-orange-50/30",
                          row.fechaRecibida && row.recepcionAutomatica && "border-blue-200 text-blue-600 bg-blue-50/30",
                          row.fechaRecibida && !row.recepcionAutomatica && "border-green-200 text-green-600 bg-green-50/30"
                        )}
                      >
                        {!row.fechaRecibida ? "Por recibir" : row.recepcionAutomatica ? "Recibida auto" : "Recibida manual"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <EditarAlquilerDialog alquiler={row} servicios={servicios} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-slate-400 transition-colors md:h-8 md:w-8 md:hover:bg-green-50 md:hover:text-green-500"
                          onClick={() => handleMarcarRecibida(row)}
                          title="Marcar recibida"
                          disabled={Boolean(row.fechaRecibida)}
                        >
                          {row.fechaRecibida ? <Clock3 className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 transition-colors md:h-8 md:w-8 md:hover:bg-red-50 md:hover:text-red-500" onClick={() => handleDelete(row.id!)} title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAlquileres.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Sin alquileres encontrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
