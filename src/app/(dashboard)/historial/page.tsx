"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Search, 
  Filter, 
  Scissors, 
  Waves, 
  ArrowUpRight
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

// Services
import { subscribeHistorial as subBarberia } from "@/lib/barberia-service";
import { subscribeAlquileresLavanderia as subLavanderia } from "@/lib/lavanderia-service";

export default function HistorialPage() {
  const [datosBarberia, setDatosBarberia] = useState<any[]>([]);
  const [datosLavanderia, setDatosLavanderia] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const unsubBarberia = subBarberia(setDatosBarberia);
    const unsubLavanderia = subLavanderia(setDatosLavanderia);
    return () => {
      unsubBarberia();
      unsubLavanderia();
    };
  }, []);

  // Unificar y ordenar datos
  const historialUnificado = [
    ...datosBarberia.map(item => ({
      ...item,
      tipoModulo: 'barberia',
      fechaOriginal: item.fecha.toDate()
    })),
    ...datosLavanderia.map(item => ({
      ...item,
      tipoModulo: 'lavanderia',
      fechaOriginal: item.fechaEntrada.toDate()
    }))
  ].sort((a, b) => b.fechaOriginal.getTime() - a.fechaOriginal.getTime());

  // Filtrado
  const filtrados = historialUnificado.filter(item => 
    item.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.nombreServicio.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="expansive-container mx-auto py-6 md:py-10 px-4 md:px-0 space-y-8 md:space-y-10">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <History className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest text-slate-400 border-slate-100">
                Módulo Historial
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 uppercase">
              Registro <span className="italic font-light text-slate-400">Histórico</span>
            </h2>
            <p className="text-[10px] md:text-xs font-medium text-slate-400 max-w-md uppercase tracking-wider leading-relaxed">
              Consulta consolidada de todas las operaciones realizadas en el ecosistema Nítido.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente o servicio..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-100 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
            <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 shrink-0">
              <Filter className="mr-2 h-3.5 w-3.5" />
              Todos los módulos
            </Button>
          </div>
        </div>

        {/* Vista Móvil (Tarjetas) */}
        <div className="grid gap-4 grid-cols-1 md:hidden">
          {filtrados.map((item) => (
            <Card key={item.id} className="border-slate-100 shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-900 tabular-nums">
                    {item.fechaOriginal.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400 tabular-nums">
                    {item.fechaOriginal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-lg border",
                  item.tipoModulo === 'barberia' ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-blue-50 border-blue-100 text-blue-600"
                )}>
                  {item.tipoModulo === 'barberia' ? <Scissors size={10} /> : <Waves size={10} />}
                  <span className="text-[8px] font-bold uppercase tracking-widest">{item.tipoModulo}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.cliente}</h4>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  {item.nombreServicio} • <span className="text-slate-900 font-bold">${item.precio.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex justify-end mt-4">
                 <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Detalles <ArrowUpRight className="ml-1.5 h-3 w-3" />
                 </Button>
              </div>
            </Card>
          ))}
          {filtrados.length === 0 && (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-200 px-6">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sin registros históricos</p>
            </div>
          )}
        </div>

        {/* Vista Escritorio (Tabla) */}
        <div className="hidden md:block">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 py-4">Fecha & Hora</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Módulo</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Servicio</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Cliente</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Monto</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((item) => (
                  <TableRow key={item.id} className="border-slate-50 md:hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900 tabular-nums">
                          {item.fechaOriginal.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400 tabular-nums">
                          {item.fechaOriginal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-lg border",
                          item.tipoModulo === 'barberia' ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-blue-50 border-blue-100 text-blue-600"
                        )}>
                          {item.tipoModulo === 'barberia' ? <Scissors size={12} /> : <Waves size={12} />}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{item.tipoModulo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-slate-900">{item.nombreServicio}</TableCell>
                    <TableCell className="text-[10px] font-medium text-slate-400">{item.cliente}</TableCell>
                    <TableCell>
                      <span className="text-[11px] font-bold text-slate-900 tabular-nums">${item.precio.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 md:hover:text-slate-900">
                          <ArrowUpRight className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Sin registros históricos</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
