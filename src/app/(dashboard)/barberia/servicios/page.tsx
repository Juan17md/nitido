"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subscribeServicios, type Servicio, eliminarServicio } from "@/lib/barberia-service";
import { NuevoServicioDialog } from "@/components/barberia/NuevoServicioDialog";

export default function BarberiaServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    const unsub = subscribeServicios(setServicios);
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-200 transition-transform hover:rotate-3">
                <Scissors className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                Catálogo de <span className="italic font-light text-slate-400">Servicios</span>
              </h2>
            </div>
          </div>
          
          <div className="shrink-0">
            <NuevoServicioDialog />
          </div>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {servicios.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] rounded-3xl border border-dashed border-slate-200 px-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Sin servicios registrados</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((s) => (
              <Card key={s.id} className="group border-slate-100 md:hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all">
                <CardHeader className="pb-3 px-6 pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-tight text-slate-900 leading-tight">{s.nombre}</CardTitle>
                    <Badge variant="outline" className="text-xs font-bold text-slate-900 border-slate-200 shrink-0">${s.precio.toFixed(2)}</Badge>
                  </div>
                  <CardDescription className="text-[11px] leading-relaxed line-clamp-2 mt-2">{s.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end gap-2 px-6 pb-6 pt-0">
                  <NuevoServicioDialog servicio={s} />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-red-400 md:h-8 md:hover:bg-red-50 md:hover:text-red-600"
                    onClick={() => {
                      if (confirm("¿Eliminar este servicio?")) {
                        eliminarServicio(s.id!);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
