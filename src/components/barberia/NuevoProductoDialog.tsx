"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlusCircle, Package } from "lucide-react";
import { agregarProducto } from "@/lib/barberia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NuevoProductoDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState("");
  const [unidad, setUnidad] = useState("unidades");
  const [minStock, setMinStock] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !stock || !unidad) return;

    setLoading(true);
    try {
      await agregarProducto({
        nombre,
        stock: parseInt(stock),
        unidad,
        status: parseInt(stock) <= (parseInt(minStock) || 0) ? 'low' : 'ok',
        minStock: parseInt(minStock) || 0
      });
      toast.success("Producto añadido al inventario");
      setOpen(false);
      setNombre("");
      setStock("");
      setMinStock("");
    } catch (error) {
      console.error(error);
      toast.error("Error al añadir producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(
        "h-11 px-6 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl active:scale-[0.98] transition-all inline-flex items-center justify-center"
      )}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nuevo Producto
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Nuevo Producto</DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Añade un nuevo ítem al catálogo de inventario de la barbería.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre del Producto</Label>
              <Input 
                id="nombre" 
                placeholder="Ej. Gel para afeitar" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Stock Inicial</Label>
                <Input 
                  id="stock" 
                  type="number"
                  placeholder="0" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Unidad</Label>
                <Select value={unidad} onValueChange={setUnidad}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 text-[11px] font-bold">
                    <SelectValue placeholder="Unidad...">
                      {(val: string) => {
                        if (val === "unidades") return "Unidades";
                        if (val === "ml") return "Mililitros (ml)";
                        if (val === "gramos") return "Gramos (g)";
                        if (val === "litros") return "Litros (L)";
                        return "Unidad...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="unidades" className="text-[11px] font-medium">Unidades</SelectItem>
                    <SelectItem value="ml" className="text-[11px] font-medium">Mililitros (ml)</SelectItem>
                    <SelectItem value="gramos" className="text-[11px] font-medium">Gramos (g)</SelectItem>
                    <SelectItem value="litros" className="text-[11px] font-medium">Litros (L)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="minStock" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Alerta Stock Bajo (Mínimo)</Label>
              <Input 
                id="minStock" 
                type="number"
                placeholder="Ej. 2" 
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200"
            >
              {loading ? "Añadiendo..." : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
