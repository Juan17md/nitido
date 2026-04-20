import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "barber" | "laundry" | "default";
  className?: string;
}

export function QuickAction({ 
  label, 
  icon: Icon, 
  onClick, 
  variant = "default",
  className 
}: QuickActionProps) {
  const variantStyles = {
    default: "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200 shadow-slate-100",
    barber: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 shadow-blue-100",
    laundry: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200 shadow-indigo-100"
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 h-24 w-28 rounded-[2rem] transition-all duration-300",
        "hover:scale-105 active:scale-95 border border-dashed",
        "shadow-lg hover:shadow-xl hover:border-solid",
        variantStyles[variant],
        className
      )}
    >
      <div className="p-3 rounded-2xl bg-white shadow-sm group-hover:rotate-12 transition-transform">
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-tight text-center px-2">
        {label}
      </span>
    </Button>
  );
}
