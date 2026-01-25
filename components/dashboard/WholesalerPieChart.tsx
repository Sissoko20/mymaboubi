"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { WholesalerSummary } from "@/types/sales";

const COLORS = [
  "hsl(var(--chart-laborex))",
  "hsl(var(--chart-ubipharm))",
  "hsl(var(--chart-camed))",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-1">{data.name}</p>
        <p className="text-sm text-primary">
          Valeur: <span className="font-bold">{Math.round(data.totalValue).toLocaleString("fr-FR")} FCFA</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Unités: {data.totalUnits.toLocaleString("fr-FR")}
        </p>
        <p className="text-xs text-muted-foreground">
          Part: {((data.totalValue / data.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

interface CustomLegendProps {
  payload: { value: string; color: string; payload: any }[];
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  return (
    <div className="flex flex-col gap-3 mt-4">
      {payload.map((entry, index) => {
        const data = entry.payload;
        const percentage = ((data.totalValue / data.total) * 100).toFixed(1);
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-foreground">{entry.value}</span>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
};

interface WholesalerPieChartProps {
  data: WholesalerSummary[];
}

export function WholesalerPieChart({ data }: WholesalerPieChartProps) {
  const total = data.reduce((sum, w) => sum + w.totalValue, 0);
  
  const chartData = data.map(w => ({
    ...w,
    total,
  }));

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card animate-fade-in" style={{ animationDelay: "500ms" }}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Parts de Marché Grossistes
        </h3>
        <p className="text-sm text-muted-foreground">
          Répartition globale du chiffre d&apos;affaires
        </p>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="totalValue"
              nameKey="name"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend payload={chartData.map((d, i) => ({ value: d.name, color: COLORS[i], payload: d }))} />
    </div>
  );
}
