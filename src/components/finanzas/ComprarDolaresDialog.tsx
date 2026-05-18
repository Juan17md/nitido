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
import { PlusCircle, DollarSign } from "lucide-react";
import { registrarCompraDolares } from "@/lib/dolares-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ComprarDolaresDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [aQuien, setAQuien] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tasa, setTasa] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aQuien || !cantidad || !tasa) return;

    setLoading(true);
    try {
      await registrarCompraDolares({
        aQuien,
        cantidad: Number(cantidad),
        tasa: Number(tasa)
      });
      toast.success("Compra de dólares registrada");
      setOpen(false);
      setAQuien("");
      setCantidad("");
      setTasa("");
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(
        "w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-sm inline-flex items-center justify-center transition-colors active:scale-[0.98] px-4",
      )}>
        <PlusCircle className="mr-2 h-3.5 w-3.5" />
        Comprar Dólares
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1.25rem)] max-w-[425px] max-h-[85vh] overflow-y-auto rounded-[26px] border-slate-100 p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-8">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3 sm:mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:h-11 sm:w-11">
              <DollarSign className="h-5 w-5" />
            </div>
            <DialogTitle className="text-sm font-bold uppercase tracking-[0.16em] text-slate-900 sm:text-base sm:tracking-widest">
              Comprar Dólares
            </DialogTitle>
          </div>
          <DialogDescription className="pt-1 text-[9px] font-medium text-slate-400 uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-widest">
            Registra a quién y a qué tasa compraste.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:space-y-6 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="aQuien" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">¿A quién se le compró?</Label>
              <Input
                id="aQuien"
                placeholder="Ej. Juan Pérez"
                value={aQuien}
                onChange={(e) => setAQuien(e.target.value)}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/80 px-3 text-[12px] font-bold transition-all focus:bg-white sm:h-12 sm:text-[11px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cantidad" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">Cantidad ($)</Label>
              <Input
                id="cantidad"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/80 px-3 text-[12px] font-bold transition-all focus:bg-white sm:h-12 sm:text-[11px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tasa" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">Tasa de Cambio (Bs)</Label>
              <Input
                id="tasa"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={tasa}
                onChange={(e) => setTasa(e.target.value)}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/80 px-3 text-[12px] font-bold transition-all focus:bg-white sm:h-12 sm:text-[11px]"
                required
              />
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 -mx-4 border-t border-slate-100 bg-white/95 px-4 pt-3 pb-1 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:p-0 sm:pt-2">
            <Button
              type="submit"
              disabled={loading || !aQuien || !cantidad || !tasa}
              className="h-11 w-full rounded-xl bg-slate-900 text-[9px] font-bold uppercase tracking-[0.16em] shadow-lg shadow-slate-200 hover:bg-slate-800 sm:h-12 sm:text-[10px] sm:tracking-[0.2em]"
            >
              {loading ? "Procesando..." : "Registrar Compra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
