"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves, Settings, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { subscribeMaquinas, eliminarMaquina, type Maquina } from "@/lib/lavanderia-service";
import { NuevaMaquinaDialog } from "@/components/lavanderia/NuevaMaquinaDialog";
import { toast } from "sonner";

export default function LavanderiaMaquinasPage() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);

  useEffect(() => {
    const unsub = subscribeMaquinas(setMaquinas);
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta máquina?")) {
      try {
        await eliminarMaquina(id);
        toast.success("Máquina eliminada");
      } catch (error) {
        toast.error("Error al eliminar la máquina");
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
                Estado de <span className="italic font-light text-slate-400">Máquinas</span>
              </h2>
            </div>
          </div>

          <NuevaMaquinaDialog />
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {maquinas.map((m) => (
          <Card key={m.id} className="border-slate-100 shadow-sm relative overflow-hidden group">
             {m.estado === 'ocupada' && (
               <div className="absolute top-0 left-0 h-1 bg-blue-500 w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
             )}
            <CardContent className="pt-6 px-4 md:px-6 pb-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl transition-colors",
                  m.estado === 'disponible' ? "bg-green-50 text-green-500" : "bg-slate-50 text-slate-400"
                )}>
                  <Settings className={cn("h-4 w-4 md:h-5 md:w-5", m.estado === 'ocupada' && "animate-spin-slow")} />
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "px-1.5 text-[10px] font-bold uppercase tracking-[0.08em]",
                      m.estado === 'disponible' && "text-green-600 border-green-100 bg-green-50",
                      m.estado === 'ocupada' && "text-blue-600 border-blue-100 bg-blue-50",
                      m.estado === 'mantenimiento' && "text-red-600 border-red-100 bg-red-50",
                    )}
                  >
                    {m.estado}
                  </Badge>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-md text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                    onClick={() => handleDelete(m.id!)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight text-slate-900 line-clamp-1">{m.nombre}</h4>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500 md:text-[11px]">{m.tipo}</p>
            </CardContent>
          </Card>
        ))}
        {maquinas.length === 0 && (
          <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-slate-200">
             <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Sin máquinas registradas</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
