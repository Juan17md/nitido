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
import { Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ajustarStock, type Producto } from "@/lib/barberia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  productos: Producto[];
}

export function AjustarStockDialog({ productos }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [selectedId, setSelectedId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "salida">("entrada");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !cantidad) return;

    setLoading(true);
    const valor = tipo === "entrada" ? parseInt(cantidad) : -parseInt(cantidad);
    
    try {
      await ajustarStock(selectedId, valor);
      toast.success(`Stock actualizado (${tipo})`);
      setOpen(false);
      setCantidad("");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(
        "h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all inline-flex items-center justify-center"
      )}>
        <Package className="mr-2 h-4 w-4" />
        Stock Inventario
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Ajustar Inventario</DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Registra la entrada o salida de productos del stock.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                type="button"
                variant={tipo === "entrada" ? "default" : "outline"}
                onClick={() => setTipo("entrada")}
                className={`flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest ${tipo === "entrada" ? "bg-slate-900" : "border-slate-100 text-slate-400"}`}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Entrada
              </Button>
              <Button 
                type="button"
                variant={tipo === "salida" ? "default" : "outline"}
                onClick={() => setTipo("salida")}
                className={`flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest ${tipo === "salida" ? "bg-slate-900" : "border-slate-100 text-slate-400"}`}
              >
                <ArrowDownRight className="mr-2 h-4 w-4" />
                Salida
              </Button>
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Producto</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 text-[11px] font-bold">
                  <SelectValue placeholder="Seleccionar producto...">
                    {(val: string) => {
                      if (!val) return "Seleccionar producto...";
                      const p = productos.find(prod => prod.id === val);
                      return p ? `${p.nombre} (${p.stock} ${p.unidad})` : "Seleccionar producto...";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {productos.map((p) => (
                    <SelectItem key={p.id} value={p.id!} className="text-[11px] font-medium">
                      {p.nombre} ({p.stock} {p.unidad})
                    </SelectItem>
                  ))}
                  {productos.length === 0 && (
                    <div className="p-2 text-center text-[10px] text-slate-400 uppercase font-bold">
                      Sin productos en inventario
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cantidad" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Cantidad</Label>
              <Input 
                id="cantidad" 
                type="number"
                placeholder="0" 
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              disabled={loading || !selectedId}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200"
            >
              {loading ? "Actualizando..." : "Confirmar Ajuste"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
