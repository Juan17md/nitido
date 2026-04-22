import { useState, useEffect } from "react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Timestamp } from "firebase/firestore";

interface Transaction {
  precio?: number;
  monto?: number;
  fecha?: Timestamp;
  fechaEntrada?: Timestamp;
  estado?: string;
}

export function useFinanzasData(
  data: Transaction[], 
  gastos: Transaction[], 
  options: { isLavanderia?: boolean; selectedDate?: Date } = {}
) {
  const [metrics, setMetrics] = useState({
    hoy: 0,
    semana: 0,
    mes: 0,
    gastos: 0,
    chartData: [] as { name: string; ingresos: number; gastos: number }[]
  });

  useEffect(() => {
    const targetDate = options.selectedDate || new Date();
    
    const hoyStart = startOfDay(targetDate);
    const hoyEnd = endOfDay(targetDate);
    
    const semanaStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Lunes
    const semanaEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
    
    const mesStart = startOfMonth(targetDate);
    const mesEnd = endOfMonth(targetDate);

    let hoy = 0;
    let semana = 0;
    let mes = 0;
    let totalGastos = 0;

    // Calcular Ingresos
    data.forEach((item) => {
      // Lavandería: ingreso al registrar el pedido (fecha de entrada); barbería: fecha de venta
      const fecha = options.isLavanderia
        ? item.fechaEntrada?.toDate()
        : item.fecha?.toDate() || item.fechaEntrada?.toDate();
      if (!fecha) return;

      const valor = item.precio || 0;

      if (isWithinInterval(fecha, { start: hoyStart, end: hoyEnd })) hoy += valor;
      if (isWithinInterval(fecha, { start: semanaStart, end: semanaEnd })) semana += valor;
      if (isWithinInterval(fecha, { start: mesStart, end: mesEnd })) mes += valor;
    });

    // Calcular Gastos
    gastos.forEach((item) => {
      const fecha = item.fecha?.toDate();
      if (!fecha) return;
      const valor = item.monto || 0;
      if (isWithinInterval(fecha, { start: mesStart, end: mesEnd })) totalGastos += valor;
    });

    // Datos para el gráfico - últimos 7 días (basado en targetDate)
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(targetDate);
      d.setDate(d.getDate() - (6 - i));
      const dStart = startOfDay(d);
      const dEnd = endOfDay(d);

      const ingresosDia = data
        .filter(item => {
          const f = options.isLavanderia
            ? item.fechaEntrada?.toDate()
            : item.fecha?.toDate() || item.fechaEntrada?.toDate();
          if (!f) return false;
          return isWithinInterval(f, { start: dStart, end: dEnd });
        })
        .reduce((acc, curr) => acc + (curr.precio || 0), 0);

      const gastosDia = gastos
        .filter(item => {
          const f = item.fecha?.toDate();
          if (!f) return false;
          return isWithinInterval(f, { start: dStart, end: dEnd });
        })
        .reduce((acc, curr) => acc + (curr.monto || 0), 0);

      return {
        name: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        ingresos: ingresosDia,
        gastos: gastosDia
      };
    });

    setMetrics({
      hoy,
      semana,
      mes,
      gastos: totalGastos,
      chartData
    });
  }, [data, gastos, options.isLavanderia, options.selectedDate]);

  return metrics;
}
