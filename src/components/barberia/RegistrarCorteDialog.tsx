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
import { PlusCircle, DollarSign } from "lucide-react";
import { registrarVenta, type Servicio } from "@/lib/barberia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  servicios: Servicio[];
}

export function RegistrarCorteDialog({ servicios }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedServicioId, setSelectedServicioId] = useState("");
  const [cliente, setCliente] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicio = servicios.find((s) => s.id === selectedServicioId);
    if (!servicio || !cliente) return;

    setLoading(true);
    try {
      await registrarVenta({
        servicioId: servicio.id!,
        nombreServicio: servicio.nombre,
        cliente,
        precio: servicio.precio
      });
      toast.success("Corte registrado correctamente");
      setOpen(false);
      setSelectedServicioId("");
      setCliente("");
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar el corte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(
        "w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-sm inline-flex items-center justify-center transition-colors active:scale-[0.98]",
      )}>
        <PlusCircle className="mr-2 h-3.5 w-3.5" />
        Registrar Corte
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1.25rem)] max-w-[425px] max-h-[85vh] overflow-y-auto rounded-[26px] border-slate-100 p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-8">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3 sm:mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 sm:h-11 sm:w-11">
              <DollarSign className="h-5 w-5" />
            </div>
            <DialogTitle className="text-sm font-bold uppercase tracking-[0.16em] text-slate-900 sm:text-base sm:tracking-widest">
              Registrar Corte
            </DialogTitle>
          </div>
          <DialogDescription className="pt-1 text-[9px] font-medium text-slate-400 uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-widest">
            Elige servicio y cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:space-y-6 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-2">
              <Label className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">Servicio Realizado</Label>
              <Select
                value={selectedServicioId}
                onValueChange={(value) => setSelectedServicioId(value ?? "")}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50/80 text-[12px] font-bold transition-all focus:bg-white sm:h-12 sm:text-[11px]">
                  <SelectValue placeholder="Seleccionar servicio...">
                    {(val: string) => {
                      if (!val) return "Seleccionar servicio...";
                      const s = servicios.find((srv) => srv.id === val);
                      return s ? s.nombre : "Seleccionar servicio...";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {servicios.map((s) => (
                    <SelectItem key={s.id} value={s.id!} className="text-[11px] font-medium">
                      {s.nombre} - ${s.precio.toFixed(2)}
                    </SelectItem>
                  ))}
                  {servicios.length === 0 && (
                    <div className="p-2 text-center text-[10px] text-slate-400 uppercase font-bold">
                      Crea servicios primero
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cliente" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">Nombre del Cliente</Label>
              <Input
                id="cliente"
                placeholder="Ej. Juan Pérez"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/80 px-3 text-[12px] font-bold transition-all focus:bg-white sm:h-12 sm:text-[11px]"
                required
              />
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 -mx-4 border-t border-slate-100 bg-white/95 px-4 pt-3 pb-1 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:p-0 sm:pt-2">
            <Button
              type="submit"
              disabled={loading || !selectedServicioId}
              className="h-11 w-full rounded-xl bg-slate-900 text-[9px] font-bold uppercase tracking-[0.16em] shadow-lg shadow-slate-200 hover:bg-slate-800 sm:h-12 sm:text-[10px] sm:tracking-[0.2em]"
            >
              {loading ? "Procesando..." : "Finalizar Corte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
