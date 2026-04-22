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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Scissors, Edit2 } from "lucide-react";
import { agregarServicio, actualizarServicio, type Servicio } from "@/lib/barberia-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  servicio?: Servicio;
}

export function NuevoServicioDialog({ servicio }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(servicio?.nombre || "");
  const [precio, setPrecio] = useState(servicio?.precio.toString() || "");
  const [descripcion, setDescripcion] = useState(servicio?.descripcion || "");

  const isEditing = !!servicio;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !precio) return;

    setLoading(true);
    try {
      if (isEditing && servicio.id) {
        await actualizarServicio(servicio.id, {
          nombre,
          precio: parseFloat(precio),
          descripcion
        });
        toast.success("Servicio actualizado correctamente");
      } else {
        await agregarServicio({
          nombre,
          precio: parseFloat(precio),
          descripcion
        });
        toast.success("Servicio agregado correctamente");
        setNombre("");
        setPrecio("");
        setDescripcion("");
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Error al actualizar el servicio" : "Error al agregar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(
        isEditing 
          ? "h-8 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 md:hover:text-slate-900 inline-flex items-center justify-center transition-colors rounded-lg hover:bg-slate-50"
          : "h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all inline-flex items-center justify-center"
      )}>
        {isEditing ? (
          <>
            <Edit2 className="mr-1.5 h-3 w-3" />
            Editar
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </>
        )}
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-1.25rem)] max-w-[425px] max-h-[85vh] overflow-y-auto rounded-[26px] border-slate-100 p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-8">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3 sm:mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 sm:h-11 sm:w-11">
              <Scissors className="h-5 w-5" />
            </div>
            <DialogTitle className="text-sm font-bold uppercase tracking-[0.16em] text-slate-900 sm:text-base sm:tracking-widest">
              {isEditing ? "Editar Servicio" : "Crear Servicio"}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-1 text-[9px] font-medium text-slate-400 uppercase tracking-[0.18em] sm:text-[10px] sm:tracking-widest">
            {isEditing ? "Actualiza nombre, precio y descripción." : "Completa nombre, precio y descripción."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:space-y-6 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">Nombre del Servicio</Label>
              <Input 
                id="nombre" 
                placeholder="Ej. Corte Clásico" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/80 px-3 text-[12px] font-bold transition-all focus:bg-white sm:h-12 sm:text-[11px]" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precio" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">Precio ($)</Label>
              <Input 
                id="precio" 
                type="number"
                step="0.01"
                placeholder="0.00" 
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/80 px-3 text-[12px] font-bold transition-all focus:bg-white sm:h-12 sm:text-[11px]" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion" className="ml-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:tracking-widest">Descripción (Opcional)</Label>
              <Textarea 
                id="descripcion" 
                placeholder="Breve descripción del servicio..." 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="min-h-[90px] rounded-xl border-slate-100 bg-slate-50/80 px-3 py-2 text-[12px] font-medium transition-all focus:bg-white sm:min-h-[80px] sm:text-[11px]" 
              />
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 -mx-4 border-t border-slate-100 bg-white/95 px-4 pt-3 pb-1 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:p-0 sm:pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="h-11 w-full rounded-xl bg-slate-900 text-[9px] font-bold uppercase tracking-[0.16em] shadow-lg shadow-slate-200 hover:bg-slate-800 sm:h-12 sm:text-[10px] sm:tracking-[0.2em]"
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar Servicio" : "Guardar Servicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
