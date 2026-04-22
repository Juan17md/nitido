import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  className 
}: StatCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden border border-slate-100 bg-white transition-all md:hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]", 
      className
    )}>
      {/* Background Pattern: Even more subtle */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] md:group-hover:opacity-[0.04] transition-opacity pointer-events-none">
        <Icon size={100} strokeWidth={1} />
      </div>

      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-1 pt-3 md:pt-6">
        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 md:text-[11px]">
          {title}
        </CardTitle>
        <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 md:group-hover:bg-slate-900 md:group-hover:text-white transition-all duration-300">
          <Icon className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pb-3 md:pb-6">
        <div className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1 md:mt-2">
            {trend && (
              <span className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                trend.positive ? "bg-emerald-50/50 text-emerald-600" : "bg-rose-50/50 text-rose-600"
              )}>
                <span className={cn("h-1 w-1 rounded-full", trend.positive ? "bg-emerald-500" : "bg-rose-500")} />
                {trend.value}
              </span>
            )}
            {description && (
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

