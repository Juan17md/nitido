import { useState, useEffect } from "react";
import { startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns";
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
  options: { isLavanderia?: boolean } = {}
) {
  const [metrics, setMetrics] = useState({
    hoy: 0,
    semana: 0,
    mes: 0,
    gastos: 0,
    chartData: [] as { name: string; ingresos: number; gastos: number }[]
  });

  useEffect(() => {
    const now = new Date();
    const hoyStart = startOfDay(now);
    const semanaStart = startOfWeek(now, { weekStartsOn: 1 }); // Lunes
    const mesStart = startOfMonth(now);

    let hoy = 0;
    let semana = 0;
    let mes = 0;
    let totalGastos = 0;

    // Calcular Ingresos
    data.forEach((item) => {
      const fecha = item.fecha?.toDate() || item.fechaEntrada?.toDate();
      if (!fecha) return;

      const valor = item.precio || 0;
      
      // Para lavandería, solo contamos los pedidos entregados como ingresos reales
      if (options.isLavanderia && item.estado !== 'entregado') {
        return; // Saltar pedidos no entregados
      }

      if (isAfter(fecha, hoyStart)) hoy += valor;
      if (isAfter(fecha, semanaStart)) semana += valor;
      if (isAfter(fecha, mesStart)) mes += valor;
    });

    // Calcular Gastos
    gastos.forEach((item) => {
      const fecha = item.fecha?.toDate();
      if (!fecha) return;
      const valor = item.monto || 0;
      if (isAfter(fecha, mesStart)) totalGastos += valor;
    });

    // Datos para el gráfico - últimos 7 días
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dStart = startOfDay(d);
      const dEnd = new Date(dStart);
      dEnd.setDate(dEnd.getDate() + 1);

      const ingresosDia = data
        .filter(item => {
          const f = item.fecha?.toDate() || item.fechaEntrada?.toDate();
          if (!f || !(f >= dStart && f < dEnd)) return false;
          // Para lavandería, solo entregados
          if (options.isLavanderia && item.estado !== 'entregado') return false;
          return true;
        })
        .reduce((acc, curr) => acc + (curr.precio || 0), 0);

      const gastosDia = gastos
        .filter(item => {
          const f = item.fecha?.toDate();
          return f && f >= dStart && f < dEnd;
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
  }, [data, gastos, options.isLavanderia]);

  return metrics;
}
