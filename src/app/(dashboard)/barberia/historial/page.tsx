"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Search, Filter, Calendar as CalendarIcon, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import { 
  subscribeHistorial, 
  subscribeServicios,
  eliminarVenta, 
  type HistorialServicio,
  type Servicio 
} from "@/lib/barberia-service";
import { toast } from "sonner";
import { EditarVentaDialog } from "@/components/barberia/EditarVentaDialog";

export default function BarberiaHistorialPage() {
  const [historial, setHistorial] = useState<HistorialServicio[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubHistorial = subscribeHistorial(setHistorial);
    const unsubServicios = subscribeServicios(setServicios);
    return () => {
      unsubHistorial();
      unsubServicios();
    };
  }, []);

  const filteredHistorial = historial.filter(row => 
    row.cliente.toLowerCase().includes(search.toLowerCase()) ||
    row.nombreServicio.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este registro del historial?")) {
      try {
        await eliminarVenta(id);
        toast.success("Registro eliminado");
      } catch (error) {
        toast.error("Error al eliminar el registro");
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-200 transition-transform hover:rotate-3">
                <History className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                Historial de <span className="italic font-light text-slate-400">Servicios</span>
              </h2>
            </div>
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
              placeholder="Buscar por cliente o servicio..." 
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
            <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-100 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 shrink-0 md:h-9">
              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
              Este Mes
            </Button>
          </div>
        </div>

        {/* Vista Móvil (Tarjetas) */}
        <div className="grid gap-4 grid-cols-1 md:hidden">
          {filteredHistorial.map((row) => (
            <Card key={row.id} className="border-slate-100 shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600">
                    {row.fecha.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} • {row.fecha.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{row.nombreServicio}</h4>
                </div>
                <Badge className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1">${row.precio.toFixed(2)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Cliente: {row.cliente}</span>
                <div className="flex items-center gap-1">
                  <EditarVentaDialog venta={row} servicios={servicios} />
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 md:h-8 md:w-8" onClick={() => handleDelete(row.id!)} title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredHistorial.length === 0 && (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200">
               <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Sin registros</p>
            </div>
          )}
        </div>

        {/* Vista Escritorio (Tabla) */}
        <div className="hidden md:block">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Fecha</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Servicio</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Cliente</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Precio</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistorial.map((row) => (
                  <TableRow key={row.id} className="border-slate-50 md:hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="py-4 text-[11px] font-medium text-slate-600 tabular-nums">
                      {row.fecha.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-slate-900">{row.nombreServicio}</TableCell>
                    <TableCell className="text-[11px] font-medium text-slate-600">{row.cliente}</TableCell>
                    <TableCell className="text-[10px] font-bold text-slate-900">${row.precio.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <EditarVentaDialog venta={row} servicios={servicios} />
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 transition-colors md:h-8 md:w-8 md:hover:bg-red-50 md:hover:text-red-500" onClick={() => handleDelete(row.id!)} title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHistorial.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Sin registros en el historial
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
