"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[180px]">
        <p className="font-semibold text-foreground mb-2 pb-2 border-b border-border">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-sm" 
                style={{ backgroundColor: p.fill }}
              />
              <span className="text-sm text-muted-foreground">{p.dataKey}</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {p.value.toLocaleString("fr-FR")}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-border">
          <span className="text-sm font-medium text-foreground">Total</span>
          <span className="text-sm font-bold text-primary">
            {total.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface WholesalerStackedChartProps {
  data: {
    zone: string;
    Laborex: number;
    Ubipharm: number;
    Camed: number;
    total: number;
  }[];
}

export function WholesalerStackedChart({ data }: WholesalerStackedChartProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Répartition Grossistes par Zone
        </h3>
        <p className="text-sm text-muted-foreground">
          Distribution des ventes Laborex, Ubipharm et Camed
        </p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="zone"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
            <Legend content={<CustomLegend />} />
            <Bar 
              dataKey="Laborex" 
              stackId="a" 
              fill="hsl(var(--chart-laborex))" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="Ubipharm" 
              stackId="a" 
              fill="hsl(var(--chart-ubipharm))" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="Camed" 
              stackId="a" 
              fill="hsl(var(--chart-camed))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
