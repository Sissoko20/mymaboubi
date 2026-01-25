"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProductSummary } from "@/types/sales";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-1 text-sm">{payload[0].payload.fullName || label}</p>
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

interface ProductPerformanceChartProps {
  data: ProductSummary[];
}

export function ProductPerformanceChart({ data }: ProductPerformanceChartProps) {
  const chartData = data.slice(0, 10).map((p) => ({
    product: p.product.length > 18 ? p.product.substring(0, 16) + "..." : p.product,
    fullName: p.product,
    value: Math.round(p.totalValue),
    totalUnits: p.totalUnits,
  }));

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Performance Produits
        </h3>
        <p className="text-sm text-muted-foreground">
          Top 10 produits pharmaceutiques par valeur de vente
        </p>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              dataKey="product"
              type="category"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              width={115}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
            <defs>
              <linearGradient id="productGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <Bar 
              dataKey="value" 
              fill="url(#productGradient)" 
              radius={[0, 6, 6, 0]} 
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
