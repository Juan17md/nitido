import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function QuickAction({ 
  label, 
  icon: Icon, 
  onClick, 
  className 
}: QuickActionProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-3 h-24 w-28 rounded-2xl transition-all duration-300",
        "bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]",
        "md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:hover:border-slate-200 md:hover:-translate-y-1 active:scale-95",
        className
      )}
    >
      <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 md:group-hover:bg-slate-900 md:group-hover:text-white transition-all duration-300">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] leading-tight text-center px-2 text-slate-500 md:group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </Button>
  );
}

