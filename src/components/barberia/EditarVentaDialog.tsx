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
import { actualizarVenta, type HistorialServicio, type Servicio } from "@/lib/barberia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Pencil } from "lucide-react";

interface Props {
  venta: HistorialServicio;
  servicios: Servicio[];
}

export function EditarVentaDialog({ venta, servicios }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [selectedServicioId, setSelectedServicioId] = useState(venta.servicioId);
  const [cliente, setCliente] = useState(venta.cliente);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicio = servicios.find(s => s.id === selectedServicioId);
    if (!servicio || !cliente || !venta.id) return;

    setLoading(true);
    try {
      await actualizarVenta(venta.id, {
        servicioId: servicio.id!,
        nombreServicio: servicio.nombre,
        cliente,
        precio: servicio.precio
      });
      toast.success("Venta actualizada correctamente");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer" title="Editar">
        <Pencil className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Editar Venta</DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Modifica el servicio realizado o el nombre del cliente.
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
                      No hay servicios disponibles
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
              {loading ? "Procesando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
