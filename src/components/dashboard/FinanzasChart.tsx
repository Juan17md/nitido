"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ChartData {
  name: string;
  ingresos: number;
  gastos: number;
}

export function FinanzasChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#F1F5F9" 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
          />
          <Tooltip 
            cursor={{ fill: '#F8FAFC' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{payload[0].payload.name}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-medium text-slate-500">Ingresos</span>
                        <span className="text-[10px] font-bold text-slate-900">${payload[0].value}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-medium text-slate-500">Gastos</span>
                        <span className="text-[10px] font-bold text-red-500">${payload[1].value}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="ingresos" 
            fill="#0F172A" 
            radius={[4, 4, 0, 0]} 
            barSize={12} 
          />
          <Bar 
            dataKey="gastos" 
            fill="#64748B" 
            radius={[4, 4, 0, 0]} 
            barSize={12} 
            opacity={0.3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
