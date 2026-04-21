"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves, Search, Filter, Play, CheckCircle2, PackageCheck, Trash2 } from "lucide-react";
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

import { cn } from "@/lib/utils";
import { 
  subscribePedidosLavanderia, 
  subscribeServiciosLavanderia,
  type PedidoLavanderia, 
  type ServicioLavanderia,
  actualizarEstadoPedido,
  eliminarPedido 
} from "@/lib/lavanderia-service";
import { NuevoPedidoDialog } from "@/components/lavanderia/NuevoPedidoDialog";
import { toast } from "sonner";

export default function LavanderiaHistorialPage() {
  const [pedidos, setPedidos] = useState<PedidoLavanderia[]>([]);
  const [servicios, setServicios] = useState<ServicioLavanderia[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubPedidos = subscribePedidosLavanderia(setPedidos);
    const unsubServicios = subscribeServiciosLavanderia(setServicios);
    return () => {
      unsubPedidos();
      unsubServicios();
    };
  }, []);

  const filteredPedidos = pedidos.filter(row => 
    row.cliente.toLowerCase().includes(search.toLowerCase()) ||
    row.nombreServicio.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        await eliminarPedido(id);
        toast.success("Pedido eliminado");
      } catch (error) {
        toast.error("Error al eliminar el pedido");
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
              <div className="flex flex-col">
                <Badge variant="outline" className="w-fit text-[8px] font-bold uppercase tracking-[0.2em] text-blue-400 border-blue-100 px-2 py-0.5 bg-white mb-1">
                  Lavandería
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                  Historial de <span className="italic font-light text-slate-400">Pedidos</span>
                </h2>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400 max-w-md ml-1">
              Gestiona el flujo de trabajo de los pedidos activos y consulta el registro histórico de servicios entregados.
            </p>
          </div>
          
          <div className="shrink-0">
            <NuevoPedidoDialog servicios={servicios} />
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
            <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 shrink-0">
              <Filter className="mr-2 h-3.5 w-3.5" />
              Filtrar
            </Button>
          </div>
        </div>

        {/* Vista Móvil (Tarjetas) */}
        <div className="grid gap-4 grid-cols-1 md:hidden">
          {filteredPedidos.map((row) => (
            <Card key={row.id} className="border-slate-100 shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Entrada: {row.fechaEntrada.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{row.cliente}</h4>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5",
                    row.estado === 'pendiente' && "border-orange-200 text-orange-600 bg-orange-50/30",
                    row.estado === 'en_proceso' && "border-blue-200 text-blue-600 bg-blue-50/30",
                    row.estado === 'listo' && "border-green-200 text-green-600 bg-green-50/30",
                    row.estado === 'entregado' && "border-slate-200 text-slate-400 bg-slate-50/30",
                  )}
                >
                  {row.estado.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{row.nombreServicio} • ${row.precio.toFixed(2)}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50" onClick={() => actualizarEstadoPedido(row.id!, 'en_proceso', row.maquinaId)} title="En Proceso">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-green-500 hover:bg-green-50" onClick={() => actualizarEstadoPedido(row.id!, 'listo', row.maquinaId)} title="Listo">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100" onClick={() => actualizarEstadoPedido(row.id!, 'entregado', row.maquinaId)} title="Entregado">
                    <PackageCheck className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(row.id!)} title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredPedidos.length === 0 && (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200 px-6">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sin pedidos encontrados</p>
            </div>
          )}
        </div>

        {/* Vista Escritorio (Tabla) */}
        <div className="hidden md:block">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 py-4">Entrada</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Cliente</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Servicio</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Estado</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.map((row) => (
                  <TableRow key={row.id} className="border-slate-50 md:hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="py-4 text-[10px] font-medium text-slate-400 tabular-nums">
                      {row.fechaEntrada.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-slate-900">{row.cliente}</TableCell>
                    <TableCell className="text-[10px] font-medium text-slate-400">{row.nombreServicio}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5",
                          row.estado === 'pendiente' && "border-orange-200 text-orange-600 bg-orange-50/30",
                          row.estado === 'en_proceso' && "border-blue-200 text-blue-600 bg-blue-50/30",
                          row.estado === 'listo' && "border-green-200 text-green-600 bg-green-50/30",
                          row.estado === 'entregado' && "border-slate-200 text-slate-400 bg-slate-50/30",
                        )}
                      >
                        {row.estado.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 md:hover:text-blue-500 md:hover:bg-blue-50 transition-colors" onClick={() => actualizarEstadoPedido(row.id!, 'en_proceso', row.maquinaId)} title="En Proceso">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 md:hover:text-green-500 md:hover:bg-green-50 transition-colors" onClick={() => actualizarEstadoPedido(row.id!, 'listo', row.maquinaId)} title="Listo">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 md:hover:text-slate-900 md:hover:bg-slate-100 transition-colors" onClick={() => actualizarEstadoPedido(row.id!, 'entregado', row.maquinaId)} title="Entregado">
                          <PackageCheck className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 md:hover:text-red-500 md:hover:bg-red-50 transition-colors" onClick={() => handleDelete(row.id!)} title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPedidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      Sin pedidos encontrados
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
