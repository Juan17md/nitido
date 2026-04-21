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
import { PlusCircle, Wallet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  onSave: (gasto: { descripcion: string; monto: number; categoria: string }) => Promise<any>;
  variant?: 'barberia' | 'lavanderia';
}

const CATEGORIAS_GASTOS = [
  "Insumos",
  "Servicios (Luz/Agua)",
  "Mantenimiento",
  "Alquiler",
  "Marketing",
  "Otros"
];

export function RegistrarGastoDialog({ onSave, variant = 'barberia' }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");

  const isLavanderia = variant === 'lavanderia';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || !monto || !categoria) return;

    setLoading(true);
    try {
      await onSave({
        descripcion,
        monto: parseFloat(monto),
        categoria
      });
      toast.success("Gasto registrado correctamente");
      setOpen(false);
      setDescripcion("");
      setMonto("");
      setCategoria("");
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar el gasto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(
        "h-11 px-6 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-[0.98] transition-all inline-flex items-center justify-center",
        isLavanderia 
          ? "bg-blue-900 hover:bg-blue-800 shadow-blue-100" 
          : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
      )}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Registrar Gasto
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Registrar Egreso</DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Control de gastos para la contabilidad del negocio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="descripcion" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Descripción</Label>
              <Input 
                id="descripcion" 
                placeholder="Ej. Compra de suavizante" 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="monto" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Monto ($)</Label>
                <Input 
                  id="monto" 
                  type="number"
                  step="0.01"
                  placeholder="0.00" 
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Categoría</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 text-[11px] font-bold">
                    <SelectValue placeholder="Tipo..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    {CATEGORIAS_GASTOS.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-[11px] font-medium">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className={cn(
                "w-full h-12 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg",
                isLavanderia 
                  ? "bg-blue-900 hover:bg-blue-800 shadow-blue-100" 
                  : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
              )}
            >
              {loading ? "Registrando..." : "Confirmar Gasto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
