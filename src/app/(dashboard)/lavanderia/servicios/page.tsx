"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscribeServiciosLavanderia, type ServicioLavanderia, eliminarServicioLavanderia } from "@/lib/lavanderia-service";
import { NuevoServicioLavanderiaDialog } from "@/components/lavanderia/NuevoServicioLavanderiaDialog";
import { Trash2 } from "lucide-react";

export default function LavanderiaServiciosPage() {
  const [servicios, setServicios] = useState<ServicioLavanderia[]>([]);

  useEffect(() => {
    const unsub = subscribeServiciosLavanderia(setServicios);
    return () => unsub();
  }, []);

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
                  Catálogo de <span className="italic font-light text-slate-400">Lavandería</span>
                </h2>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400 max-w-md ml-1">
              Administra los tipos de lavado, secado y servicios adicionales disponibles para tus clientes.
            </p>
          </div>
          
          <div className="shrink-0">
            <NuevoServicioLavanderiaDialog />
          </div>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {servicios.map((s) => (
          <Card key={s.id} className="group border-slate-100 md:hover:shadow-md transition-all">
            <CardHeader className="px-6 pt-6 pb-3">
              <div className="flex justify-between items-start gap-4">
                <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest text-blue-500 border-blue-100 shrink-0">{s.tipo}</Badge>
                <span className="text-sm font-bold text-slate-900 shrink-0">${s.precio.toFixed(2)}</span>
              </div>
              <CardTitle className="text-sm font-bold uppercase tracking-tight text-slate-900 mt-3 leading-tight">{s.nombre}</CardTitle>
              <CardDescription className="text-[11px] leading-relaxed line-clamp-2 mt-1">{s.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2 px-6 pb-6 pt-0">
              <NuevoServicioLavanderiaDialog servicio={s} />
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-[10px] font-bold uppercase tracking-widest text-red-400 md:hover:text-red-600 md:hover:bg-red-50"
                onClick={() => {
                  if (confirm("¿Eliminar este servicio?")) {
                    eliminarServicioLavanderia(s.id!);
                  }
                }}
              >
                <Trash2 className="mr-1.5 h-3 w-3" />
                Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
        {servicios.length === 0 && (
          <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-slate-200">
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sin servicios registrados</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
