"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ZoneSummary } from "@/types/sales";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-sm text-primary">
          Valeur: <span className="font-bold">{payload[0].value.toLocaleString("fr-FR")} FCFA</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Unités: {payload[0].payload.totalUnits.toLocaleString("fr-FR")}
        </p>
      </div>
    );
  }
  return null;
};

interface ZoneBarChartProps {
  data: ZoneSummary[];
}

export function ZoneBarChart({ data }: ZoneBarChartProps) {
  const chartData = data.map((z) => ({
    zone: z.zone,
    value: Math.round(z.totalValue),
    totalUnits: z.totalUnits,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value));

  const getBarColor = (value: number) => {
    const ratio = value / maxValue;
    if (ratio >= 0.7) return "hsl(var(--chart-strong))";
    if (ratio >= 0.4) return "hsl(var(--chart-medium))";
    return "hsl(var(--chart-weak))";
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Ventes par Zone
        </h3>
        <p className="text-sm text-muted-foreground">
          Performance comparée des zones
        </p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              dataKey="zone"
              type="category"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-chart-strong" />
          <span className="text-muted-foreground">Zone forte</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-chart-medium" />
          <span className="text-muted-foreground">Zone moyenne</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-chart-weak" />
          <span className="text-muted-foreground">Zone faible</span>
        </div>
      </div>
    </div>
  );
}
