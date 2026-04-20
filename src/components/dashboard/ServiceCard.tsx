import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scissors, Waves, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  price: number;
  duration?: string;
  type: "barber" | "laundry";
  description?: string;
  onAction?: () => void;
}

export function ServiceCard({ title, price, duration, type, description, onAction }: ServiceCardProps) {
  const isBarber = type === "barber";
  const Icon = isBarber ? Scissors : Waves;

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white/60 backdrop-blur-sm border-l-4 border-l-transparent hover:border-l-primary">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <Badge 
            variant="secondary" 
            className={cn(
              "font-semibold text-[10px] uppercase tracking-wider",
              isBarber ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
            )}
          >
            {isBarber ? "Barbería" : "Lavandería"}
          </Badge>
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{title}</h3>
        </div>
        <div className={cn(
          "rounded-full p-2 transition-transform group-hover:rotate-12",
          isBarber ? "bg-blue-50 text-blue-500" : "bg-indigo-50 text-indigo-500"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black">${price}</span>
          <span className="text-xs text-muted-foreground font-medium">/ servicio</span>
        </div>
        {duration && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground italic">
            <Clock className="h-3 w-3" />
            <span>aprox. {duration}</span>
          </div>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full gap-2 font-bold shadow-sm" 
          onClick={onAction}
          variant={isBarber ? "default" : "secondary"}
        >
          <Plus className="h-4 w-4" />
          Registrar Venta
        </Button>
      </CardFooter>
    </Card>
  );
}
