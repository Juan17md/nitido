"use client";

import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function WeekSelector({ selectedDate, onChange, className, minDate, maxDate }: WeekSelectorProps) {
  const handlePreviousWeek = () => {
    onChange(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    onChange(addWeeks(selectedDate, 1));
  };

  const handleCurrentWeek = () => {
    onChange(new Date());
  };

  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });

  const isPreviousDisabled = minDate ? start <= startOfWeek(minDate, { weekStartsOn: 1 }) : false;
  const isNextDisabled = maxDate ? start >= startOfWeek(maxDate, { weekStartsOn: 1 }) : false;

  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 py-2", className)}>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handlePreviousWeek}
          disabled={isPreviousDisabled}
          className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col items-center justify-center min-w-[200px] px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">
            Semana del
          </span>
          <span className="text-xs font-semibold text-slate-900">
            {format(start, "d 'de' MMMM", { locale: es })} — {format(end, "d 'de' MMMM", { locale: es })}
          </span>
        </div>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleNextWeek}
          disabled={isNextDisabled}
          className="h-9 w-9 rounded-full border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {!isCurrentWeek && (
        <Button 
          variant="ghost" 
          onClick={handleCurrentWeek}
          className="h-9 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 hover:text-slate-900"
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          Volver a esta semana
        </Button>
      )}
    </div>
  );
}
