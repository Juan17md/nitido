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
import { registrarPedido, subscribeMaquinas, type ServicioLavanderia, type Maquina } from "@/lib/lavanderia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  servicios: ServicioLavanderia[];
}

export function NuevoPedidoDialog({ servicios }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [selectedServicioId, setSelectedServicioId] = useState("");
  const [selectedMaquinaId, setSelectedMaquinaId] = useState("ninguna");
  const [cliente, setCliente] = useState("");
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);

  useEffect(() => {
    const unsub = subscribeMaquinas((data) => {
      // Solo mostrar máquinas disponibles
      setMaquinas(data.filter(m => m.estado === 'disponible'));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicio = servicios.find(s => s.id === selectedServicioId);
    if (!servicio || !cliente) return;

    setLoading(true);
    try {
      await registrarPedido({
        servicioId: servicio.id!,
        nombreServicio: servicio.nombre,
        cliente,
        precio: servicio.precio,
        maquinaId: selectedMaquinaId === "ninguna" ? undefined : selectedMaquinaId
      });
      toast.success("Pedido registrado correctamente");
      setOpen(false);
      setSelectedServicioId("");
      setSelectedMaquinaId("ninguna");
      setCliente("");
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(
        "w-full h-11 px-6 bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-all inline-flex items-center justify-center",
      )}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Registrar Alquiler
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-slate-100 p-8 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Waves className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 uppercase">Registrar Pedido</DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed pt-2">
            Configura los parámetros del servicio y asigna recursos operativos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Servicio de Lavandería</Label>
              <Select
                value={selectedServicioId}
                onValueChange={(value) => setSelectedServicioId(value ?? "")}
              >
                <SelectTrigger className="h-12 rounded-2xl border-transparent bg-slate-50 text-[11px] font-bold uppercase tracking-tight focus:bg-white transition-all">
                  <SelectValue placeholder="SELECCIONAR SERVICIO...">
                    {(val: string) => {
                      if (!val) return "SELECCIONAR SERVICIO...";
                      const s = servicios.find(srv => srv.id === val);
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
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Asignar Máquina (Opcional)</Label>
              <Select
                value={selectedMaquinaId}
                onValueChange={(value) => setSelectedMaquinaId(value ?? "ninguna")}
              >
                <SelectTrigger className="h-12 rounded-2xl border-transparent bg-slate-50 text-[11px] font-bold uppercase tracking-tight focus:bg-white transition-all">
                  <div className="flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                    <SelectValue placeholder="SIN ASIGNAR...">
                      {(val: string) => {
                        if (!val || val === "ninguna") return "SIN ASIGNAR / MANUAL";
                        const m = maquinas.find(maq => maq.id === val);
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
              <Label htmlFor="cliente" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nombre del Cliente</Label>
              <Input 
                id="cliente" 
                placeholder="CLIENTE" 
                value={cliente}
                onChange={(e) => setCliente(e.target.value.toUpperCase())}
                className="h-12 rounded-2xl border-transparent bg-slate-50 focus:bg-white transition-all text-[11px] font-bold uppercase tracking-tight px-4" 
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={loading || !selectedServicioId}
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
            >
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
