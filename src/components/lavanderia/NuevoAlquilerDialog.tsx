"use client";

import { useState, useEffect } from "react";
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
import { PlusCircle, Waves, Settings } from "lucide-react";
import { registrarAlquiler, subscribeMaquinas, type ServicioLavanderia, type Maquina } from "@/lib/lavanderia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  servicios: ServicioLavanderia[];
}

export function NuevoAlquilerDialog({ servicios }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedServicioId, setSelectedServicioId] = useState("");
  const [selectedMaquinaId, setSelectedMaquinaId] = useState("ninguna");
  const [cliente, setCliente] = useState("");
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);

  useEffect(() => {
    const unsub = subscribeMaquinas((data) => {
      setMaquinas(data.filter((m) => m.estado === "disponible"));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicio = servicios.find((s) => s.id === selectedServicioId);
    if (!servicio || !cliente) return;

    setLoading(true);
    try {
      await registrarAlquiler({
        servicioId: servicio.id!,
        nombreServicio: servicio.nombre,
        cliente,
        precio: servicio.precio,
        maquinaId: selectedMaquinaId === "ninguna" ? undefined : selectedMaquinaId
      });
      toast.success("Alquiler registrado correctamente");
      setOpen(false);
      setSelectedServicioId("");
      setSelectedMaquinaId("ninguna");
      setCliente("");
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar el alquiler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn("w-full h-11 px-6 bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all inline-flex items-center justify-center")}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Registrar Alquiler
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-1.25rem)] max-w-[425px] max-h-[85vh] overflow-y-auto rounded-[26px] border-slate-100 p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-[32px] sm:p-8">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3 sm:mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
              <Waves className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <DialogTitle className="text-base font-bold tracking-tight text-slate-900 uppercase sm:text-xl">Registrar Alquiler</DialogTitle>
          </div>
          <DialogDescription className="pt-1 text-[9px] font-medium leading-relaxed text-slate-400 uppercase tracking-[0.18em] sm:pt-2 sm:text-[10px] sm:tracking-widest">
            Elige servicio, máquina y cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 sm:space-y-6 sm:pt-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-2">
              <Label className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-widest">Servicio de Lavandería</Label>
              <Select value={selectedServicioId} onValueChange={(value) => setSelectedServicioId(value ?? "")}>
                <SelectTrigger className="h-11 rounded-2xl border-transparent bg-slate-50 text-[12px] font-bold uppercase tracking-tight transition-all focus:bg-white sm:h-12 sm:text-[11px]">
                  <SelectValue placeholder="SELECCIONAR SERVICIO...">
                    {(val: string) => {
                      if (!val) return "SELECCIONAR SERVICIO...";
                      const s = servicios.find((srv) => srv.id === val);
                      return s ? `${s.nombre} — $${s.precio.toFixed(2)}` : "SELECCIONAR SERVICIO...";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  {servicios.map((s) => (
                    <SelectItem key={s.id} value={s.id!} className="text-[10px] font-bold uppercase tracking-widest py-3">
                      {s.nombre} — <span className="text-blue-600">${s.precio.toFixed(2)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-widest">Asignar Máquina (Opcional)</Label>
              <Select value={selectedMaquinaId} onValueChange={(value) => setSelectedMaquinaId(value ?? "ninguna")}>
                <SelectTrigger className="h-11 rounded-2xl border-transparent bg-slate-50 text-[12px] font-bold uppercase tracking-tight transition-all focus:bg-white sm:h-12 sm:text-[11px]">
                  <div className="flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                    <SelectValue placeholder="SIN ASIGNAR...">
                      {(val: string) => {
                        if (!val || val === "ninguna") return "SIN ASIGNAR / MANUAL";
                        const m = maquinas.find((maq) => maq.id === val);
                        return m ? `${m.nombre} — ${m.tipo}` : "SIN ASIGNAR...";
                      }}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  <SelectItem value="ninguna" className="text-[10px] font-bold uppercase tracking-widest py-3">Sin asignar / Manual</SelectItem>
                  {maquinas.map((m) => (
                    <SelectItem key={m.id} value={m.id!} className="text-[10px] font-bold uppercase tracking-widest py-3">
                      {m.nombre} — <span className="text-green-500">{m.tipo}</span>
                    </SelectItem>
                  ))}
                  {maquinas.length === 0 && (
                    <div className="p-3 text-center text-[9px] text-slate-400 uppercase font-bold bg-slate-50/50 rounded-xl mx-1">
                      No hay máquinas disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cliente" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px] sm:tracking-widest">Nombre del Cliente</Label>
              <Input
                id="cliente"
                placeholder="CLIENTE"
                value={cliente}
                onChange={(e) => setCliente(e.target.value.toUpperCase())}
                className="h-11 rounded-2xl border-transparent bg-slate-50 px-3 text-[12px] font-bold uppercase tracking-tight transition-all focus:bg-white sm:h-12 sm:px-4 sm:text-[11px]"
                required
              />
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 -mx-4 border-t border-slate-100 bg-white/95 px-4 pt-3 pb-1 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:p-0 sm:pt-4">
            <Button
              type="submit"
              disabled={loading || !selectedServicioId}
              className="h-12 w-full rounded-2xl bg-slate-900 text-[9px] font-bold uppercase tracking-[0.16em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] hover:bg-slate-800 sm:h-14 sm:text-[10px] sm:tracking-[0.2em]"
            >
              {loading ? "Procesando..." : "Confirmar Alquiler"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
