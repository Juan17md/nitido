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

export function RegistrarVentaDialog({ servicios }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [selectedServicioId, setSelectedServicioId] = useState("");
  const [cliente, setCliente] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicio = servicios.find(s => s.id === selectedServicioId);
    if (!servicio || !cliente) return;

    setLoading(true);
    try {
      await registrarVenta({
        servicioId: servicio.id!,
        nombreServicio: servicio.nombre,
        cliente,
        precio: servicio.precio
      });
      toast.success("Venta registrada correctamente");
      setOpen(false);
      setSelectedServicioId("");
      setCliente("");
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar la venta");
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
        Registrar Servicio
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Registrar Venta</DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Selecciona el servicio realizado y el nombre del cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Servicio Realizado</Label>
              <Select value={selectedServicioId} onValueChange={setSelectedServicioId}>
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 text-[11px] font-bold">
                  <SelectValue placeholder="Seleccionar servicio...">
                    {(val: string) => {
                      if (!val) return "Seleccionar servicio...";
                      const s = servicios.find(srv => srv.id === val);
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
              <Label htmlFor="cliente" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre del Cliente</Label>
              <Input 
                id="cliente" 
                placeholder="Ej. Juan Pérez" 
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              disabled={loading || !selectedServicioId}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200"
            >
              {loading ? "Procesando..." : "Finalizar Registro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
