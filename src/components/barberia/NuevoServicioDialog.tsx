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

      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">
            {isEditing ? "Editar Servicio" : "Crear Servicio"}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            {isEditing ? "Modifica los detalles del servicio existente." : "Añade un nuevo servicio al catálogo de la barbería."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre del Servicio</Label>
              <Input 
                id="nombre" 
                placeholder="Ej. Corte Clásico" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precio" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Precio ($)</Label>
              <Input 
                id="precio" 
                type="number"
                step="0.01"
                placeholder="0.00" 
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-bold" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Descripción (Opcional)</Label>
              <Textarea 
                id="descripcion" 
                placeholder="Breve descripción del servicio..." 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-[11px] font-medium min-h-[80px]" 
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200"
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar Servicio" : "Guardar Servicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
