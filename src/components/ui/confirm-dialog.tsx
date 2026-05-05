"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-[320px] sm:max-w-[380px] rounded-3xl p-6">
        <DialogHeader>
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${variant === 'destructive' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-lg font-bold uppercase tracking-tight text-slate-900">
                {title}
              </DialogTitle>
              <DialogDescription className="text-[11px] font-medium uppercase tracking-widest text-slate-500 leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-6 flex-row gap-3 bg-transparent p-0 border-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl h-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50"
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            className={`flex-1 rounded-xl h-12 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${variant === 'destructive' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-100'}`}
            disabled={loading}
          >
            {loading ? "..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
