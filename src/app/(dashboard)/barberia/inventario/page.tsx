"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { subscribeInventario, eliminarProducto, type Producto } from "@/lib/barberia-service";
import { AjustarStockDialog } from "@/components/barberia/AjustarStockDialog";
import { NuevoProductoDialog } from "@/components/barberia/NuevoProductoDialog";
import { toast } from "sonner";

export default function BarberiaInventarioPage() {
  const [inventario, setInventario] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = subscribeInventario(setInventario);
    return () => unsub();
  }, []);

  const filteredInventario = inventario.filter(item => 
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto del inventario?")) {
      try {
        await eliminarProducto(id);
        toast.success("Producto eliminado");
      } catch (error) {
        toast.error("Error al eliminar el producto");
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
                <Package className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <Badge variant="outline" className="w-fit text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 border-slate-100 px-2 py-0.5 bg-white mb-1">
                  Barbería
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                  Control de <span className="italic font-light text-slate-400">Stock</span>
                </h2>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400 max-w-md ml-1">
              Monitorea el inventario de insumos y productos para asegurar la continuidad de tus servicios premium.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <NuevoProductoDialog />
            <AjustarStockDialog productos={inventario} />
          </div>
        </div>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Buscar producto..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-10 rounded-2xl border-slate-100 bg-white shadow-sm text-[11px] font-medium"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {filteredInventario.map((item) => (
          <Card key={item.id} className="group border-slate-100 shadow-sm md:hover:shadow-xl md:hover:shadow-slate-100/50 transition-all duration-500 rounded-3xl overflow-hidden bg-white">
            <CardContent className="pt-6 px-4 md:px-6 pb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[7px] md:text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5",
                      item.status === "low" ? "text-red-500 border-red-100 bg-red-50" : "text-slate-400 border-slate-100 bg-slate-50/50"
                    )}
                  >
                    {item.status === "low" ? "Bajo" : "OK"}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-md text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                    onClick={() => handleDelete(item.id!)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight text-slate-900 line-clamp-1">{item.nombre}</h4>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-xl md:text-3xl font-bold text-slate-900 tabular-nums tracking-tighter">{item.stock}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.unidad}</span>
              </div>
              {item.minStock && item.minStock > 0 && (
                 <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-2">Mínimo: {item.minStock}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredInventario.length === 0 && (
          <div className="col-span-full py-20 text-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/30">
             <Package className="h-8 w-8 text-slate-200 mx-auto mb-3" />
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No se encontraron productos</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
