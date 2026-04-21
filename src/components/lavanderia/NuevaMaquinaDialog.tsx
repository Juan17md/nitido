"use client";

import { useState } from "react";
import { PlusCircle, Settings, Monitor, Power } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { agregarMaquina, type Maquina } from "@/lib/lavanderia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NuevaMaquinaDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await agregarMaquina({
        nombre: formData.nombre,
        tipo: "lavadora",
        estado: "disponible",
      });
      toast.success("Máquina registrada con éxito");
      setOpen(false);
      setFormData({ nombre: "" });
    } catch (error) {
      toast.error("Error al registrar la máquina");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-2xl bg-blue-900 hover:bg-blue-800 text-white shadow-lg shadow-blue-100 px-6 py-4 inline-flex items-center justify-center group transition-all duration-500 active:scale-[0.98]">
        <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Adquirir Máquina</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-slate-100 shadow-2xl p-8">
        <DialogHeader>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Settings className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Nueva Adquisición</DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest leading-relaxed pt-2">
            Registra una nueva unidad en el inventario operativo de la lavandería.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nombre / Identificador</Label>
              <div className="relative group">
                <Input
                  placeholder="EJ. LAVADORA 04"
                  className="h-12 bg-slate-50 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl transition-all pl-4 text-xs font-bold uppercase tracking-wider"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value.toUpperCase() })}
                  required
                />
              </div>
            </div>


          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
            >
              {loading ? "Registrando..." : "Confirmar Adquisición"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
